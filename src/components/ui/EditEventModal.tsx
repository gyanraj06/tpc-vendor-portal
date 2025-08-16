import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Loader2, Calendar, Clock } from 'lucide-react';
import { EventService, type EventListing } from '../../services/eventService';

interface EditEventModalProps {
  event: EventListing;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: (updatedEvent: EventListing) => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  event,
  isOpen,
  onClose,
  onEventUpdated
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [formData, setFormData] = useState({
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
    pricingType: 'fixed' as 'fixed' | 'tiered',
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
    needContentHelp: '',
    needCreatorCollaboration: '',
    whatsappNotifications: true,
    emailReports: true,
    automaticReminders: true,
    wheelchairAccessible: false,
    womenOnly: false,
    petFriendly: false,
    languagesSpoken: '',
    faqs: '',
    agreeToTerms: true
  });

  const steps = [
    { id: 1, name: 'Basic Info' },
    { id: 2, name: 'Event Details' },
    { id: 3, name: 'Pricing' },
    { id: 4, name: 'Media & Settings' }
  ];

  // Initialize form data when event changes
  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      const dateString = eventDate.toISOString().split('T')[0];
      
      // Convert tiers object to array format expected by form
      const tiersArray = event.tiers ? 
        Object.entries(event.tiers).map(([name, data]) => ({
          name: name.replace(/_/g, ' '),
          price: data.price.toString()
        })) : [{ name: '', price: '' }];

      setFormData({
        eventName: event.event_name || '',
        tagline: event.tagline || '',
        category: event.category || '',
        eventFormat: event.event_format || '',
        shortDescription: event.short_description || '',
        longDescription: event.long_description || '',
        date: dateString,
        startTime: event.start_time || '',
        duration: event.duration?.toString() || '',
        city: event.city || '',
        state: event.state || '',
        venue: event.venue || '',
        fullAddress: event.full_address || '',
        landmark: event.landmark || '',
        pricingType: event.pricing_type || 'fixed',
        fixedPrice: event.fixed_price?.toString() || '',
        tiers: tiersArray,
        googleMapLink: event.google_map_link || '',
        bannerImage: event.banner_image || '',
        bannerFile: null,
        eventWebsite: event.event_website || '',
        instagram: event.instagram || '',
        twitter: event.twitter || '',
        contactNumber: event.contact_number || '',
        contactName: event.contact_name || '',
        beneficiaryName: event.beneficiary_name || '',
        accountType: event.account_type || '',
        bankName: event.bank_name || '',
        accountNumber: event.account_number || '',
        bankIFSC: event.bank_ifsc || '',
        panNumber: event.pan_number || '',
        gstinNumber: event.gstin_number || '',
        upiId: event.upi_id || '',
        maxParticipants: event.max_participants?.toString() || '',
        bookingClosure: event.booking_closure?.toString() || '',
        refundPolicy: event.refund_policy || '',
        guidelines: event.guidelines || '',
        customNote: event.custom_note || '',
        needContentHelp: event.need_content_help || 'no',
        needCreatorCollaboration: event.need_creator_collaboration || 'no',
        whatsappNotifications: event.whatsapp_notifications ?? true,
        emailReports: event.email_reports ?? true,
        automaticReminders: event.automatic_reminders ?? true,
        wheelchairAccessible: event.wheelchair_accessible ?? false,
        womenOnly: event.women_only ?? false,
        petFriendly: event.pet_friendly ?? false,
        languagesSpoken: event.languages_spoken || '',
        faqs: event.faqs || '',
        agreeToTerms: true
      });
    }
  }, [event]);

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTier = () => {
    setFormData(prev => ({
      ...prev,
      tiers: [...prev.tiers, { name: '', price: '' }]
    }));
  };

  const removeTier = (index: number) => {
    const newTiers = formData.tiers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tiers: newTiers }));
  };

  const updateTier = (index: number, field: 'name' | 'price', value: string) => {
    const newTiers = [...formData.tiers];
    newTiers[index][field] = value;
    setFormData(prev => ({ ...prev, tiers: newTiers }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        bannerFile: file,
        bannerImage: ''
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
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

      const eventDataWithBanner = {
        ...formData,
        bannerImage: bannerUrl || ''
      };

      const result = await EventService.updateEvent(event.id, eventDataWithBanner);

      if (result.success) {
        setSubmitSuccess(result.message || 'Event updated successfully!');
        
        // Create updated event object from form data
        const updatedEvent: EventListing = {
          ...event,
          event_name: formData.eventName,
          tagline: formData.tagline,
          category: formData.category,
          event_format: formData.eventFormat,
          short_description: formData.shortDescription,
          long_description: formData.longDescription,
          date: new Date(`${formData.date}T${formData.startTime}:00`).toISOString(),
          start_time: formData.startTime,
          duration: parseFloat(formData.duration),
          city: formData.city,
          state: formData.state,
          venue: formData.venue,
          full_address: formData.fullAddress,
          landmark: formData.landmark,
          pricing_type: formData.pricingType,
          fixed_price: formData.pricingType === 'fixed' ? parseFloat(formData.fixedPrice) : undefined,
          tiers: formData.pricingType === 'tiered' ? 
            formData.tiers
              .filter(tier => tier.name && tier.price)
              .reduce((acc: Record<string, { price: number }>, tier) => {
                const tierKey = tier.name.toLowerCase().replace(/\s+/g, '_');
                acc[tierKey] = { price: parseFloat(tier.price) };
                return acc;
              }, {}) : undefined,
          google_map_link: formData.googleMapLink,
          banner_image: bannerUrl,
          event_website: formData.eventWebsite,
          instagram: formData.instagram,
          twitter: formData.twitter,
          contact_number: formData.contactNumber,
          contact_name: formData.contactName,
          beneficiary_name: formData.beneficiaryName,
          account_type: formData.accountType,
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          bank_ifsc: formData.bankIFSC,
          pan_number: formData.panNumber,
          gstin_number: formData.gstinNumber,
          upi_id: formData.upiId,
          max_participants: parseInt(formData.maxParticipants),
          booking_closure: parseInt(formData.bookingClosure),
          refund_policy: formData.refundPolicy,
          guidelines: formData.guidelines,
          custom_note: formData.customNote,
          need_content_help: formData.needContentHelp,
          need_creator_collaboration: formData.needCreatorCollaboration,
          whatsapp_notifications: formData.whatsappNotifications,
          email_reports: formData.emailReports,
          automatic_reminders: formData.automaticReminders,
          wheelchair_accessible: formData.wheelchairAccessible,
          women_only: formData.womenOnly,
          pet_friendly: formData.petFriendly,
          languages_spoken: formData.languagesSpoken,
          faqs: formData.faqs,
          agree_to_terms: formData.agreeToTerms,
          updated_at: new Date().toISOString()
        };

        onEventUpdated(updatedEvent);

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setSubmitError(result.error || 'Failed to update event');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('An unexpected error occurred while updating the event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-brand-dark-900">Edit Event</h2>
            <p className="text-sm text-brand-dark-600">{event.event_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-brand-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step.id ? 'text-brand-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`ml-4 w-12 h-0.5 ${
                    currentStep > step.id ? 'bg-brand-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {submitSuccess}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => handleInputChange('eventName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="comedy">Comedy</option>
                    <option value="music">Music</option>
                    <option value="workshop">Workshop</option>
                    <option value="cultural">Cultural</option>
                    <option value="educational">Educational</option>
                    <option value="networking">Networking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Event Format *
                  </label>
                  <select
                    value={formData.eventFormat}
                    onChange={(e) => handleInputChange('eventFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Format</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Long Description *
                </label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => handleInputChange('longDescription', e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Event Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Event Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    <Calendar className="inline mr-2" size={16} />
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    <Clock className="inline mr-2" size={16} />
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Full Address *
                </label>
                <textarea
                  value={formData.fullAddress}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Max Participants *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Pricing</h3>
              
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-3">
                  Pricing Type *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="fixed"
                      checked={formData.pricingType === 'fixed'}
                      onChange={(e) => handleInputChange('pricingType', e.target.value)}
                      className="mr-2"
                    />
                    Fixed Price
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="tiered"
                      checked={formData.pricingType === 'tiered'}
                      onChange={(e) => handleInputChange('pricingType', e.target.value)}
                      className="mr-2"
                    />
                    Tiered Pricing
                  </label>
                </div>
              </div>

              {formData.pricingType === 'fixed' ? (
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.fixedPrice}
                    onChange={(e) => handleInputChange('fixedPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-3">
                    Price Tiers *
                  </label>
                  {formData.tiers.map((tier, index) => (
                    <div key={index} className="flex items-center space-x-3 mb-3">
                      <input
                        type="text"
                        placeholder="Tier name (e.g., Early Bird)"
                        value={tier.name}
                        onChange={(e) => updateTier(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        min="0"
                        value={tier.price}
                        onChange={(e) => updateTier(index, 'price', e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        required
                      />
                      {formData.tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTier}
                    className="text-brand-blue-600 hover:text-brand-blue-700 text-sm"
                  >
                    + Add Tier
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Booking Closure (hours before event) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.bookingClosure}
                  onChange={(e) => handleInputChange('bookingClosure', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: Media & Settings */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-brand-dark-900 mb-4">Media & Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Banner Image
                </label>
                <div className="space-y-3">
                  {formData.bannerImage && !formData.bannerFile && (
                    <div className="relative">
                      <img
                        src={formData.bannerImage}
                        alt="Current banner"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange('bannerImage', '')}
                          className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {formData.bannerFile && (
                    <div className="text-sm text-green-600">
                      New file selected: {formData.bannerFile.name}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="banner-upload"
                    />
                    <label
                      htmlFor="banner-upload"
                      className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Upload size={16} />
                      <span>Upload New Image</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Event Website
                  </label>
                  <input
                    type="url"
                    value={formData.eventWebsite}
                    onChange={(e) => handleInputChange('eventWebsite', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    value={formData.languagesSpoken}
                    onChange={(e) => handleInputChange('languagesSpoken', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                    placeholder="e.g., English, Hindi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Guidelines
                </label>
                <textarea
                  value={formData.guidelines}
                  onChange={(e) => handleInputChange('guidelines', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Any guidelines for participants..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  FAQs
                </label>
                <textarea
                  value={formData.faqs}
                  onChange={(e) => handleInputChange('faqs', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Frequently asked questions..."
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-md font-medium text-brand-dark-900">Accessibility & Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.wheelchairAccessible}
                      onChange={(e) => handleInputChange('wheelchairAccessible', e.target.checked)}
                      className="mr-2"
                    />
                    Wheelchair Accessible
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.womenOnly}
                      onChange={(e) => handleInputChange('womenOnly', e.target.checked)}
                      className="mr-2"
                    />
                    Women Only
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.petFriendly}
                      onChange={(e) => handleInputChange('petFriendly', e.target.checked)}
                      className="mr-2"
                    />
                    Pet Friendly
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{currentStep === 4 ? 'Update Event' : 'Next'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};