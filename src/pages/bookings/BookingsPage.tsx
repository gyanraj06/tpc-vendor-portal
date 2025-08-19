import React from 'react';
import { Calendar } from 'lucide-react';
import { ComingSoonPage } from '../coming-soon/ComingSoonPage';

export const BookingsPage: React.FC = () => {
  const features = [
    'Real-time booking management',
    'Customer communication tools',
    'Automated confirmation emails',
    'Payment processing integration',
    'Booking modification handling',
    'Cancellation and refund management',
    'Customer profile management',
    'Booking analytics and reports'
  ];

  return (
    <ComingSoonPage
      title="Bookings"
      subtitle="Customers and Reservations"
      description="Manage all your customer bookings, reservations, and communications in one centralized location. Track payment status, handle modifications, and provide excellent customer service."
      icon={<Calendar size={32} className="text-white" />}
      features={features}
    />
  );
};