import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Save, Settings, Shield, Bell, CreditCard, Mountain, Theater, Building2 } from 'lucide-react';
import { AuthService, type Vendor } from '../../services/authService';
import { VendorType, vendorTypeConfigs } from '../../types/vendorTypes';
import { StorageService } from '../../services/storageService';
import { AvatarUpload } from '../../components/ui/AvatarUpload';
import { supabase } from '../../lib/supabase';

type SidebarSection = 'personal' | 'business' | 'security' | 'notifications' | 'billing';

interface SidebarItem {
  id: SidebarSection;
  label: string;
  icon: React.ReactNode;
  available: boolean;
}

const iconMap = {
  Mountain: Mountain,
  Theater: Theater
};

export const EditProfilePage: React.FC = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState<SidebarSection>('personal');
  
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [vendorType, setVendorType] = useState<VendorType | ''>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Business details state
  const [businessDetails, setBusinessDetails] = useState({
    businessName: '',
    legalName: '',
    businessType: '',
    businessRegistrationDocument: '',
    websiteOrSocialLink: '',
    registeredAddress: '',
    authorizedContactPersonName: '',
    contactPhoneNumber: '',
    contactEmail: '',
    idProofDocument: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    isVerified: false,
    verificationStatus: 'pending'
  });
  
  // Document files state (UI only)
  const [businessRegFile, setBusinessRegFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  
  // File input refs for resetting
  const businessRegInputRef = React.useRef<HTMLInputElement>(null);
  const idProofInputRef = React.useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'personal',
      label: 'Personal Details',
      icon: <User size={20} />,
      available: true
    },
    {
      id: 'business',
      label: 'Business Details',
      icon: <Building2 size={20} />,
      available: vendor?.vendorType === 'LOCAL_EVENT_HOST'
    },
    {
      id: 'security',
      label: 'Security Settings',
      icon: <Shield size={20} />,
      available: false
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={20} />,
      available: false
    },
    {
      id: 'billing',
      label: 'Billing & Plans',
      icon: <CreditCard size={20} />,
      available: false
    }
  ];

  useEffect(() => {
    loadVendorData();
    
    // Check URL parameters for section navigation
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section === 'business') {
      setActiveSection('business');
    }
  }, []);

  const loadVendorData = async () => {
    try {
      const vendorData = await AuthService.getCurrentUser();
      if (vendorData) {
        setVendor(vendorData);
        setName(vendorData.name || '');
        setPhone(vendorData.phone || '');
        setAddress(vendorData.address || '');
        setVendorType(vendorData.vendorType || '');
        
        // Load business details if vendor is LOCAL_EVENT_HOST
        if (vendorData.vendorType === 'LOCAL_EVENT_HOST') {
          const { data: businessData, error } = await supabase
            .from('vendor_profiles')
            .select('business_name, legal_name, business_type, business_registration_document, website_or_social_link, registered_address, authorized_contact_person_name, contact_phone_number, contact_email, id_proof_document, account_holder_name, bank_name, account_number, ifsc_code, business_verification_status, business_details_verified')
            .eq('id', vendorData.id)
            .single();
          
          if (!error && businessData) {
            setBusinessDetails({
              businessName: businessData.business_name || '',
              legalName: businessData.legal_name || '',
              businessType: businessData.business_type || '',
              businessRegistrationDocument: businessData.business_registration_document || '',
              websiteOrSocialLink: businessData.website_or_social_link || '',
              registeredAddress: businessData.registered_address || '',
              authorizedContactPersonName: businessData.authorized_contact_person_name || '',
              contactPhoneNumber: businessData.contact_phone_number || '',
              contactEmail: businessData.contact_email || '',
              idProofDocument: businessData.id_proof_document || '',
              accountHolderName: businessData.account_holder_name || '',
              bankName: businessData.bank_name || '',
              accountNumber: businessData.account_number || '',
              ifscCode: businessData.ifsc_code || '',
              isVerified: businessData.business_details_verified || false,
              verificationStatus: businessData.business_verification_status || 'pending'
            });
          }
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to load vendor data:', error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!vendor) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    if (!vendorType) {
      setError('Please select a vendor type.');
      setIsLoading(false);
      return;
    }

    try {
      // First update the basic profile
      const updatedVendor = await AuthService.updateVendorProfile(vendor.id, {
        name,
        phone,
        address,
        vendorType: vendorType as VendorType
      });

      if (!updatedVendor) {
        setError('Failed to update profile. Please try again.');
        return;
      }

      // Handle avatar upload if file is selected
      if (avatarFile) {
        setIsUploadingAvatar(true);
        const avatarUrl = await StorageService.uploadAndUpdateAvatar(
          vendor.id, 
          avatarFile, 
          vendor.avatar_url
        );
        
        if (avatarUrl) {
          updatedVendor.avatar_url = avatarUrl;
        } else {
          console.warn('Avatar upload failed, but profile was saved');
        }
        setIsUploadingAvatar(false);
      }

      setVendor(updatedVendor);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setIsSaving(false);
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveBusinessDetails = async () => {
    if (!vendor) return;

    setIsSavingBusiness(true);
    setError('');
    setSuccess('');

    try {
      // Prepare update data
      const updateData: any = {
        business_name: businessDetails.businessName,
        legal_name: businessDetails.legalName,
        business_type: businessDetails.businessType,
        website_or_social_link: businessDetails.websiteOrSocialLink,
        registered_address: businessDetails.registeredAddress,
        authorized_contact_person_name: businessDetails.authorizedContactPersonName,
        contact_phone_number: businessDetails.contactPhoneNumber,
        contact_email: businessDetails.contactEmail,
        account_holder_name: businessDetails.accountHolderName,
        bank_name: businessDetails.bankName,
        account_number: businessDetails.accountNumber,
        ifsc_code: businessDetails.ifscCode,
        business_verification_status: 'pending',
        business_details_verified: false
      };

      // Handle document file selection (UI only - no actual upload)
      if (businessRegFile) {
        console.log('Business registration document selected:', businessRegFile.name);
        updateData.business_registration_document = businessRegFile.name;
      }
      
      if (idProofFile) {
        console.log('ID proof document selected:', idProofFile.name);
        updateData.id_proof_document = idProofFile.name;
      }

      // Update business details using direct Supabase call
      console.log('Updating database with data:', updateData);
      const { data, error } = await supabase
        .from('vendor_profiles')
        .update(updateData)
        .eq('id', vendor.id)
        .select()
        .single();

      if (error) {
        console.error('Business details update error:', error);
        setError('Failed to save business details. Please try again.');
        return;
      }

      console.log('Database updated successfully:', data);
      setSuccess('Business details saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Clear file inputs after successful save
      setBusinessRegFile(null);
      setIdProofFile(null);
      if (businessRegInputRef.current) businessRegInputRef.current.value = '';
      if (idProofInputRef.current) idProofInputRef.current.value = '';
      
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Business details save error:', err);
    } finally {
      setIsSavingBusiness(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
          <p className="text-brand-dark-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-dark-900">Settings</h1>
        <p className="text-brand-dark-600">Accounts and Preferences</p>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-t-xl shadow-sm border border-gray-100 border-b-0 mb-0">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.available && setActiveSection(item.id)}
                disabled={!item.available}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeSection === item.id
                    ? 'border-brand-blue-500 text-brand-blue-600'
                    : item.available
                    ? 'border-transparent text-brand-dark-500 hover:text-brand-dark-700 hover:border-gray-300'
                    : 'border-transparent text-gray-400 cursor-not-allowed'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {!item.available && (
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full ml-1">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 border-t-0">
        <div className="p-8">
          {activeSection === 'personal' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-brand-dark-900 mb-2">Personal Details</h1>
                <p className="text-brand-dark-600">
                  Update your personal information and contact details.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
                  {success}
                </div>
              )}

              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex justify-center mb-8">
                  <AvatarUpload
                    currentAvatar={vendor?.avatar_url}
                    onAvatarChange={setAvatarFile}
                    isUploading={isUploadingAvatar}
                    size="lg"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={vendor?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-brand-dark-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-brand-dark-500 mt-1">
                    Email address cannot be changed
                  </p>
                </div>

                {/* Vendor Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Vendor Type *
                  </label>
                  <div className="grid gap-3">
                    {[VendorType.TREK_ORGANIZER, VendorType.LOCAL_EVENT_HOST].map((type) => {
                      const config = vendorTypeConfigs[type];
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setVendorType(type)}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            vendorType === type
                              ? 'border-brand-blue-500 bg-brand-blue-50'
                              : 'border-gray-200 hover:border-brand-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-brand-blue-100 rounded-xl flex items-center justify-center">
                              {React.createElement(iconMap[config.icon as keyof typeof iconMap], { size: 24, className: "text-brand-blue-600" })}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-brand-dark-900">{config.title}</h4>
                              <p className="text-brand-dark-600 text-sm">{config.description}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              vendorType === type
                                ? 'border-brand-blue-500 bg-brand-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {vendorType === type && <div className="w-full h-full bg-white rounded-full scale-50"></div>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Business Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-brand-dark-400" size={20} />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Enter your complete business address"
                      required
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || isUploadingAvatar}
                    className="flex items-center space-x-2 bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-brand-blue-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                  >
                    <Save size={18} />
                    <span>
                      {isUploadingAvatar ? 'Uploading Avatar...' : isSaving ? 'Saving...' : 'Save Changes'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'business' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-brand-dark-900 mb-2">Business Details</h1>
                <p className="text-brand-dark-600">
                  Complete your business verification details to start listing experiences.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
                  {success}
                </div>
              )}

              <div className="space-y-8">
                {/* Business Information Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        value={businessDetails.businessName}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, businessName: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Enter your business name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Legal Name (if different)
                      </label>
                      <input
                        type="text"
                        value={businessDetails.legalName}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, legalName: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Enter legal name if different"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Business Type *
                      </label>
                      <select
                        value={businessDetails.businessType}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, businessType: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      >
                        <option value="">Select business type</option>
                        <option value="sole_proprietorship">Sole Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="private_limited">Private Limited Company</option>
                        <option value="public_limited">Public Limited Company</option>
                        <option value="llp">Limited Liability Partnership (LLP)</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Business Registration Document
                      </label>
                      <input
                        ref={businessRegInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setBusinessRegFile(file);
                            setBusinessDetails(prev => ({ ...prev, businessRegistrationDocument: file.name }));
                          }
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload registration certificate, license, or incorporation document</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Website or Social Media Link *
                      </label>
                      <input
                        type="url"
                        value={businessDetails.websiteOrSocialLink}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, websiteOrSocialLink: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="https://example.com or social media profile"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Registered Business Address *
                      </label>
                      <textarea
                        value={businessDetails.registeredAddress}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, registeredAddress: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent resize-none"
                        placeholder="Enter complete registered business address"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Person Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Authorized Contact Person</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        value={businessDetails.authorizedContactPersonName}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, authorizedContactPersonName: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Enter authorized contact person name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Contact Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={businessDetails.contactPhoneNumber}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, contactPhoneNumber: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Enter contact phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        value={businessDetails.contactEmail}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, contactEmail: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Enter contact email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        ID Proof Document
                      </label>
                      <input
                        ref={idProofInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIdProofFile(file);
                            setBusinessDetails(prev => ({ ...prev, idProofDocument: file.name }));
                          }
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload Aadhar, PAN, Passport, or Driver's License</p>
                    </div>
                  </div>
                </div>

                {/* Bank Account Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Bank Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        value={businessDetails.accountHolderName}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Enter account holder name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={businessDetails.bankName}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, bankName: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Enter bank name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={businessDetails.accountNumber}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Enter account number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        value={businessDetails.ifscCode}
                        onChange={(e) => setBusinessDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Enter IFSC code"
                        maxLength={11}
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                {businessDetails.verificationStatus && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-brand-dark-900 mb-2">Verification Status</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        businessDetails.verificationStatus === 'approved' ? 'bg-green-500' :
                        businessDetails.verificationStatus === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm font-medium text-brand-dark-700 capitalize">
                        {businessDetails.verificationStatus}
                      </span>
                    </div>
                    {businessDetails.verificationStatus === 'pending' && (
                      <p className="text-sm text-gray-600 mt-2">
                        Your business details are under review. We'll notify you once verification is complete.
                      </p>
                    )}
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveBusinessDetails}
                    disabled={isSavingBusiness}
                    className="flex items-center space-x-2 bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-brand-blue-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                  >
                    <Save size={18} />
                    <span>{isSavingBusiness ? 'Saving...' : 'Save Business Details'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other sections */}
          {activeSection !== 'personal' && activeSection !== 'business' && (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Settings size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-brand-dark-700 mb-2">Coming Soon</h3>
              <p className="text-brand-dark-500 max-w-md">
                This section is under development and will be available in a future update.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};