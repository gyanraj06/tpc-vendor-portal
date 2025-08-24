import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, MapPin, Users, Eye, Edit, Trash2, X, Clock, Phone, CreditCard, Globe, Info,
  Search, Filter, Grid, List, Package, FileText, CheckCircle
} from 'lucide-react';
import { EventService, type EventListing } from '../../services/eventService';
import { RecurringEventService, type RecurringEvent, type TimeSlot } from '../../services/recurringEventService';
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
  
  // Recurring event deletion state
  const [deletingRecurringEvent, setDeletingRecurringEvent] = useState<RecurringEvent | null>(null);
  const [showDeleteRecurringModal, setShowDeleteRecurringModal] = useState(false);
  const [isDeletingRecurring, setIsDeletingRecurring] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  
  // Filter and view states
  const [eventType, setEventType] = useState<'one-time' | 'experience'>('one-time'); // New toggle state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'draft', 'ended'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  
  // Recurring events state
  const [recurringEvents, setRecurringEvents] = useState<RecurringEvent[]>([]);
  const [filteredRecurringEvents, setFilteredRecurringEvents] = useState<RecurringEvent[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadListings();
    loadVendorData();
  }, []);
  
  // Load data when event type changes
  useEffect(() => {
    loadListings();
  }, [eventType]);

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
    if (eventType === 'one-time') {
      let filtered = [...listings];

      // Search filter for one-time events
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

      // Date filter for one-time events
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
    } else {
      // Filter recurring events/experiences
      let filtered = [...recurringEvents];

      // Search filter for recurring events
      if (searchQuery.trim()) {
        filtered = filtered.filter(event =>
          event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.sub_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.primary_category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Active status filter
      if (activeFilter !== 'all') {
        filtered = filtered.filter(event => event.status === activeFilter);
      }

      // Category filter for recurring events
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(event => event.primary_category === categoryFilter);
      }

      setFilteredRecurringEvents(filtered);
    }
  }, [listings, recurringEvents, searchQuery, activeFilter, categoryFilter, dateFilter, eventType]);

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
      if (eventType === 'one-time') {
        // Load one-time events
        const result = await EventService.getAllListings();
        if (result.success) {
          setListings(result.listings || []);
        } else {
          setError(result.error || 'Failed to load events');
        }
      } else {
        // Load recurring events/experiences
        const result = await RecurringEventService.getRecurringEventsByVendor();
        if (result.success) {
          setRecurringEvents(result.data || []);
        } else {
          setError(result.error || 'Failed to load recurring events');
        }
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

  const handleDeleteRecurringEvent = (event: RecurringEvent) => {
    setDeletingRecurringEvent(event);
    setShowDeleteRecurringModal(true);
  };

  const confirmDeleteRecurring = async () => {
    if (!deletingRecurringEvent) return;
    
    setIsDeletingRecurring(true);
    try {
      const result = await RecurringEventService.deleteRecurringEvent(deletingRecurringEvent.id);
      if (result.success) {
        setRecurringEvents(prev => prev.filter(event => event.id !== deletingRecurringEvent.id));
        setShowDeleteRecurringModal(false);
        setDeletingRecurringEvent(null);
      } else {
        alert(result.error || 'Failed to delete recurring event');
      }
    } catch (error) {
      console.error('Failed to delete recurring event:', error);
      alert('An unexpected error occurred while deleting the recurring event');
    } finally {
      setIsDeletingRecurring(false);
    }
  };

  const closeDeleteRecurringModal = () => {
    if (!isDeletingRecurring) {
      setShowDeleteRecurringModal(false);
      setDeletingRecurringEvent(null);
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
  const currentData = eventType === 'one-time' ? listings : recurringEvents;
  const totalProducts = currentData.length;
  const activeListings = currentData.filter(l => l.status === 'active').length;
  const draftProducts = currentData.filter(l => l.status === 'draft').length;

  // Get unique categories for filter
  const categories = eventType === 'one-time' 
    ? [...new Set(listings.map(l => l.category))]
    : [...new Set(recurringEvents.map(e => e.primary_category))];

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
      case 'music':
      case 'dance':
        return 'bg-purple-100 text-purple-800';
      case 'workshop':
      case 'educational':
        return 'bg-orange-100 text-orange-800';
      case 'cultural':
      case 'art':
        return 'bg-pink-100 text-pink-800';
      case 'adventure':
      case 'nature':
        return 'bg-green-100 text-green-800';
      case 'wellness':
        return 'bg-blue-100 text-blue-800';
      case 'food':
        return 'bg-yellow-100 text-yellow-800';
      case 'photography':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format time slots
  const formatTimeSlots = (timeSlots: TimeSlot[]) => {
    if (!timeSlots || timeSlots.length === 0) return 'No time slots';
    return timeSlots.map(slot => `${slot.start} - ${slot.end}`).join(', ');
  };

  // Helper function to format location for recurring events
  const formatRecurringLocation = (event: RecurringEvent) => {
    if (event.location_type === 'fixed' && event.event_address) {
      const addr = event.event_address;
      return `${addr["Line 1"]}${addr["Line 2"] ? ', ' + addr["Line 2"] : ''}, ${addr.City}`;
    }
    return `${event.location_type} location`;
  };

  // Render card for recurring events/experiences
  const renderRecurringEventCard = (event: RecurringEvent) => (
    <div
      key={event.id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
    >
      {/* Header Image */}
      <div className="h-48 bg-gray-200 relative">
        {event.experience_photo_urls && event.experience_photo_urls.length > 0 ? (
          <img
            src={event.experience_photo_urls[0]}
            alt={event.event_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
            eventType === 'one-time' 
              ? 'from-blue-100 to-blue-200' 
              : 'from-purple-100 to-purple-200'
          }`}>
            <Plus className={eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'} size={32} />
          </div>
        )}
        
        <div className={`fallback-icon hidden absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br ${
          eventType === 'one-time' 
            ? 'from-blue-100 to-blue-200' 
            : 'from-purple-100 to-purple-200'
        }`}>
          <Plus className={eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'} size={32} />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(event.status)}`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-brand-dark-900 line-clamp-2">
            {event.event_name}
          </h3>
        </div>

        {/* Category */}
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(event.primary_category)}`}>
            {event.primary_category}
          </span>
        </div>

        {/* Experience Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-brand-dark-600">
            <Calendar size={14} className="mr-2" />
            {event.recurrence_type} recurring
          </div>
          <div className="flex items-center text-sm text-brand-dark-600">
            <Clock size={14} className="mr-2" />
            {formatTimeSlots(event.time_slots)}
          </div>
          <div className="flex items-center text-sm text-brand-dark-600">
            <MapPin size={14} className="mr-2" />
            {formatRecurringLocation(event)}
          </div>
          {event.max_participants_per_occurrence && (
            <div className="flex items-center text-sm text-brand-dark-600">
              <Users size={14} className="mr-2" />
              Max {event.max_participants_per_occurrence} per session
            </div>
          )}
        </div>

        {/* Price */}
        {event.event_type === 'paid' && event.ticket_price && (
          <div className="mb-4">
            <span className={`text-lg font-semibold ${
              eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
            }`}>
              ₹{event.ticket_price}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => console.log('View recurring event:', event.id)}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                eventType === 'one-time' 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              <Eye size={14} />
              <span>View</span>
            </button>
            <button 
              onClick={() => console.log('Edit recurring event:', event.id)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700 transition-colors"
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
            <button 
              onClick={() => console.log('View bookings for recurring event:', event.id)}
              className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 transition-colors"
            >
              <Users size={14} />
              <span>Bookings</span>
            </button>
          </div>
          <button 
            onClick={() => handleDeleteRecurringEvent(event)}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
            eventType === 'one-time' ? 'border-blue-600' : 'border-purple-600'
          }`}></div>
          <p className="text-brand-dark-600">Loading your {eventType === 'one-time' ? 'events' : 'experiences'}...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-dark-900 mb-4">All {vendorLabels.productPlural}</h1>
            
            {/* Event Type Description and Toggle */}
            {vendor?.vendorType === 'LOCAL_EVENT_HOST' ? (
              <div className="space-y-4">
                {/* Description based on current event type */}
                <div>
                  {eventType === 'one-time' ? (
                    <div>
                      <h2 className="text-lg font-semibold text-brand-dark-800 mb-2">One-time Events</h2>
                      <p className="text-brand-dark-600">
                        Traditional single-occurrence events with specific dates, times, and venues. Perfect for workshops, 
                        concerts, conferences, or any event that happens once at a scheduled time.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-lg font-semibold text-brand-dark-800 mb-2">Recurring Experiences</h2>
                      <p className="text-brand-dark-600">
                        Ongoing activities that repeat regularly - daily, weekly, or as per your usecase. Ideal for fitness classes, 
                        cooking workshops, guided tours, or any experience that runs on a recurring schedule.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-brand-dark-500">Manage your {vendorLabels.productPlural.toLowerCase()} listings and bookings</p>
            )}
          </div>
          
          {/* Right side controls */}
          <div className="flex flex-col items-end space-y-4">
            {/* Event Type Toggle - Only show for LOCAL_EVENT_HOST */}
            {vendor?.vendorType === 'LOCAL_EVENT_HOST' && (
              <div className="flex items-center bg-white rounded-xl p-2 shadow-md border border-gray-200">
                <button
                  onClick={() => setEventType('one-time')}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-lg transition-all duration-200 text-sm font-semibold ${
                    eventType === 'one-time'
                      ? 'bg-brand-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-brand-dark-600 hover:text-brand-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Calendar size={16} />
                  <span>One-time Events</span>
                </button>
                <button
                  onClick={() => setEventType('experience')}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-lg transition-all duration-200 text-sm font-semibold ${
                    eventType === 'experience'
                      ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-brand-dark-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Plus size={16} />
                  <span>Experiences</span>
                </button>
              </div>
            )}
            
            {/* Create Buttons */}
            {vendor?.vendorType === 'LOCAL_EVENT_HOST' ? (
              <div className="flex space-x-3">
                {eventType === 'one-time' ? (
                  <button
                    onClick={() => navigate('/create-event')}
                    className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors text-sm font-medium"
                  >
                    <Plus size={16} />
                    <span>CREATE EVENT</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/create-recurring-event')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors text-sm font-medium"
                  >
                    <Plus size={16} />
                    <span>CREATE EXPERIENCE</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/create-event')}
                className={`text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
                  eventType === 'one-time' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <Plus size={16} />
                <span>{vendorLabels.createNewButtonText}</span>
              </button>
            )}
          </div>
        </div>

        {/* Top Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                eventType === 'one-time' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                <Package size={24} className={eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                eventType === 'one-time' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-purple-600 bg-purple-50'
              }`}>
                Total
              </span>
            </div>
            <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">{totalProducts}</h3>
            <p className="text-brand-dark-500 text-sm">
              Total {eventType === 'one-time' ? 'Events' : 'Experiences'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                eventType === 'one-time' ? 'bg-green-100' : 'bg-emerald-100'
              }`}>
                <CheckCircle size={24} className={eventType === 'one-time' ? 'text-green-600' : 'text-emerald-600'} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                eventType === 'one-time' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-emerald-600 bg-emerald-50'
              }`}>
                Live
              </span>
            </div>
            <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">{activeListings}</h3>
            <p className="text-brand-dark-500 text-sm">Active Listings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                eventType === 'one-time' ? 'bg-yellow-100' : 'bg-orange-100'
              }`}>
                <FileText size={24} className={eventType === 'one-time' ? 'text-yellow-600' : 'text-orange-600'} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                eventType === 'one-time' 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-orange-600 bg-orange-50'
              }`}>
                Draft
              </span>
            </div>
            <h3 className="text-2xl font-bold text-brand-dark-900 mb-1">{draftProducts}</h3>
            <p className="text-brand-dark-500 text-sm">
              Draft {eventType === 'one-time' ? 'Events' : 'Experiences'}
            </p>
          </div>
        </div>

        {/* Search, Filters and View Controls - All in One Line */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                eventType === 'one-time' ? 'text-blue-400' : 'text-purple-400'
              }`} size={20} />
              <input
                type="text"
                placeholder={`Search ${eventType === 'one-time' ? 'events' : 'experiences'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  eventType === 'one-time' 
                    ? 'focus:ring-blue-500 focus:border-blue-500' 
                    : 'focus:ring-purple-500 focus:border-purple-500'
                }`}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-brand-dark-700 whitespace-nowrap">Status:</label>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className={`px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm whitespace-nowrap ${
                  eventType === 'one-time' 
                    ? 'focus:ring-blue-500 focus:border-blue-500' 
                    : 'focus:ring-purple-500 focus:border-purple-500'
                }`}
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
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors text-sm whitespace-nowrap ${
                showAdvancedFilters 
                  ? (eventType === 'one-time' 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200')
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Filter size={16} className={showAdvancedFilters ? (eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600') : 'text-gray-600'} />
              <span>Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm ${
                  viewMode === 'card' 
                    ? (eventType === 'one-time' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'bg-white text-purple-600 shadow-sm')
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
                    ? (eventType === 'one-time' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'bg-white text-purple-600 shadow-sm')
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
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${
                      eventType === 'one-time' 
                        ? 'focus:ring-blue-500 focus:border-blue-500' 
                        : 'focus:ring-purple-500 focus:border-purple-500'
                    }`}
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
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${
                      eventType === 'one-time' 
                        ? 'focus:ring-blue-500 focus:border-blue-500' 
                        : 'focus:ring-purple-500 focus:border-purple-500'
                    }`}
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
            Showing {eventType === 'one-time' ? filteredListings.length : filteredRecurringEvents.length} of {totalProducts} {eventType === 'one-time' ? 'events' : 'experiences'}
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          {(eventType === 'one-time' ? filteredListings.length : filteredRecurringEvents.length) !== totalProducts && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setCategoryFilter('all');
                setDateFilter('all');
              }}
              className={`transition-colors ${
                eventType === 'one-time' 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Listings Content */}
      {!error && (eventType === 'one-time' ? filteredListings.length === 0 : filteredRecurringEvents.length === 0) ? (
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
                ? `You haven't created any ${eventType === 'one-time' ? 'events' : 'experiences'} yet. Start by creating your first ${eventType === 'one-time' ? 'event' : 'experience'}!`
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
                className={`text-white px-6 py-3 rounded-xl transition-colors mx-auto ${
                  eventType === 'one-time' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventType === 'one-time' 
            ? filteredListings.map((listing) => (
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
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
                          eventType === 'one-time' 
                            ? 'from-blue-100 to-blue-200' 
                            : 'from-purple-100 to-purple-200'
                        }`}>
                          <Calendar className={eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'} size={32} />
                        </div>
                      )}
                      
                      {/* Fallback icon for failed images */}
                      <div className={`fallback-icon hidden absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br ${
                        eventType === 'one-time' 
                          ? 'from-blue-100 to-blue-200' 
                          : 'from-purple-100 to-purple-200'
                      }`}>
                        <Calendar className={eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'} size={32} />
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
                          <span className={`text-lg font-semibold ${
                            eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                          }`}>
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
                            <div className={`rounded-lg p-3 mb-2 ${
                              eventType === 'one-time' 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'bg-purple-50 border border-purple-200'
                            }`}>
                              <div className="space-y-2">
                                {Object.entries(listing.tiers).map(([tierName, tierData]) => (
                                  <div key={tierName} className="flex justify-between items-center">
                                    <div>
                                      <div className={`font-medium text-sm ${
                                        eventType === 'one-time' ? 'text-blue-900' : 'text-purple-900'
                                      }`}>
                                        {tierName.replace(/_/g, ' ').toUpperCase()}
                                      </div>
                                      {tierData.description && (
                                        <div className={`text-xs ${
                                          eventType === 'one-time' ? 'text-blue-700' : 'text-purple-700'
                                        }`}>{tierData.description}</div>
                                      )}
                                      {tierData.available_until && (
                                        <div className={`text-xs ${
                                          eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                                        }`}>
                                          Available until: {new Date(tierData.available_until).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                    <div className={`font-bold ${
                                      eventType === 'one-time' ? 'text-blue-900' : 'text-purple-900'
                                    }`}>₹{tierData.price}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(listing.tiers).map(([tierName, tierData]) => (
                                <span 
                                  key={tierName}
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    eventType === 'one-time' 
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-purple-100 text-purple-700'
                                  }`}
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
                            className={`flex items-center space-x-1 text-sm transition-colors ${
                              eventType === 'one-time' 
                                ? 'text-blue-600 hover:text-blue-700' 
                                : 'text-purple-600 hover:text-purple-700'
                            }`}
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
            ))
            : filteredRecurringEvents.map((event) => renderRecurringEventCard(event))
          }
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">
                    {eventType === 'one-time' ? 'Event' : 'Experience'}
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">
                    {eventType === 'one-time' ? 'Date & Venue' : 'Schedule & Location'}
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">Category</th>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">Price</th>
                  <th className="text-left py-3 px-6 font-semibold text-brand-dark-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventType === 'one-time' 
                  ? filteredListings.map((listing, index) => (
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
                            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
                              eventType === 'one-time' 
                                ? 'from-blue-100 to-blue-200' 
                                : 'from-purple-100 to-purple-200'
                            }`}>
                              <Calendar className={eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'} size={16} />
                            </div>
                          )}
                          <div className={`fallback-icon hidden w-full h-full flex items-center justify-center bg-gradient-to-br ${
                            eventType === 'one-time' 
                              ? 'from-blue-100 to-blue-200' 
                              : 'from-purple-100 to-purple-200'
                          }`}>
                            <Calendar className={eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'} size={16} />
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
                        <span className={`text-sm font-semibold ${
                          eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                        }`}>₹{listing.fixed_price}</span>
                      ) : listing.pricing_type === 'tiered' && listing.tiers ? (
                        <div className="text-sm">
                          <span className={`font-medium ${
                            eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                          }`}>Tiered</span>
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
                          className={`p-2 rounded-lg transition-colors ${
                            eventType === 'one-time' 
                              ? 'text-blue-600 hover:bg-blue-50' 
                              : 'text-purple-600 hover:bg-purple-50'
                          }`}
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
                ))
                  : filteredRecurringEvents.map((event, index) => (
                  <tr key={event.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                          {event.experience_photo_urls && event.experience_photo_urls.length > 0 ? (
                            <img
                              src={event.experience_photo_urls[0]}
                              alt={event.event_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                              <Plus className="text-purple-600" size={16} />
                            </div>
                          )}
                          <div className="fallback-icon hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                            <Plus className="text-purple-600" size={16} />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-brand-dark-900 line-clamp-1">{event.event_name}</h3>
                          <p className="text-sm text-brand-dark-500 flex items-center mt-1">
                            <Users size={12} className="mr-1" />
                            Max {event.max_participants_per_occurrence || 'N/A'} per session
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="flex items-center text-brand-dark-900 mb-1">
                          <Calendar size={12} className="mr-1" />
                          {event.recurrence_type} recurring
                        </div>
                        <div className="flex items-center text-brand-dark-500">
                          <MapPin size={12} className="mr-1" />
                          {formatRecurringLocation(event)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(event.primary_category)}`}>
                        {event.primary_category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {event.event_type === 'paid' && event.ticket_price ? (
                        <span className="text-sm font-semibold text-purple-600">₹{event.ticket_price}</span>
                      ) : event.event_type === 'free' ? (
                        <span className="text-sm text-green-600 font-medium">Free</span>
                      ) : (
                        <span className="text-sm text-brand-dark-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => console.log('View recurring event:', event.id)}
                          className="p-2 rounded-lg transition-colors text-purple-600 hover:bg-purple-50"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => console.log('Edit recurring event:', event.id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit Experience"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => console.log('View bookings for recurring event:', event.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View Bookings"
                        >
                          <Users size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteRecurringEvent(event)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Experience"
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
                      <Calendar className={`mr-3 ${
                        eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                      }`} size={20} />
                      <div>
                        <div className="font-medium">{formatDate(selectedEvent.date)}</div>
                        <div className="text-sm text-brand-dark-500">at {selectedEvent.start_time}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className={`mr-3 ${
                        eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                      }`} size={20} />
                      <div>
                        <div className="font-medium">{selectedEvent.duration} hours</div>
                        <div className="text-sm text-brand-dark-500">Duration</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className={`mr-3 ${
                        eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                      }`} size={20} />
                      <div>
                        <div className="font-medium">{selectedEvent.venue}</div>
                        <div className="text-sm text-brand-dark-500">{selectedEvent.full_address}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className={`mr-3 ${
                        eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                      }`} size={20} />
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
                      <CreditCard className={`mr-3 ${
                        eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                      }`} size={20} />
                      <div>
                        {selectedEvent.pricing_type === 'fixed' && selectedEvent.fixed_price ? (
                          <div className={`font-medium ${
                            eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                          }`}>₹{selectedEvent.fixed_price}</div>
                        ) : selectedEvent.pricing_type === 'tiered' && selectedEvent.tiers ? (
                          <div className="pricing-details-container">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">Tiered Pricing</span>
                              <button
                                onClick={() => togglePricingDetails(`modal-${selectedEvent.id}`)}
                                className={`transition-colors ${
                                  eventType === 'one-time' 
                                    ? 'text-blue-600 hover:text-blue-700' 
                                    : 'text-purple-600 hover:text-purple-700'
                                }`}
                                title="Show detailed pricing"
                              >
                                <Info size={14} />
                              </button>
                            </div>
                            <div className="text-sm text-brand-dark-500">
                              {showPricingDetails[`modal-${selectedEvent.id}`] ? (
                                <div className={`rounded-lg p-3 ${
                                  eventType === 'one-time' 
                                    ? 'bg-blue-50 border border-blue-200' 
                                    : 'bg-purple-50 border border-purple-200'
                                }`}>
                                  <div className="space-y-3">
                                    {Object.entries(selectedEvent.tiers).map(([tierName, tierData]) => (
                                      <div key={tierName} className={`last:border-b-0 pb-2 last:pb-0 ${
                                        eventType === 'one-time' ? 'border-b border-blue-200' : 'border-b border-purple-200'
                                      }`}>
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <div className={`font-semibold ${
                                              eventType === 'one-time' ? 'text-blue-900' : 'text-purple-900'
                                            }`}>
                                              {tierName.replace(/_/g, ' ').toUpperCase()}
                                            </div>
                                            {tierData.description && (
                                              <div className={`text-sm mt-1 ${
                                                eventType === 'one-time' ? 'text-blue-700' : 'text-purple-700'
                                              }`}>{tierData.description}</div>
                                            )}
                                            {tierData.available_until && (
                                              <div className={`text-sm mt-1 ${
                                                eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                                              }`}>
                                                Available until: {new Date(tierData.available_until).toLocaleDateString()}
                                              </div>
                                            )}
                                          </div>
                                          <div className={`text-lg font-bold ml-4 ${
                                            eventType === 'one-time' ? 'text-blue-900' : 'text-purple-900'
                                          }`}>₹{tierData.price}</div>
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
                      <Phone className={`mr-3 ${
                        eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                      }`} size={20} />
                      <div>
                        <div className="font-medium">{selectedEvent.contact_number}</div>
                        <div className="text-sm text-brand-dark-500">{selectedEvent.contact_name}</div>
                      </div>
                    </div>

                    {/* Website */}
                    {selectedEvent.event_website && (
                      <div className="flex items-center">
                        <Globe className={`mr-3 ${
                          eventType === 'one-time' ? 'text-blue-600' : 'text-purple-600'
                        }`} size={20} />
                        <div>
                          <a 
                            href={selectedEvent.event_website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`font-medium transition-colors ${
                              eventType === 'one-time' 
                                ? 'text-blue-600 hover:text-blue-700' 
                                : 'text-purple-600 hover:text-purple-700'
                            }`}
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

      {/* Delete Recurring Event Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteRecurringModal}
        onClose={closeDeleteRecurringModal}
        onConfirm={confirmDeleteRecurring}
        itemName={deletingRecurringEvent?.event_name || ''}
        isLoading={isDeletingRecurring}
      />
    </>
  );
};