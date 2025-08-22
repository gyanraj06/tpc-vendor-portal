import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Loader2 } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { EventService } from '../../services/eventService';

export const CreateEventPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    // Page 1
    eventName: '',
    tagline: '',
    category: '',
    eventFormat: '',
    shortDescription: '',
    longDescription: '',
    date: null as Date | null,
    startTime: null as Date | null,
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

  // Real-time field validation
  const validateField = (fieldName: string, value: any) => {
    const errors = { ...fieldErrors };
    
    switch (fieldName) {
      case 'eventName':
        if (!value.trim()) {
          errors[fieldName] = 'Event name is required';
        } else if (value.length > 60) {
          errors[fieldName] = 'Event name must be 60 characters or less';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'tagline':
        if (!value.trim()) {
          errors[fieldName] = 'Tagline is required';
        } else if (value.length > 30) {
          errors[fieldName] = 'Tagline must be 30 characters or less';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'category':
        if (!value) {
          errors[fieldName] = 'Category is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'eventFormat':
        if (!value) {
          errors[fieldName] = 'Event format is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'shortDescription':
        if (!value.trim()) {
          errors[fieldName] = 'Short description is required';
        } else {
          const charCount = value.trim().length;
          if (charCount < 200 || charCount > 600) {
            errors[fieldName] = 'Short description must be 200-600 characters';
          } else {
            delete errors[fieldName];
          }
        }
        break;
      case 'longDescription':
        if (!value.trim()) {
          errors[fieldName] = 'Long description is required';
        } else {
          const charCount = value.trim().length;
          if (charCount < 500 || charCount > 2000) {
            errors[fieldName] = 'Long description must be 500-2000 characters';
          } else {
            delete errors[fieldName];
          }
        }
        break;
      case 'date':
        if (!value) {
          errors[fieldName] = 'Event date is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'startTime':
        if (!value) {
          errors[fieldName] = 'Start time is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'duration':
        if (!value.trim()) {
          errors[fieldName] = 'Duration is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'city':
        if (!value.trim()) {
          errors[fieldName] = 'City is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'state':
        if (!value.trim()) {
          errors[fieldName] = 'State is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'venue':
        if (!value.trim()) {
          errors[fieldName] = 'Venue is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'fullAddress':
        if (!value.trim()) {
          errors[fieldName] = 'Full address is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'landmark':
        if (!value.trim()) {
          errors[fieldName] = 'Landmark is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'pricingType':
        if (!value) {
          errors[fieldName] = 'Pricing type is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'fixedPrice':
        if (formData.pricingType === 'fixed' && !value.trim()) {
          errors[fieldName] = 'Fixed price is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'googleMapLink':
        if (!value.trim()) {
          errors[fieldName] = 'Google Map link is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'bannerImage':
        if (!value.trim() && !formData.bannerFile) {
          errors[fieldName] = 'Banner image is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'contactNumber':
        if (!value.trim()) {
          errors[fieldName] = 'Contact number is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'contactName':
        if (!value.trim()) {
          errors[fieldName] = 'Contact name is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'maxParticipants':
        if (!value.trim()) {
          errors[fieldName] = 'Maximum participants is required';
        } else if (parseInt(value) < 10) {
          errors[fieldName] = 'Minimum 10 participants required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'beneficiaryName':
        if (!value.trim()) {
          errors[fieldName] = 'Beneficiary name is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'accountType':
        if (!value) {
          errors[fieldName] = 'Account type is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'bankName':
        if (!value.trim()) {
          errors[fieldName] = 'Bank name is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'accountNumber':
        if (!value.trim()) {
          errors[fieldName] = 'Account number is required';
        } else if (!/^\d{9,18}$/.test(value)) {
          errors[fieldName] = 'Account number must be 9-18 digits only';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'bankIFSC':
        if (!value.trim()) {
          errors[fieldName] = 'Bank IFSC is required';
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
          errors[fieldName] = 'Invalid IFSC format (4 letters + 0 + 6 alphanumeric)';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'panNumber':
        if (!value.trim()) {
          errors[fieldName] = 'PAN number is required';
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          errors[fieldName] = 'Invalid PAN format (5 letters + 4 numbers + 1 letter)';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'gstinNumber':
        if (value.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
          errors[fieldName] = 'Invalid GSTIN format';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'upiId':
        if (value.trim() && !/^[a-zA-Z0-9._]{2,256}@[a-zA-Z]{2,64}$/.test(value)) {
          errors[fieldName] = 'Invalid UPI ID format';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'refundPolicy':
        if (!value) {
          errors[fieldName] = 'Refund policy is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'needContentHelp':
        if (!value) {
          errors[fieldName] = 'Content help preference is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'needCreatorCollaboration':
        if (!value) {
          errors[fieldName] = 'Creator collaboration preference is required';
        } else {
          delete errors[fieldName];
        }
        break;
      case 'languagesSpoken':
        if (!value.trim()) {
          errors[fieldName] = 'Languages spoken by host is required';
        } else {
          delete errors[fieldName];
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(errors);
  };

  // Validate all current step fields on continue
  const validateCurrentStepFields = () => {
    let newErrors: {[key: string]: string} = {};
    
    if (currentStep === 1) {
      // Validate all step 1 required fields
      if (!formData.eventName.trim()) {
        newErrors.eventName = 'Event name is required';
      } else if (formData.eventName.length > 60) {
        newErrors.eventName = 'Event name must be 60 characters or less';
      }
      
      if (!formData.tagline.trim()) {
        newErrors.tagline = 'Tagline is required';
      } else if (formData.tagline.length > 30) {
        newErrors.tagline = 'Tagline must be 30 characters or less';
      }
      
      if (!formData.category) {
        newErrors.category = 'Category is required';
      }
      
      if (!formData.eventFormat) {
        newErrors.eventFormat = 'Event format is required';
      }
      
      if (!formData.shortDescription.trim()) {
        newErrors.shortDescription = 'Short description is required';
      } else {
        const charCount = formData.shortDescription.trim().length;
        if (charCount < 200 || charCount > 600) {
          newErrors.shortDescription = 'Short description must be 200-600 characters';
        }
      }
      
      if (!formData.longDescription.trim()) {
        newErrors.longDescription = 'Long description is required';
      } else {
        const charCount = formData.longDescription.trim().length;
        if (charCount < 500 || charCount > 2000) {
          newErrors.longDescription = 'Long description must be 500-2000 characters';
        }
      }
      
      if (!formData.date) {
        newErrors.date = 'Event date is required';
      }
      
      if (!formData.startTime) {
        newErrors.startTime = 'Start time is required';
      }
      
      if (!formData.duration.trim()) {
        newErrors.duration = 'Duration is required';
      }
      
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      
      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
      }
      
      if (!formData.venue.trim()) {
        newErrors.venue = 'Venue is required';
      }
      
      if (!formData.fullAddress.trim()) {
        newErrors.fullAddress = 'Full address is required';
      }
      
      if (!formData.landmark.trim()) {
        newErrors.landmark = 'Landmark is required';
      }
      
      if (!formData.pricingType) {
        newErrors.pricingType = 'Pricing type is required';
      }
      
      if (formData.pricingType === 'fixed' && !formData.fixedPrice.trim()) {
        newErrors.fixedPrice = 'Fixed price is required';
      }
      
      if (formData.pricingType === 'tiered') {
        if (formData.tiers.length < 2) {
          newErrors.tiers = 'Minimum 2 tiers required';
        } else {
          formData.tiers.forEach((tier, index) => {
            if (!tier.name.trim()) {
              newErrors[`tier_${index}_name`] = `Tier ${index + 1} name is required`;
            }
            if (!tier.price.trim()) {
              newErrors[`tier_${index}_price`] = `Tier ${index + 1} price is required`;
            }
          });
        }
      }
      
      if (!formData.googleMapLink.trim()) {
        newErrors.googleMapLink = 'Google Map link is required';
      }
      
      if (!formData.bannerImage.trim() && !formData.bannerFile) {
        newErrors.bannerImage = 'Banner image is required';
      }
      
      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required';
      }
      
      if (!formData.contactName.trim()) {
        newErrors.contactName = 'Contact name is required';
      }
    } else if (currentStep === 2) {
      // Validate step 2 fields
      if (!formData.beneficiaryName.trim()) {
        newErrors.beneficiaryName = 'Beneficiary name is required';
      }
      
      if (!formData.accountType) {
        newErrors.accountType = 'Account type is required';
      }
      
      if (!formData.bankName.trim()) {
        newErrors.bankName = 'Bank name is required';
      }
      
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
        newErrors.accountNumber = 'Account number must be 9-18 digits only';
      }
      
      if (!formData.bankIFSC.trim()) {
        newErrors.bankIFSC = 'Bank IFSC is required';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankIFSC)) {
        newErrors.bankIFSC = 'Invalid IFSC format (4 letters + 0 + 6 alphanumeric)';
      }
      
      if (!formData.panNumber.trim()) {
        newErrors.panNumber = 'PAN number is required';
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
        newErrors.panNumber = 'Invalid PAN format (5 letters + 4 numbers + 1 letter)';
      }
      
      if (formData.gstinNumber.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstinNumber)) {
        newErrors.gstinNumber = 'Invalid GSTIN format';
      }
      
      if (formData.upiId.trim() && !/^[a-zA-Z0-9._]{2,256}@[a-zA-Z]{2,64}$/.test(formData.upiId)) {
        newErrors.upiId = 'Invalid UPI ID format';
      }
      
      if (!formData.maxParticipants.trim()) {
        newErrors.maxParticipants = 'Maximum participants is required';
      } else if (parseInt(formData.maxParticipants) < 10) {
        newErrors.maxParticipants = 'Minimum 10 participants required';
      }
      
      if (!formData.refundPolicy) {
        newErrors.refundPolicy = 'Refund policy is required';
      }
    } else if (currentStep === 3) {
      // Validate step 3 fields
      if (!formData.needContentHelp) {
        newErrors.needContentHelp = 'Content help preference is required';
      }
      
      if (!formData.needCreatorCollaboration) {
        newErrors.needCreatorCollaboration = 'Creator collaboration preference is required';
      }
    } else if (currentStep === 4) {
      // Validate step 4 fields
      if (!formData.languagesSpoken.trim()) {
        newErrors.languagesSpoken = 'Languages spoken by host is required';
      }
    }
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation functions
  /*const validateStep1 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Basic validations
    if (!formData.eventName.trim()) errors.push('Event name is required');
    else if (formData.eventName.length > 60) errors.push('Event name must be 60 characters or less');
    
    if (!formData.tagline.trim()) errors.push('Tagline is required');
    else if (formData.tagline.length > 30) errors.push('Tagline must be 30 characters or less');
    
    if (!formData.category) errors.push('Category is required');
    if (!formData.eventFormat) errors.push('Event format is required');
    
    // Description validations
    if (!formData.shortDescription.trim()) errors.push('Short description is required');
    else {
      const wordCount = formData.shortDescription.trim().split(/\s+/).length;
      if (wordCount < 40 || wordCount > 120) errors.push('Short description must be 40-120 words');
    }
    
    if (!formData.longDescription.trim()) errors.push('Long description is required');
    else {
      const wordCount = formData.longDescription.trim().split(/\s+/).length;
      if (wordCount < 100 || wordCount > 1000) errors.push('Long description must be 100-1000 words');
    }
    
    // Date and time
    if (!formData.date) errors.push('Event date is required');
    if (!formData.startTime) errors.push('Start time is required');
    if (!formData.duration.trim()) errors.push('Duration is required');
    
    // Location
    if (!formData.city.trim()) errors.push('City is required');
    if (!formData.state.trim()) errors.push('State is required');
    if (!formData.venue.trim()) errors.push('Venue is required');
    if (!formData.fullAddress.trim()) errors.push('Full address is required');
    if (!formData.landmark.trim()) errors.push('Landmark is required');
    
    // Pricing
    if (!formData.pricingType) errors.push('Pricing type is required');
    if (formData.pricingType === 'fixed') {
      if (!formData.fixedPrice.trim()) errors.push('Fixed price is required');
    } else if (formData.pricingType === 'tiered') {
      if (formData.tiers.length < 2) errors.push('Minimum 2 tiers required');
      formData.tiers.forEach((tier, index) => {
        if (!tier.name.trim()) errors.push(`Tier ${index + 1} name is required`);
        if (!tier.price.trim()) errors.push(`Tier ${index + 1} price is required`);
      });
    }
    
    if (!formData.googleMapLink.trim()) errors.push('Google Map link is required');
    if (!formData.bannerImage.trim() && !formData.bannerFile) errors.push('Banner image is required');
    if (!formData.contactNumber.trim()) errors.push('Contact number is required');
    if (!formData.contactName.trim()) errors.push('Contact name is required');
    
    return { isValid: errors.length === 0, errors };
  };

  const validateStep2 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!formData.beneficiaryName.trim()) errors.push('Beneficiary name is required');
    if (!formData.accountType) errors.push('Account type is required');
    if (!formData.bankName.trim()) errors.push('Bank name is required');
    
    // Account number validation (9-18 digits)
    if (!formData.accountNumber.trim()) {
      errors.push('Account number is required');
    } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
      errors.push('Account number must be 9-18 digits only');
    }
    
    // IFSC validation (11 chars, 5th char must be 0)
    if (!formData.bankIFSC.trim()) {
      errors.push('Bank IFSC is required');
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankIFSC)) {
      errors.push('Invalid IFSC format (4 letters + 0 + 6 alphanumeric)');
    }
    
    // PAN validation (10 chars)
    if (!formData.panNumber.trim()) {
      errors.push('PAN number is required');
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      errors.push('Invalid PAN format (5 letters + 4 numbers + 1 letter)');
    }
    
    // GSTIN validation (15 chars) - optional but if provided must be valid
    if (formData.gstinNumber.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstinNumber)) {
      errors.push('Invalid GSTIN format');
    }
    
    // UPI validation - optional but if provided must be valid
    if (formData.upiId.trim() && !/^[a-zA-Z0-9._]{2,256}@[a-zA-Z]{2,64}$/.test(formData.upiId)) {
      errors.push('Invalid UPI ID format');
    }
    
    // Max participants (minimum 10)
    if (!formData.maxParticipants.trim()) {
      errors.push('Maximum participants is required');
    } else if (parseInt(formData.maxParticipants) < 10) {
      errors.push('Minimum 10 participants required');
    }
    
    if (!formData.refundPolicy) errors.push('Refund policy is required');
    
    return { isValid: errors.length === 0, errors };
  };

  const validateStep3 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!formData.needContentHelp) errors.push('Content help preference is required');
    if (!formData.needCreatorCollaboration) errors.push('Creator collaboration preference is required');
    
    return { isValid: errors.length === 0, errors };
  };

  const validateStep4 = (): { isValid: boolean; errors: string[] } => {
    // Step 4 has no mandatory fields
    return { isValid: true, errors: [] };
  };

  const validateStep5 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!formData.agreeToTerms) errors.push('You must agree to the terms and conditions');
    
    return { isValid: errors.length === 0, errors };
  };*/


  const steps = [
    { id: 1, name: 'Basic Info', description: 'Event name, category & description', completed: false },
    { id: 2, name: 'Details', description: 'Location, timing & pricing', completed: false },
    { id: 3, name: 'Content', description: 'Media, contact & collaboration', completed: false },
    { id: 4, name: 'Settings', description: 'Preferences & accessibility', completed: false },
    { id: 5, name: 'Review', description: 'Final review & submission', completed: false },
  ];

  const handleNext = async () => {
    // Validate current step fields
    const isValid = validateCurrentStepFields();
    
    if (!isValid) {
      // Scroll to first error field after a brief delay
      setTimeout(() => {
        const firstErrorField = document.querySelector('.border-red-500');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
      return;
    }
    
    // If validation passed, proceed to next step
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
      // Upload banner file if present
      let bannerUrl = formData.bannerImage;
      if (formData.bannerFile) {
        const uploadResult = await EventService.uploadBannerFile(formData.bannerFile);
        if (uploadResult.success && uploadResult.url) {
          bannerUrl = uploadResult.url;
        } else {
          console.error('Failed to upload banner image:', uploadResult.error);
          setIsSubmitting(false);
          return;
        }
      }

      // Create event data with uploaded banner URL and formatted dates
      const eventDataWithBanner = {
        ...formData,
        date: formData.date ? formData.date.toISOString().split('T')[0] : '',
        startTime: formData.startTime ? formData.startTime.toLocaleTimeString('en-US', { hour12: false }) : '',
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
        console.error('Failed to create event:', result.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
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
      // Clear banner image error since file is uploaded
      validateField('bannerImage', 'file_uploaded');
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
    
    const durationHours = parseFloat(formData.duration);
    if (isNaN(durationHours)) return '';
    
    const endDate = new Date(formData.startTime);
    endDate.setMinutes(endDate.getMinutes() + (durationHours * 60));
    
    return endDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatStartTime = () => {
    if (!formData.startTime) return '';
    
    return formData.startTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-blue-500 to-brand-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark-900 mb-4">Let's start with the basics</h2>
              <p className="text-lg text-brand-dark-600">Tell us about your event so we can help you create an amazing listing</p>
            </div>

            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center mb-8">
                  <div className="w-8 h-8 bg-brand-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-brand-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-dark-900">Basic Information</h3>
                    <p className="text-brand-dark-600">What's your event all about?</p>
                  </div>
                </div>
                <div className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                  What's the name of your event? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => {
                    if (e.target.value.length <= 60) {
                      setFormData({...formData, eventName: e.target.value});
                      validateField('eventName', e.target.value);
                    }
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    fieldErrors.eventName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-brand-blue-500'
                  }`}
                  placeholder="e.g., Comedy Night with Local Stars"
                  maxLength={60}
                />
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">{formData.eventName.length}/60 characters</div>
                </div>
                {fieldErrors.eventName && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.eventName}</div>
                )}
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-3">
                  Got a catchy tagline or hashtag? <span className="text-red-500">*</span>
                </label>
                <p className="text-brand-dark-600 mb-4">This helps people remember your event</p>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => {
                    if (e.target.value.length <= 30) {
                      setFormData({...formData, tagline: e.target.value});
                      validateField('tagline', e.target.value);
                    }
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    fieldErrors.tagline ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-brand-blue-500'
                  }`}
                  placeholder="e.g., #LaughTillYouCry or An Unforgettable Evening"
                  maxLength={30}
                />
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">{formData.tagline.length}/30 characters</div>
                </div>
                {fieldErrors.tagline && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.tagline}</div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  What type of event is this? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { value: 'comedy', label: 'Comedy Show' },
                    { value: 'workshop', label: 'Workshop' },
                    { value: 'music', label: 'Music Event' },
                    { value: 'dance', label: 'Dance' },
                    { value: 'theater', label: 'Theater' },
                    { value: 'cultural', label: 'Cultural' },
                    { value: 'educational', label: 'Educational' },
                    { value: 'networking', label: 'Networking' },
                    { value: 'other', label: 'Other' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({...formData, category: option.value});
                        validateField('category', option.value);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                        formData.category === option.value
                          ? 'border-brand-blue-500 bg-brand-blue-50 text-brand-blue-700'
                          : fieldErrors.category
                          ? 'border-red-300 hover:border-red-400 text-brand-dark-700'
                          : 'border-gray-200 hover:border-gray-300 text-brand-dark-700'
                      }`}
                    >
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
                {fieldErrors.category && (
                  <div className="text-xs text-red-500 mt-2">{fieldErrors.category}</div>
                )}
              </div>

              {/* Event Format */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-900 mb-4">
                  How will people attend your event? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'offline', label: 'In-Person Only', desc: 'Physical venue, face-to-face experience' },
                    { value: 'online', label: 'Online/Virtual', desc: 'Join from anywhere via video call' },
                    { value: 'hybrid', label: 'Hybrid', desc: 'Both in-person and online options' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({...formData, eventFormat: option.value});
                        validateField('eventFormat', option.value);
                      }}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        formData.eventFormat === option.value
                          ? 'border-brand-blue-500 bg-brand-blue-50'
                          : fieldErrors.eventFormat
                          ? 'border-red-300 hover:border-red-400'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className={`font-semibold ${
                          formData.eventFormat === option.value ? 'text-brand-blue-700' : 'text-brand-dark-900'
                        }`}>{option.label}</div>
                        <div className={`text-sm ${
                          formData.eventFormat === option.value ? 'text-brand-blue-600' : 'text-brand-dark-600'
                        }`}>{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {fieldErrors.eventFormat && (
                  <div className="text-xs text-red-500 mt-2">{fieldErrors.eventFormat}</div>
                )}
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => {
                    setFormData({...formData, shortDescription: e.target.value});
                    validateField('shortDescription', e.target.value);
                  }}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${
                    fieldErrors.shortDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                  }`}
                  placeholder="Brief description of your event (200-600 characters)"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.shortDescription.trim().length}/600 characters (200-600 required)
                </div>
                {fieldErrors.shortDescription && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.shortDescription}</div>
                )}
              </div>

              {/* Long Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Long Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => {
                    setFormData({...formData, longDescription: e.target.value});
                    validateField('longDescription', e.target.value);
                  }}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${
                    fieldErrors.longDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                  }`}
                  placeholder="Detailed description of your event, what attendees can expect, schedule, etc. (500-2000 characters)"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.longDescription.trim().length}/2000 characters (500-2000 required)
                </div>
                {fieldErrors.longDescription && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.longDescription}</div>
                )}
              </div>
                </div>
              </div>

              {/* Location and Timings Section */}
              <div>
                <h3 className="text-sm font-medium text-brand-dark-900 mb-6 pb-2 border-b border-gray-200">
                  Location and Timings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={formData.date}
                  onChange={(newValue) => {
                    setFormData({...formData, date: newValue});
                    validateField('date', newValue);
                  }}
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'white',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3B82F6',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3B82F6',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputBase-input': {
                          padding: '12px 14px',
                          fontSize: '16px',
                        },
                      },
                    },
                  }}
                />
                {fieldErrors.date && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.date}</div>
                )}
              </div>

              {/* Time and Duration */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Event Timing *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-brand-dark-600 mb-1">Start Time <span className="text-red-500">*</span></label>
                    <TimePicker
                      value={formData.startTime}
                      onChange={(newValue) => {
                        setFormData({...formData, startTime: newValue});
                        validateField('startTime', newValue);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: 'white',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3B82F6',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3B82F6',
                                borderWidth: '2px',
                              },
                            },
                            '& .MuiInputBase-input': {
                              padding: '12px 14px',
                              fontSize: '16px',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-brand-dark-600 mb-1">Duration (hours) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="24"
                      value={formData.duration}
                      onChange={(e) => {
                        setFormData({...formData, duration: e.target.value});
                        validateField('duration', e.target.value);
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${
                        fieldErrors.duration ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                      }`}
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
                
                {/* Error messages */}
                {(fieldErrors.startTime || fieldErrors.duration) && (
                  <div className="mt-2 space-y-1">
                    {fieldErrors.startTime && (
                      <div className="text-xs text-red-500">{fieldErrors.startTime}</div>
                    )}
                    {fieldErrors.duration && (
                      <div className="text-xs text-red-500">{fieldErrors.duration}</div>
                    )}
                  </div>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({...formData, city: e.target.value});
                    validateField('city', e.target.value);
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${
                    fieldErrors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                  }`}
                  placeholder="Enter city"
                />
                {fieldErrors.city && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.city}</div>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({...formData, state: e.target.value});
                    validateField('state', e.target.value);
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${
                    fieldErrors.state ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                  }`}
                  placeholder="Enter state"
                />
                {fieldErrors.state && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.state}</div>
                )}
              </div>

              {/* Venue */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => {
                    setFormData({...formData, venue: e.target.value});
                    validateField('venue', e.target.value);
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${
                    fieldErrors.venue ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                  }`}
                  placeholder="Venue name"
                />
                {fieldErrors.venue && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.venue}</div>
                )}
              </div>

              {/* Full Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.fullAddress}
                  onChange={(e) => {
                    setFormData({...formData, fullAddress: e.target.value});
                    validateField('fullAddress', e.target.value);
                  }}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${
                    fieldErrors.fullAddress ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                  }`}
                  placeholder="Complete address with pincode"
                />
                {fieldErrors.fullAddress && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.fullAddress}</div>
                )}
              </div>

              {/* Landmark */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Landmark <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Nearby landmark for easy location"
                />
              </div>

              {/* Google Map Link */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Google Map Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.googleMapLink}
                  onChange={(e) => setFormData({...formData, googleMapLink: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="https://maps.google.com/..."
                />
              </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div>
                <h3 className="text-sm font-medium text-brand-dark-900 mb-6 pb-2 border-b border-gray-200">
                  Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Pricing */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-4">
                  Pricing <span className="text-red-500">*</span>
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="Enter price (₹)"
                    />
                  )}

                  {formData.pricingType === 'tiered' && (
                    <div className="space-y-3">
                      <p className="text-xs text-red-600 mb-2">Minimum 2 tiers required <span className="text-red-500">*</span></p>
                      {fieldErrors.tiers && (
                        <div className="text-sm text-red-600">{fieldErrors.tiers}</div>
                      )}
                      {formData.tiers.map((tier, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex gap-3 items-center">
                            <input
                              type="text"
                              value={tier.name}
                              onChange={(e) => updateTier(index, 'name', e.target.value)}
                              className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent ${ 
                                fieldErrors[`tier_${index}_name`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                              }`}
                              placeholder="Tier name (e.g. Early Bird, Regular)"
                            />
                            <input
                              type="number"
                              value={tier.price}
                              onChange={(e) => updateTier(index, 'price', e.target.value)}
                              className={`w-32 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent ${
                                fieldErrors[`tier_${index}_price`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                              }`}
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
                        {fieldErrors[`tier_${index}_name`] && (
                          <div className="text-sm text-red-600">{fieldErrors[`tier_${index}_name`]}</div>
                        )}
                        {fieldErrors[`tier_${index}_price`] && (
                          <div className="text-sm text-red-600">{fieldErrors[`tier_${index}_price`]}</div>
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
                {fieldErrors.pricingType && (
                  <div className="text-xs text-red-500 mt-2">{fieldErrors.pricingType}</div>
                )}
                {fieldErrors.fixedPrice && (
                  <div className="text-xs text-red-500 mt-2">{fieldErrors.fixedPrice}</div>
                )}
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
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                        placeholder="Referral code (e.g. SAVE20)"
                      />
                      <input
                        type="text"
                        value={referral.discount}
                        onChange={(e) => updateReferralCode(index, 'discount', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
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
                  Max Participants <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="10"
                  value={formData.maxParticipants}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= 0) {
                      setFormData({...formData, maxParticipants: e.target.value});
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="Maximum number of participants"
                />
              </div>

              {/* Booking Closure */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Booking Closure (hours before event) 
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bookingClosure}
                  onChange={(e) => setFormData({...formData, bookingClosure: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="e.g. 2 (closes 2 hours before event)"
                />
              </div>
                </div>
              </div>

              {/* Media and Contact Section */}
              <div>
                <h3 className="text-sm font-medium text-brand-dark-900 mb-6 pb-2 border-b border-gray-200">
                  Media and Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Event Banner */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Event Banner/Poster <span className="text-red-500">*</span>
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
                      onChange={(e) => {
                        setFormData({...formData, bannerImage: e.target.value, bannerFile: null});
                        validateField('bannerImage', e.target.value);
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-colors ${
                        formData.bannerFile 
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed focus:ring-gray-200 focus:border-gray-200' 
                          : fieldErrors.bannerImage
                          ? 'border-red-500 bg-white text-gray-900 focus:ring-red-500 focus:border-red-500'
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
                {fieldErrors.bannerImage && (
                  <div className="text-xs text-red-500 mt-2">{fieldErrors.bannerImage}</div>
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                  placeholder="@username"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => {
                    setFormData({...formData, contactNumber: e.target.value});
                    validateField('contactNumber', e.target.value);
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${
                    fieldErrors.contactNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                  }`}
                  placeholder="+91 XXXXX XXXXX"
                />
                {fieldErrors.contactNumber && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.contactNumber}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => {
                    setFormData({...formData, contactName: e.target.value});
                    validateField('contactName', e.target.value);
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent ${
                    fieldErrors.contactName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                  }`}
                  placeholder="Contact person name"
                />
                {fieldErrors.contactName && (
                  <div className="text-xs text-red-500 mt-1">{fieldErrors.contactName}</div>
                )}
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
                <h3 className="text-sm font-medium text-brand-dark-900 mb-4 pb-2 border-b border-gray-200">
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Beneficiary Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Beneficiary Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.beneficiaryName}
                      onChange={(e) => {
                        setFormData({...formData, beneficiaryName: e.target.value});
                        validateField('beneficiaryName', e.target.value);
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent ${
                        fieldErrors.beneficiaryName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                      }`}
                      placeholder="Account holder name as per bank records"
                    />
                    {fieldErrors.beneficiaryName && (
                      <div className="text-sm text-red-600 mt-1">{fieldErrors.beneficiaryName}</div>
                    )}
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Account Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.accountType}
                      onChange={(e) => {
                        setFormData({...formData, accountType: e.target.value});
                        validateField('accountType', e.target.value);
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent ${
                        fieldErrors.accountType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                      }`}
                    >
                      <option value="">Select account type</option>
                      <option value="salary">Salary</option>
                      <option value="saving">Saving</option>
                      <option value="nri">NRI</option>
                    </select>
                    {fieldErrors.accountType && (
                      <div className="text-sm text-red-600 mt-1">{fieldErrors.accountType}</div>
                    )}
                  </div>

                  {/* Bank Name */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => {
                        setFormData({...formData, bankName: e.target.value});
                        validateField('bankName', e.target.value);
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent ${
                        fieldErrors.bankName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                      }`}
                      placeholder="e.g. State Bank of India"
                    />
                    {fieldErrors.bankName && (
                      <div className="text-sm text-red-600 mt-1">{fieldErrors.bankName}</div>
                    )}
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                        if (value.length <= 18) {
                          setFormData({...formData, accountNumber: value});
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="Enter 9-18 digit account number"
                      pattern="\d{9,18}"
                      maxLength={18}
                    />
                  </div>

                  {/* Bank IFSC */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Bank IFSC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.bankIFSC}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        if (value.length <= 11) {
                          setFormData({...formData, bankIFSC: value});
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="e.g. SBIN0000123"
                      pattern="[A-Z]{4}0[A-Z0-9]{6}"
                      title="IFSC format: 4 letters + 0 + 6 alphanumeric characters"
                    />
                  </div>

                  {/* PAN Number */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      PAN Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        if (value.length <= 10) {
                          setFormData({...formData, panNumber: value});
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
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
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        if (value.length <= 15) {
                          setFormData({...formData, gstinNumber: value});
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                      placeholder="e.g. yourname@paytm, mobile@oksbi"
                      pattern="[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}"
                      title="UPI ID format: username@bank"
                    />
                  </div>
                </div>
              </div>


              {/* Terms and Conditions Section */}
              <div>
                <h3 className="text-sm font-medium text-brand-dark-900 mb-4 pb-2 border-b border-gray-200">
                  Terms and Conditions
                </h3>
                <div className="space-y-6">
                  {/* Refund Policy */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Refund Policy <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.refundPolicy}
                      onChange={(e) => setFormData({...formData, refundPolicy: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
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
                    Need Content Help? <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="radio"
                      name="needContentHelp"
                      value="yes"
                      checked={formData.needContentHelp === 'yes'}
                      onChange={(e) => {
                        setFormData({...formData, needContentHelp: e.target.value});
                        validateField('needContentHelp', e.target.value);
                      }}
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
                      onChange={(e) => {
                        setFormData({...formData, needContentHelp: e.target.value});
                        validateField('needContentHelp', e.target.value);
                      }}
                      className="mr-3"
                    />
                    <span>No, I'll handle content myself</span>
                  </label>
                </div>
                {fieldErrors.needContentHelp && (
                  <div className="text-sm text-red-600 mt-2">{fieldErrors.needContentHelp}</div>
                )}
              </div>

              {/* Creator Collaboration */}
              <div>
                <label className="block text-sm font-medium text-brand-dark-700 mb-4">
                  Looking for Local Creator Collaboration? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <input
                      type="radio"
                      name="needCreatorCollaboration"
                      value="yes"
                      checked={formData.needCreatorCollaboration === 'yes'}
                      onChange={(e) => {
                        setFormData({...formData, needCreatorCollaboration: e.target.value});
                        validateField('needCreatorCollaboration', e.target.value);
                      }}
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
                      onChange={(e) => {
                        setFormData({...formData, needCreatorCollaboration: e.target.value});
                        validateField('needCreatorCollaboration', e.target.value);
                      }}
                      className="mr-3"
                    />
                    <span>No, just list my events</span>
                  </label>
                </div>
                {fieldErrors.needCreatorCollaboration && (
                  <div className="text-sm text-red-600 mt-2">{fieldErrors.needCreatorCollaboration}</div>
                )}
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
                <h3 className="text-sm font-medium text-brand-dark-900 mb-4">Your Event Dashboard Will Include:</h3>
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
                <h3 className="text-sm font-medium text-brand-dark-900 mb-4">Communication Preferences</h3>
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
                <h3 className="text-sm font-medium text-brand-dark-900 mb-4">Accessibility Tags</h3>
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
                  Languages Spoken by Host <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.languagesSpoken}
                  onChange={(e) => {
                    setFormData({...formData, languagesSpoken: e.target.value});
                    validateField('languagesSpoken', e.target.value);
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent ${
                    fieldErrors.languagesSpoken ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue-500'
                  }`}
                  placeholder="e.g. Hindi, English, Kannada"
                />
                {fieldErrors.languagesSpoken && (
                  <div className="text-sm text-red-600 mt-1">{fieldErrors.languagesSpoken}</div>
                )}
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
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
                <h3 className="text-sm font-medium text-brand-dark-900 mb-4">
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
                    <span className="font-medium">I agree to TrippeChalo's Terms of Service <span className="text-red-500">*</span></span> and understand that:
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
    <div>
      {/* Modern Typeform-style Header */}
      <div className="bg-gradient-to-br from-brand-blue-600 via-brand-blue-700 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header Content */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Create Your Event</h1>
              <p className="text-blue-100 text-lg">Let's build something amazing together</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200 mb-1">Step {currentStep} of {steps.length}</div>
              <div className="text-2xl font-bold">{Math.round((currentStep / steps.length) * 100)}%</div>
            </div>
          </div>

          {/* Modern Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex items-center w-full">
                  {/* Step Circle */}
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep > step.id 
                      ? 'bg-white border-white text-brand-blue-600' 
                      : currentStep === step.id 
                      ? 'bg-brand-blue-500 border-white text-white ring-4 ring-white/30' 
                      : 'bg-transparent border-white/40 text-white/60'
                  }`}>
                    {currentStep > step.id ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-semibold transition-colors ${
                      currentStep >= step.id ? 'text-white' : 'text-white/60'
                    }`}>
                      {step.name}
                    </div>
                    <div className={`text-xs transition-colors ${
                      currentStep >= step.id ? 'text-blue-100' : 'text-white/40'
                    }`}>
                      {step.description}
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 w-8 mx-4 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-white' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              </div>
            ))}
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
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
              className={`
                flex items-center space-x-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 text-lg
                ${currentStep === 1 || isSubmitting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-brand-dark-700 hover:bg-gray-300 hover:shadow-md transform hover:scale-105'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>
            
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
                  ? 'Creating Event...' 
                  : currentStep === 5 
                  ? 'Submit Event' 
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
    </div>
  );
};