import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Building,
  Target
} from 'lucide-react';
import { getDashboardData } from '@/api/admin-api';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalUsers: 0,
      totalFreelancers: 0,
      totalClients: 0,
      activeContracts: 0,
      totalJobs: 0,
      fundedJobs: 0,
      totalTransactions: 0,
      totalFees: 0
    },
    revenue: {
      weeklyFees: 0,
      monthlyFees: 0,
      clientSideFees: 0,
      freelancerSideFees: 0
    },
    pending: {
      withdrawals: 0,
      disputes: 0,
      reports: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getDashboardData();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  type StatCardProps = {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color?: string;
    prefix?: string;
    suffix?: string;
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = '', prefix = '', suffix = '' }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-boldblue">
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              `${prefix}${typeof value === 'number' ? value.toLocaleString() : value}${suffix}`
            )}
          </p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-boldblue mb-2">Dashboard</h1>
      </div>

      {/* Overview Cards - Updated to match backend response */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={dashboardData.overview.totalUsers}
          icon={Users}
          color="deepskyblue"
        />
        <StatCard
          title="Total Freelancers"
          value={dashboardData.overview.totalFreelancers}
          icon={UserCheck}
          color="skyblue"
        />
        <StatCard
          title="Total Clients"
          value={dashboardData.overview.totalClients}
          icon={Users}
          color="green-500"
        />
        <StatCard
          title="Active Contracts"
          value={dashboardData.overview.activeContracts}
          icon={Briefcase}
          color="boldblue"
        />
      </div>

      {/* Additional Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Jobs"
          value={dashboardData.overview.totalJobs}
          icon={Building}
          color="deepskyblue"
        />
        <StatCard
          title="Funded Jobs"
          value={dashboardData.overview.fundedJobs}
          icon={Target}
          color="green-500"
        />
        <StatCard
          title="Total Transactions"
          value={dashboardData.overview.totalTransactions}
          icon={DollarSign}
          color="skyblue"
          prefix="$"
        />
        <StatCard
          title="Total Fees"
          value={dashboardData.overview.totalFees}
          icon={TrendingUp}
          color="boldblue"
          prefix="$"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Snapshot */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-boldblue mb-4">Revenue Snapshot</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-deepskyblue/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp size={20} className="text-deepskyblue" />
                  <span className="font-medium text-boldblue">Weekly Fees</span>
                </div>
                <span className="text-xl font-bold text-boldblue">
                  {loading ? (
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    `$${dashboardData.revenue.weeklyFees.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-skyblue/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp size={20} className="text-skyblue" />
                  <span className="font-medium text-boldblue">Monthly Fees</span>
                </div>
                <span className="text-xl font-bold text-boldblue">
                  {loading ? (
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    `$${dashboardData.revenue.monthlyFees.toLocaleString()}`
                  )}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign size={20} className="text-green-500" />
                  <span className="font-medium text-boldblue">Client Side Fees</span>
                </div>
                <span className="text-xl font-bold text-boldblue">
                  {loading ? (
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    `$${dashboardData.revenue.clientSideFees.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign size={20} className="text-purple-500" />
                  <span className="font-medium text-boldblue">Freelancer Side Fees</span>
                </div>
                <span className="text-xl font-bold text-boldblue">
                  {loading ? (
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    `$${dashboardData.revenue.freelancerSideFees.toLocaleString()}`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-boldblue mb-4">Shortcuts</h3>
          <div className="space-y-4">
            <button className="w-full cursor-pointer flex items-center hover:bg-faintskyblue/50 justify-between p-3 bg-white shadow text-sm rounded-lg border border-lightgray text-boldblue">
                  Escrow <MdOutlineArrowForwardIos />
            </button>
            <button className="w-full cursor-pointer flex items-center hover:bg-faintskyblue/50 justify-between p-3 bg-white shadow text-sm rounded-lg border border-lightgray text-boldblue">
                  Fee Settings <MdOutlineArrowForwardIos />
            </button>
            <button className="w-full cursor-pointer flex items-center hover:bg-faintskyblue/50 justify-between p-3 bg-white shadow text-sm rounded-lg border border-lightgray text-boldblue">

                  Users <MdOutlineArrowForwardIos />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;