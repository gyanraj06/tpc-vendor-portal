import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Plus, ChevronDown, Edit, Mountain, MapPin, Tent, Footprints, Mic, Palette, Theater, Car, Target, Zap } from 'lucide-react';
import { AuthService, type Vendor } from '../../services/authService';
import { VendorType } from '../../types/vendorTypes';

export const DashboardPage: React.FC = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadVendorData();
  }, []);

  // Refresh vendor data when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadVendorData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
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
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to load vendor data:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.signOut();
    navigate('/');
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
          <p className="text-brand-dark-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-[url('/assets/blueicon.png')] bg-contain bg-no-repeat"></div>
              <div className="h-8 w-32 bg-[url('/assets/bluetext.png')] bg-contain bg-no-repeat"></div>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-semibold text-brand-dark-900">Vendor Portal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-brand-dark-600">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-dark-900 mb-2">
            Dashboard
          </h1>
          <p className="text-brand-dark-600">
            Manage your listings and track your business performance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-brand-dark-600">Total Listings</h3>
              <div className="w-8 h-8 bg-brand-blue-100 rounded-lg flex items-center justify-center">
                <Plus size={16} className="text-brand-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-brand-dark-900">0</p>
            <p className="text-sm text-brand-dark-500 mt-1">No listings yet</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-brand-dark-600">Active Events</h3>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus size={16} className="text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-brand-dark-900">0</p>
            <p className="text-sm text-brand-dark-500 mt-1">Ready to create?</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-brand-dark-600">Profile Status</h3>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <User size={16} className="text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-brand-dark-900">
              {vendor?.name ? 'Complete' : 'Incomplete'}
            </p>
            <p className="text-sm text-brand-dark-500 mt-1">
              {vendor?.name ? 'Profile setup done' : 'Complete your profile'}
            </p>
          </div>
        </div>

                {/* Quick Actions based on Vendor Type */}
        {vendor?.vendorType && (
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark-900 mb-2">
                {vendor.vendorType === VendorType.TREK_ORGANIZER ? 'Start Creating Your Trek/Travel Package' : 'Choose Your Event Type'}
              </h2>
              <p className="text-brand-dark-600">
                {vendor.vendorType === VendorType.TREK_ORGANIZER 
                  ? 'Create amazing trekking and travel experiences for your customers'
                  : 'Select the type of event you want to create and manage'
                }
              </p>
            </div>

            {vendor.vendorType === VendorType.TREK_ORGANIZER ? (
              // Single card for Trek/Travel vendors
              <div className="max-w-md mx-auto">
                <button className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:border-brand-blue-300 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-blue-500 to-brand-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Mountain className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark-900 mb-3">Add Trek/Travel Package</h3>
                    <p className="text-brand-dark-600 mb-4">Create and manage your trekking expeditions, travel packages, and outdoor adventures</p>
                    <div className="bg-brand-blue-50 rounded-xl p-4">
                      <div className="flex items-center justify-center space-x-4 text-sm text-brand-blue-700">
                        <span className="flex items-center"><MapPin size={14} className="mr-1" />Routes</span>
                        <span className="flex items-center"><Tent size={14} className="mr-1" />Accommodation</span>
                        <span className="flex items-center"><Footprints size={14} className="mr-1" />Equipment</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              // Two cards for Event vendors
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <button 
                  onClick={() => navigate('/create-event')}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:border-brand-purple-300 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Theater className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark-900 mb-3">One-Time Events</h3>
                    <p className="text-brand-dark-600 mb-4">Create single-day hosted events like standup comedy, workshops, and cultural shows</p>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center justify-center space-x-4 text-sm text-purple-700">
                        <span className="flex items-center"><Mic size={14} className="mr-1" />Shows</span>
                        <span className="flex items-center"><Palette size={14} className="mr-1" />Workshops</span>
                        <span className="flex items-center"><Theater size={14} className="mr-1" />Cultural</span>
                      </div>
                    </div>
                  </div>
                  </button>
                  
                <button 
                  onClick={() => navigate('/recurring-events-verification')}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:border-brand-orange-300 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Zap className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark-900 mb-3">Recurring Events (Experience)</h3>
                    <p className="text-brand-dark-600 mb-4">Create experience-based activities like go-karting, trampoline parks, and adventure sports</p>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="flex items-center justify-center space-x-4 text-sm text-orange-700">
                        <span className="flex items-center"><Car size={14} className="mr-1" />Racing</span>
                        <span className="flex items-center"><Target size={14} className="mr-1" />Adventure</span>
                        <span className="flex items-center"><Zap size={14} className="mr-1" />Experiences</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Show setup message if vendor type not set */}
        {!vendor?.vendorType && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">Complete Your Profile Setup</h3>
                <p className="text-yellow-700 text-sm">Please complete your vendor profile to access personalized dashboard features.</p>
                <button 
                  onClick={() => navigate('/profile-setup')}
                  className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          </div>
        )}

    
        {/* Recent Activity - Placeholder - TO BE USED IN FUTURE ABHI TO ISKA IMPLEMENTATION KONI LOL*/}
        {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-brand-dark-900 mb-4">Recent Activity</h2>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-brand-dark-700 mb-2">No activity yet</h3>
            <p className="text-brand-dark-500 mb-6">
              Start by creating your first event or trek listing.
            </p>
            <button className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-6 py-2 rounded-xl transition-colors">
              Create Your First Listing
            </button>
          </div>
        </div> */}



      </main>
    </div>
  );
};