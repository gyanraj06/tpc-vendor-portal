import { VendorType } from '../types/vendorTypes';

export interface VendorLabels {
  productSingular: string;
  productPlural: string;
  createNewButtonText: string;
  createNewButtonTexts?: string[]; // For multiple buttons like event vendors
  sidebarSubtitle: string;
  dashboardMetricLabel: string;
}

export const getVendorLabels = (vendorType: VendorType | null | undefined): VendorLabels => {
  switch (vendorType) {
    case VendorType.TREK_ORGANIZER:
      return {
        productSingular: 'Trekk',
        productPlural: 'Trekks',
        createNewButtonText: 'CREATE NEW TREKK LISTING',
        sidebarSubtitle: 'Manage Trekk Listings',
        dashboardMetricLabel: 'Listed Trekks'
      };
    
    case VendorType.LOCAL_EVENT_HOST:
      return {
        productSingular: 'Event',
        productPlural: 'Events',
        createNewButtonText: 'CREATE ONE TIME EVENT',
        createNewButtonTexts: ['CREATE ONE TIME EVENT', 'CREATE EXPERIENCE'],
        sidebarSubtitle: 'Manage Event Listings',
        dashboardMetricLabel: 'Listed Events'
      };
    
    default:
      // Fallback to generic product terminology
      return {
        productSingular: 'Product',
        productPlural: 'Products',
        createNewButtonText: 'Create New Product',
        sidebarSubtitle: 'Manage Listings',
        dashboardMetricLabel: 'Listed Products'
      };
  }
};

// Hook to get vendor labels with current vendor context
export const useVendorLabels = (vendorType: VendorType | null | undefined): VendorLabels => {
  return getVendorLabels(vendorType);
};