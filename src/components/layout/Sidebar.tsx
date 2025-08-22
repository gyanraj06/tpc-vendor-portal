import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Calendar,
  Globe,
  Share2,
  Bot,
  BookOpen,
  Leaf,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { AuthService, type Vendor } from '../../services/authService';
import { getVendorLabels } from '../../utils/vendorLabels';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const vendorLabels = getVendorLabels(vendor?.vendorType);

  useEffect(() => {
    const loadVendor = async () => {
      const vendorData = await AuthService.getCurrentUser();
      setVendor(vendorData);
    };
    loadVendor();
  }, []);

  const navigationItems = [
    {
      name: 'Quick Guide',
      subtitle: 'Learn the platform',
      icon: HelpCircle,
      path: '/quick-guide',
      color: 'text-blue-600'
    },
    {
      name: 'Dashboard',
      subtitle: 'Overview and Analytics',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-purple-600'
    },
    {
      name: vendorLabels.productPlural,
      subtitle: vendorLabels.sidebarSubtitle,
      icon: Package,
      path: '/products',
      color: 'text-green-600'
    },
    {
      name: 'Bookings',
      subtitle: 'Customers and Reservations',
      icon: Calendar,
      path: '/bookings',
      color: 'text-orange-600'
    },
    {
      name: 'Website Builder',
      subtitle: 'Create your site',
      icon: Globe,
      path: '/website-builder',
      color: 'text-indigo-600'
    },
    {
      name: 'Social Connect',
      subtitle: 'Social Media Hub',
      icon: Share2,
      path: '/social-connect',
      color: 'text-pink-600'
    },
    {
      name: 'Sherpa AI',
      subtitle: 'AI Assistance',
      icon: Bot,
      path: '/sherpa-ai',
      color: 'text-cyan-600'
    },
    {
      name: 'Learnings',
      subtitle: 'Courses and Badges',
      icon: BookOpen,
      path: '/learnings',
      color: 'text-yellow-600'
    },
    {
      name: 'Sustainability',
      subtitle: 'Eco Tracking',
      icon: Leaf,
      path: '/sustainability',
      color: 'text-emerald-600'
    }
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/products') return location.pathname === '/all-listings';
    return location.pathname === path;
  };

  return (
    <div
      className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      } min-h-screen fixed left-0 top-0 z-40`}
    >
      {/* Header with Toggle Button - Aligned with main header */}
      <div className="flex items-center justify-between border-b border-gray-200 h-[73px] px-2">
        {!isCollapsed && (
          <div className="px-4 flex-1">
            <h2 className="text-lg font-bold text-brand-blue-600 whitespace-nowrap">Command Center</h2>
          </div>
        )}
        <div className={`flex items-center justify-center ${isCollapsed ? 'w-full' : 'pr-2'}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 flex-shrink-0 hover:scale-105 group"
          >
            <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
              <ChevronRight 
                size={20} 
                className="text-gray-600 transition-colors group-hover:text-brand-blue-600" 
              />
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-2 pb-4 pt-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path === '/products' ? '/all-listings' : item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-brand-blue-50 text-brand-blue-700 border-r-2 border-brand-blue-600'
                      : 'text-gray-700 hover:bg-brand-blue-50 hover:text-brand-blue-700'
                  }`}
                  title={isCollapsed ? `${item.name} - ${item.subtitle}` : undefined}
                >
                  <Icon
                    size={20}
                    className={`${isActive ? 'text-brand-blue-600' : item.color} transition-colors`}
                  />
                  
                  {!isCollapsed && (
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-300">{item.subtitle}</div>
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}

                  {/* Active indicator */}
                  {isActive && !isCollapsed && (
                    <div className="w-2 h-2 bg-brand-blue-600 rounded-full"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logo at bottom when collapsed */}
      {isCollapsed && (
        <div className="p-3 border-t border-gray-200">
          <div className="w-10 h-10 bg-[url('/assets/blueicon.png')] bg-contain bg-no-repeat bg-center mx-auto"></div>
        </div>
      )}
    </div>
  );
};