import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp
} from 'lucide-react';
import AllContracts from '@/components/admin/contracts/all';
import { getContractStats } from '@/api/admin-api';
import StatCardSkeleton from '@/components/skeleton/StatCardSkeleton';
import { ContractStats } from '@/types/admin';

const ManageContracts = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [contractStats, setContractStats] = useState<ContractStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContractStats = async () => {
      try {
        setLoading(true);
        const response = await getContractStats();
        if (response.success) {
          setContractStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching contract stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContractStats();
  }, []);

  const getStatsArray = (stats: ContractStats | null) => {
    if (!stats) return [];

    return [
      {
        label: 'Total Contracts',
        value: stats.totalContracts.toLocaleString() ?? 0,
        icon: FileText,
        color: 'deepskyblue'
      },
      {
        label: 'Active Contracts',
        value: stats.activeContracts.toLocaleString() ?? 0,
        icon: Clock,
        color: 'skyblue'
      },
      {
        label: 'Completed',
        value: stats.completedContracts.toLocaleString() ?? 0,
        icon: CheckCircle,
        color: 'green-500'
      },
      {
        label: 'Disputed',
        value: stats.disputedContracts.toLocaleString() ?? 0,
        icon: AlertCircle,
        color: 'orange-500'
      },
      {
        label: 'Avg. Value',
        value: `$${stats.averageContractValue?.toLocaleString() ?? 0}`,
        icon: TrendingUp,
        color: 'boldblue'
      }
    ];
  };

  const tabs = [
    {
      key: 'all',
      label: 'All Contracts',
      component: AllContracts
    },
  ];

  const renderContent = () => {
    const activeTabData = tabs.find(tab => tab.key === activeTab);
    const Component = activeTabData?.component;
    return Component ? <Component /> : <AllContracts />;
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-boldblue mb-2">Contract Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
        ) : (
          getStatsArray(contractStats).map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-boldblue">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                    <Icon size={20} className={`text-${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 cursor-pointer
                  ${activeTab === tab.key
                    ? 'border-deepskyblue text-deepskyblue bg-deepskyblue/5'
                    : 'border-transparent text-gray-500 hover:text-skyblue hover:border-skyblue'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ManageContracts;