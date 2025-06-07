import React from 'react';

interface UserProfileModalProps {
  user: {
    name: string;
    email: string;
    phoneNumber?: string;
    role: string;
    isSuspended: boolean;
    isHighPriority: boolean;
  };
  profile: {
    profileImage?: string;
    location?: {
      country?: string;
      state?: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  user, 
  profile, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-boldblue">User Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-4">
          {profile?.profileImage ? (
            <img 
              src={profile.profileImage} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center mb-3">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <h3 className="text-lg font-semibold">{user.name}</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex">
            <span className="font-medium w-1/3">Email:</span>
            <span className="w-2/3">{user.email}</span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-1/3">Phone:</span>
            <span className="w-2/3">{user.phoneNumber || 'N/A'}</span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-1/3">Location:</span>
            <span className="w-2/3">
              {profile?.location?.country || 'N/A'}, 
              {profile?.location?.state || 'N/A'}
            </span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-1/3">Role:</span>
            <span className="w-2/3 capitalize">{user.role}</span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-1/3">Status:</span>
            <span className={`w-2/3 font-medium ${user.isSuspended ? 'text-red-500' : 'text-green-500'}`}>
              {user.isSuspended ? 'Suspended' : 'Active'}
            </span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-1/3">Priority:</span>
            <span className={`w-2/3 font-medium ${user.isHighPriority ? 'text-blue-500' : 'text-gray-500'}`}>
              {user.isHighPriority ? 'High Priority' : 'Normal'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;