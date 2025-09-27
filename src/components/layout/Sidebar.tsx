import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  MapPin, 
  User, 
  Calendar, 
  Settings,
  HelpCircle
} from 'lucide-react';

interface SidebarItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigationItems: SidebarItem[] = [
    {
      to: '/dashboard',
      icon: <Home size={20} />,
      label: 'Dashboard'
    },
    {
      to: '/plan-trip',
      icon: <PlusCircle size={20} />,
      label: 'Plan New Trip'
    },
    {
      to: '/itinerary/current',
      icon: <Calendar size={20} />,
      label: 'Current Trip'
    },
    {
      to: '/profile',
      icon: <User size={20} />,
      label: 'Profile'
    }
  ];

  const secondaryItems: SidebarItem[] = [
    {
      to: '/settings',
      icon: <Settings size={20} />,
      label: 'Settings'
    },
    {
      to: '/help',
      icon: <HelpCircle size={20} />,
      label: 'Help & Support'
    }
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const SidebarLink: React.FC<{ item: SidebarItem }> = ({ item }) => {
    const isActive = isActiveRoute(item.to);
    
    return (
      <Link
        to={item.to}
        className={`
          flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
          ${isActive 
            ? 'glass-strong text-primary-700 border-r-2 border-primary-400' 
            : 'text-glass hover:glass-card'
          }
        `}
      >
        <span className={`mr-3 ${isActive ? 'text-primary-600' : 'text-glass opacity-70'}`}>
          {item.icon}
        </span>
        <span className="flex-1 text-sm font-medium">{item.label}</span>
        {item.badge && (
          <span className="ml-auto glass text-primary-700 text-xs px-2 py-1 rounded-full font-medium">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="w-64 glass-navbar min-h-screen border-r border-white border-opacity-20">
      <div className="p-4">
        {/* Primary Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Secondary Navigation */}
        <nav className="space-y-1">
          {secondaryItems.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </nav>

        {/* Quick Stats or Info */}
        <div className="mt-8 p-4 glass-card">
          <div className="flex items-center text-sm text-glass">
            <MapPin size={16} className="mr-2 text-primary-500" />
            <span>Ready for your next adventure?</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
