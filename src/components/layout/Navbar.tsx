import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="glass-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-glass">Xplor</h1>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/dashboard"
                className="text-glass hover:glass-button px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/plan-trip"
                className="text-glass hover:glass-button px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Plan Trip
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="glass-button p-3 hover:glass-strong transition-all duration-200 relative">
              <Bell size={18} className="text-glass" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-3 glass-button px-4 py-2 hover:glass-strong transition-all duration-200"
              >
                <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-primary-600" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-glass">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-glass opacity-70">
                    View Profile
                  </p>
                </div>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                icon={<LogOut size={16} />}
                className="glass-button hover:bg-red-100 hover:bg-opacity-20"
              >
                <span className="hidden sm:block text-glass">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
