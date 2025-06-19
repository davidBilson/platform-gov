// components/AllContractors.tsx
import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';
import { CheckCircle, XCircle, Search, X } from 'lucide-react';
import { getAllUsers } from '@/api/admin-api';
import Pagination from '@/components/pagination/pagination';
import TableSkeletonLoader from '@/components/skeleton/tableSkeletonLoader';
import { User } from '@/types/admin';

import { Switch } from '@/components/ui/switch';
import { toggleUserPriority, toggleUserSuspend } from '@/api/admin-api';
import { maskEmail, maskPhoneNumber } from '@/utils/maskData';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalUsers: number;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

type UserAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'UPDATE_USER'; payload: { userId: string; updates: Partial<User> } }
  | { type: 'SET_ERROR'; payload: string | null };

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_USERS':
      return { ...state, users: action.payload, error: null };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload.userId
            ? { ...user, ...action.payload.updates }
            : user
        )
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
};

// Memoized UserRow component
const UserRow = React.memo(({ 
  user, 
  index, 
  onPriorityToggle, 
  onSuspendToggle, 
}: {
  user: User;
  index: number;
  onPriorityToggle: (userId: string, isHighPriority: boolean) => void;
  onSuspendToggle: (userId: string, isSuspended: boolean) => void;
}) => {
  const handlePriorityChange = useCallback((checked: boolean) => {
    onPriorityToggle(user._id, checked);
  }, [user._id, onPriorityToggle]);

  const handleSuspendChange = useCallback((checked: boolean) => {
    onSuspendToggle(user._id, checked);
  }, [user._id, onSuspendToggle]);

  return (
    <tr 
      className={`text-xs border-b border-gray-200 hover:bg-deepskyblue/5 transition-all duration-200 ease-in-out ${
        index % 2 === 0 ? 'bg-white' : 'bg-faintskyblue'
      } ${user.isHighPriority ? 'ring-1 ring-deepskyblue/30' : ''} ${
        user.isSuspended ? 'opacity-60' : ''
      }`}
    >
      <td className="px-4 py-3 font-medium text-boldblue transition-colors duration-200">
        {user.name}
      </td>
      <td className="px-4 py-3 text-gray-700">{maskEmail(user.email)}</td>
      <td className="px-4 py-3 text-gray-700">{maskPhoneNumber(user.phoneNumber || '')}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
          user.role === 'client' 
            ? 'bg-aquagreen/60 text-skyblue' 
            : 'bg-deepskyblue/20 text-deepskyblue'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {user.isEmailVerified ? (
            <>
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-green-600 font-medium">Yes</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-red-500" />
              <span className="text-red-600 font-medium">No</span>
            </>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <Switch
          checked={user.isHighPriority}
          onCheckedChange={handlePriorityChange}
          className="data-[state=checked]:bg-deepskyblue transition-all duration-200"
        />
      </td>
      <td className="px-4 py-3">
        <Switch
          checked={user.isSuspended}
          onCheckedChange={handleSuspendChange}
          className="data-[state=checked]:bg-red-500 transition-all duration-200"
        />
      </td>
    </tr>
  );
});

UserRow.displayName = 'UserRow';

const AllContractors = () => {
  // Use reducer for complex user state management
  const [userState, dispatch] = useReducer(userReducer, {
    users: [],
    loading: true,
    error: null
  });

  // Simple state for pagination
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalUsers: 0
  });

  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = useCallback(async (page: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await getAllUsers({ page, limit: 10, role: 'contractor' });
      // const response = await getAllUsers({ page, limit: 10 });
      
      dispatch({ type: 'SET_USERS', payload: response.data.users });
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch users' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Memoized filtered users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return userState.users;
    }

    const searchLower = searchTerm.toLowerCase();
    return userState.users.filter(user => 
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phoneNumber?.toLowerCase().includes(searchLower)
    );
  }, [userState.users, searchTerm]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handlePriorityToggle = useCallback(async (userId: string, isHighPriority: boolean) => {
    try {
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { userId, updates: { isHighPriority } } 
      });

      await toggleUserPriority(userId, isHighPriority);
    } catch (error) {
      console.error('Error updating priority:', error);
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { userId, updates: { isHighPriority: !isHighPriority } } 
      });
    }
  }, []);
  
  const handleSuspendToggle = useCallback(async (userId: string, isSuspended: boolean) => {
    try {
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { userId, updates: { isSuspended } } 
      });

      await toggleUserSuspend(userId, isSuspended);
    } catch (error) {
      console.error('Error updating suspend status:', error);
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { userId, updates: { isSuspended: !isSuspended } } 
      });
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    fetchUsers(page);
  }, [fetchUsers]);

  const userRows = useMemo(() => {
    return filteredUsers.map((user, index) => (
      <UserRow
        key={user._id}
        user={user}
        index={index}
        onPriorityToggle={handlePriorityToggle}
        onSuspendToggle={handleSuspendToggle}
      />
    ));
  }, [filteredUsers, handlePriorityToggle, handleSuspendToggle]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <div className="mb-4">
        <div className="relative mb-4">
          <div className="relative">
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search users by name, email, or phone number..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="text-sm w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepskyblue focus:border-transparent transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              {filteredUsers.length > 0 
                ? `Found ${filteredUsers.length} user${filteredUsers.length === 1 ? '' : 's'} matching "${searchTerm}"`
                : `No users found matching "${searchTerm}"`
              }
            </div>
          )}
        </div>

        {userState.error && (
          <div className="text-red-500 text-sm mb-2">{userState.error}</div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-boldblue text-boldblue">
              <th className="px-4 py-3 text-left font-bold text-sm">Name</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Email</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Phone Number</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Role</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Verified</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Make Priority</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Suspend</th>
            </tr>
          </thead>
          <tbody>
            {userState.loading ? (
              <tr>
                <td colSpan={9}>
                  <TableSkeletonLoader rows={5} cols={9} />
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </td>
              </tr>
            ) : (
              userRows
            )}
          </tbody>
        </table>
      </div>

      {!userState.loading && !searchTerm && (
        <Pagination 
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            hasNextPage: pagination.hasNextPage,
            hasPrevPage: pagination.hasPrevPage
          }} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
};

export default AllContractors;