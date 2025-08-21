import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  FileText, 
  ChevronRight,
  LogOut,
  User,
  Package,
  DollarSign,
  User2Icon,
  ShieldUser,
  Repeat,
  RefreshCcw,
  Layers
} from 'lucide-react';
import Logo from '@/components/ui/logo';
import useAuthStore from '@/store/useAuth';
import useAdminStore from '@/store/useAdmin'; // Import the new admin store
import { useRouter } from 'next/router';
import { FaMoneyBill } from 'react-icons/fa';

interface AdminSideBarProps {
  setActiveComponent: (component: string) => void;
}

const AdminSideBar = ({ setActiveComponent }: AdminSideBarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { resetAll } = useAuthStore();
  const { activeComponent, setActiveComponent: setStoreActiveComponent } = useAdminStore();
  const router = useRouter();

  const handleSignOut = () => {
    resetAll();
    router.push('/account/sign-in');
  }

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard'
    },
    {
      key: 'users',
      label: 'Users',
      icon: Users,
      path: '/admin/users'
    },
    {
      key: 'contracts',
      label: 'Contracts',
      icon: FileText,
      path: '/admin/contracts'
    },
    {
      key: 'jobs',
      label: 'Jobs',
      icon: ShoppingBag,
      path: '/admin/jobs'
    },
    {
      key: 'contents',
      label: 'Manage Contents',
      icon: Package,
      path: '/admin/contents'
    },
    {
      key: 'subscription-settings',
      label: 'Subscriptions',
      icon: Layers,
      path: '/admin/subscription-settings'
    },
    {
      key: 'fee-settings',
      label: 'Fee Settings',
      icon: DollarSign,
      path: '/admin/fee-settings'
    },
    {
      key: 'escrow',
      label: 'Escrow',
      icon: FaMoneyBill,
      path: '/admin/escrow'
    },
    {
      key: 'admins',
      label: 'Manage Admins',
      icon: ShieldUser,
      path: '/admin/manage-admins'
    }
  ];

  interface MenuItemProps {
    key: string;
    label?: string;
    icon?: React.ComponentType<{ size: number; className?: string }>;
    path?: string;
    submenu?: Array<MenuItemProps>;
    badge?: string;
  }

  const MenuItem = ({ item }: { item: MenuItemProps; isSubmenuItem?: boolean }) => {
    const Icon = item.icon;
    const isActive = activeComponent === item.key;
    
    return (
      <div className="mb-1">
        <button
          onClick={() => {
            setStoreActiveComponent(item.key); // Update Zustand store
            setActiveComponent(item.key); // Keep the original prop function for backward compatibility
          }}
          className={`
            w-full flex items-center p-2.5 pr-2.5 rounded-lg text-left transition-all duration-200
            ${isActive 
              ? 'bg-deepskyblue text-white shadow-md shadow-darkgray' 
              : 'text-skyblue cursor-pointer hover:bg-deepskyblue/50 hover:text-white'
            }
            ${isCollapsed ? 'justify-center' : 'justify-between'}
          `}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon size={18} />}
            {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
            )}
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className={`
      bg-boldblue text-white h-[calc(100vh-112px)] flex flex-col transition-all duration-300 border-r border-gray-700
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-deepskyblue">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-boldblue rounded-lg flex items-center justify-center">
                <Logo  />
              </div>
              <div>
                <h1 className="font-bold text-lg">GovLink Global</h1>
                <p className="text-xs ">Management System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-deepskyblue text-white cursor-pointer rounded-lg transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight 
              size={18} 
              className={`transform transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} 
            />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2 flex flex-col gap-3">
          {menuItems.map((item) => (
            <MenuItem key={item.key} item={item} />
          ))}
        </div>
      </nav>

      <div className="border-t border-deepskyblue p-4">
        <div>
          <div className={`flex items-center gap-3 p-2 rounded-lg  transition-colors ${isCollapsed ? 'justify-center ' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-boldblue to-deepskyblue rounded-full flex items-center justify-center flex-shrink-0">
              <User size={16} />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">GovLink Global</p>
                <p className="text-xs text-lightblue truncate">Administrator</p>
              </div>
            )}
          </div>
          
            <button onClick={handleSignOut} className="w-full mt-2 flex items-center gap-3 p-2 text-crimson cursor-pointer border border-crimson hover:bg-crimson/20 bg-crimson/10 rounded-lg transition-colors">
              <LogOut size={16} className='text-crimson' />
              {!isCollapsed && (
                <span className="text-sm">Sign Out</span>
              )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;