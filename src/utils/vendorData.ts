import type { VendorType } from '../types';

export const vendorTypes: VendorType[] = [
  {
    id: 'travel-operator',
    title: 'Travel Operator / Trek Organizer',
    description: 'Let hikers, trek partners do trip bookings for exciting journeys',
    icon: 'MapPin',
    backgroundGradient: 'bg-black',
    category: 'travel'
  },
  {
    id: 'cultural-organizer',
    title: 'Local Event Host / Cultural Organizer',
    description: 'Promote gigs, workshops, cultural events, or experiences',
    icon: 'Calendar',
    backgroundGradient: 'bg-black',
    category: 'cultural'
  },
  {
    id: 'property-host',
    title: 'Property Host / Workstay Owner',
    description: 'List homestays, boutique hotels, or workspaces for unique stays',
    icon: 'Home',
    backgroundGradient: 'bg-black',
    category: 'property'
  }
];