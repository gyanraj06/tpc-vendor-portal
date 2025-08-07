export interface VendorType {
  id: string;
  title: string;
  description: string;
  icon: string;
  backgroundGradient: string;
  category: 'travel' | 'cultural' | 'property';
}

export interface OnboardingFormData {
  vendorType: string;
  businessName: string;
  contactEmail: string;
  phoneNumber: string;
  location: string;
  description: string;
}

export interface VendorProfile {
  id: string;
  businessName: string;
  contactEmail: string;
  phoneNumber: string;
  location: string;
  description: string;
  vendorType: VendorType;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}