import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  FileText, 
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Package,
  DollarSign
} from 'lucide-react';
import Logo from '@/components/ui/logo';

interface AdminSideBarProps {
  setActiveComponent: (component: string) => void;
}

const AdminSideBar = ({ setActiveComponent }: AdminSideBarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState<Record<string | number, boolean>>({});

  const toggleExpanded = (key: string | number) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
    // {
    //   key: 'bank-records',
    //   label: 'Bank Records',
    //   icon: CreditCard,
    //   path: '/admin/bank-records'
    // },
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
      label: 'Contents',
      icon: Package,
      path: '/admin/contents'
    },
    {
      key: 'fee-settings',
      label: 'Fee Settings',
      icon: DollarSign,
      path: '/admin/contents'
    }
  ];

  interface MenuItemProps {
    key: string;
    label?: string;
    icon?: React.ComponentType<{ size: number; className?: string }>;
    path?: string;
    hasSubmenu?: boolean;
    submenu?: Array<MenuItemProps>;
    badge?: string;
  }

  const MenuItem = ({ item, isSubmenuItem = false }: { item: MenuItemProps; isSubmenuItem?: boolean }) => {
    const Icon = item.icon;
    const isActive = activeItem === item.key;
    const isExpanded = expandedItems[item.key];
    
    return (
      <div className="mb-1">
        <button
          onClick={() => {
            setActiveItem(item.key);
            setActiveComponent(item.key); // Add this line
            if (item.hasSubmenu) {
              toggleExpanded(item.key);
            }
          }}
          className={`
            w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200
            ${isActive 
              ? 'bg-deepskyblue text-white shadow-md shadow-darkgray' 
              : 'text-skyblue cursor-pointer hover:bg-deepskyblue/50 hover:text-white'
            }
            ${isSubmenuItem ? 'pl-12 py-2' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className="flex-shrink-0" />}
            {!isCollapsed && (
              <>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="bg-deepskyblue text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </div>
          {!isCollapsed && item.hasSubmenu && (
            <div className="flex-shrink-0">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </button>
        
        {!isCollapsed && item.hasSubmenu && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.submenu && item.submenu.map((subItem: { key: string }) => (
              <MenuItem key={subItem.key} item={subItem} isSubmenuItem={true} />
            ))}
          </div>
        )}
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
            className="p-2 hover:bg-skyblue hover:text-boldblue cursor-pointer rounded-lg transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight 
              size={18} 
              className={`transform transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} 
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <MenuItem key={item.key} item={item} />
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div 
        className="border-t border-deepskyblue p-4"
      >
        <div className="space-y-2">
          {/* {bottomMenuItems.map((item) => (
            <MenuItem key={item.key} item={item} />
          ))} */}
        </div>
        
        {/* User Profile */}
        <div 
        // className="mt-4 pt-4 border-t border-deepskyblue"
        >
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
          
            <button className="w-full mt-2 flex items-center gap-3 p-2 text-crimson cursor-pointer border border-crimson hover:bg-crimson/20 bg-crimson/10 rounded-lg transition-colors">
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