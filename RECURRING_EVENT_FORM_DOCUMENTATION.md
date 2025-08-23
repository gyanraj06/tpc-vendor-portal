# Recurring Event Form Documentation

## Form Overview
The CreateRecurringEventPage component handles the creation of recurring events through a multi-step form process. The form is divided into 5 main steps with conditional field visibility based on user selections.

## Form Steps
1. **Experience Category** - Event details and scheduling
2. **Location Settings** - Venue and location configuration
3. **Pricing & Inclusions** - Pricing and service details
4. **Operational & Safety** - Safety measures and media
5. **Review & Submit** - Final review and terms acceptance

## Form Data Structure

### Event Information
| Field Name | Data Type | Required | Description | Validation |
|------------|-----------|----------|-------------|------------|
| `eventName` | string | Yes | Name of the event/experience | Non-empty string |
| `description` | string | Yes | Detailed description of the event | Non-empty string |

### Category Information
| Field Name | Data Type | Required | Description | Options |
|------------|-----------|----------|-------------|---------|
| `primaryCategory` | string | Yes | Main category of experience | adventure, cultural, food, wellness, art, photography, music, nature, educational, other |
| `subCategory` | string | Yes | Specific subcategory | Free text input |

### Scheduling Information
| Field Name | Data Type | Required | Description | Options |
|------------|-----------|----------|-------------|---------|
| `recurrenceType` | string | Yes | Type of recurrence pattern | daily, weekly |
| `daysOfWeek` | string[] | Conditional* | Selected days for weekly events | Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday |
| `timeSlots` | TimeSlot[] | Yes | Array of time slots | Array of objects with startTime and endTime |

*Required only when `recurrenceType` is "weekly"

#### TimeSlot Object Structure
```typescript
interface TimeSlot {
  startTime: Date | null;
  endTime: Date | null;
}
```

### Location Settings
| Field Name | Data Type | Required | Description | Options |
|------------|-----------|----------|-------------|---------|
| `locationType` | string | Yes | Type of location setup | fixed, itinerary |
| `address` | string | Conditional* | Address for fixed location | Free text (textarea) |
| `itinerary` | ItineraryItem[] | Conditional** | Itinerary for multi-location events | Array of itinerary objects |

*Required only when `locationType` is "fixed"  
**Used only when `locationType` is "itinerary"

#### ItineraryItem Object Structure
```typescript
interface ItineraryItem {
  location: string;
  description: string;
  duration: string;
}
```

### Pricing & Inclusions
| Field Name | Data Type | Required | Description | Options |
|------------|-----------|----------|-------------|---------|
| `eventType` | string | Yes | Whether event is paid or free | paid, free |
| `ticketPricePerPerson` | string | Conditional* | Price per ticket | Number as string |
| `ticketType` | string | Yes | Type of booking allowed | individual, group, both |
| `addOnServices` | AddOnService[] | No | Optional additional services | Array of service objects |
| `numberOfMaxTicketsPerOccurrence` | string | No | Maximum tickets per occurrence | Number as string (optional) |
| `bookingClosesBeforeHrs` | string | Yes | Hours before event when booking closes | Number as string (≥0) |
| `earlyBirdCouponCode` | string | No | Early bird discount code | Free text |
| `earlyBirdDiscount` | string | No | Early bird discount amount | Free text |
| `refundPolicy` | string | Yes | Refund policy selection | no-refund, 24hr-full, 48hr-full, 72hr-full |
| `cancellationPolicy` | string | Yes | Cancellation policy selection | flexible, moderate, strict |
| `customNote` | string | No | Additional notes for participants | Free text (textarea) |

*Required only when `eventType` is "paid"

#### AddOnService Object Structure
```typescript
interface AddOnService {
  name: string;
  price: string;
}
```

### Operational & Safety
| Field Name | Data Type | Required | Description | Options |
|------------|-----------|----------|-------------|---------|
| `emergencyContactNumber` | string | Yes | Emergency contact for events | 10-digit phone number |
| `hasLiabilityInsurance` | string | Yes | Insurance status | yes, no, planning |
| `experiencePhotos` | File[] | No | Photos showcasing the experience | Array of image files |
| `experiencePhotoUrls` | string[] | No | URLs of uploaded photos | Array of strings |

### Terms & Conditions
| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `agreeToTerms` | boolean | Yes | Agreement to terms of service |

## Validation Rules

### Field-Specific Validations
- **eventName**: Must be non-empty string
- **description**: Must be non-empty string  
- **primaryCategory**: Must be selected from dropdown
- **subCategory**: Must be non-empty string
- **recurrenceType**: Must be selected (daily or weekly)
- **daysOfWeek**: Required only for weekly recurrence, at least one day must be selected
- **timeSlots**: Must have at least one complete time slot (both start and end time)
- **locationType**: Must be selected (fixed or itinerary)
- **address**: Required for fixed location type, must be non-empty string
- **eventType**: Must be selected (paid or free)
- **ticketPricePerPerson**: Required for paid events, must be valid number
- **ticketType**: Must be selected from options
- **numberOfMaxTicketsPerOccurrence**: If provided, must be positive number
- **bookingClosesBeforeHrs**: Must be non-negative number
- **refundPolicy**: Must be selected from options
- **cancellationPolicy**: Must be selected from options
- **emergencyContactNumber**: Must be exactly 10 digits
- **hasLiabilityInsurance**: Must be selected from options
- **agreeToTerms**: Must be true to submit

### Step-Based Required Fields
```typescript
const requiredFields = {
  2: ['eventName', 'description', 'primaryCategory', 'subCategory', 'recurrenceType', 'timeSlots'] 
     + ['daysOfWeek'] // only if recurrenceType === 'weekly'
  3: ['locationType'] 
     + ['address'] // only if locationType === 'fixed'
  4: ['eventType', 'ticketType', 'bookingClosesBeforeHrs', 'refundPolicy', 'cancellationPolicy']
  5: ['emergencyContactNumber', 'hasLiabilityInsurance']
}
```

## Form State Management

### Error Handling
- Real-time validation on field change
- Error messages displayed immediately below each field
- Form submission blocked if validation errors exist
- Auto-scroll to first error field on validation failure

### Conditional Field Display
- **Days of Week**: Only shown when recurrence type is "weekly"
- **Address**: Only shown when location type is "fixed"
- **Itinerary Builder**: Only shown when location type is "itinerary"
- **Ticket Price**: Only shown when event type is "paid"

### Dynamic Arrays
- **Time Slots**: Can add/remove multiple time slots
- **Itinerary Items**: Can add/remove multiple locations (itinerary mode only)
- **Add-on Services**: Can add/remove multiple services
- **Experience Photos**: Can upload multiple images

## Notable Changes from Original
1. **Removed Fields**:
   - `recurrenceFrequency` - Completely eliminated
   - `locationVariations` - Removed location variation functionality
   - Multiple location type option removed

2. **Field Modifications**:
   - `bookingCloses` → `bookingClosesBeforeHrs` (dropdown → number input)
   - `maxParticipants` → `numberOfMaxTicketsPerOccurrence` (required → optional)

3. **New Fields**:
   - `description` - Added as mandatory field after event name
   - `address` - Added as conditional mandatory field for fixed locations

## Component Dependencies
- React hooks: useState, useEffect
- React Router: useNavigate
- Lucide React: Various icons
- MUI DatePicker: TimePicker component
- Custom components: ToasterNotification
- Services: AuthService

## Form Submission
On successful validation, the form data is logged to console and redirects to dashboard after 2 seconds with success message.