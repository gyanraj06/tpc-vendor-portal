import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown, Edit } from 'lucide-react';
import { AuthService, type Vendor } from '../../services/authService';

interface HeaderProps {
  isCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isCollapsed }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadVendorData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadVendorData = async () => {
    try {
      const vendorData = await AuthService.getCurrentUser();
      if (vendorData) {
        setVendor(vendorData);
      }
    } catch (error) {
      console.error('Failed to load vendor data:', error);
    }
  };

  const handleLogout = async () => {
    await AuthService.signOut();
    navigate('/');
  };

  return (
    <header
      className={`bg-white shadow-sm border-b border-gray-200 transition-all duration-300 fixed top-0 right-0 z-30 ${
        isCollapsed ? 'left-16' : 'left-64'
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Brand Text */}
          <div className="flex items-center">
            <div className={`flex flex-col transition-opacity duration-300 ${isCollapsed ? 'hidden sm:flex' : 'flex'}`}>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-blue-600 to-brand-blue-700 bg-clip-text text-transparent leading-tight">
                TrippeChalo
              </span>
              <span className="text-xs font-semibold tracking-wide text-brand-dark-500 uppercase -mt-1">
                Vendor Portal
              </span>
            </div>
          </div>

          {/* Welcome message and Profile */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-brand-dark-600 hidden sm:block">
              Welcome, {vendor?.name || vendor?.email}
            </span>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 text-brand-dark-600 hover:text-brand-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="w-8 h-8 bg-brand-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  {vendor?.avatar_url ? (
                    <img
                      src={vendor.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-white" />
                  )}
                </div>
                <ChevronDown size={16} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-brand-blue-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {vendor?.avatar_url ? (
                          <img
                            src={vendor.avatar_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={18} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-dark-900 truncate">{vendor?.name || 'Vendor'}</p>
                        <p className="text-xs text-brand-dark-500 truncate" title={vendor?.email}>{vendor?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/edit-profile');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-brand-dark-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};