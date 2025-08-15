import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, CheckCircle, Mountain, Theater } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { VendorType, vendorTypeConfigs } from '../../types/vendorTypes';
import { StorageService } from '../../services/storageService';
import { AvatarUpload } from '../../components/ui/AvatarUpload';

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
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (currentStep === 1 && vendorType) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
      // First update the basic profile
      const vendor = await AuthService.updateVendorProfile(vendorId, {
        name,
        phone,
        address,
        vendorType: vendorType as VendorType
      });

      if (!vendor) {
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

          {/* Progress Steps */}
          <div className="px-8 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-brand-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? <CheckCircle size={16} /> : step}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step ? 'text-brand-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 ? 'Vendor Type' : 'Personal Info'}
                  </span>
                  {step < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-4"></div>}
                </div>
              ))}
            </div>
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
            {currentStep === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-brand-dark-900 mb-2">Personal Information</h3>
                  <p className="text-brand-dark-600">Tell us about yourself and your business</p>
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
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
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
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                      required
                    />
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
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Enter your business address"
                      required
                    />
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
                    type="submit"
                    disabled={isLoading || isUploadingAvatar}
                    className="bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-brand-blue-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {isUploadingAvatar ? 'Uploading Avatar...' : isLoading ? 'Setting up...' : 'Complete Setup'}
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