import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const navigationItems: SidebarItem[] = [
    {
      to: '/dashboard',
      icon: <Home size={20} />,
      label: 'Dashboard'
    },
    {
      to: '/itinerary/current',
      icon: <Calendar size={20} />,
      label: 'Current Trip'
    },
    {
      to: '/planned-trip',
      icon: <MapPin size={20} />,
      label: 'Planned Trip'
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
      <button
        onClick={() => navigate(item.to)}
        className={`
          flex items-center glass-sidebar-item transition-all duration-200 border-none w-full mx-auto
          ${isActive 
            ? 'active text-glass-strong' 
            : 'text-glass hover:text-glass-strong'
          }
        `}
      >
        <span className={`mr-3 ${isActive ? 'text-primary-600' : 'text-glass opacity-70'}`}>
          {item.icon}
        </span>
        <span className="flex-1 text-sm font-medium ml-2">
          {item.label}
        </span>
        {item.badge && (
          <span className="ml-auto glass text-primary-700 text-xs px-2 py-1 rounded-full font-medium">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-64 glass-navbar min-h-screen border-r border-white border-opacity-20">
      <div className="p-4 pt-8">
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

        
      </div>
    </div>
  );
};

export default Sidebar;
