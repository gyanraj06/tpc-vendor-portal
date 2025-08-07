import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Save, Settings, Shield, Bell, CreditCard, Mountain, Theater } from 'lucide-react';
import { AuthService, type Vendor } from '../../services/authService';
import { VendorType, vendorTypeConfigs } from '../../types/vendorTypes';
import { StorageService } from '../../services/storageService';
import { AvatarUpload } from '../../components/ui/AvatarUpload';

type SidebarSection = 'personal' | 'security' | 'notifications' | 'billing';

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
  
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'personal',
      label: 'Personal Details',
      icon: <User size={20} />,
      available: true
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
    <div className="min-h-screen bg-brand-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-brand-dark-600 hover:text-brand-blue-600 transition-colors mr-4"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center">
                <div className="h-8 w-8 bg-[url('/src/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
                <div className="h-8 w-32 bg-[url('/src/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
              </div>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-semibold text-brand-dark-900">Edit Profile</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-brand-dark-600">
                {vendor?.name || vendor?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex min-h-[600px]">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-50 border-r border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-brand-dark-900 mb-6">Profile Settings</h2>
                <nav className="space-y-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => item.available && setActiveSection(item.id)}
                      disabled={!item.available}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-brand-blue-100 text-brand-blue-700 border border-brand-blue-200'
                          : item.available
                          ? 'text-brand-dark-600 hover:bg-white hover:shadow-sm'
                          : 'text-brand-dark-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span className={activeSection === item.id ? 'text-brand-blue-600' : 'text-current'}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                      {!item.available && (
                        <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          Soon
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8">
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

              {/* Placeholder for other sections */}
              {activeSection !== 'personal' && (
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
      </div>
    </div>
  );
};