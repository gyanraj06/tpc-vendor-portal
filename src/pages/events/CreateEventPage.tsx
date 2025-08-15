import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, Upload, X, Loader2 } from 'lucide-react';
import { EventService } from '../../services/eventService';

export const CreateEventPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [formData, setFormData] = useState({
    // Page 1
    eventName: '',
    tagline: '',
    category: '',
    eventFormat: '',
    shortDescription: '',
    longDescription: '',
    date: '',
    startTime: '',
    duration: '',
    city: '',
    state: '',
    venue: '',
    fullAddress: '',
    landmark: '',
    pricingType: 'fixed',
    fixedPrice: '',
    tiers: [{ name: '', price: '' }],
    googleMapLink: '',
    bannerImage: '',
    bannerFile: null as File | null,
    eventWebsite: '',
    instagram: '',
    twitter: '',
    contactNumber: '',
    contactName: '',
    referralCodes: [{ code: '', discount: '' }],
    // Page 2
    beneficiaryName: '',
    accountType: '',
    bankName: '',
    accountNumber: '',
    bankIFSC: '',
    panNumber: '',
    gstinNumber: '',
    upiId: '',
    maxParticipants: '',
    bookingClosure: '',
    refundPolicy: '',
    guidelines: '',
    customNote: '',
    // Page 3
    needContentHelp: '',
    needCreatorCollaboration: '',
    // Page 4
    whatsappNotifications: true,
    emailReports: true,
    automaticReminders: true,
    wheelchairAccessible: false,
    womenOnly: false,
    petFriendly: false,
    languagesSpoken: '',
    faqs: '',
    // Page 5
    agreeToTerms: false
  });
  const navigate = useNavigate();

  const steps = [
    { id: 1, name: 'Basic Info', completed: false },
    { id: 2, name: 'Event Details', completed: false },
    { id: 3, name: 'Pricing', completed: false },
    { id: 4, name: 'Media', completed: false },
    { id: 5, name: 'Review', completed: false },
  ];

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      // Upload banner file if present
      let bannerUrl = formData.bannerImage;
      if (formData.bannerFile) {
        const uploadResult = await EventService.uploadBannerFile(formData.bannerFile);
        if (uploadResult.success && uploadResult.url) {
          bannerUrl = uploadResult.url;
        } else {
          setSubmitError(uploadResult.error || 'Failed to upload banner image');
          setIsSubmitting(false);
          return;
        }
      }

      // Create event data with uploaded banner URL
      const eventDataWithBanner = {
        ...formData,
        bannerImage: bannerUrl || ''
      };

      const result = await EventService.createEvent(eventDataWithBanner);

      if (result.success) {
        setSubmitSuccess(result.message || 'Event created successfully!');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setSubmitError(result.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('An unexpected error occurred while creating the event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addTier = () => {
    setFormData({
      ...formData,
      tiers: [...formData.tiers, { name: '', price: '' }]
    });
  };

  const removeTier = (index: number) => {
    const newTiers = formData.tiers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tiers: newTiers
    });
  };

  const updateTier = (index: number, field: 'name' | 'price', value: string) => {
    const newTiers = [...formData.tiers];
    newTiers[index][field] = value;
    setFormData({
      ...formData,
      tiers: newTiers
    });
  };

  const addReferralCode = () => {
    setFormData({
      ...formData,
      referralCodes: [...formData.referralCodes, { code: '', discount: '' }]
    });
  };

  const removeReferralCode = (index: number) => {
    const newReferralCodes = formData.referralCodes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      referralCodes: newReferralCodes
    });
  };

  const updateReferralCode = (index: number, field: 'code' | 'discount', value: string) => {
    const newReferralCodes = [...formData.referralCodes];
    newReferralCodes[index][field] = value;
    setFormData({
      ...formData,
      referralCodes: newReferralCodes
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear URL field when file is uploaded
      setFormData({
        ...formData,
        bannerFile: file,
        bannerImage: ''
      });
    }
  };

  const removeUploadedFile = () => {
    setFormData({
      ...formData,
      bannerFile: null
    });
  };

  const calculateEndTime = () => {
    if (!formData.startTime || !formData.duration) return '';
    
    const [hours, minutes] = formData.startTime.split(':').map(Number);
    const durationHours = parseFloat(formData.duration);
    
    if (isNaN(hours) || isNaN(minutes) || isNaN(durationHours)) return '';
    
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + (durationHours * 60));
    
    return endDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatStartTime = () => {
    if (!formData.startTime) return '';
    
    const [hours, minutes] = formData.startTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return '';
    
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark-900 mb-2">Your Event Page in Minutes</h2>
              <p className="text-brand-dark-600">Let's create your amazing event listing</p>
            </div>

            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Enter your event name"
                />
              </div>

              {/* Tagline */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Tagline or Hashtag
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="e.g. #BestComedyShow or Fun Evening Guaranteed!"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="comedy">Comedy Show</option>
                  <option value="workshop">Workshop</option>
                  <option value="music">Music Event</option>
                  <option value="dance">Dance Performance</option>
                  <option value="theater">Theater</option>
                  <option value="cultural">Cultural Event</option>
                  <option value="educational">Educational</option>
                  <option value="networking">Networking</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Event Format */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Event Format *
                </label>
                <select
                  value={formData.eventFormat}
                  onChange={(e) => setFormData({...formData, eventFormat: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                >
                  <option value="">Select format</option>
                  <option value="offline">Offline/In-Person</option>
                  <option value="online">Online/Virtual</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Brief description of your event (2-3 sentences)"
                />
              </div>

              {/* Long Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Long Description *
                </label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Detailed description of your event, what attendees can expect, schedule, etc."
                />
              </div>
                </div>
              </div>

              {/* Location and Timings Section */}
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-4 pb-2 border-b border-gray-200">
                  Location and Timings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent bg-white text-brand-dark-900 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-blue-500 pointer-events-none" />
                </div>
              </div>

              {/* Time and Duration */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Event Timing *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-brand-dark-600 mb-1">Start Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent bg-white text-brand-dark-900 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-blue-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-brand-dark-600 mb-1">Duration (hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="24"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="e.g. 2 or 1.5"
                    />
                  </div>
                </div>
                
                {/* Calculated Time Display */}
                {formData.startTime && formData.duration && calculateEndTime() && (
                  <div className="mt-3 p-3 bg-brand-blue-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brand-dark-600">Event Time:</span>
                      <span className="font-medium text-brand-blue-700">
                        {formatStartTime()} - {calculateEndTime()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Enter state"
                />
              </div>

              {/* Venue */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Venue name"
                />
              </div>

              {/* Full Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Full Address *
                </label>
                <textarea
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({...formData, fullAddress: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Complete address with pincode"
                />
              </div>

              {/* Landmark */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Nearby landmark for easy location"
                />
              </div>

              {/* Google Map Link */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Google Map Link
                </label>
                <input
                  type="url"
                  value={formData.googleMapLink}
                  onChange={(e) => setFormData({...formData, googleMapLink: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="https://maps.google.com/..."
                />
              </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-4 pb-2 border-b border-gray-200">
                  Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Pricing */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-4">
                  Pricing *
                </label>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="pricingType"
                        value="fixed"
                        checked={formData.pricingType === 'fixed'}
                        onChange={(e) => setFormData({...formData, pricingType: e.target.value})}
                        className="mr-2"
                      />
                      Fixed Pricing
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="pricingType"
                        value="tiered"
                        checked={formData.pricingType === 'tiered'}
                        onChange={(e) => setFormData({...formData, pricingType: e.target.value})}
                        className="mr-2"
                      />
                      Tiered Pricing
                    </label>
                  </div>

                  {formData.pricingType === 'fixed' && (
                    <input
                      type="number"
                      value={formData.fixedPrice}
                      onChange={(e) => setFormData({...formData, fixedPrice: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="Enter price (₹)"
                    />
                  )}

                  {formData.pricingType === 'tiered' && (
                    <div className="space-y-3">
                      {formData.tiers.map((tier, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => updateTier(index, 'name', e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                            placeholder="Tier name (e.g. Early Bird, Regular)"
                          />
                          <input
                            type="number"
                            value={tier.price}
                            onChange={(e) => updateTier(index, 'price', e.target.value)}
                            className="w-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                            placeholder="Price (₹)"
                          />
                          {formData.tiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTier(index)}
                              className="px-3 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTier}
                        className="text-brand-blue-600 hover:text-brand-blue-700 text-sm font-medium"
                      >
                        + Add Another Tier
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Referral Codes & Discounts */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-4">
                  Referral Codes & Discounts
                </label>
                <div className="space-y-3">
                  {formData.referralCodes.map((referral, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={referral.code}
                        onChange={(e) => updateReferralCode(index, 'code', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Referral code (e.g. SAVE20)"
                      />
                      <input
                        type="text"
                        value={referral.discount}
                        onChange={(e) => updateReferralCode(index, 'discount', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Discount (e.g. 20% off, ₹100 off)"
                      />
                      {formData.referralCodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeReferralCode(index)}
                          className="px-3 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addReferralCode}
                    className="text-brand-blue-600 hover:text-brand-blue-700 text-sm font-medium"
                  >
                    + Add Another Referral Code
                  </button>
                </div>
              </div>

              {/* Max Participants */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Max Participants *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Maximum number of participants"
                />
              </div>

              {/* Booking Closure */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Booking Closure (hours before event) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bookingClosure}
                  onChange={(e) => setFormData({...formData, bookingClosure: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="e.g. 2 (closes 2 hours before event)"
                />
              </div>
                </div>
              </div>

              {/* Media and Contact Section */}
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-4 pb-2 border-b border-gray-200">
                  Media and Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Event Banner */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Event Banner/Poster
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* File Upload Section */}
                  <div>
                    <label className={`block text-xs mb-2 ${formData.bannerImage ? 'text-gray-400' : 'text-brand-dark-600'}`}>
                      Upload Image
                    </label>
                    <label className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-xl transition-colors ${
                      formData.bannerImage 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                        : 'border-gray-300 hover:border-brand-blue-500 cursor-pointer'
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={!!formData.bannerImage}
                      />
                      <Upload className={`w-5 h-5 mr-2 ${formData.bannerImage ? 'text-gray-300' : 'text-gray-400'}`} />
                      <span className={`text-sm ${formData.bannerImage ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formData.bannerImage ? 'URL provided' : formData.bannerFile ? 'Change Image' : 'Choose File'}
                      </span>
                    </label>
                    
                    {formData.bannerFile && (
                      <div className="flex items-center space-x-2 px-3 py-2 bg-brand-green-50 rounded-lg mt-2">
                        <span className="text-sm text-brand-green-700 truncate">
                          {formData.bannerFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={removeUploadedFile}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* URL Input Section */}
                  <div>
                    <label className={`block text-xs mb-2 ${formData.bannerFile ? 'text-gray-400' : 'text-brand-dark-600'}`}>
                      Or Paste Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.bannerImage}
                      onChange={(e) => setFormData({...formData, bannerImage: e.target.value, bannerFile: null})}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-colors ${
                        formData.bannerFile 
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed focus:ring-gray-200 focus:border-gray-200' 
                          : 'border-gray-300 bg-white text-gray-900 focus:ring-brand-blue-500 focus:border-transparent'
                      }`}
                      placeholder={formData.bannerFile ? 'File uploaded' : 'https://example.com/banner.jpg'}
                      disabled={!!formData.bannerFile}
                    />
                  </div>
                </div>

                {/* Preview */}
                {(formData.bannerFile || (formData.bannerImage && formData.bannerImage.trim() !== '')) && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <div className="w-full h-40 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      {formData.bannerFile ? (
                        <img
                          src={URL.createObjectURL(formData.bannerFile)}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                      ) : formData.bannerImage && formData.bannerImage.trim() !== '' ? (
                        <img
                          src={formData.bannerImage}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const errorDiv = target.nextElementSibling as HTMLElement;
                            if (errorDiv) {
                              errorDiv.classList.remove('hidden');
                            }
                          }}
                        />
                      ) : null}
                      <div className="hidden w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                        <div className="text-center">
                          <div className="text-red-400 mb-1">⚠️</div>
                          <div>Failed to load image</div>
                          <div className="text-xs mt-1">Please check the URL</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Website */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Event Website (if any)
                </label>
                <input
                  type="url"
                  value={formData.eventWebsite}
                  onChange={(e) => setFormData({...formData, eventWebsite: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="https://your-event-website.com"
                />
              </div>

              {/* Social Media */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  X (Twitter)
                </label>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="@username"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Contact person name"
                />
              </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark-900 mb-2">Collect Payments & Limit Bookings Easily</h2>
              <p className="text-brand-dark-600">Set up your payment and booking preferences</p>
            </div>

            <div className="space-y-6">
              {/* Bank Details */}
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-4 pb-2 border-b border-gray-200">
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Beneficiary Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Beneficiary Name *
                    </label>
                    <input
                      type="text"
                      value={formData.beneficiaryName}
                      onChange={(e) => setFormData({...formData, beneficiaryName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="Account holder name as per bank records"
                    />
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Account Type *
                    </label>
                    <select
                      value={formData.accountType}
                      onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    >
                      <option value="">Select account type</option>
                      <option value="salary">Salary</option>
                      <option value="saving">Saving</option>
                      <option value="nri">NRI</option>
                    </select>
                  </div>

                  {/* Bank Name */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="e.g. State Bank of India"
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="Enter account number"
                    />
                  </div>

                  {/* Bank IFSC */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Bank IFSC *
                    </label>
                    <input
                      type="text"
                      value={formData.bankIFSC}
                      onChange={(e) => setFormData({...formData, bankIFSC: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="e.g. SBIN0000123"
                      pattern="[A-Z]{4}0[A-Z0-9]{6}"
                      title="IFSC format: 4 letters + 0 + 6 alphanumeric characters"
                    />
                  </div>

                  {/* PAN Number */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="e.g. ABCDE1234F"
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      title="PAN format: 5 letters + 4 numbers + 1 letter"
                      maxLength={10}
                    />
                  </div>

                  {/* GSTIN Number */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      GSTIN Number
                    </label>
                    <input
                      type="text"
                      value={formData.gstinNumber}
                      onChange={(e) => setFormData({...formData, gstinNumber: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="e.g. 22AAAAA0000A1Z5"
                      pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
                      title="GSTIN format: 15 characters as per GST rules"
                      maxLength={15}
                    />
                  </div>

                  {/* UPI ID */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) => setFormData({...formData, upiId: e.target.value.toLowerCase()})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="e.g. yourname@paytm, mobile@oksbi"
                      pattern="[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}"
                      title="UPI ID format: username@bank"
                    />
                  </div>
                </div>
              </div>


              {/* Terms and Conditions Section */}
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-4 pb-2 border-b border-gray-200">
                  Terms and Conditions
                </h3>
                <div className="space-y-6">
                  {/* Refund Policy */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Refund Policy *
                    </label>
                    <select
                      value={formData.refundPolicy}
                      onChange={(e) => setFormData({...formData, refundPolicy: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    >
                      <option value="">Select refund policy</option>
                      <option value="no-refund">No Refund</option>
                      <option value="48hr-full">48 Hour Full Refund</option>
                      <option value="24hr-full">24 Hour Full Refund</option>
                    </select>
                  </div>

                  {/* Guidelines */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Guidelines
                    </label>
                    <textarea
                      value={formData.guidelines}
                      onChange={(e) => setFormData({...formData, guidelines: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="Enter event guidelines, rules, what to bring, dress code, safety instructions, or any other important information for attendees..."
                    />
                  </div>
                </div>
              </div>

              {/* Custom Note */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Custom Note (For our team to cater you better)
                </label>
                <textarea
                  value={formData.customNote}
                  onChange={(e) => setFormData({...formData, customNote: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Any special requirements or notes for our team..."
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark-900 mb-2">Through Creators & Editors</h2>
              <p className="text-brand-dark-600">Get help with content creation and local collaborations</p>
            </div>

            <div className="space-y-8">
              {/* Content Help */}
              <div>
                <div className="flex items-center mb-4">
                  <label className="block text-sm font-medium text-brand-dark-700">
                    Need Content Help?
                  </label>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="radio"
                      name="needContentHelp"
                      value="yes"
                      checked={formData.needContentHelp === 'yes'}
                      onChange={(e) => setFormData({...formData, needContentHelp: e.target.value})}
                      className="mr-3"
                    />
                    <span>Yes, I need professional content creation</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="radio"
                      name="needContentHelp"
                      value="no"
                      checked={formData.needContentHelp === 'no'}
                      onChange={(e) => setFormData({...formData, needContentHelp: e.target.value})}
                      className="mr-3"
                    />
                    <span>No, I'll handle content myself</span>
                  </label>
                </div>
              </div>

              {/* Creator Collaboration */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-4">
                  Looking for Local Creator Collaboration?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="radio"
                      name="needCreatorCollaboration"
                      value="yes"
                      checked={formData.needCreatorCollaboration === 'yes'}
                      onChange={(e) => setFormData({...formData, needCreatorCollaboration: e.target.value})}
                      className="mr-3"
                    />
                    <span>Connect me with local creators</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="radio"
                      name="needCreatorCollaboration"
                      value="no"
                      checked={formData.needCreatorCollaboration === 'no'}
                      onChange={(e) => setFormData({...formData, needCreatorCollaboration: e.target.value})}
                      className="mr-3"
                    />
                    <span>No, just list my events</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark-900 mb-2">Track, Communicate, Manage</h2>
              <p className="text-brand-dark-600">Configure your event dashboard and communication preferences</p>
            </div>

            <div className="space-y-8">
              {/* Dashboard Features */}
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Your Event Dashboard Will Include:</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <ul className="space-y-2 text-brand-dark-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-brand-blue-600 rounded-full mr-3"></div>
                      Real-time attendee list & CSV download
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-brand-blue-600 rounded-full mr-3"></div>
                      Payment status tracking
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-brand-blue-600 rounded-full mr-3"></div>
                      WhatsApp broadcast messaging
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-brand-blue-600 rounded-full mr-3"></div>
                      Event QR code generation
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-brand-blue-600 rounded-full mr-3"></div>
                      Reschedule & refund management
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-brand-blue-600 rounded-full mr-3"></div>
                      Live "spots left" counter
                    </li>
                  </ul>
                </div>
              </div>

              {/* Communication Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Communication Preferences</h3>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.whatsappNotifications}
                      onChange={(e) => setFormData({...formData, whatsappNotifications: e.target.checked})}
                      className="mr-3"
                    />
                    <span>WhatsApp notifications for new bookings</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.emailReports}
                      onChange={(e) => setFormData({...formData, emailReports: e.target.checked})}
                      className="mr-3"
                    />
                    <span>Email summaries and reports</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.automaticReminders}
                      onChange={(e) => setFormData({...formData, automaticReminders: e.target.checked})}
                      className="mr-3"
                    />
                    <span>Send automatic event reminders to attendees</span>
                  </label>
                </div>
              </div>

              {/* Accessibility Tags */}
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Accessibility Tags</h3>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.wheelchairAccessible}
                      onChange={(e) => setFormData({...formData, wheelchairAccessible: e.target.checked})}
                      className="mr-3"
                    />
                    <span>Wheelchair Accessible</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.womenOnly}
                      onChange={(e) => setFormData({...formData, womenOnly: e.target.checked})}
                      className="mr-3"
                    />
                    <span>Women-only</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.petFriendly}
                      onChange={(e) => setFormData({...formData, petFriendly: e.target.checked})}
                      className="mr-3"
                    />
                    <span>Pet-Friendly</span>
                  </label>
                </div>
              </div>

              {/* Languages Spoken */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Languages Spoken by Host
                </label>
                <input
                  type="text"
                  value={formData.languagesSpoken}
                  onChange={(e) => setFormData({...formData, languagesSpoken: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="e.g. Hindi, English, Kannada"
                />
              </div>

              {/* FAQs */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  FAQs / Host Tips (Optional)
                </label>
                <textarea
                  value={formData.faqs}
                  onChange={(e) => setFormData({...formData, faqs: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Common questions and helpful tips for attendees..."
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark-900 mb-2">Build Long-Term Credibility</h2>
              <p className="text-brand-dark-600">Review and submit your event</p>
            </div>

            <div className="space-y-8">
              {/* Verification Badge Info */}
              <div className="bg-gradient-to-r from-brand-green-50 to-brand-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">
                  "Verified by TrippeChalo" Badge
                </h3>
                <ul className="space-y-2 text-brand-dark-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green-600 rounded-full mr-3"></div>
                    Complete 3+ successful events with us
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green-600 rounded-full mr-3"></div>
                    Maintain 4+ star average rating
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green-600 rounded-full mr-3"></div>
                    Get "Trusted Local Host" badge on your profile
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green-600 rounded-full mr-3"></div>
                    Higher visibility in search results
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green-600 rounded-full mr-3"></div>
                    Access to premium creator network
                  </li>
                </ul>
              </div>

              {/* Terms and Conditions */}
              <div className="border border-gray-200 rounded-xl p-6">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                    className="mt-1 mr-3"
                  />
                  <div className="text-sm text-brand-dark-700">
                    <span className="font-medium">I agree to TrippeChalo's Terms of Service</span> and understand that:
                    <ul className="mt-2 space-y-1 ml-4 list-disc">
                      <li>I'm responsible for delivering the event as described</li>
                      <li>TrippeChalo will collect a 5% platform fee on paid events</li>
                      <li>Refunds will be processed according to my stated policy</li>
                      <li>I'll maintain professional communication with attendees</li>
                    </ul>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-brand-dark-600 hover:text-brand-blue-600 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl font-semibold text-brand-dark-900">Create your event</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-4">
            <span className="text-sm font-medium text-brand-dark-600">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Error/Success Messages */}
          {submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {submitError}
            </div>
          )}
          
          {submitSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              {submitSuccess}
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all
                ${currentStep === 1 || isSubmitting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-brand-dark-700 hover:bg-gray-300'
                }
              `}
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={(currentStep === 5 && !formData.agreeToTerms) || isSubmitting}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2
                ${(currentStep === 5 && !formData.agreeToTerms) || isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : currentStep === 5
                  ? 'bg-brand-green-600 text-white hover:bg-brand-green-700'
                  : 'bg-brand-blue-600 text-white hover:bg-brand-blue-700'
                }
              `}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {isSubmitting 
                  ? 'Creating Event...' 
                  : currentStep === 5 
                  ? 'Submit Event' 
                  : 'Next'
                }
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};