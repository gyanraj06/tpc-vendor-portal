import { supabase } from "../lib/supabase";

export interface TimeSlot {
  start: string;
  end: string;
}

export interface LocationAddress {
  "Line 1": string;
  "Line 2": string;
  "City": string;
}

export interface CreateRecurringEventRequest {
  primary_category: string;
  sub_category: string;
  event_name: string;
  description: string;
  recurrence_type: "weekly" | "daily" | "monthly";
  days_of_week: string[];
  time_slots: TimeSlot[];
  location_type: "fixed" | "itinerary" | "multiple";
  event_address?: any; // JSON field
  itinerary?: any;
  event_type: "paid" | "free";
  ticket_price?: number;
  ticket_type: "individual" | "group" | "both";
  add_on_services?: any;
  max_participants_per_occurrence?: number; // Now nullable
  booking_closure_before_hours?: number; // Updated field name
  coupons?: any;
  refund_policy?: string;
  cancellation_policy?: string;
  custom_note?: string;
  emergency_contact_number?: string;
  has_liability_insurance: "has_insurance" | "no_insurance" | "in_progress" | "planning";
  experience_photo_urls?: string[];
  agree_to_terms: boolean;
}

export interface CreateRecurringEventResponse {
  success: boolean;
  event_id?: string;
  message?: string;
  error?: string;
}

export interface RecurringEvent {
  id: string;
  vendor_id: string;
  primary_category: string;
  sub_category: string;
  recurrence_type: "daily" | "weekly" | "monthly";
  days_of_week: string[];
  time_slots: TimeSlot[];
  location_type: "fixed" | "itinerary" | "multiple";
  itinerary?: any;
  event_type: "paid" | "free";
  ticket_price?: string;
  ticket_type: "individual" | "group" | "both";
  add_on_services?: any;
  max_participants_per_occurrence?: number;
  booking_closure_before_hours: number;
  coupons?: any;
  refund_policy: string;
  cancellation_policy: string;
  custom_note?: string;
  emergency_contact_number?: string;
  has_liability_insurance: "has_insurance" | "no_insurance" | "in_progress" | "planning";
  experience_photo_urls: string[];
  agree_to_terms: boolean;
  status: "active" | "inactive" | "expired";
  created_at: string;
  updated_at: string;
  event_name: string;
  description: string;
  event_address: LocationAddress;
}

export interface GetRecurringEventsResponse {
  success: boolean;
  data?: RecurringEvent[];
  message?: string;
  error?: string;
}

export interface DeleteRecurringEventResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class RecurringEventService {
  private static readonly API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  private static async getAuthToken(): Promise<string | null> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }

  private static mapFormDataToAPI(formData: any): CreateRecurringEventRequest {
    // Format time slots
    const timeSlots: TimeSlot[] = formData.timeSlots
      .filter((slot: any) => slot.startTime && slot.endTime)
      .map((slot: any) => ({
        start: slot.startTime.toLocaleTimeString('en-GB', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        end: slot.endTime.toLocaleTimeString('en-GB', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }));

    // Format address for fixed location type
    let eventAddress: LocationAddress | undefined;
    if (formData.locationType === 'fixed' && formData.address) {
      const addressParts = formData.address.split('\n').filter((part: string) => part.trim());
      eventAddress = {
        "Line 1": addressParts[0] || '',
        "Line 2": addressParts.slice(1).join(', ') || '',
        "City": addressParts[addressParts.length - 1] || ''
      };
    }

    // Format add-on services
    let addOnServices: any = null;
    if (formData.addOnServices && formData.addOnServices.length > 0) {
      const validServices = formData.addOnServices.filter((service: any) => 
        service.name && service.price
      );
      if (validServices.length > 0) {
        addOnServices = validServices.reduce((acc: any, service: any) => {
          acc[service.name] = {
            price: parseFloat(service.price)
          };
          return acc;
        }, {});
      }
    }

    // Format itinerary for itinerary location type
    let itinerary: any = null;
    if (formData.locationType === 'itinerary' && formData.itinerary) {
      const validItinerary = formData.itinerary.filter((item: any) => 
        item.location && item.description
      );
      if (validItinerary.length > 0) {
        itinerary = validItinerary;
      }
    }

    // Format coupons if early bird coupon is provided
    let coupons: any = null;
    if (formData.earlyBirdCouponCode && formData.earlyBirdDiscount) {
      coupons = {
        [formData.earlyBirdCouponCode]: {
          discount: formData.earlyBirdDiscount,
          type: 'early_bird'
        }
      };
    }

    return {
      primary_category: formData.primaryCategory,
      sub_category: formData.subCategory,
      event_name: formData.eventName,
      description: formData.description,
      recurrence_type: formData.recurrenceType,
      days_of_week: formData.recurrenceType === 'weekly' ? 
        formData.daysOfWeek.map((day: string) => day.toLowerCase()) : [],
      time_slots: timeSlots,
      location_type: formData.locationType,
      event_address: eventAddress,
      itinerary: itinerary,
      event_type: formData.eventType,
      ticket_price: formData.eventType === 'paid' ? 
        parseFloat(formData.ticketPricePerPerson) : undefined,
      ticket_type: formData.ticketType,
      add_on_services: addOnServices,
      max_participants_per_occurrence: formData.numberOfMaxTicketsPerOccurrence ? 
        parseInt(formData.numberOfMaxTicketsPerOccurrence) : undefined,
      booking_closure_before_hours: parseInt(formData.bookingClosesBeforeHrs) || 1,
      coupons: coupons,
      refund_policy: formData.refundPolicy?.replace('-', '_'),
      cancellation_policy: this.mapCancellationPolicy(formData.cancellationPolicy),
      custom_note: formData.customNote || undefined,
      emergency_contact_number: formData.emergencyContactNumber,
      has_liability_insurance: this.mapInsuranceStatus(formData.hasLiabilityInsurance),
      experience_photo_urls: formData.experiencePhotoUrls || [],
      agree_to_terms: formData.agreeToTerms
    };
  }

  private static mapCancellationPolicy(policy: string): string {
    switch (policy) {
      case 'flexible':
        return 'flexible_any';
      case 'moderate':
        return 'moderate_24hr';
      case 'strict':
        return 'strict_48hr';
      default:
        return 'none';
    }
  }

  private static mapInsuranceStatus(status: string): "has_insurance" | "no_insurance" | "in_progress" | "planning" {
    switch (status) {
      case 'yes':
        return 'has_insurance';
      case 'no':
        return 'no_insurance';
      case 'planning':
        return 'planning';
      default:
        return 'no_insurance';
    }
  }

  static async createRecurringEvent(formData: any): Promise<CreateRecurringEventResponse> {
    try {
      // Get JWT token from Supabase auth
      const token = await this.getAuthToken();
      if (!token) {
        return {
          success: false,
          error: "Authentication required. Please log in again.",
        };
      }

      // Transform form data to API format
      const eventData = this.mapFormDataToAPI(formData);

      console.log("Creating recurring event:", eventData.event_name);
      console.log("=== DEBUG: Full API Payload ===");
      console.log(JSON.stringify(eventData, null, 2));
      console.log("=== End API Payload ===");

      // Validate required fields
      if (!eventData.agree_to_terms) {
        return {
          success: false,
          error: "You must agree to the terms and conditions to create a recurring event.",
        };
      }

      if (!eventData.time_slots || eventData.time_slots.length === 0) {
        return {
          success: false,
          error: "At least one time slot is required.",
        };
      }

      if (eventData.recurrence_type === 'weekly' && (!eventData.days_of_week || eventData.days_of_week.length === 0)) {
        return {
          success: false,
          error: "At least one day of the week must be selected for weekly recurrence.",
        };
      }

      const apiUrl = `${this.API_BASE_URL}/api/recurringevents/create`;
      console.log("=== DEBUG: API Request Details ===");
      console.log("URL:", apiUrl);
      console.log("Method: POST");
      console.log("Headers:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.substring(0, 20)}...` // Show first 20 chars of token for debugging
      });
      console.log("=== End API Request Details ===");

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      console.log(
        "Recurring event creation response:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          "Recurring event creation failed:",
          response.status,
          response.statusText
        );
        console.error("Error data:", errorData);

        if (response.status === 401) {
          return {
            success: false,
            error: "Authentication failed. Please log in again.",
          };
        } else if (response.status === 400) {
          return {
            success: false,
            error: "Invalid event data. Please check all required fields.",
          };
        } else {
          return {
            success: false,
            error: `Failed to create recurring event: ${response.status} ${response.statusText}`,
          };
        }
      }

      const result = await response.json();
      console.log("Recurring event created successfully:", result.event_id || result.id);

      return {
        success: true,
        event_id: result.event_id || result.id,
        message: result.message || "Recurring event created successfully!",
      };
    } catch (error) {
      console.error("Recurring event creation error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while creating the recurring event.",
      };
    }
  }

  static async getRecurringEventsByVendor(): Promise<GetRecurringEventsResponse> {
    try {
      // Get JWT token from Supabase auth
      const token = await this.getAuthToken();
      if (!token) {
        return {
          success: false,
          error: "Authentication required. Please log in again.",
        };
      }

      const apiUrl = `${this.API_BASE_URL}/api/recurringevents/getrecurringevent/vendor`;
      console.log("=== DEBUG: Get Recurring Events Request ==");
      console.log("URL:", apiUrl);
      console.log("Method: GET");
      console.log("Authorization:", `Bearer ${token?.substring(0, 20)}...`);
      console.log("=== End Request Details ===");

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        "Get recurring events response:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          "Get recurring events failed:",
          response.status,
          response.statusText
        );
        console.error("Error data:", errorData);

        if (response.status === 401) {
          return {
            success: false,
            error: "Authentication failed. Please log in again.",
          };
        } else if (response.status === 404) {
          return {
            success: false,
            error: "No recurring events found.",
          };
        } else {
          return {
            success: false,
            error: `Failed to fetch recurring events: ${response.status} ${response.statusText}`,
          };
        }
      }

      const result = await response.json();
      console.log("Recurring events fetched successfully:", result.data?.length || 0, "events");

      return {
        success: true,
        data: result.data || [],
        message: result.message || "Recurring events fetched successfully!",
      };
    } catch (error) {
      console.error("Get recurring events error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while fetching recurring events.",
      };
    }
  }

  static async deleteRecurringEvent(eventId: string): Promise<DeleteRecurringEventResponse> {
    try {
      // Get JWT token from Supabase auth
      const token = await this.getAuthToken();
      if (!token) {
        return {
          success: false,
          error: "Authentication required. Please log in again.",
        };
      }

      const apiUrl = `${this.API_BASE_URL}/api/recurringevents/delete/${eventId}`;
      console.log("=== DEBUG: Delete Recurring Event Request ===");
      console.log("URL:", apiUrl);
      console.log("Method: DELETE");
      console.log("Event ID:", eventId);
      console.log("Authorization:", `Bearer ${token?.substring(0, 20)}...`);
      console.log("=== End Request Details ===");

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        "Delete recurring event response:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          "Delete recurring event failed:",
          response.status,
          response.statusText
        );
        console.error("Error data:", errorData);

        if (response.status === 401) {
          return {
            success: false,
            error: "Authentication failed. Please log in again.",
          };
        } else if (response.status === 404) {
          return {
            success: false,
            error: "Recurring event not found.",
          };
        } else if (response.status === 403) {
          return {
            success: false,
            error: "You don't have permission to delete this recurring event.",
          };
        } else {
          return {
            success: false,
            error: `Failed to delete recurring event: ${response.status} ${response.statusText}`,
          };
        }
      }

      // Check if response has content
      let result;
      try {
        const responseText = await response.text();
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        // If no content or parsing fails, assume success for DELETE operations with 2xx status
        result = {};
      }

      console.log("Recurring event deleted successfully:", eventId);

      return {
        success: true,
        message: result.message || "Recurring event deleted successfully!",
      };
    } catch (error) {
      console.error("Delete recurring event error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while deleting the recurring event.",
      };
    }
  }

  // Additional methods will be added later as needed

  static async uploadExperiencePhoto(
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split(".").pop();
      const fileName = `experience-${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("recurring-event-photos")
        .upload(fileName, file);

      if (error) {
        console.error("File upload error:", error);
        return {
          success: false,
          error: `Failed to upload experience photo: ${error.message}`,
        };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("recurring-event-photos").getPublicUrl(fileName);

      return {
        success: true,
        url: publicUrl,
      };
    } catch (error) {
      console.error("File upload error:", error);
      return {
        success: false,
        error: "Failed to upload experience photo",
      };
    }
  }
}