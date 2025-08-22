import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, MapPin, Users, Eye, Edit, Trash2, X, Clock, Phone, CreditCard, Globe, Info,
  Search, Filter, Grid, List, Package, FileText, CheckCircle
} from 'lucide-react';
import { EventService, type EventListing } from '../../services/eventService';
import { EditEventModal } from '../../components/ui/EditEventModal';
import { DeleteConfirmationModal } from '../../components/ui/DeleteConfirmationModal';
import { AuthService, type Vendor } from '../../services/authService';
import { getVendorLabels } from '../../utils/vendorLabels';

export const AllListingsPage: React.FC = () => {
  const [listings, setListings] = useState<EventListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<EventListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventListing | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showPricingDetails, setShowPricingDetails] = useState<{[key: string]: boolean}>({});
  const [editingEvent, setEditingEvent] = useState<EventListing | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<EventListing | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  
  // Filter and view states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'draft', 'ended'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadListings();
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      const vendorData = await AuthService.getCurrentUser();
      setVendor(vendorData);
    } catch (error) {
      console.error('Failed to load vendor data:', error);
    }
  };

  // Filter listings whenever filters or search changes
  useEffect(() => {
    let filtered = [...listings];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(listing =>
        listing.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Active status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === activeFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(listing => listing.category === categoryFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(listing => {
        const eventDate = new Date(listing.date);
        switch (dateFilter) {
          case 'upcoming':
            return eventDate > now;
          case 'past':
            return eventDate < now;
          case 'this_month':
            return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredListings(filtered);
  }, [listings, searchQuery, activeFilter, categoryFilter, dateFilter]);

  // Close pricing details when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.pricing-details-container')) {
        setShowPricingDetails({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadListings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await EventService.getAllListings();
      if (result.success) {
        setListings(result.listings || []);
      } else {
        setError(result.error || 'Failed to load listings');
      }
    } catch (error) {
      console.error('Failed to load listings:', error);
      setError('An unexpected error occurred while loading listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteListing = (listing: EventListing) => {
    setDeletingEvent(listing);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingEvent) return;
    
    setIsDeleting(true);
    try {
      const result = await EventService.deleteEvent(deletingEvent.id);
      if (result.success) {
        setListings(prev => prev.filter(listing => listing.id !== deletingEvent.id));
        setShowDeleteModal(false);
        setDeletingEvent(null);
      } else {
        alert(result.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('An unexpected error occurred while deleting the event');
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setDeletingEvent(null);
    }
  };

  const handleViewEvent = (event: EventListing) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
    setShowEventDetails(false);
  };

  const togglePricingDetails = (eventId: string) => {
    setShowPricingDetails(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const handleEditEvent = (event: EventListing) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingEvent(null);
    setShowEditModal(false);
  };

  const handleEventUpdated = (updatedEvent: EventListing) => {
    setListings(prev => prev.map(listing => 
      listing.id === updatedEvent.id ? updatedEvent : listing
    ));
    closeEditModal();
  };

  // Computed statistics and labels
  const vendorLabels = getVendorLabels(vendor?.vendorType);
  const totalProducts = listings.length;
  const activeListings = listings.filter(l => l.status === 'active').length;
  const draftProducts = listings.filter(l => l.status === 'draft').length;

  // Get unique categories for filter
  const categories = [...new Set(listings.map(l => l.category))];

  const handleViewBookings = (listing: EventListing) => {
    // Navigate to bookings page with event filter
    navigate(`/bookings?event=${listing.id}`);
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'comedy':
        return 'bg-purple-100 text-purple-800';
      case 'music':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-orange-100 text-orange-800';
      case 'cultural':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
          <p className="text-brand-dark-600">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark-900">All {vendorLabels.productPlural}</h1>
            <p className="text-brand-dark-500">Manage your {vendorLabels.productPlural.toLowerCase()} listings and bookings</p>
          </div>
          
          {/* Dynamic Create Buttons based on vendor type */}
          {vendor?.vendorType === 'LOCAL_EVENT_HOST' ? (
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/create-event')}
                className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                <span>CREATE ONE TIME EVENT</span>
              </button>
              <button
                onClick={() => navigate('/create-recurring-event')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                <span>CREATE EXPERIENCE</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/create-event')}
              className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={16} />
              <span>{vendorLabels.createNewButtonText}</span>
            </button>
          )}
        </div>

        {/* Top Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package size={24} className="text-blue-600" />
              </div>
              <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">{totalProducts}</h3>
            <p className="text-brand-dark-500 text-sm">Total {vendorLabels.productPlural}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                Live
              </span>
            </div>
            <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">{activeListings}</h3>
            <p className="text-brand-dark-500 text-sm">Active Listings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FileText size={24} className="text-yellow-600" />
              </div>
              <span className="text-yellow-600 text-sm font-medium bg-yellow-50 px-2 py-1 rounded-full">
                Draft
              </span>
            </div>
            <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">{draftProducts}</h3>
            <p className="text-brand-dark-500 text-sm">Draft {vendorLabels.productPlural}</p>
          </div>
        </div>

        {/* Search, Filters and View Controls - All in One Line */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-brand-dark-700 whitespace-nowrap">Status:</label>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent text-sm whitespace-nowrap"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="ended">Ended</option>
              </select>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm ${
                  viewMode === 'card' 
                    ? 'bg-white text-brand-blue-600 shadow-sm' 
                    : 'text-brand-dark-600 hover:text-brand-dark-900'
                }`}
              >
                <Grid size={16} />
                <span>Card</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm ${
                  viewMode === 'list' 
                    ? 'bg-white text-brand-blue-600 shadow-sm' 
                    : 'text-brand-dark-600 hover:text-brand-dark-900'
                }`}
              >
                <List size={16} />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">Date Range</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Dates</option>
                    <option value="upcoming">Upcoming Events</option>
                    <option value="past">Past Events</option>
                    <option value="this_month">This Month</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>


      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p>{error}</p>
          <button 
            onClick={loadListings}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results Info */}
      {!error && (
        <div className="flex items-center justify-between text-sm text-brand-dark-600">
          <span>
            Showing {filteredListings.length} of {totalProducts} {vendorLabels.productPlural.toLowerCase()}
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          {filteredListings.length !== totalProducts && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setCategoryFilter('all');
                setDateFilter('all');
              }}
              className="text-brand-blue-600 hover:text-brand-blue-700 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Listings Content */}
      {!error && filteredListings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {totalProducts === 0 ? (
                <Plus size={24} className="text-gray-400" />
              ) : (
                <Search size={24} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-brand-dark-700 mb-2">
              {totalProducts === 0 ? 'No listings found' : 'No matching results'}
            </h3>
            <p className="text-brand-dark-500 mb-6">
              {totalProducts === 0 
                ? "You haven't created any listings yet. Start by creating your first event!"
                : "Try adjusting your search or filter criteria to find what you're looking for."
              }
            </p>
            {totalProducts === 0 ? (
              <div className="text-center">
                <p className="text-brand-dark-500 mb-2">Use the create buttons above to get started</p>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  setCategoryFilter('all');
                  setDateFilter('all');
                }}
                className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-6 py-3 rounded-xl transition-colors mx-auto"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
            >
                    {/* Banner Image */}
                    <div className="h-48 bg-gray-200 relative">
                      {listing.banner_image ? (
                        <img
                          src={listing.banner_image}
                          alt={listing.event_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', listing.banner_image);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue-100 to-brand-blue-200">
                          <Calendar className="text-brand-blue-600" size={32} />
                        </div>
                      )}
                      
                      {/* Fallback icon for failed images */}
                      <div className="fallback-icon hidden absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue-100 to-brand-blue-200">
                        <Calendar className="text-brand-blue-600" size={32} />
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(listing.status)}`}>
                          {listing.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-brand-dark-900 line-clamp-2">
                          {listing.event_name}
                        </h3>
                      </div>

                      {/* Category */}
                      <div className="mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(listing.category)}`}>
                          {listing.category}
                        </span>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-brand-dark-600">
                          <Calendar size={14} className="mr-2" />
                          {formatDate(listing.date)}
                        </div>
                        <div className="flex items-center text-sm text-brand-dark-600">
                          <MapPin size={14} className="mr-2" />
                          {listing.venue}, {listing.city}
                        </div>
                        <div className="flex items-center text-sm text-brand-dark-600">
                          <Users size={14} className="mr-2" />
                          Max {listing.max_participants} participants
                        </div>
                      </div>

                      {/* Price */}
                      {listing.pricing_type === 'fixed' && listing.fixed_price && (
                        <div className="mb-4">
                          <span className="text-lg font-semibold text-brand-blue-600">
                            ₹{listing.fixed_price}
                          </span>
                        </div>
                      )}

                      {listing.pricing_type === 'tiered' && listing.tiers && (
                        <div className="mb-4 pricing-details-container">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-brand-dark-600">Tiered Pricing:</span>
                            <button
                              onClick={() => togglePricingDetails(listing.id)}
                              className="text-brand-blue-600 hover:text-brand-blue-700 transition-colors"
                              title="Show detailed pricing"
                            >
                              <Info size={14} />
                            </button>
                          </div>
                          
                          {showPricingDetails[listing.id] ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                              <div className="space-y-2">
                                {Object.entries(listing.tiers).map(([tierName, tierData]) => (
                                  <div key={tierName} className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium text-sm text-blue-900">
                                        {tierName.replace(/_/g, ' ').toUpperCase()}
                                      </div>
                                      {tierData.description && (
                                        <div className="text-xs text-blue-700">{tierData.description}</div>
                                      )}
                                      {tierData.available_until && (
                                        <div className="text-xs text-blue-600">
                                          Available until: {new Date(tierData.available_until).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                    <div className="font-bold text-blue-900">₹{tierData.price}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(listing.tiers).map(([tierName, tierData]) => (
                                <span 
                                  key={tierName}
                                  className="text-xs bg-brand-blue-100 text-brand-blue-700 px-2 py-1 rounded-full"
                                >
                                  {tierName.replace(/_/g, ' ')}: ₹{tierData.price}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleViewEvent(listing)}
                            className="flex items-center space-x-1 text-sm text-brand-blue-600 hover:text-brand-blue-700 transition-colors"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                          <button 
                            onClick={() => handleEditEvent(listing)}
                            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700 transition-colors"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => handleViewBookings(listing)}
                            className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 transition-colors"
                          >
                            <Users size={14} />
                            <span>Bookings</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => handleDeleteListing(listing)}
                          className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
            ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">Event</th>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">Date & Venue</th>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">Category</th>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">Price</th>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing, index) => (
                  <tr key={listing.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                          {listing.banner_image ? (
                            <img
                              src={listing.banner_image}
                              alt={listing.event_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue-100 to-brand-blue-200">
                              <Calendar className="text-brand-blue-600" size={16} />
                            </div>
                          )}
                          <div className="fallback-icon hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue-100 to-brand-blue-200">
                            <Calendar className="text-brand-blue-600" size={16} />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-brand-dark-900 line-clamp-1">{listing.event_name}</h3>
                          <p className="text-sm text-brand-dark-500 flex items-center mt-1">
                            <Users size={12} className="mr-1" />
                            Max {listing.max_participants}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="flex items-center text-brand-dark-900 mb-1">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(listing.date)}
                        </div>
                        <div className="flex items-center text-brand-dark-500">
                          <MapPin size={12} className="mr-1" />
                          {listing.venue}, {listing.city}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(listing.category)}`}>
                        {listing.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {listing.pricing_type === 'fixed' && listing.fixed_price ? (
                        <span className="text-sm font-semibold text-brand-blue-600">₹{listing.fixed_price}</span>
                      ) : listing.pricing_type === 'tiered' && listing.tiers ? (
                        <div className="text-sm">
                          <span className="text-brand-blue-600 font-medium">Tiered</span>
                          <div className="text-xs text-brand-dark-500">
                            {Object.entries(listing.tiers).slice(0, 1).map(([, tierData]) => (
                              <span key="first">from ₹{tierData.price}</span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-brand-dark-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => handleViewEvent(listing)}
                          className="p-2 text-brand-blue-600 hover:bg-brand-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditEvent(listing)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleViewBookings(listing)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View Bookings"
                        >
                          <Users size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteListing(listing)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-brand-dark-900">{selectedEvent.event_name}</h2>
              <button
                onClick={closeEventDetails}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Banner Image */}
              {selectedEvent.banner_image && (
                <div className="mb-6">
                  <img
                    src={selectedEvent.banner_image}
                    alt={selectedEvent.event_name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Modal image failed to load:', selectedEvent.banner_image);
                      e.currentTarget.parentElement?.style.setProperty('display', 'none');
                    }}
                  />
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="text-brand-blue-600 mr-3" size={20} />
                      <div>
                        <div className="font-medium">{formatDate(selectedEvent.date)}</div>
                        <div className="text-sm text-brand-dark-500">at {selectedEvent.start_time}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="text-brand-blue-600 mr-3" size={20} />
                      <div>
                        <div className="font-medium">{selectedEvent.duration} hours</div>
                        <div className="text-sm text-brand-dark-500">Duration</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="text-brand-blue-600 mr-3" size={20} />
                      <div>
                        <div className="font-medium">{selectedEvent.venue}</div>
                        <div className="text-sm text-brand-dark-500">{selectedEvent.full_address}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="text-brand-blue-600 mr-3" size={20} />
                      <div>
                        <div className="font-medium">Max {selectedEvent.max_participants} participants</div>
                        <div className="text-sm text-brand-dark-500">Capacity</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Pricing & Contact</h3>
                  <div className="space-y-3">
                    {/* Pricing */}
                    <div className="flex items-center">
                      <CreditCard className="text-brand-blue-600 mr-3" size={20} />
                      <div>
                        {selectedEvent.pricing_type === 'fixed' && selectedEvent.fixed_price ? (
                          <div className="font-medium text-brand-blue-600">₹{selectedEvent.fixed_price}</div>
                        ) : selectedEvent.pricing_type === 'tiered' && selectedEvent.tiers ? (
                          <div className="pricing-details-container">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">Tiered Pricing</span>
                              <button
                                onClick={() => togglePricingDetails(`modal-${selectedEvent.id}`)}
                                className="text-brand-blue-600 hover:text-brand-blue-700 transition-colors"
                                title="Show detailed pricing"
                              >
                                <Info size={14} />
                              </button>
                            </div>
                            <div className="text-sm text-brand-dark-500">
                              {showPricingDetails[`modal-${selectedEvent.id}`] ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <div className="space-y-3">
                                    {Object.entries(selectedEvent.tiers).map(([tierName, tierData]) => (
                                      <div key={tierName} className="border-b border-blue-200 last:border-b-0 pb-2 last:pb-0">
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <div className="font-semibold text-blue-900">
                                              {tierName.replace(/_/g, ' ').toUpperCase()}
                                            </div>
                                            {tierData.description && (
                                              <div className="text-sm text-blue-700 mt-1">{tierData.description}</div>
                                            )}
                                            {tierData.available_until && (
                                              <div className="text-sm text-blue-600 mt-1">
                                                Available until: {new Date(tierData.available_until).toLocaleDateString()}
                                              </div>
                                            )}
                                          </div>
                                          <div className="text-lg font-bold text-blue-900 ml-4">₹{tierData.price}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  {Object.entries(selectedEvent.tiers).map(([tierName, tierData]) => (
                                    <div key={tierName} className="flex justify-between">
                                      <span>{tierName.replace(/_/g, ' ')}</span>
                                      <span>₹{tierData.price}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-brand-dark-500">Pricing not specified</div>
                        )}
                        <div className="text-sm text-brand-dark-500">{selectedEvent.pricing_type} pricing</div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center">
                      <Phone className="text-brand-blue-600 mr-3" size={20} />
                      <div>
                        <div className="font-medium">{selectedEvent.contact_number}</div>
                        <div className="text-sm text-brand-dark-500">{selectedEvent.contact_name}</div>
                      </div>
                    </div>

                    {/* Website */}
                    {selectedEvent.event_website && (
                      <div className="flex items-center">
                        <Globe className="text-brand-blue-600 mr-3" size={20} />
                        <div>
                          <a 
                            href={selectedEvent.event_website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-brand-blue-600 hover:text-brand-blue-700"
                          >
                            Event Website
                          </a>
                          <div className="text-sm text-brand-dark-500">External link</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-3">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-brand-dark-700 mb-2">{selectedEvent.tagline}</p>
                  <p className="text-brand-dark-600 text-sm mb-3">{selectedEvent.short_description}</p>
                  <p className="text-brand-dark-600 text-sm">{selectedEvent.long_description}</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark-900 mb-3">Event Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-dark-500">Category:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(selectedEvent.category)}`}>
                        {selectedEvent.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-dark-500">Format:</span>
                      <span className="capitalize">{selectedEvent.event_format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-dark-500">Languages:</span>
                      <span>{selectedEvent.languages_spoken || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-dark-500">Booking Closure:</span>
                      <span>{selectedEvent.booking_closure} hours before</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-dark-900 mb-3">Accessibility & Features</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-dark-500">Wheelchair Accessible:</span>
                      <span className={selectedEvent.wheelchair_accessible ? 'text-green-600' : 'text-red-600'}>
                        {selectedEvent.wheelchair_accessible ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-dark-500">Women Only:</span>
                      <span className={selectedEvent.women_only ? 'text-green-600' : 'text-gray-600'}>
                        {selectedEvent.women_only ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-dark-500">Pet Friendly:</span>
                      <span className={selectedEvent.pet_friendly ? 'text-green-600' : 'text-gray-600'}>
                        {selectedEvent.pet_friendly ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-dark-500">Refund Policy:</span>
                      <span className="capitalize">{selectedEvent.refund_policy?.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guidelines and FAQs */}
              {(selectedEvent.guidelines || selectedEvent.faqs) && (
                <div className="mt-6">
                  {selectedEvent.guidelines && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-brand-dark-900 mb-2">Guidelines</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">{selectedEvent.guidelines}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.faqs && (
                    <div>
                      <h3 className="text-lg font-semibold text-brand-dark-900 mb-2">FAQs</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">{selectedEvent.faqs}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Note */}
              {selectedEvent.custom_note && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-brand-dark-900 mb-2">Special Note</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">{selectedEvent.custom_note}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeEventDetails}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    closeEventDetails();
                    handleEditEvent(selectedEvent);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Edit Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <EditEventModal
          event={editingEvent}
          isOpen={showEditModal}
          onClose={closeEditModal}
          onEventUpdated={handleEventUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deletingEvent?.event_name || ''}
        isLoading={isDeleting}
      />
    </>
  );
};