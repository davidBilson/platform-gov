import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FolderOpen, 
  Clock, 
  CheckCircle 
} from 'lucide-react';
import AllJobs from "@/components/admin/jobs/all";
import { getJobStats } from '@/api/admin-api';
import StatCardSkeleton from '@/components/skeleton/StatCardSkeleton';

interface JobStatsData {
  totalJobs: number;
  jobsByStatus: {
    open: number;
    active: number;
    closed: number;
    completed: number;
  };
  jobsByPaymentType: {
    hourly: number;
    fixedPrice: number;
    retainer: number;
  };
  recentJobs: number;
}

const Jobs = () => {
  const [jobStats, setJobStats] = useState<JobStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobStats = async () => {
      try {
        setLoading(true);
        const response = await getJobStats();
        if (response.success) {
          setJobStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching job stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobStats();
  }, []);

  const getStatsArray = (stats: JobStatsData | null) => {
    if (!stats) return [];

    return [
      {
        label: 'Total Jobs',
        value: stats.totalJobs.toLocaleString(),
        icon: Briefcase,
        color: 'deepskyblue'
      },
      {
        label: 'Open Jobs',
        value: stats.jobsByStatus.open.toLocaleString(),
        icon: FolderOpen,
        color: 'green-500'
      },
      {
        label: 'Active Jobs',
        value: stats.jobsByStatus.active.toLocaleString(),
        icon: Clock,
        color: 'orange-500'
      },
      {
        label: 'Completed Jobs',
        value: stats.jobsByStatus.completed.toLocaleString(),
        icon: CheckCircle,
        color: 'purple-500'
      }
    ];
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-boldblue mb-2">Job Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
        ) : (
          getStatsArray(jobStats).map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-boldblue">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                    <Icon size={24} className={`text-${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <AllJobs />
        </div>
      </div>
    </div>
  );
};

export default Jobs;