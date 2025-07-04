import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, UserCheck, Briefcase, UserX } from 'lucide-react';
import AllUsers from "@/components/admin/users/all";
import AllClients from "@/components/admin/users/clients";
import AllContractors from "@/components/admin/users/contractors";
import { getUserStats } from '@/api/admin-api';
import StatCardSkeleton from '@/components/skeleton/StatCardSkeleton';

interface UserStats {
  totalUsers: number;
  usersByRole: {
    contractors: number;
    clients: number;
    admins: number;
  };
  verification: {
    verifiedEmails: number;
    verifiedPhones: number;
  };
  recentUsers: number;
}

const Users = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await getUserStats();
        
        if (response.success) {
          setUserStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  // Generate stats array from API data
  const getStatsArray = (stats: UserStats | null) => {
    if (!stats) return [];

    return [
      {
        label: 'Total Users',
        value: stats.totalUsers.toLocaleString() ?? 0,
        icon: UsersIcon,
        color: 'deepskyblue'
      },
      {
        label: 'Verified Users',
        value: stats?.verification?.verifiedEmails - 1,
        icon: UserCheck,
        color: 'green-500'
      },
      {
        label: 'Contractors',
        value: stats.usersByRole.contractors.toLocaleString() ?? 0,
        icon: Briefcase,
        color: 'skyblue'
      },
      {
        label: 'Clients',
        value: stats.usersByRole.clients.toLocaleString() ?? 0,
        icon: UserX,
        color: 'boldblue'
      }
    ];
  };

  const tabs = [
    {
      key: 'all',
      label: 'All Users',
      component: AllUsers
    },
    {
      key: 'clients',
      label: 'Clients',
      component: AllClients
    },
    {
      key: 'contractors',
      label: 'Contractors',
      component: AllContractors
    }
  ];

  const renderContent = () => {
    const activeTabData = tabs.find(tab => tab.key === activeTab);
    const Component = activeTabData?.component;
    return Component ? <Component /> : <AllUsers />;
  };

  return (
    <div className="min-h-screen">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-boldblue mb-2">User Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
        ) : (
          getStatsArray(userStats).map((stat, index) => {
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

      {/* Tabs and Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 cursor-pointer
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

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Users;