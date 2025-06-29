import React, { useState, useEffect } from 'react';
import { Settings, List, Trash2, Plus } from 'lucide-react';
import ManageList from '@/components/admin/contentManagement/manageList';
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  getContentStats
} from '@/api/admin-api';
import AddCategoryModal from '@/components/admin/contentManagement/addCategoryModal';
import { toast } from 'react-toastify';

interface Category {
  _id: string;
  name: string;
  label: string;
}

const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="p-3 rounded-lg bg-gray-100">
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const TabSkeleton = () => (
  <div className="flex space-x-2 p-2">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
    ))}
    <div className="ml-auto mr-4 w-9 h-9 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const ContentSkeleton = () => (
  <div className="p-6 space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48"></div>
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-12 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ totalLists: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, statsRes] = await Promise.all([
          getAllCategories(),
          getContentStats()
        ]);
        
        console.log(categoriesRes);

        setCategories(categoriesRes.data || []);
        setStats({
          totalLists: statsRes.data?.totalCategories || 0,
          totalItems: statsRes.data?.totalItems || 0
        });
        
        if (categoriesRes.data?.length > 0) {
          setActiveTab(categoriesRes.data[0]._id);
        }
      } catch (err) {
        console.log(err)
        toast.error('Failed to load content data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCategory = async (name: string, label: string) => {
    try {
      const response = await createCategory({ name, label });
      setCategories([...categories, response.data]);
      
      // Update stats
      const statsRes = await getContentStats();
      setStats({
        totalLists: statsRes.data?.totalCategories || stats.totalLists + 1,
        totalItems: statsRes.data?.totalItems || stats.totalItems
      });
      
      // Switch to new category
      setActiveTab(response.data._id);
      setShowAddModal(false);
    } catch (err) {
      console.log(err)
      toast.error('Category name already exists');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    
    try {
      await deleteCategory(id);
      const updatedCategories = categories.filter(cat => cat._id !== id);
      setCategories(updatedCategories);
      
      // Update stats
      const statsRes = await getContentStats();
      setStats({
        totalLists: statsRes.data?.totalCategories || stats.totalLists - 1,
        totalItems: statsRes.data?.totalItems || stats.totalItems
      });
      
      if (activeTab === id && updatedCategories.length > 0) {
        setActiveTab(updatedCategories[0]._id);
      } else if (updatedCategories.length === 0) {
        setActiveTab(null);
      }
    } catch (err) {
      console.log(err)
      toast.error('Failed to delete category');
    }
  };

  const statCards = [
    {
      label: 'Total Lists',
      value: stats.totalLists.toString(),
      icon: List,
      color: 'deepskyblue'
    },
    {
      label: 'Total Items',
      value: stats.totalItems.toString(),
      icon: Settings,
      color: 'boldblue'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-boldblue mb-2">Content Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          statCards.map((stat, index) => {
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
        <div className="border-b border-gray-200">
          {loading ? (
            <TabSkeleton />
          ) : (
            <nav className="flex space-x-0 items-center flex-wrap p-2">
              {categories.map((category) => (
                <div key={category._id} className="flex group">
                  <button
                    onClick={() => setActiveTab(category._id)}
                    className={`
                      px-4 py-2 text-sm font-medium border transition-all duration-200 rounded cursor-pointer
                      ${activeTab === category._id
                        ? 'border-deepskyblue text-deepskyblue bg-deepskyblue/10'
                        : 'border-transparent text-gray-500 hover:bg-deepskyblue/5 hover:text-deepskyblue/30'
                      }
                    `}
                  >
                    {category.label}
                  </button>
                  {/* <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="cursor-pointer text-gray-400 hover:text-red-500 px-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Delete ${category.label}`}
                  >
                    <Trash2 size={16} />
                  </button> */}
                </div>
              ))}
              <button
                onClick={() => setShowAddModal(true)}
                className="cursor-pointer ml-auto mr-4 p-2 text-gray-500 hover:text-deepskyblue"
                aria-label="Add new category"
              >
                <Plus size={20} />
              </button>
            </nav>
          )}
        </div>

        <div className="min-h-[300px]">
          {loading ? (
            <ContentSkeleton />
          ) : activeTab ? (
            <div className="p-6">
              <ManageList categoryId={activeTab} />
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 p-6">
              {categories.length === 0 
                ? 'No categories found. Create your first category.' 
                : 'Please select a category'}
            </div>
          )}
        </div>
      </div>

      <AddCategoryModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={handleCreateCategory}
      />
    </div>
  );
};

export default ContentManagement;