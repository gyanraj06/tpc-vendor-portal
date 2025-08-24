import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Loader2, Plus, Minus, AlertCircle } from 'lucide-react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AuthService } from '../../services/authService';
import { RecurringEventService } from '../../services/recurringEventService';
import { ToasterNotification } from '../../components/ui/ToasterNotification';

export const CreateRecurringEventPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState('');
  const [isLoadingVerification, setIsLoadingVerification] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    // Event Name - ADDED
    eventName: '',
    description: '',
    
    // Category of Experience
    primaryCategory: '',
    subCategory: '',
    recurrenceType: '',
    daysOfWeek: [] as string[],
    timeSlots: [{ startTime: null as Date | null, endTime: null as Date | null }],

    // Location Setting
    locationType: 'fixed', // fixed, itinerary, multiple
    address: '',
    itinerary: [{ location: '', description: '', duration: '' }],

    // Pricing and Inclusions
    eventType: '',
    ticketPricePerPerson: '',
    ticketType: '',
    addOnServices: [{ name: '', price: '' }],
    numberOfMaxTicketsPerOccurrence: '',
    bookingClosesBeforeHrs: '',
    earlyBirdCouponCode: '',
    earlyBirdDiscount: '',
    refundPolicy: '',
    cancellationPolicy: '',
    customNote: '',

    // Operational & Safety
    emergencyContactNumber: '',
    hasLiabilityInsurance: '',
    experiencePhotos: [] as File[],
    experiencePhotoUrls: [] as string[],

    // Terms and Conditions
    agreeToTerms: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const vendorData = await AuthService.getCurrentUser();
        if (!vendorData) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Failed to check user authentication:', error);
        navigate('/dashboard');
      } finally {
        setIsLoadingVerification(false);
      }
    };

    checkUserAuth();
  }, [navigate]);

  const showToasterMessage = (message: string) => {
    setToasterMessage(message);
    setShowToaster(true);
  };

  // Validation functions
  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'eventName':
        return !value?.trim() ? 'Event name is required' : '';
      case 'description':
        return !value?.trim() ? 'Description is required' : '';
      case 'primaryCategory':
        return !value ? 'Primary category is required' : '';
      case 'subCategory':
        return !value?.trim() ? 'Sub category is required' : '';
      case 'recurrenceType':
        return !value ? 'Recurrence type is required' : '';
      case 'daysOfWeek':
        return formData.recurrenceType === 'weekly' && value.length === 0 ? 'At least one day must be selected' : '';
      case 'timeSlots':
        return value.length === 0 || !value[0].startTime || !value[0].endTime ? 'At least one complete time slot is required' : '';
      case 'locationType':
        return !value ? 'Location type is required' : '';
      case 'address':
        return formData.locationType === 'fixed' && !value?.trim() ? 'Address is required for fixed location' : '';
      case 'eventType':
        return !value ? 'Event type is required' : '';
      case 'ticketPricePerPerson':
        return formData.eventType === 'paid' && !value?.trim() ? 'Ticket price is required for paid events' : 
               formData.eventType === 'paid' && isNaN(Number(value)) ? 'Ticket price must be a number' : '';
      case 'ticketType':
        return !value ? 'Ticket type is required' : '';
      case 'numberOfMaxTicketsPerOccurrence':
        return value?.trim() && (isNaN(Number(value)) || Number(value) <= 0) ? 'Number of max tickets must be a positive number' : '';
      case 'bookingClosesBeforeHrs':
        return !value?.trim() ? 'Booking closes before hours is required' : 
               isNaN(Number(value)) || Number(value) < 0 ? 'Booking closes before hours must be a positive number' : '';
      case 'refundPolicy':
        return !value ? 'Refund policy is required' : '';
      case 'cancellationPolicy':
        return !value ? 'Cancellation policy is required' : '';
      case 'emergencyContactNumber':
        return !value?.trim() ? 'Emergency contact is required' : 
               !/^\d{10}$/.test(value.replace(/\D/g, '')) ? 'Emergency contact must be 10 digits' : '';
      case 'hasLiabilityInsurance':
        return !value ? 'Please select insurance option' : '';
      default:
        return '';
    }
  };

  // Real-time validation handler
  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Validate field in real-time
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };


  // Show loading while checking business verification
  if (isLoadingVerification) {
    return (
      <div className="min-h-screen bg-brand-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
          <p className="text-brand-dark-600">Checking verification status...</p>
        </div>
      </div>
    );
  }


  const steps = [
    { id: 1, name: 'Experience Category', description: 'Type & scheduling details', completed: false },
    { id: 2, name: 'Location Settings', description: 'Venue & itinerary details', completed: false },
    { id: 3, name: 'Pricing & Inclusions', description: 'Tickets & additional services', completed: false },
    { id: 4, name: 'Operational & Safety', description: 'Insurance & media', completed: false },
    { id: 5, name: 'Review & Submit', description: 'Final review & terms', completed: false },
  ];

  const handleNext = async () => {
    // ALL mandatory fields validation
    let step2Fields = ['eventName', 'description', 'primaryCategory', 'subCategory', 'recurrenceType', 'timeSlots'];
    if (formData.recurrenceType === 'weekly') {
      step2Fields.push('daysOfWeek');
    }
    
    let step3Fields = ['locationType'];
    if (formData.locationType === 'fixed') {
      step3Fields.push('address');
    }
    
    const requiredFields = {
      1: step2Fields,
      2: step3Fields,
      3: ['eventType', 'ticketType', 'bookingClosesBeforeHrs', 'refundPolicy', 'cancellationPolicy'],
      4: ['emergencyContactNumber', 'hasLiabilityInsurance']
    };

    const fieldsToValidate = (requiredFields as any)[currentStep] || [];
    const newErrors: {[key: string]: string} = {};
    
    fieldsToValidate.forEach((field: string) => {
      const value = (formData as any)[field];
      if (!value || (Array.isArray(value) && value.length === 0) || value.trim?.() === '') {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      setTimeout(() => {
        const firstField = Object.keys(newErrors)[0];
        const element = document.getElementById(firstField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
      return;
    }

    setErrors({});
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitSuccess('');

    try {
      console.log('Submitting recurring event form:', formData);
      
      const result = await RecurringEventService.createRecurringEvent(formData);
      
      if (result.success) {
        setSubmitSuccess(result.message || 'Recurring event created successfully!');
        showToasterMessage('Recurring event created successfully!');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        console.error('Recurring event creation failed:', result.error);
        showToasterMessage(result.error || 'Failed to create recurring event');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToasterMessage('An unexpected error occurred while creating the recurring event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    // Start from step 1 now (Experience Category) since we removed Business Info step
    const minStep = 1;
    if (currentStep > minStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      timeSlots: [...formData.timeSlots, { startTime: null, endTime: null }]
    });
  };

  const removeTimeSlot = (index: number) => {
    const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      timeSlots: newTimeSlots
    });
  };

  const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: Date | null) => {
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots[index][field] = value;
    handleFieldChange('timeSlots', newTimeSlots);
  };

  const addItineraryItem = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { location: '', description: '', duration: '' }]
    });
  };

  const removeItineraryItem = (index: number) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      itinerary: newItinerary
    });
  };

  const updateItineraryItem = (index: number, field: 'location' | 'description' | 'duration', value: string) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index][field] = value;
    setFormData({
      ...formData,
      itinerary: newItinerary
    });
  };


  const addAddOnService = () => {
    setFormData({
      ...formData,
      addOnServices: [...formData.addOnServices, { name: '', price: '' }]
    });
  };

  const removeAddOnService = (index: number) => {
    const newAddOnServices = formData.addOnServices.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      addOnServices: newAddOnServices
    });
  };

  const updateAddOnService = (index: number, field: 'name' | 'price', value: string) => {
    const newAddOnServices = [...formData.addOnServices];
    newAddOnServices[index][field] = value;
    setFormData({
      ...formData,
      addOnServices: newAddOnServices
    });
  };


  const handleMultipleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData({
        ...formData,
        experiencePhotos: [...formData.experiencePhotos, ...fileArray]
      });

      // Upload files and get URLs
      const uploadPromises = fileArray.map(async (file) => {
        try {
          const result = await RecurringEventService.uploadExperiencePhoto(file);
          return result.success ? result.url : null;
        } catch (error) {
          console.error('Photo upload failed:', error);
          return null;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => url !== null);
      
      if (validUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          experiencePhotoUrls: [...(prev.experiencePhotoUrls || []), ...validUrls]
        }));
        
        showToasterMessage(`${validUrls.length} photo(s) uploaded successfully!`);
      }
    }
  };

  const removeExperiencePhoto = (index: number) => {
    const newPhotos = formData.experiencePhotos.filter((_, i) => i !== index);
    const newUrls = formData.experiencePhotoUrls?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      experiencePhotos: newPhotos,
      experiencePhotoUrls: newUrls
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Embedded requirements page for unverified users
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-brand-dark-900 mb-4">Business Verification Required</h1>
              <p className="text-lg text-brand-dark-600">Complete your business verification to create experiences</p>
            </div>

            {/* Requirements Card */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Required Information:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3 text-amber-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm">Business name & registration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm">Website or social media link</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm">Registered business address</span>
                  </div>
                </div>
                <div className="space-y-3 text-amber-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm">Contact person details</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm">Bank account information</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm">Identity verification documents</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                After Verification:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 text-green-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-sm">Create unlimited experiences</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-sm">Receive bookings & payments</span>
                  </div>
                </div>
                <div className="space-y-2 text-green-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-sm">Verified business badge</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-sm">Priority customer support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Estimate */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 text-sm">
                ⏱️ <strong>5-10 minutes to complete</strong> • Verification within 1-2 business days
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  showToasterMessage('Redirecting to Settings...');
                  setTimeout(() => {
                    navigate('/edit-profile?section=business');
                  }, 1500);
                }}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Go to Settings & Complete Verification</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-10">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-blue-500 to-brand-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1M8 7h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark-900 mb-4">Category of Experience</h2>
              <p className="text-lg text-brand-dark-600">Define your experience type and scheduling</p>
            </div>

            <div className="space-y-6">
              {/* Event Name - ADDED */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="eventName"
                  type="text"
                  value={formData.eventName || ''}
                  onChange={(e) => handleFieldChange('eventName', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.eventName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter your event/experience name"
                  required
                />
                {errors.eventName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.eventName}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Describe your event/experience in detail"
                  rows={4}
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Primary Category */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  Primary Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="primaryCategory"
                  value={formData.primaryCategory}
                  onChange={(e) => handleFieldChange('primaryCategory', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.primaryCategory ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  required
                >
                  <option value="">Select primary category</option>
                  <option value="adventure">Adventure & Outdoor</option>
                  <option value="cultural">Cultural & Heritage</option>
                  <option value="food">Food & Culinary</option>
                  <option value="wellness">Wellness & Health</option>
                  <option value="art">Art & Craft</option>
                  <option value="photography">Photography</option>
                  <option value="music">Music & Performance</option>
                  <option value="nature">Nature & Wildlife</option>
                  <option value="educational">Educational</option>
                  <option value="other">Other</option>
                </select>
                {errors.primaryCategory && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.primaryCategory}
                  </p>
                )}
              </div>

              {/* Sub Category */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  Sub Category <span className="text-red-500">*</span>
                </label>
                <input
                  id="subCategory"
                  type="text"
                  value={formData.subCategory}
                  onChange={(e) => handleFieldChange('subCategory', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.subCategory ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Hiking, Cooking Classes, Pottery Workshop"
                />
                {errors.subCategory && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.subCategory}
                  </p>
                )}
              </div>

              {/* Recurrence and Type */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  Recurrence Type <span className="text-red-500">*</span>
                </label>
<div id="recurrenceType">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'daily', label: 'Daily', desc: 'Every day or specific days' },
                    { value: 'weekly', label: 'Weekly', desc: 'Every week on selected days' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleFieldChange('recurrenceType', option.value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        formData.recurrenceType === option.value
                          ? 'border-brand-blue-500 bg-brand-blue-50'
                          : errors.recurrenceType ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-semibold ${
                        formData.recurrenceType === option.value ? 'text-brand-blue-700' : 'text-brand-dark-900'
                      }`}>{option.label}</div>
                      <div className={`text-sm ${
                        formData.recurrenceType === option.value ? 'text-brand-blue-600' : 'text-brand-dark-600'
                      }`}>{option.desc}</div>
                    </button>
                  ))}
                </div>
                {errors.recurrenceType && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.recurrenceType}
                  </p>
                )}
                </div>
              </div>

              {/* Days of Week - Show only when recurrence type is Weekly */}
              {formData.recurrenceType === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                    Days of Week <span className="text-red-500">*</span>
                  </label>
<div id="daysOfWeek">
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const newDays = formData.daysOfWeek.includes(day)
                          ? formData.daysOfWeek.filter(d => d !== day)
                          : [...formData.daysOfWeek, day];
                        handleFieldChange('daysOfWeek', newDays);
                      }}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                        formData.daysOfWeek.includes(day)
                          ? 'border-brand-blue-500 bg-brand-blue-50 text-brand-blue-700'
                          : errors.daysOfWeek ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 text-brand-dark-700'
                      }`}
                    >
                      <div className="text-sm font-medium">{day.slice(0, 3)}</div>
                    </button>
                  ))}
                </div>
                {errors.daysOfWeek && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.daysOfWeek}
                  </p>
                )}
                </div>
                </div>
              )}

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  Time Slots <span className="text-red-500">*</span>
                </label>
                <div id="timeSlots" className="space-y-4">
                  {formData.timeSlots.map((slot, index) => (
                    <div key={index} className={`flex items-center space-x-4 ${
                      errors.timeSlots ? 'border border-red-500 bg-red-50 rounded-xl p-4' : ''
                    }`}>
                      <div className="flex-1">
                        <label className="block text-sm text-brand-dark-600 mb-1">Start Time</label>
                        <TimePicker
                          value={slot.startTime}
                          onChange={(newValue) => updateTimeSlot(index, 'startTime', newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  backgroundColor: 'white',
                                },
                              },
                            },
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-brand-dark-600 mb-1">End Time</label>
                        <TimePicker
                          value={slot.endTime}
                          onChange={(newValue) => updateTimeSlot(index, 'endTime', newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  backgroundColor: 'white',
                                },
                              },
                            },
                          }}
                        />
                      </div>
                      {formData.timeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="px-3 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 mt-6"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="flex items-center text-brand-blue-600 hover:text-brand-blue-700 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Another Time Slot
                  </button>
                </div>
                {errors.timeSlots && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.timeSlots}
                  </p>
                )}
              </div>

            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-10">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-blue-500 to-brand-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark-900 mb-4">Location Settings</h2>
              <p className="text-lg text-brand-dark-600">Configure your experience locations and itinerary</p>
            </div>

            <div className="space-y-6">
              {/* Location Type */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  Location Type <span className="text-red-500">*</span>
                </label>
                <div id="locationType" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'fixed', label: 'Fixed Location', desc: 'Same venue every time' },
                    { value: 'itinerary', label: 'Itinerary Builder', desc: 'Multiple locations in sequence' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleFieldChange('locationType', option.value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        formData.locationType === option.value
                          ? 'border-brand-blue-500 bg-brand-blue-50'
                          : errors.locationType ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-semibold ${
                        formData.locationType === option.value ? 'text-brand-blue-700' : 'text-brand-dark-900'
                      }`}>{option.label}</div>
                      <div className={`text-sm ${
                        formData.locationType === option.value ? 'text-brand-blue-600' : 'text-brand-dark-600'
                      }`}>{option.desc}</div>
                    </button>
                  ))}
                </div>
                {errors.locationType && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.locationType}
                  </p>
                )}
              </div>

              {/* Address - Show only if Fixed Location is selected */}
              {formData.locationType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                      errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Enter the complete address for your fixed location"
                    rows={3}
                    required
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>
              )}

              {/* Itinerary Builder - Show only if itinerary type is selected */}
              {formData.locationType === 'itinerary' && (
                <div>
                  <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                    Itinerary Builder
                  </label>
                  <div className="space-y-4">
                    {formData.itinerary.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-brand-dark-600 mb-1">Location</label>
                            <input
                              type="text"
                              value={item.location}
                              onChange={(e) => updateItineraryItem(index, 'location', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                              placeholder="Location name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-brand-dark-600 mb-1">Duration</label>
                            <input
                              type="text"
                              value={item.duration}
                              onChange={(e) => updateItineraryItem(index, 'duration', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                              placeholder="e.g., 2 hours"
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-sm text-brand-dark-600 mb-1">Actions</label>
                            {formData.itinerary.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItineraryItem(index)}
                                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm text-brand-dark-600 mb-1">Description</label>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateItineraryItem(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                            placeholder="What happens at this location?"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addItineraryItem}
                      className="flex items-center text-brand-blue-600 hover:text-brand-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Location to Itinerary
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-10">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-blue-500 to-brand-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark-900 mb-4">Pricing & Inclusions</h2>
              <p className="text-lg text-brand-dark-600">Set your pricing and additional services</p>
            </div>

            <div className="space-y-6">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <div id="eventType" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'paid', label: 'Paid Experience', desc: 'Charge participants for the experience' },
                    { value: 'free', label: 'Free Experience', desc: 'No charge for participants' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleFieldChange('eventType', option.value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        formData.eventType === option.value
                          ? 'border-brand-blue-500 bg-brand-blue-50'
                          : errors.eventType ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-semibold ${
                        formData.eventType === option.value ? 'text-brand-blue-700' : 'text-brand-dark-900'
                      }`}>{option.label}</div>
                      <div className={`text-sm ${
                        formData.eventType === option.value ? 'text-brand-blue-600' : 'text-brand-dark-600'
                      }`}>{option.desc}</div>
                    </button>
                  ))}
                </div>
                {errors.eventType && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.eventType}
                  </p>
                )}
              </div>

              {/* Ticket Price Per Person - Show only if paid */}
              {formData.eventType === 'paid' && (
                <div>
                  <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                    Ticket Price Per Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.ticketPricePerPerson}
                    onChange={(e) => handleFieldChange('ticketPricePerPerson', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter price in ₹"
                  />
                </div>
              )}

              {/* Ticket Type */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  Ticket Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="ticketType"
                  value={formData.ticketType}
                  onChange={(e) => handleFieldChange('ticketType', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.ticketType ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select ticket type</option>
                  <option value="individual">Individual Booking</option>
                  <option value="group">Group Booking</option>
                  <option value="both">Both Individual & Group</option>
                </select>
                {errors.ticketType && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.ticketType}
                  </p>
                )}
              </div>

              {/* Add-on Services */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  Add-on Services
                </label>
                <div className="space-y-4">
                  {formData.addOnServices.map((service, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateAddOnService(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                          placeholder="Service name (e.g., Photography, Lunch)"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => updateAddOnService(index, 'price', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                          placeholder="Price ₹"
                        />
                      </div>
                      {formData.addOnServices.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddOnService(index)}
                          className="px-3 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAddOnService}
                    className="flex items-center text-brand-blue-600 hover:text-brand-blue-700 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Service
                  </button>
                </div>
              </div>

              {/* Number of Max Tickets per Occurrence */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                  Number of Max Tickets per Occurrence
                </label>
                <input
                  id="numberOfMaxTicketsPerOccurrence"
                  type="number"
                  min="1"
                  value={formData.numberOfMaxTicketsPerOccurrence}
                  onChange={(e) => handleFieldChange('numberOfMaxTicketsPerOccurrence', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.numberOfMaxTicketsPerOccurrence ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Maximum number of tickets available per occurrence (optional)"
                />
                {errors.numberOfMaxTicketsPerOccurrence && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.numberOfMaxTicketsPerOccurrence}
                  </p>
                )}
              </div>

              {/* Booking Closes Before Hrs */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                  Booking Closes Before Hrs <span className="text-red-500">*</span>
                </label>
                <input
                  id="bookingClosesBeforeHrs"
                  type="number"
                  min="0"
                  value={formData.bookingClosesBeforeHrs}
                  onChange={(e) => handleFieldChange('bookingClosesBeforeHrs', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.bookingClosesBeforeHrs ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Number of hours before event starts (e.g., 2, 24, 48)"
                />
                {errors.bookingClosesBeforeHrs && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.bookingClosesBeforeHrs}
                  </p>
                )}
              </div>

              {/* Early Bird Coupon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                    Early Bird Coupon Code
                  </label>
                  <input
                    type="text"
                    value={formData.earlyBirdCouponCode}
                    onChange={(e) => setFormData({...formData, earlyBirdCouponCode: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="EARLY20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                    Early Bird Discount
                  </label>
                  <input
                    type="text"
                    value={formData.earlyBirdDiscount}
                    onChange={(e) => setFormData({...formData, earlyBirdDiscount: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="20% or ₹100"
                  />
                </div>
              </div>

              {/* Policies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                    Refund Policy <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="refundPolicy"
                    value={formData.refundPolicy}
                    onChange={(e) => handleFieldChange('refundPolicy', e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                      errors.refundPolicy ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select refund policy</option>
                    <option value="no-refund">No Refund</option>
                    <option value="24hr-full">24 Hour Full Refund</option>
                    <option value="48hr-full">48 Hour Full Refund</option>
                    <option value="72hr-full">72 Hour Full Refund</option>
                  </select>
                  {errors.refundPolicy && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.refundPolicy}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                    Cancellation Policy <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="cancellationPolicy"
                    value={formData.cancellationPolicy}
                    onChange={(e) => handleFieldChange('cancellationPolicy', e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                      errors.cancellationPolicy ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select cancellation policy</option>
                    <option value="flexible">Flexible - Cancel anytime</option>
                    <option value="moderate">Moderate - 24hr notice</option>
                    <option value="strict">Strict - 48hr notice</option>
                  </select>
                  {errors.cancellationPolicy && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.cancellationPolicy}
                    </p>
                  )}
                </div>
              </div>

              {/* Custom Note */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                  Custom Note
                </label>
                <textarea
                  value={formData.customNote}
                  onChange={(e) => setFormData({...formData, customNote: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Any special instructions or information for participants..."
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-10">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-blue-500 to-brand-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark-900 mb-4">Operational & Safety</h2>
              <p className="text-lg text-brand-dark-600">Safety measures and experience media</p>
            </div>

            <div className="space-y-6">
              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                  Emergency Contact Number for Events <span className="text-red-500">*</span>
                </label>
                <input
                  id="emergencyContactNumber"
                  type="tel"
                  value={formData.emergencyContactNumber}
                  onChange={(e) => handleFieldChange('emergencyContactNumber', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 focus:border-brand-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.emergencyContactNumber ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="+91 XXXXX XXXXX"
                />
                {errors.emergencyContactNumber && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.emergencyContactNumber}
                  </p>
                )}
              </div>

              {/* Liability Insurance */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  Do you have liability insurance for your experience? <span className="text-red-500">*</span>
                </label>
                <div id="hasLiabilityInsurance" className="space-y-3">
                  {[
                    { value: 'yes', label: 'Yes, I have liability insurance' },
                    { value: 'no', label: 'No, I don\'t have liability insurance' },
                    { value: 'planning', label: 'I\'m planning to get insurance' }
                  ].map(option => (
                    <label key={option.value} className={`flex items-center p-4 border rounded-xl hover:bg-gray-50 ${
                      errors.hasLiabilityInsurance ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="hasLiabilityInsurance"
                        value={option.value}
                        checked={formData.hasLiabilityInsurance === option.value}
                        onChange={(e) => handleFieldChange('hasLiabilityInsurance', e.target.value)}
                        className="mr-3"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.hasLiabilityInsurance && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.hasLiabilityInsurance}
                  </p>
                )}
              </div>

              {/* Experience Photos */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                  Experience Photos
                </label>
                <p className="text-brand-dark-600 mb-4">Upload photos that showcase your experience</p>
                
                <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-brand-blue-500 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleFileUpload}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-gray-600">
                      Upload multiple photos (JPG, PNG)
                    </span>
                  </div>
                </label>

                {/* Display uploaded photos */}
                {formData.experiencePhotos.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Uploaded Photos:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.experiencePhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Experience ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeExperiencePhoto(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">{photo.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-10">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark-900 mb-4">Review & Submit</h2>
              <p className="text-lg text-brand-dark-600">Final review of your recurring experience</p>
            </div>

            <div className="space-y-6">
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
                    <span className="font-medium">I agree to TrippeChalo's Terms of Service for Recurring Experiences <span className="text-red-500">*</span></span> and understand that:
                    <ul className="mt-2 space-y-1 ml-4 list-disc">
                      <li>I'm responsible for delivering consistent quality experiences</li>
                      <li>TrippeChalo will collect a 5% platform fee on paid experiences</li>
                      <li>I'll maintain professional communication with all participants</li>
                      <li>I'll provide adequate safety measures for recurring activities</li>
                      <li>Refunds and cancellations will be processed according to stated policies</li>
                    </ul>
                  </div>
                </label>
              </div>

              {/* Benefits of Recurring Experiences */}
              <div className="bg-gradient-to-r from-brand-green-50 to-brand-blue-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-brand-dark-900 mb-4">
                  Benefits of Recurring Experiences
                </h3>
                <ul className="space-y-2 text-brand-dark-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green-600 rounded-full mr-3"></div>
                    Build a loyal community of participants
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green-600 rounded-full mr-3"></div>
                    Predictable recurring revenue stream
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green-600 rounded-full mr-3"></div>
                    Enhanced visibility in search results
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green-600 rounded-full mr-3"></div>
                    Automated scheduling and booking management
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green-600 rounded-full mr-3"></div>
                    Access to analytics and participant insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-blue-600 via-brand-blue-700 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Create Experience</h1>
              <p className="text-blue-100 text-lg">Build sustainable revenue with recurring bookings</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200 mb-1">Step {Math.max(currentStep, 1)} of {steps.length}</div>
              <div className="text-2xl font-bold">{Math.round((Math.max(currentStep, 1) / steps.length) * 100)}%</div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              // Map currentStep (0-5) to visual steps (1-5)
              // Step 0 (business verification) maps to step 1 in visual
              const visualCurrentStep = Math.max(currentStep, 1);
              
              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className="flex items-center w-full">
                    <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      visualCurrentStep > step.id 
                        ? 'bg-white border-white text-brand-blue-600' 
                        : visualCurrentStep === step.id 
                        ? 'bg-brand-blue-500 border-white text-white ring-4 ring-white/30' 
                        : 'bg-transparent border-white/40 text-white/60'
                    }`}>
                      {visualCurrentStep > step.id ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-semibold">{step.id}</span>
                      )}
                    </div>

                    <div className="ml-3 flex-1">
                      <div className={`text-sm font-semibold transition-colors ${
                        visualCurrentStep >= step.id ? 'text-white' : 'text-white/60'
                      }`}>
                        {step.name}
                      </div>
                      <div className={`text-xs transition-colors ${
                        visualCurrentStep >= step.id ? 'text-blue-100' : 'text-white/40'
                      }`}>
                        {step.description}
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div className={`h-0.5 w-8 mx-4 transition-all duration-300 ${
                        visualCurrentStep > step.id ? 'bg-white' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            {/* Success Messages */}
            {submitSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                {submitSuccess}
              </div>
            )}

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className={`flex items-center mt-6 pt-4 border-t border-gray-100 ${
              currentStep <= 1 ? 'justify-end' : 'justify-between'
            }`}>
              {/* Previous button only shows on steps 2 and above */}
              {currentStep >= 2 && (
                <button
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 text-lg bg-gray-200 text-brand-dark-700 hover:bg-gray-300 hover:shadow-md transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={(currentStep === 5 && !formData.agreeToTerms) || isSubmitting}
                className={`
                  flex items-center space-x-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 text-lg
                  ${(currentStep === 5 && !formData.agreeToTerms) || isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : currentStep === 5
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gradient-to-r from-brand-blue-500 to-brand-blue-600 text-white hover:from-brand-blue-600 hover:to-brand-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }
                `}
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>
                  {isSubmitting 
                    ? 'Creating Experience...' 
                    : currentStep === 5 
                    ? 'Submit Experience' 
                    : 'Continue'
                  }
                </span>
                {!isSubmitting && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toaster Notification */}
      <ToasterNotification
        isVisible={showToaster}
        message={toasterMessage}
        type="info"
        onClose={() => setShowToaster(false)}
      />
    </div>
  );
};