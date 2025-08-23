import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Phone, 
  MessageCircle, 
  Eye,
  Calendar,
  Users,
  IndianRupee,
  XCircle,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  X,
  CalendarDays
} from 'lucide-react';

// Types
interface Booking {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  productType: 'event' | 'experience' | 'trek';
  date: string;
  participants: number;
  pricePaid: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  location?: string;
  specialRequests?: string;
}

interface BookingStats {
  totalBookings: number;
  totalCancellations: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
  thisMonthBookings: number;
}

// Mock data - replace with actual API calls
const mockStats: BookingStats = {
  totalBookings: 156,
  totalCancellations: 12,
  totalRevenue: 234500,
  pendingBookings: 8,
  completedBookings: 136,
  thisMonthBookings: 45
};

const mockBookings: Booking[] = [
  {
    id: '1',
    bookingId: 'BK001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+91 9876543210',
    productName: 'Weekend Hiking Adventure',
    productType: 'trek',
    date: '2024-01-15',
    participants: 2,
    pricePaid: 3500,
    status: 'confirmed',
    bookingDate: '2024-01-10',
    location: 'Manali, HP',
    specialRequests: 'Vegetarian meals required'
  },
  {
    id: '2',
    bookingId: 'BK002',
    customerName: 'Sarah Smith',
    customerEmail: 'sarah@example.com',
    customerPhone: '+91 9876543211',
    productName: 'Photography Workshop',
    productType: 'experience',
    date: '2024-01-20',
    participants: 1,
    pricePaid: 2500,
    status: 'pending',
    bookingDate: '2024-01-12',
    location: 'Mumbai, MH'
  },
  {
    id: '3',
    bookingId: 'BK003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    customerPhone: '+91 9876543212',
    productName: 'Food Festival',
    productType: 'event',
    date: '2024-01-25',
    participants: 4,
    pricePaid: 8000,
    status: 'completed',
    bookingDate: '2024-01-08',
    location: 'Delhi, DL'
  }
];

export const BookingsPage: React.FC = () => {
  const [bookings] = useState<Booking[]>(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(mockBookings);
  const [stats] = useState<BookingStats>(mockStats);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Helper function to format dates nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
      return { main: 'Today', sub: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    } else if (isTomorrow) {
      return { main: 'Tomorrow', sub: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    } else {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { main: dayName, sub: dateStr };
    }
  };

  const getDaysFromNow = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: 'Today', color: 'bg-green-100 text-green-700' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'bg-blue-100 text-blue-700' };
    if (diffDays > 1) return { text: `In ${diffDays} days`, color: 'bg-gray-100 text-gray-700' };
    if (diffDays === -1) return { text: 'Yesterday', color: 'bg-orange-100 text-orange-700' };
    return { text: `${Math.abs(diffDays)} days ago`, color: 'bg-red-100 text-red-700' };
  };

  // Filter bookings based on search and filters
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Product type filter
    if (selectedProductType) {
      filtered = filtered.filter(booking => booking.productType === selectedProductType);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(booking => booking.status === selectedStatus);
    }

    // Date range filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return bookingDate >= fromDate && bookingDate <= toDate;
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, selectedProductType, selectedStatus, dateRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      case 'completed': return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const handleWhatsApp = (phone: string, name: string, productName: string) => {
    const message = `Hello ${name}, regarding your booking for ${productName}`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedProductType('');
    setSelectedStatus('');
    setDateRange({ from: '', to: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookings Management</h1>
              <p className="text-gray-600 mt-1">Manage all your customer bookings and reservations</p>
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center justify-center space-x-2 bg-brand-blue-600 text-white px-4 py-2 rounded-lg hover:bg-brand-blue-700 transition-colors"
            >
              <Download size={18} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="ml-2 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Bookings</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div className="ml-2 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Cancellations</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.totalCancellations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="ml-2 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Revenue</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">₹{(stats.totalRevenue / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <div className="ml-2 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Pending</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="ml-2 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Completed</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.completedBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="ml-2 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">This Month</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.thisMonthBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, booking ID, product, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                  <select
                    value={selectedProductType}
                    onChange={(e) => setSelectedProductType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="event">Events</option>
                    <option value="experience">Experiences</option>
                    <option value="trek">Treks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Bookings ({filteredBookings.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => {
              const formattedDate = formatDate(booking.date);
              const daysBadge = getDaysFromNow(booking.date);
              
              return (
                <div key={booking.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="space-y-4">
                    {/* Mobile/Tablet Layout */}
                    <div className="lg:hidden">
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-gray-900 truncate">{booking.customerName}</h3>
                          <p className="text-sm text-gray-600 truncate">{booking.customerEmail}</p>
                          <p className="text-sm text-gray-600">{booking.customerPhone}</p>
                          <p className="text-xs text-gray-500 mt-1">ID: {booking.bookingId}</p>
                        </div>
                        
                        <div className="ml-4 flex items-center space-x-2">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">{booking.productName}</p>
                          <p className="text-sm text-gray-600 capitalize">{booking.productType}</p>
                          {booking.location && (
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin size={12} className="mr-1" />
                              <span className="truncate">{booking.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          {/* Enhanced Date Display for Mobile */}
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center space-x-1">
                              <CalendarDays size={14} className="text-gray-500" />
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{formattedDate.main}</p>
                                <p className="text-xs text-gray-500">{formattedDate.sub}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${daysBadge.color}`}>
                              {daysBadge.text}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{booking.participants} Participants</p>
                          <p className="text-lg font-bold text-green-600">₹{booking.pricePaid.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleWhatsApp(booking.customerPhone, booking.customerName, booking.productName)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </button>

                        <button
                          onClick={() => handleCall(booking.customerPhone)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Call"
                        >
                          <Phone size={18} />
                        </button>

                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:flex items-center">
                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-6 gap-4 items-center">
                          {/* Customer Info */}
                          <div className="col-span-2 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 truncate">{booking.customerName}</h3>
                            <p className="text-sm text-gray-600 truncate">{booking.customerEmail}</p>
                            <p className="text-sm text-gray-600">{booking.customerPhone}</p>
                            <p className="text-xs text-gray-500 mt-1">ID: {booking.bookingId}</p>
                          </div>

                          {/* Product Info */}
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{booking.productName}</h4>
                            <p className="text-sm text-gray-600 capitalize">{booking.productType}</p>
                            {booking.location && (
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <MapPin size={12} className="mr-1 flex-shrink-0" />
                                <span className="truncate">{booking.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Enhanced Date Display for Desktop */}
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <CalendarDays size={16} className="text-gray-500 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-900">{formattedDate.main}</p>
                                <p className="text-sm text-gray-500">{formattedDate.sub}</p>
                              </div>
                            </div>
                            <div className="mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${daysBadge.color}`}>
                                {daysBadge.text}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Booked: {new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>

                          {/* Participants & Price */}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900">{booking.participants} Participants</p>
                            <p className="text-lg font-bold text-green-600">₹{booking.pricePaid.toLocaleString()}</p>
                          </div>

                          {/* Status */}
                          <div className="min-w-0">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="capitalize">{booking.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-6">
                        <button
                          onClick={() => handleWhatsApp(booking.customerPhone, booking.customerName, booking.productName)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </button>

                        <button
                          onClick={() => handleCall(booking.customerPhone)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Call"
                        >
                          <Phone size={18} />
                        </button>

                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500 px-4">
                {searchTerm || selectedProductType || selectedStatus || dateRange.from || dateRange.to
                  ? 'Try adjusting your search or filters'
                  : 'Your bookings will appear here once customers start booking your services'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          bookings={filteredBookings}
        />
      )}
    </div>
  );
};

// Booking Details Modal Component
const BookingDetailsModal: React.FC<{ booking: Booking; onClose: () => void }> = ({ booking, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleWhatsApp = () => {
    const message = `Hello ${booking.customerName}, regarding your booking ${booking.bookingId} for ${booking.productName}`;
    const whatsappUrl = `https://wa.me/${booking.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${booking.customerPhone}`, '_self');
  };

  const handleEmail = () => {
    const subject = `Regarding your booking ${booking.bookingId}`;
    const body = `Dear ${booking.customerName},\n\nThank you for booking ${booking.productName}.\n\nBest regards,\nYour Team`;
    window.open(`mailto:${booking.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Booking Details</h2>
            <p className="text-gray-600">ID: {booking.bookingId}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="capitalize">{booking.status}</span>
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleWhatsApp}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle size={18} />
                </button>
                <button
                  onClick={handleCall}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Call"
                >
                  <Phone size={18} />
                </button>
                <button
                  onClick={handleEmail}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Email"
                >
                  <Mail size={18} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900 break-words">{booking.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900 break-words">{booking.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{booking.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="font-medium text-gray-900">{booking.participants}</p>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Special Requests</p>
                <p className="text-blue-800 text-sm break-words">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Product Name</p>
                <p className="font-medium text-gray-900 break-words">{booking.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900 capitalize">{booking.productType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900 break-words">{booking.location || 'TBD'}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-bold text-green-600 text-xl">₹{booking.pricePaid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Booking Date</p>
                <p className="font-medium text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Booking Created</p>
                  <p className="text-sm text-gray-600">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{booking.status}</p>
                  <p className="text-sm text-gray-600">Current status</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 sm:p-6 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Export Modal Component
const ExportModal: React.FC<{ onClose: () => void; bookings: Booking[] }> = ({ onClose, bookings }) => {
  const [exportDateRange, setExportDateRange] = useState({ from: '', to: '' });
  const [exportType, setExportType] = useState<'all' | 'filtered' | 'date_range'>('filtered');

  const handleExport = () => {
    let dataToExport = bookings;

    if (exportType === 'date_range' && exportDateRange.from && exportDateRange.to) {
      dataToExport = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const fromDate = new Date(exportDateRange.from);
        const toDate = new Date(exportDateRange.to);
        return bookingDate >= fromDate && bookingDate <= toDate;
      });
    }

    // Create CSV content
    const headers = ['Booking ID', 'Customer Name', 'Email', 'Phone', 'Product', 'Type', 'Date', 'Participants', 'Price', 'Status'];
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(booking => [
        booking.bookingId,
        booking.customerName,
        booking.customerEmail,
        booking.customerPhone,
        booking.productName,
        booking.productType,
        booking.date,
        booking.participants,
        booking.pricePaid,
        booking.status
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Export Bookings</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Options</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="filtered"
                    checked={exportType === 'filtered'}
                    onChange={(e) => setExportType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm">Current filtered results ({bookings.length} bookings)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="date_range"
                    checked={exportType === 'date_range'}
                    onChange={(e) => setExportType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm">Custom date range</span>
                </label>
              </div>
            </div>

            {exportType === 'date_range' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="date"
                    value={exportDateRange.from}
                    onChange={(e) => setExportDateRange({ ...exportDateRange, from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="date"
                    value={exportDateRange.to}
                    onChange={(e) => setExportDateRange({ ...exportDateRange, to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exportType === 'date_range' && (!exportDateRange.from || !exportDateRange.to)}
              className="px-4 py-2 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};