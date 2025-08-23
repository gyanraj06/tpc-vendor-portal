# Recurring Event Form - Field Documentation

This document provides a comprehensive overview of all fields, data types, and form steps in the Recurring Event creation form.

## Form Overview

The recurring event form is a multi-step form with **6 steps** containing **35 total fields** (23 editable + 12 read-only business fields).

---

## Step 0: Business Verification (Conditional)

**Purpose:** Displayed only for unverified LOCAL_EVENT_HOST vendors  
**Action:** Redirects to business verification in settings

### Requirements Shown:
- Business name & registration
- Website or social media link  
- Registered business address
- Contact person details
- Bank account information
- Identity verification documents

---

## Step 1: Business Information (Read-Only Display)

**Purpose:** Display verified business information from vendor profile

| Field Name | Frontend Label | Data Type | Source |
|------------|----------------|-----------|--------|
| `business_name` | Business Name / Brand Name | string | vendor_profiles.business_name |
| `legal_name` | Legal Registered Name | string | vendor_profiles.legal_name |
| `business_type` | Business Type | string | vendor_profiles.business_type |
| `business_registration_document` | Business Registration Document | file | vendor_profiles.business_registration_document |
| `website_or_social_link` | Website or Social Link | string | vendor_profiles.website_or_social_link |
| `registered_address` | Registered Address | string | vendor_profiles.registered_address |
| `authorized_contact_person_name` | Authorized Contact Person - Full Name | string | vendor_profiles.authorized_contact_person_name |
| `contact_phone_number` | Contact Phone Number | string | vendor_profiles.contact_phone_number |
| `contact_email` | Contact Email | string | vendor_profiles.contact_email |
| `id_proof_document` | ID Proof of Authorized Person | file | vendor_profiles.id_proof_document |
| `account_holder_name` | Account Holder Name | string | vendor_profiles.account_holder_name |
| `bank_name` | Bank Name | string | vendor_profiles.bank_name |
| `account_number` | Account Number | string | vendor_profiles.account_number |
| `ifsc_code` | IFSC Code | string | vendor_profiles.ifsc_code |

**Total Fields:** 14 read-only fields

---

## Step 2: Category of Experience

**Purpose:** Define experience type and scheduling details

| Field Name | Frontend Label | Data Type | Required | Options/Format |
|------------|----------------|-----------|----------|----------------|
| `primaryCategory` | Primary Category | string (select) | ✅ Yes | adventure, cultural, food, wellness, art, photography, music, nature, educational, other |
| `subCategory` | Sub Category | string (text) | ✅ Yes | Free text (e.g., "Hiking, Cooking Classes, Pottery Workshop") |
| `recurrenceType` | Recurrence Type | string (radio) | ✅ Yes | daily, weekly, monthly |
| `daysOfWeek` | Days of Week | string[] (multi-select) | ✅ Yes | Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday |
| `timeSlots` | Time Slots | Array<{startTime: Date, endTime: Date}> | ✅ Yes | Multiple time slots with start/end times |
| `recurrenceFrequency` | Recurrence Frequency | string (select) | ✅ Yes | every_week, every_2_weeks, every_month, seasonal, custom |

**Total Fields:** 6 required fields

### Time Slots Structure:
```typescript
timeSlots: [
  { 
    startTime: Date | null, 
    endTime: Date | null 
  }
]
```

---

## Step 3: Location Settings

**Purpose:** Configure experience locations and itinerary

| Field Name | Frontend Label | Data Type | Required | Conditional Logic |
|------------|----------------|-----------|----------|-------------------|
| `locationType` | Location Type | string (radio) | ✅ Yes | fixed, itinerary, multiple |
| `itinerary` | Itinerary Builder | Array<{location: string, description: string, duration: string}> | ❓ Conditional | Only if locationType = 'itinerary' |
| `locationVariations` | Location Variations | Array<{name: string, address: string, description: string}> | ❓ Conditional | Only if locationType = 'multiple' |

**Total Fields:** 3 fields (1 always required, 2 conditional)

### Itinerary Structure:
```typescript
itinerary: [
  {
    location: string,        // Location name
    description: string,     // What happens at this location
    duration: string        // e.g., "2 hours"
  }
]
```

### Location Variations Structure:
```typescript
locationVariations: [
  {
    name: string,           // Location name
    address: string,        // Full address
    description: string     // Description of this location
  }
]
```

---

## Step 4: Pricing & Inclusions

**Purpose:** Set pricing and additional services

| Field Name | Frontend Label | Data Type | Required | Conditional Logic |
|------------|----------------|-----------|----------|-------------------|
| `eventType` | Event Type | string (radio) | ✅ Yes | paid, free |
| `ticketPricePerPerson` | Ticket Price Per Person | string (number) | ❓ Conditional | Required if eventType = 'paid' |
| `ticketType` | Ticket Type | string (select) | ✅ Yes | individual, group, both |
| `addOnServices` | Add-on Services | Array<{name: string, price: string}> | ❌ No | Multiple services with name and price |
| `maxParticipants` | Max Participants | string (number) | ✅ Yes | Minimum value: 1 |
| `bookingCloses` | Booking Closes | string (select) | ❌ No | 1hr, 2hr, 4hr, 24hr, 48hr |
| `earlyBirdCouponCode` | Early Bird Coupon Code | string (text) | ❌ No | e.g., "EARLY20" |
| `earlyBirdDiscount` | Early Bird Discount | string (text) | ❌ No | e.g., "20% or ₹100" |
| `refundPolicy` | Refund Policy | string (select) | ❌ No | no-refund, 24hr-full, 48hr-full, 72hr-full |
| `cancellationPolicy` | Cancellation Policy | string (select) | ❌ No | flexible, moderate, strict |
| `customNote` | Custom Note | string (textarea) | ❌ No | Special instructions for participants |

**Total Fields:** 11 fields (4 required, 1 conditional, 6 optional)

### Add-on Services Structure:
```typescript
addOnServices: [
  {
    name: string,    // Service name (e.g., "Photography", "Lunch")
    price: string    // Price in ₹
  }
]
```

---

## Step 5: Operational & Safety

**Purpose:** Safety measures and experience media

| Field Name | Frontend Label | Data Type | Required | Format/Validation |
|------------|----------------|-----------|----------|-------------------|
| `emergencyContactNumber` | Emergency Contact Number for Events (Optional) | string (tel) | ❌ No | Phone number format |
| `hasLiabilityInsurance` | Do you have liability insurance for your experience? | string (radio) | ✅ Yes | yes, no, planning |
| `experiencePhotos` | Experience Photos | File[] (multiple) | ❌ No | image/* files |
| `experiencePhotoUrls` | - | string[] | ❌ No | URLs after file upload |

**Total Fields:** 4 fields (1 required, 3 optional)

### Experience Photos:
- **Accepted formats:** JPG, PNG
- **Multiple files:** Yes
- **Preview:** Shows uploaded images with remove option
- **Storage:** Files stored in `experiencePhotos`, URLs in `experiencePhotoUrls`

---

## Step 6: Review & Submit

**Purpose:** Final review and terms acceptance

| Field Name | Frontend Label | Data Type | Required | Description |
|------------|----------------|-----------|----------|-------------|
| `agreeToTerms` | I agree to TrippeChalo's Terms of Service for Recurring Experiences | boolean (checkbox) | ✅ Yes | Must be checked to submit |

**Total Fields:** 1 required field

### Terms Include:
- Responsible for delivering consistent quality experiences
- TrippeChalo collects 5% platform fee on paid experiences
- Maintain professional communication with participants
- Provide adequate safety measures for recurring activities
- Refunds and cancellations processed according to stated policies

---

## Form Data Structure

```typescript
interface RecurringEventFormData {
  // Category of Experience
  primaryCategory: string;
  subCategory: string;
  recurrenceType: string;
  daysOfWeek: string[];
  timeSlots: Array<{ startTime: Date | null, endTime: Date | null }>;
  recurrenceFrequency: string;

  // Location Setting
  locationType: 'fixed' | 'itinerary' | 'multiple';
  itinerary: Array<{ location: string, description: string, duration: string }>;
  locationVariations: Array<{ name: string, address: string, description: string }>;

  // Pricing and Inclusions
  eventType: string;
  ticketPricePerPerson: string;
  ticketType: string;
  addOnServices: Array<{ name: string, price: string }>;
  maxParticipants: string;
  bookingCloses: string;
  earlyBirdCouponCode: string;
  earlyBirdDiscount: string;
  refundPolicy: string;
  cancellationPolicy: string;
  customNote: string;

  // Operational & Safety
  emergencyContactNumber: string;
  hasLiabilityInsurance: string;
  experiencePhotos: File[];
  experiencePhotoUrls: string[];

  // Terms and Conditions
  agreeToTerms: boolean;
}
```

---

## Form Validation Rules

### Required Fields:
1. **Step 2:** primaryCategory, subCategory, recurrenceType, daysOfWeek, timeSlots, recurrenceFrequency
2. **Step 3:** locationType (+ conditional fields based on type)
3. **Step 4:** eventType, ticketType, maxParticipants (+ ticketPricePerPerson if paid)
4. **Step 5:** hasLiabilityInsurance
5. **Step 6:** agreeToTerms

### Conditional Requirements:
- `ticketPricePerPerson`: Required only if `eventType = 'paid'`
- `itinerary`: Required only if `locationType = 'itinerary'`
- `locationVariations`: Required only if `locationType = 'multiple'`

### Field Constraints:
- `maxParticipants`: Minimum value = 1
- `account_number`: Maximum length = 18 characters
- `ifsc_code`: Maximum length = 11 characters
- `experiencePhotos`: Accept only image/* files
- `timeSlots`: Must have at least one complete time slot (start + end time)

---

## Summary

- **Total Steps:** 6 (including conditional step 0)
- **Total Fields:** 35 (23 editable + 12 read-only)
- **Required Fields:** 15
- **Optional Fields:** 20
- **Conditional Fields:** 3
- **File Upload Fields:** 3 (business registration, ID proof, experience photos)
- **Array Fields:** 5 (timeSlots, itinerary, locationVariations, addOnServices, experiencePhotos)