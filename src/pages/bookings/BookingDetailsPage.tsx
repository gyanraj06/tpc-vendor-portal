import React, { useState } from 'react';
import { 
  ArrowLeft,
  Calendar,
  Users,
  IndianRupee,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  CreditCard,
  FileText,
  Edit3
} from 'lucide-react';

// Types
interface BookingDetails {
  id: string;
  bookingId: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  
  // Customer Information
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    emergencyContact?: string;
    specialRequests?: string;
    dietaryRequirements?: string;
  };
  
  // Product Information
  product: {
    name: string;
    type: 'event' | 'experience' | 'trek';
    location: string;
    description?: string;
    duration?: string;
  };
  
  // Booking Details
  booking: {
    date: string;
    time?: string;
    participants: number;
    pricePaid: number;
    paymentStatus: 'paid' | 'pending' | 'refunded' | 'partial';
    bookingDate: string;
    lastUpdated: string;
  };
  
  // Payment Information
  payment: {
    method: string;
    transactionId?: string;
    amount: number;
    tax?: number;
    discount?: number;
    refundAmount?: number;
  };
  
  // Additional Information
  notes?: string;
  internalNotes?: string;
}

// Mock booking details - replace with actual API call
const mockBookingDetails: BookingDetails = {
  id: '1',
  bookingId: 'BK001',
  status: 'confirmed',
  
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    address: '123 Main Street, Mumbai, Maharashtra 400001',
    emergencyContact: '+91 9876543211',
    specialRequests: 'Vegetarian meals required. First time trekker, needs basic equipment guidance.',
    dietaryRequirements: 'Vegetarian, No nuts'
  },
  
  product: {
    name: 'Weekend Hiking Adventure',
    type: 'trek',
    location: 'Manali, Himachal Pradesh',
    description: 'A beautiful weekend trek through the scenic mountains of Manali with professional guides.',
    duration: '2 Days, 1 Night'
  },
  
  booking: {
    date: '2024-01-15',
    time: '06:00 AM',
    participants: 2,
    pricePaid: 3500,
    paymentStatus: 'paid',
    bookingDate: '2024-01-10',
    lastUpdated: '2024-01-10T14:30:00Z'
  },
  
  payment: {
    method: 'UPI',
    transactionId: 'TXN123456789',
    amount: 3500,
    tax: 350,
    discount: 200
  },
  
  notes: 'Customer confirmed pickup location. Reminded about weather conditions.',
  internalNotes: 'VIP customer - previous booking was excellent. Assign best guide.'
};

export const BookingDetailsPage: React.FC = () => {
  const [booking, setBooking] = useState<BookingDetails>(mockBookingDetails);
  const [showEditModal, setShowEditModal] = useState(false);
  const [internalNotes, setInternalNotes] = useState(booking.internalNotes || '');

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
      case 'confirmed': return <CheckCircle size={20} />;
      case 'pending': return <Clock size={20} />;
      case 'cancelled': return <XCircle size={20} />;
      case 'completed': return <CheckCircle size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'refunded': return 'text-red-600 bg-red-50';
      case 'partial': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleWhatsApp = () => {
    const message = `Hello ${booking.customer.name}, regarding your booking ${booking.bookingId} for ${booking.product.name}`;
    const whatsappUrl = `https://wa.me/${booking.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${booking.customer.phone}`, '_self');
  };

  const handleEmail = () => {
    const subject = `Regarding your booking ${booking.bookingId}`;
    const body = `Dear ${booking.customer.name},\n\nThank you for booking ${booking.product.name}.\n\nBest regards,\nYour Team`;
    window.open(`mailto:${booking.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
  };

  const updateInternalNotes = () => {
    setBooking(prev => ({ ...prev, internalNotes }));
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
                <p className="text-gray-600 mt-1">Booking ID: {booking.bookingId}</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="capitalize">{booking.status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleWhatsApp}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle size={20} />
                  </button>
                  <button
                    onClick={handleCall}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Call"
                  >
                    <Phone size={20} />
                  </button>
                  <button
                    onClick={handleEmail}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Email"
                  >
                    <Mail size={20} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{booking.customer.name}</h3>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail size={14} className="mr-2" />
                    {booking.customer.email}
                  </p>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Phone size={14} className="mr-2" />
                    {booking.customer.phone}
                  </p>
                  {booking.customer.emergencyContact && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <AlertCircle size={14} className="mr-2" />
                      Emergency: {booking.customer.emergencyContact}
                    </p>
                  )}
                </div>
                
                {booking.customer.address && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600 text-sm">{booking.customer.address}</p>
                  </div>
                )}
              </div>

              {booking.customer.specialRequests && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Special Requests</h4>
                  <p className="text-blue-800 text-sm">{booking.customer.specialRequests}</p>
                </div>
              )}

              {booking.customer.dietaryRequirements && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Dietary Requirements</h4>
                  <p className="text-yellow-800 text-sm">{booking.customer.dietaryRequirements}</p>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Product Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{booking.product.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{booking.product.type}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                    <p className="text-gray-600 text-sm">{booking.product.location}</p>
                  </div>
                  
                  {booking.product.duration && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Duration</h4>
                      <p className="text-gray-600 text-sm">{booking.product.duration}</p>
                    </div>
                  )}
                </div>

                {booking.product.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                    <p className="text-gray-600 text-sm">{booking.product.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.booking.paymentStatus)}`}>
                    {booking.booking.paymentStatus.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Payment Method</span>
                    <p className="font-medium">{booking.payment.method}</p>
                  </div>
                  
                  {booking.payment.transactionId && (
                    <div>
                      <span className="text-gray-600">Transaction ID</span>
                      <p className="font-medium font-mono text-sm">{booking.payment.transactionId}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-medium">₹{booking.payment.amount.toLocaleString()}</span>
                    </div>
                    
                    {booking.payment.tax && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>₹{booking.payment.tax.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {booking.payment.discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{booking.payment.discount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total Paid</span>
                      <span className="text-green-600">₹{booking.booking.pricePaid.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date
                  </span>
                  <span className="font-medium">{new Date(booking.booking.date).toLocaleDateString()}</span>
                </div>
                
                {booking.booking.time && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Time
                    </span>
                    <span className="font-medium">{booking.booking.time}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Participants
                  </span>
                  <span className="font-medium">{booking.booking.participants}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    Amount
                  </span>
                  <span className="font-bold text-green-600">₹{booking.booking.pricePaid.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Booking Created</p>
                    <p className="text-sm text-gray-600">{new Date(booking.booking.bookingDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Payment Confirmed</p>
                    <p className="text-sm text-gray-600">{new Date(booking.booking.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Notes
                </h3>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              
              {booking.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Customer Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Internal Notes</h4>
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                  {booking.internalNotes || 'No internal notes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Notes Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Internal Notes</h3>
            
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
              placeholder="Add internal notes for this booking..."
            />
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateInternalNotes}
                className="px-4 py-2 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700 transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};