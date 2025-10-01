import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar">
      <div className="w-full px-10 py-14 flex justify-between items-center text-white">
        {/* Logo */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-3xl font-bold play-regular" 
          style={{ 
            fontSize: "1.5rem", 
            marginLeft: "20px", 
            marginTop: "10px", 
            color: "#1B5A67",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          Xplor
        </button>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[#1B5A67] hover:opacity-80 border-none bg-transparent"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
