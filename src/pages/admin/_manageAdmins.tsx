// 🚀 Modern Admin Management with React Query
// Provides WhatsApp/Twitter-level smooth UI updates

import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Ban, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllAdmins, addAdmin, removeAdmin, toggleSuspendAdmin, Admin, AddAdminRequest } from '@/api/admin-management';
import useAuthStore from '@/store/useAuth';
import { toast } from 'react-toastify';

// Define proper types for mutation contexts
interface AddAdminMutationContext {
  previousAdmins: Admin[] | undefined;
  optimisticAdmin: Admin;
}

interface SuspendAdminMutationContext {
  previousAdmins: Admin[] | undefined;
  adminId: string;
  newSuspendedStatus: boolean;
}

interface RemoveAdminMutationContext {
  previousAdmins: Admin[] | undefined;
  adminToRemove: Admin | undefined;
}

// Type for API response structure
interface AdminApiResponse {
  admins?: Admin[];
  user?: Admin;
  data?: Partial<Admin>;
}

// Type for mutation response
interface MutationResponse {
  user?: Admin;
  data?: Partial<Admin>;
  success?: boolean;
  message?: string;
}

// Type for auth store
interface AuthStore {
  userId: string | null;
  role: 'admin' | 'superadmin' | null;
}

const ManageAdmins: React.FC = () => {
  const { userId, role }: AuthStore = useAuthStore();
  const queryClient = useQueryClient();
  
  // Local UI state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [newAdmin, setNewAdmin] = useState<AddAdminRequest>({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const canManageAdmins: boolean = role === 'superadmin';

  const {
    data: admins = [],
    isLoading,
    isError,
    error
  } = useQuery<Admin[], Error>({
    queryKey: ['admins', userId],
    queryFn: async (): Promise<Admin[]> => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const response = await getAllAdmins(userId);
      return response.admins || [];
    },
    enabled: canManageAdmins && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime is deprecated)
    refetchOnWindowFocus: true,
    retry: 2
  });

  const addAdminMutation = useMutation<MutationResponse, Error, AddAdminRequest, AddAdminMutationContext>({
    mutationFn: async (adminData: AddAdminRequest): Promise<MutationResponse> => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return await addAdmin(adminData, userId);
    },
    onMutate: async (newAdminData: AddAdminRequest): Promise<AddAdminMutationContext> => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admins', userId] });

      // Snapshot the previous value
      const previousAdmins = queryClient.getQueryData<Admin[]>(['admins', userId]);

      // Create optimistic admin object
      const optimisticAdmin: Admin = {
        _id: `temp-${Date.now()}`, // Temporary ID
        name: newAdminData.name,
        email: newAdminData.email,
        role: newAdminData.role,
        isSuspended: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Optimistically update the cache
      queryClient.setQueryData<Admin[]>(['admins', userId], (old: Admin[] = []) => [
        ...old,
        optimisticAdmin
      ]);

      // Return context with previous data for rollback
      return { previousAdmins, optimisticAdmin };
    },
    onSuccess: (response: MutationResponse, variables: AddAdminRequest, context: AddAdminMutationContext | undefined) => {
      // Replace optimistic admin with real data from server
      if (response.user && context) {
        queryClient.setQueryData<Admin[]>(['admins', userId], (old: Admin[] = []) =>
          old.map(admin => 
            admin._id === context.optimisticAdmin._id 
              ? response.user! 
              : admin
          )
        );
      }

      // Reset form and close modal
      setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
      setShowAddModal(false);
      toast.success('Admin added successfully');
    },
    onError: (error: Error, variables: AddAdminRequest, context: AddAdminMutationContext | undefined) => {
      // Rollback optimistic update
      if (context?.previousAdmins) {
        queryClient.setQueryData(['admins', userId], context.previousAdmins);
      }
      
      console.error('Failed to add admin:', error);
      toast.error('Failed to add admin');
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['admins', userId] });
    }
  });

  // 🔥 SUSPEND ADMIN MUTATION - Optimistic Updates
  const suspendAdminMutation = useMutation<MutationResponse, Error, string, SuspendAdminMutationContext>({
    mutationFn: async (adminId: string): Promise<MutationResponse> => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return await toggleSuspendAdmin(adminId, userId);
    },
    onMutate: async (adminId: string): Promise<SuspendAdminMutationContext> => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admins', userId] });

      // Snapshot the previous value
      const previousAdmins = queryClient.getQueryData<Admin[]>(['admins', userId]);

      // Find the admin to update
      const adminToUpdate = previousAdmins?.find(admin => admin._id === adminId);
      if (!adminToUpdate) {
        return { previousAdmins, adminId, newSuspendedStatus: false };
      }

      const newSuspendedStatus = !adminToUpdate.isSuspended;

      // Optimistically update the cache
      queryClient.setQueryData<Admin[]>(['admins', userId], (old: Admin[] = []) =>
        old.map(admin =>
          admin._id === adminId
            ? { ...admin, isSuspended: newSuspendedStatus, updatedAt: new Date().toISOString() }
            : admin
        )
      );

      return { previousAdmins, adminId, newSuspendedStatus };
    },
    onSuccess: (response: MutationResponse, adminId: string, context: SuspendAdminMutationContext | undefined) => {
      // Sync with server response if needed
      if (response.data) {
        queryClient.setQueryData<Admin[]>(['admins', userId], (old: Admin[] = []) =>
          old.map(admin =>
            admin._id === adminId
              ? { ...admin, ...response.data }
              : admin
          )
        );
      }

      const message = context?.newSuspendedStatus ? 'Admin suspended successfully' : 'Admin activated successfully';
      toast.success(message);
    },
    onError: (error: Error, adminId: string, context: SuspendAdminMutationContext | undefined) => {
      // Rollback optimistic update
      if (context?.previousAdmins) {
        queryClient.setQueryData(['admins', userId], context.previousAdmins);
      }
      
      console.error('Failed to update admin status:', error);
      toast.error('Failed to update admin status');
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['admins', userId] });
    }
  });

  // 🔥 REMOVE ADMIN MUTATION - Optimistic Updates
  const removeAdminMutation = useMutation<MutationResponse, Error, string, RemoveAdminMutationContext>({
    mutationFn: async (adminId: string): Promise<MutationResponse> => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return await removeAdmin(adminId, userId);
    },
    onMutate: async (adminId: string): Promise<RemoveAdminMutationContext> => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admins', userId] });

      // Snapshot the previous value
      const previousAdmins = queryClient.getQueryData<Admin[]>(['admins', userId]);

      // Find the admin to remove (for rollback)
      const adminToRemove = previousAdmins?.find(admin => admin._id === adminId);

      // Optimistically remove from cache
      queryClient.setQueryData<Admin[]>(['admins', userId], (old: Admin[] = []) =>
        old.filter(admin => admin._id !== adminId)
      );

      // Close modal immediately for better UX
      setShowDeleteModal(false);
      setSelectedAdmin(null);

      return { previousAdmins, adminToRemove };
    },
    onSuccess: (response: MutationResponse, adminId: string, context: RemoveAdminMutationContext | undefined) => {
      toast.success('Admin removed successfully');
    },
    onError: (error: Error, adminId: string, context: RemoveAdminMutationContext | undefined) => {
      // Rollback optimistic update
      if (context?.previousAdmins) {
        queryClient.setQueryData(['admins', userId], context.previousAdmins);
      }
      
      // Reopen modal if needed
      if (context?.adminToRemove) {
        setSelectedAdmin(context.adminToRemove);
        setShowDeleteModal(true);
      }
      
      console.error('Failed to remove admin:', error);
      toast.error('Failed to remove admin');
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['admins', userId] });
    }
  });

  // Memoized filtered admins
  const filteredAdmins = useMemo<Admin[]>(() => {
    return admins.filter(admin =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [admins, searchTerm]);

  // Memoized stats
  const adminStats = useMemo<{ total: number; active: number; suspended: number }>(() => {
    const total = admins.length;
    const active = admins.filter(admin => !admin.isSuspended).length;
    const suspended = admins.filter(admin => admin.isSuspended).length;
    return { total, active, suspended };
  }, [admins]);

  // Event handlers
  const handleAddAdmin = (): void => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error('All fields are required');
      return;
    }
    addAdminMutation.mutate(newAdmin);
  };

  const handleSuspendAdmin = (adminId: string): void => {
    suspendAdminMutation.mutate(adminId);
  };

  const handleDeleteAdmin = (): void => {
    if (selectedAdmin) {
      removeAdminMutation.mutate(selectedAdmin._id);
    }
  };

  const openDeleteModal = (admin: Admin): void => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (admin: Admin) => {
    if (!admin.isSuspended) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Suspended
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'superadmin': 'bg-purple-100 text-purple-800',
      'admin': 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[role] || colors['admin']}`}>
        {role === 'superadmin' ? 'Super Admin' : 'Admin'}
      </span>
    );
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value as 'admin' | 'superadmin';
    setNewAdmin({ ...newAdmin, role: value });
  };

  // Access control
  if (!canManageAdmins) {
    return (
      <div className="p-6 bg-white">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <Ban className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only Super Admins can manage administrative privileges.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 bg-white">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <XCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Admins</h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Failed to load admin data'}
          </p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admins', userId] })}
            className="px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-boldblue/70 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 bg-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-boldblue mb-2">Manage Admins</h1>
          <p className="text-gray-600 mt-1">Add, remove, and manage administrative privileges</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={isLoading || addAdminMutation.isPending}
          className="inline-flex items-center px-4 py-2 cursor-pointer bg-boldblue text-white rounded-lg hover:bg-boldblue/70 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
        >
          {addAdminMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add Admin
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boldblue outline-none focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Total Admins</p>
            <p className="text-lg font-semibold text-boldblue">{adminStats.total}</p>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-lg font-semibold text-green-600">{adminStats.active}</p>
          </div>
          <div className="bg-red-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Suspended</p>
            <p className="text-lg font-semibold text-red-600">{adminStats.suspended}</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-boldblue" />
        </div>
      )}

      {/* No Admins State */}
      {!isLoading && admins.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No admins found</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-boldblue/70 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Admin
          </button>
        </div>
      )}

      {/* Admins Table */}
      {!isLoading && admins.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin: Admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-boldblue font-medium text-sm">
                            {admin.name.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(admin.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(admin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {admin.role === 'superadmin' ? (
                        <span className="text-xs text-gray-500 italic">Protected</span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSuspendAdmin(admin._id)}
                            disabled={suspendAdminMutation.isPending}
                            className={`inline-flex cursor-pointer items-center px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                              !admin.isSuspended
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {suspendAdminMutation.isPending && suspendAdminMutation.variables === admin._id ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Ban className="w-3 h-3 mr-1" />
                            )}
                            {!admin.isSuspended ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => openDeleteModal(admin)}
                            disabled={removeAdminMutation.isPending}
                            className="inline-flex cursor-pointer items-center px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boldblue outline-none focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boldblue outline-none focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boldblue outline-none focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newAdmin.role}
                  onChange={handleRoleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boldblue outline-none focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
                }}
                disabled={addAdminMutation.isPending}
                className="px-4 py-2 cursor-pointer text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdmin}
                disabled={addAdminMutation.isPending}
                className="px-4 py-2 cursor-pointer bg-boldblue text-white rounded-lg hover:bg-boldblue/70 transition-colors disabled:opacity-50"
              >
                {addAdminMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                    Adding...
                  </>
                ) : (
                  'Add Admin'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Remove Admin</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <strong>{selectedAdmin.name}</strong> from the admin panel?
              This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAdmin(null);
                }}
                disabled={removeAdminMutation.isPending}
                className="px-4 py-2 cursor-pointer text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAdmin}
                disabled={removeAdminMutation.isPending}
                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {removeAdminMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                    Removing...
                  </>
                ) : (
                  'Remove Admin'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;