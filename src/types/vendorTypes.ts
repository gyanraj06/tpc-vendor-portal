// Vendor Type Enums and Interfaces for Mounterra Vendor Portal

export type VendorType = 'TREK_ORGANIZER' | 'LOCAL_EVENT_HOST';
export const VendorType = {
  TREK_ORGANIZER: 'TREK_ORGANIZER' as const,
  LOCAL_EVENT_HOST: 'LOCAL_EVENT_HOST' as const
} as const;


export interface VendorTypeInfo {
  id: VendorType;
  title: string;
  description: string;
  icon: string;
  features: string[];
  dashboardCards: DashboardCardType[];
}


export type DashboardCardType = 'ADD_TREK' | 'ADD_ONE_DAY_EVENT' | 'ADD_EXPERIENCE_EVENT' | 'MANAGE_BOOKINGS' | 'VIEW_ANALYTICS';
export const DashboardCardType = {
  ADD_TREK: 'ADD_TREK' as const,
  ADD_ONE_DAY_EVENT: 'ADD_ONE_DAY_EVENT' as const,
  ADD_EXPERIENCE_EVENT: 'ADD_EXPERIENCE_EVENT' as const,
  MANAGE_BOOKINGS: 'MANAGE_BOOKINGS' as const,
  VIEW_ANALYTICS: 'VIEW_ANALYTICS' as const
} as const;

// Vendor type configurations
export const vendorTypeConfigs: Record<VendorType, VendorTypeInfo> = {
  [VendorType.TREK_ORGANIZER]: {
    id: VendorType.TREK_ORGANIZER,
    title: 'Trek & Travel Organizer',
    description: 'Organize trekking expeditions, travel packages, tours, and outdoor adventures',
    icon: 'Mountain',
    features: [
      'Create trekking expeditions and travel packages',
      'Plan hiking routes and multi-day itineraries',
      'Manage outdoor equipment and transportation',
      'Coordinate safety measures and accommodation'
    ],
    dashboardCards: [
      DashboardCardType.ADD_TREK,
      DashboardCardType.MANAGE_BOOKINGS,
      DashboardCardType.VIEW_ANALYTICS
    ]
  },
  [VendorType.LOCAL_EVENT_HOST]: {
    id: VendorType.LOCAL_EVENT_HOST,
    title: 'Local Event Host',
    description: 'Host local events, experiences, and entertainment activities',
    icon: 'Theater',
    features: [
      'Host one-day events and shows',
      'Organize experience-based activities',
      'Manage local entertainment',
      'Create unique local experiences'
    ],
    dashboardCards: [
      DashboardCardType.ADD_ONE_DAY_EVENT,
      DashboardCardType.ADD_EXPERIENCE_EVENT,
      DashboardCardType.MANAGE_BOOKINGS,
      DashboardCardType.VIEW_ANALYTICS
    ]
  }
};


// Dashboard card configurations
export const dashboardCardConfigs = {
  [DashboardCardType.ADD_TREK]: {
    title: 'Add Trek',
    description: 'Create new trekking expedition or travel package',
    icon: 'Mountain',
    color: 'bg-green-500'
  },
  [DashboardCardType.ADD_ONE_DAY_EVENT]: {
    title: 'Add One-Day Event',
    description: 'Create hosted event like standup comedy, workshops',
    icon: 'Theater',
    color: 'bg-purple-500'
  },
  [DashboardCardType.ADD_EXPERIENCE_EVENT]: {
    title: 'Add Experience',
    description: 'Create activity like go-karting, trampoline parks',
    icon: 'Zap',
    color: 'bg-orange-500'
  },
  [DashboardCardType.MANAGE_BOOKINGS]: {
    title: 'Manage Bookings',
    description: 'View and manage customer bookings',
    icon: 'Calendar',
    color: 'bg-indigo-500'
  },
  [DashboardCardType.VIEW_ANALYTICS]: {
    title: 'View Analytics',
    description: 'Track performance and insights',
    icon: 'TrendingUp',
    color: 'bg-teal-500'
  }
};

// Helper functions
export const getVendorTypeConfig = (vendorType: VendorType): VendorTypeInfo => {
  return vendorTypeConfigs[vendorType];
};


export const getDashboardCardsForVendorType = (vendorType: VendorType): DashboardCardType[] => {
  return vendorTypeConfigs[vendorType].dashboardCards;
};

// Validation helpers
export const isValidVendorType = (value: string): value is VendorType => {
  return value === VendorType.TREK_ORGANIZER || value === VendorType.LOCAL_EVENT_HOST;
};

