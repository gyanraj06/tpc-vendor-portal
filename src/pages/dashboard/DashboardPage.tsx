import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Calendar, Package, Star, Clock, Eye, MessageSquare, Bot, Sparkles, ArrowRight } from 'lucide-react';
import { AuthService, type Vendor } from '../../services/authService';
import { EventService } from '../../services/eventService';
import { AnalyticsSection } from '../../components/dashboard/AnalyticsSection';
import { getVendorLabels } from '../../utils/vendorLabels';

export const DashboardPage: React.FC = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalListings, setTotalListings] = useState(0);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadVendorData();
    loadListingsCount();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadListingsCount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadVendorData = async () => {
    try {
      const vendorData = await AuthService.getCurrentUser();
      if (vendorData) {
        setVendor(vendorData);
        
      }
    } catch (error) {
      console.error('Failed to load vendor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadListingsCount = async () => {
    try {
      console.log('Loading listings count...');
      const result = await EventService.getAllListings();
      console.log('API Response:', result);
      
      if (result.success && result.listings) {
        console.log('Setting total listings to:', result.listings.length);
        setTotalListings(result.listings.length);
      } else {
        console.log('API failed or no listings, setting to 3 as fallback');
        // Fallback to show 3 as sample data if API fails
        setTotalListings(3);
      }
    } catch (error) {
      console.error('Failed to load listings count:', error);
      // Fallback to show 3 as sample data if API fails
      setTotalListings(3);
    } finally {
      setIsLoadingListings(false);
    }
  };

  // Get dynamic labels based on vendor type
  const vendorLabels = getVendorLabels(vendor?.vendorType);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
          <p className="text-brand-dark-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-brand-blue-600 via-brand-blue-700 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="relative px-8 py-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4">
              <Sparkles size={64} className="text-white" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Sparkles size={48} className="text-white" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Sparkles size={80} className="text-white" />
            </div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Welcome Back, {vendor?.name?.split(' ')[0] || 'Vendor'}! 👋
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Let's make today even better. Ready to launch?
            </p>
            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={20} />
                <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Verification Status - Only for LOCAL_EVENT_HOST */}
      {vendor?.vendorType === 'LOCAL_EVENT_HOST' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                vendor?.business_details_verified 
                  ? 'bg-green-100' 
                  : vendor?.business_verification_status === 'pending'
                  ? 'bg-amber-100'
                  : 'bg-red-100'
              }`}>
                {vendor?.business_details_verified ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : vendor?.business_verification_status === 'pending' ? (
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-900">
                  Business Verification Status
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vendor?.business_details_verified
                      ? 'bg-green-100 text-green-800'
                      : vendor?.business_verification_status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : vendor?.business_verification_status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vendor?.business_details_verified 
                      ? '✅ Verified' 
                      : vendor?.business_verification_status === 'pending'
                      ? '⏳ Under Review'
                      : vendor?.business_verification_status === 'rejected'
                      ? '❌ Rejected'
                      : '⚠️ Not Submitted'
                    }
                  </span>
                  {vendor?.business_verification_completed_at && (
                    <span className="text-sm text-gray-500">
                      Verified on {new Date(vendor.business_verification_completed_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {vendor?.business_details_verified
                    ? 'Your business is verified. You can create unlimited experiences.'
                    : vendor?.business_verification_status === 'pending'
                    ? 'Your business details are under review. We\'ll notify you once approved.'
                    : vendor?.business_verification_status === 'rejected'
                    ? 'Your business verification was rejected. Please update your details.'
                    : 'Complete your business verification to start creating experiences.'
                  }
                </p>
              </div>
            </div>
            {!vendor?.business_details_verified && (
              <button
                onClick={() => navigate('/edit-profile?section=business')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>
                  {vendor?.business_verification_status === 'rejected' ? 'Update Details' : 'Complete Verification'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">₹24,500</h3>
          <p className="text-brand-dark-500 text-sm">Revenue This Month</p>
        </div>

        <button
          onClick={() => navigate('/all-listings')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-brand-blue-300 transition-all duration-200 text-left w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">
            {isLoadingListings ? (
              <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              totalListings
            )}
          </h3>
          <p className="text-brand-dark-500 text-sm">Active Bookings</p>
        </button>

        <button
          onClick={() => navigate('/all-listings')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-brand-purple-300 transition-all duration-200 text-left w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-purple-600" />
            </div>
            <span className="text-purple-600 text-sm font-medium bg-purple-50 px-2 py-1 rounded-full">
              Live
            </span>
          </div>
          <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">
            {isLoadingListings ? (
              <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              totalListings
            )}
          </h3>
          <p className="text-brand-dark-500 text-sm">{vendorLabels.dashboardMetricLabel}</p>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-yellow-600" />
            </div>
            <span className="text-yellow-600 text-sm font-medium bg-yellow-50 px-2 py-1 rounded-full">
              Excellent
            </span>
          </div>
          <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">4.8</h3>
          <p className="text-brand-dark-500 text-sm">Avg. Rating</p>
        </div>
      </div>

      {/* Recent Bookings & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-brand-dark-900">Recent Bookings</h2>
                <p className="text-brand-dark-500 text-sm">Latest reservations and inquiries</p>
              </div>
              <button
                onClick={() => navigate('/bookings')}
                className="flex items-center space-x-2 text-brand-blue-600 hover:text-brand-blue-700 transition-colors"
              >
                <span className="text-sm font-medium">View All</span>
                <ArrowRight size={16} />
              </button>
            </div>
            
            {/* Fixed height content area with white space */}
            <div className="bg-white flex-1 flex items-center justify-center text-brand-dark-400">
              <div className="text-center">
                <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Booking data will appear here</p>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-brand-dark-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              {/* Dynamic Create Button(s) based on vendor type */}
              {vendor?.vendorType === 'LOCAL_EVENT_HOST' ? (
                <>
                  <button
                    onClick={() => navigate('/create-event')}
                    className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-brand-blue-600 to-brand-blue-700 text-white rounded-lg hover:from-brand-blue-700 hover:to-brand-blue-800 transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Plus size={24} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-sm">CREATE ONE TIME EVENT</h4>
                      <p className="text-sm text-blue-100">Create a one-day event</p>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/create-recurring-event')}
                    className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Plus size={24} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-sm">CREATE EXPERIENCE</h4>
                      <p className="text-sm text-purple-100">Create recurring events</p>
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/create-event')}
                  className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-brand-blue-600 to-brand-blue-700 text-white rounded-lg hover:from-brand-blue-700 hover:to-brand-blue-800 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold">{vendorLabels.createNewButtonText}</h4>
                    <p className="text-sm text-blue-100">Create a new {vendorLabels.productSingular.toLowerCase()}</p>
                  </div>
                </button>
              )}

              <button className="w-full flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Eye size={24} className="text-orange-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-brand-dark-900">View Inquiries</h4>
                  <p className="text-sm text-brand-dark-500">Check customer messages</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare size={24} className="text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-brand-dark-900">Customer Support</h4>
                  <p className="text-sm text-brand-dark-500">Get help with bookings</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-purple-800">Ask Sherpa AI</h4>
                  <p className="text-sm text-purple-600">Get AI-powered insights</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <AnalyticsSection />

    </div>
  );
};