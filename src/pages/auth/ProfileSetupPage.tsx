import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Mountain, Theater, Building2, UserCheck, CreditCard } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { VendorType, vendorTypeConfigs } from '../../types/vendorTypes';
import { StorageService } from '../../services/storageService';
import { AvatarUpload } from '../../components/ui/AvatarUpload';
import { supabase } from '../../lib/supabase';

const iconMap = {
  Mountain: Mountain,
  Theater: Theater
};

export const ProfileSetupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [vendorType, setVendorType] = useState<VendorType | ''>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: boolean}>({});
  
  // Business Details State
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
  });
  
  const navigate = useNavigate();

  // Calculate total steps based on vendor type
  const getTotalSteps = () => {
    return vendorType === 'LOCAL_EVENT_HOST' ? 5 : 2; // 5 for event hosts (vendor type, personal, contact, business, bank), 2 for trek organizers (vendor type, personal)
  };

  const handleNextStep = () => {
    if (currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  const validatePersonalInfo = () => {
    const errors: {[key: string]: boolean} = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = true;
      isValid = false;
    }
    if (!phone.trim()) {
      errors.phone = true;
      isValid = false;
    }
    if (!address.trim()) {
      errors.address = true;
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const isBusinessDetailsComplete = () => {
    if (vendorType !== 'LOCAL_EVENT_HOST') return false;
    
    return businessDetails.authorizedContactPersonName &&
           businessDetails.contactPhoneNumber &&
           businessDetails.contactEmail &&
           businessDetails.businessName &&
           businessDetails.businessType &&
           businessDetails.websiteOrSocialLink &&
           businessDetails.registeredAddress &&
           businessDetails.accountHolderName &&
           businessDetails.bankName &&
           businessDetails.accountNumber &&
           businessDetails.ifscCode;
  };

  const handleNextOrSkip = () => {
    if (currentStep === 2) {
      // Personal info step - validate before proceeding
      if (!validatePersonalInfo()) {
        return;
      }
    }

    if (vendorType === 'TREK_ORGANIZER' && currentStep === 2) {
      // Complete setup for trek organizers
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    } else if (currentStep === getTotalSteps()) {
      // Last step - complete or skip
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    } else {
      // Continue to next step
      handleNextStep();
    }
  };

  const getButtonText = () => {
    if (vendorType === 'TREK_ORGANIZER' && currentStep === 2) {
      return isUploadingAvatar ? 'Uploading Avatar...' : isLoading ? 'Setting up...' : 'Complete Setup';
    }
    
    if (currentStep === getTotalSteps()) {
      // Last step: Complete if all details filled, otherwise Skip For Now
      return isBusinessDetailsComplete() ? 
        (isUploadingAvatar ? 'Uploading Avatar...' : isLoading ? 'Setting up...' : 'Complete Setup') :
        (isLoading ? 'Setting up...' : 'Skip For Now');
    }
    
    // For intermediate steps: Skip if all details complete, otherwise Next
    if (vendorType === 'LOCAL_EVENT_HOST' && currentStep > 2) {
      return isBusinessDetailsComplete() ? 'Skip' : 'Next';
    }
    
    return 'Next';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const currentUser = await AuthService.getCurrentUser();
    if (!currentUser) {
      setError('No vendor session found. Please login again.');
      navigate('/');
      return;
    }
    
    const vendorId = currentUser.id;

    if (!vendorType) {
      setError('Please select a vendor type.');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare update data - always include basic profile
      const updateData: any = {
        name,
        phone,
        address,
        vendor_type: vendorType as VendorType,
        is_first_login: false
      };

      // Add business details for LOCAL_EVENT_HOST vendors
      if (vendorType === 'LOCAL_EVENT_HOST') {
        updateData.business_name = businessDetails.businessName;
        updateData.legal_name = businessDetails.legalName;
        updateData.business_type = businessDetails.businessType;
        updateData.website_or_social_link = businessDetails.websiteOrSocialLink;
        updateData.registered_address = businessDetails.registeredAddress;
        updateData.authorized_contact_person_name = businessDetails.authorizedContactPersonName;
        updateData.contact_phone_number = businessDetails.contactPhoneNumber;
        updateData.contact_email = businessDetails.contactEmail;
        updateData.account_holder_name = businessDetails.accountHolderName;
        updateData.bank_name = businessDetails.bankName;
        updateData.account_number = businessDetails.accountNumber;
        updateData.ifsc_code = businessDetails.ifscCode;
        updateData.business_verification_status = 'pending';
        updateData.business_details_verified = false;
      }

      // Update profile using direct Supabase call since AuthService doesn't support business fields
      const { error } = await supabase
        .from('vendor_profiles')
        .update(updateData)
        .eq('id', vendorId)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        setError('Failed to update profile. Please try again.');
        return;
      }

      // Handle avatar upload if file is selected
      if (avatarFile) {
        setIsUploadingAvatar(true);
        const avatarUrl = await StorageService.uploadAndUpdateAvatar(vendorId, avatarFile);
        
        if (!avatarUrl) {
          console.warn('Avatar upload failed, but profile was saved');
        }
      }

      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Profile setup error:', err);
    } finally {
      setIsLoading(false);
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-50 to-brand-green-50 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-blue-600 to-brand-green-600 px-8 py-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-[url('/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
              <div className="-ml-2 h-12 w-48 bg-[url('/assets/LogoWritten.jpg')] bg-contain bg-no-repeat filter brightness-0 invert"></div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Complete Your Profile</h2>
            <p className="text-white/90 text-center">Let's set up your vendor profile to get started</p>
          </div>


          {/* Form Content */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            {/* Step 1: Vendor Type Selection */}
            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-brand-dark-900 mb-2">What type of vendor are you?</h3>
                  <p className="text-brand-dark-600">Choose the category that best describes your business</p>
                </div>

                <div className="grid gap-4">
                  {[VendorType.TREK_ORGANIZER, VendorType.LOCAL_EVENT_HOST].map((type) => {
                    const config = vendorTypeConfigs[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setVendorType(type)}
                        className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                          vendorType === type
                            ? 'border-brand-blue-500 bg-brand-blue-50'
                            : 'border-gray-200 hover:border-brand-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-brand-blue-100 rounded-xl flex items-center justify-center">
                            {React.createElement(iconMap[config.icon as keyof typeof iconMap], { size: 24, className: "text-brand-blue-600" })}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-brand-dark-900 mb-2">{config.title}</h4>
                            <p className="text-brand-dark-600 text-sm mb-3">{config.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {config.features.slice(0, 2).map((feature, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            vendorType === type
                              ? 'border-brand-blue-500 bg-brand-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {vendorType === type && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNextStep}
                    disabled={!vendorType}
                    className="bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (vendorType === 'TREK_ORGANIZER' || vendorType === 'LOCAL_EVENT_HOST') && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-brand-dark-900 mb-2">Personal Information</h3>
                  <p className="text-brand-dark-600">Tell us about yourself</p>
                </div>

                {/* Avatar Upload */}
                <div className="flex justify-center mb-8">
                  <AvatarUpload
                    onAvatarChange={setAvatarFile}
                    isUploading={isUploadingAvatar}
                    size="lg"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) {
                          setFieldErrors(prev => ({ ...prev, name: false }));
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                    {fieldErrors.name && (
                      <p className="text-red-500 text-xs mt-1">Full name is required</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldErrors.phone) {
                          setFieldErrors(prev => ({ ...prev, phone: false }));
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                      required
                    />
                    {fieldErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">Phone number is required</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Business Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-brand-dark-400" size={20} />
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (fieldErrors.address) {
                          setFieldErrors(prev => ({ ...prev, address: false }));
                        }
                      }}
                      rows={3}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                        fieldErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your business address"
                      required
                    />
                    {fieldErrors.address && (
                      <p className="text-red-500 text-xs mt-1">Business address is required</p>
                    )}
                  </div>
                </div>


                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-gray-300 text-brand-dark-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    Previous
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNextOrSkip}
                    disabled={isLoading || isUploadingAvatar}
                    className="bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-brand-blue-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {getButtonText()}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact Person - Only for LOCAL_EVENT_HOST */}
            {currentStep === 3 && vendorType === 'LOCAL_EVENT_HOST' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <UserCheck className="w-12 h-12 text-brand-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-brand-dark-900 mb-2">Authorized Contact Person</h3>
                  <p className="text-brand-dark-600">Details of the person authorized to represent your business</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      value={businessDetails.authorizedContactPersonName}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, authorizedContactPersonName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter authorized contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      value={businessDetails.contactPhoneNumber}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, contactPhoneNumber: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter contact phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={businessDetails.contactEmail}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter contact email address"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold leading-none">!</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">Optional Step</h4>
                      <p className="text-amber-700 text-sm">
                        This information is required for creating experiences or events. You can skip this and complete it later in your profile settings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-gray-300 text-brand-dark-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    Previous
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNextOrSkip}
                    className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {getButtonText()}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Business Information - Only for LOCAL_EVENT_HOST */}
            {currentStep === 4 && vendorType === 'LOCAL_EVENT_HOST' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Building2 className="w-12 h-12 text-brand-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-brand-dark-900 mb-2">Business Information</h3>
                  <p className="text-brand-dark-600">Tell us about your business and organization</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessDetails.businessName}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter legal name if different"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Business Type
                    </label>
                    <select
                      value={businessDetails.businessType}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, businessType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
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
                      Website or Social Media Link
                    </label>
                    <input
                      type="url"
                      value={businessDetails.websiteOrSocialLink}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, websiteOrSocialLink: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://example.com or social media profile"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Registered Business Address
                    </label>
                    <textarea
                      value={businessDetails.registeredAddress}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, registeredAddress: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Enter complete registered business address"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold leading-none">!</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">Optional Step</h4>
                      <p className="text-amber-700 text-sm">
                        This information is required for creating experiences or events. You can skip this and complete it later in your profile settings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-gray-300 text-brand-dark-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    Previous
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNextOrSkip}
                    className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {getButtonText()}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Bank Account Details - Only for LOCAL_EVENT_HOST */}
            {currentStep === 5 && vendorType === 'LOCAL_EVENT_HOST' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <CreditCard className="w-12 h-12 text-brand-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-brand-dark-900 mb-2">Bank Account Details</h3>
                  <p className="text-brand-dark-600">Payment and settlement information</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={businessDetails.accountHolderName}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={businessDetails.bankName}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, bankName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter bank name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={businessDetails.accountNumber}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter account number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={businessDetails.ifscCode}
                      onChange={(e) => setBusinessDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter IFSC code"
                      maxLength={11}
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold leading-none">!</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">Optional Step</h4>
                      <p className="text-amber-700 text-sm">
                        This information is required for creating experiences or events. You can skip this and complete it later in your profile settings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-gray-300 text-brand-dark-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    Previous
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNextOrSkip}
                    disabled={isLoading || isUploadingAvatar}
                    className="bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-brand-blue-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {getButtonText()}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};