import { supabase } from "../lib/supabase";

export interface CreateEventRequest {
  event_name: string;
  tagline?: string;
  category: string;
  event_format: string;
  short_description: string;
  long_description: string;
  date: string;
  start_time: string;
  duration: number;
  city: string;
  state: string;
  venue: string;
  full_address: string;
  landmark?: string;
  google_map_link?: string;
  pricing_type: "fixed" | "tiered";
  fixed_price?: number;
  tiers?: Record<string, { price: number }>;
  max_participants: number;
  booking_closure: number;
  banner_image?: string;
  event_website?: string;
  instagram?: string;
  twitter?: string;
  contact_number: string;
  contact_name: string;
  beneficiary_name: string;
  account_type: string;
  bank_name: string;
  account_number: string;
  bank_ifsc: string;
  pan_number?: string;
  gstin_number?: string;
  upi_id?: string;
  refund_policy: string;
  guidelines?: string;
  custom_note?: string;
  need_content_help: "yes" | "no";
  need_creator_collaboration: "yes" | "no";
  whatsapp_notifications: boolean;
  email_reports: boolean;
  automatic_reminders: boolean;
  wheelchair_accessible: boolean;
  women_only: boolean;
  pet_friendly: boolean;
  languages_spoken?: string;
  faqs?: string;
  agree_to_terms: boolean;
}

export interface CreateEventResponse {
  success: boolean;
  event_id?: string;
  message?: string;
  error?: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export interface UpdateEventResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface EventListing {
  id: string;
  vendor_id: string;
  event_name: string;
  tagline?: string;
  category: string;
  event_format: string;
  short_description: string;
  long_description: string;
  date: string;
  start_time: string;
  duration: number;
  city: string;
  state: string;
  venue: string;
  full_address: string;
  landmark?: string;
  google_map_link?: string;
  pricing_type: "fixed" | "tiered";
  fixed_price?: number;
  tiers?: Record<
    string,
    { price: number; description?: string; available_until?: string }
  >;
  referral_codes?: any;
  max_participants: number;
  booking_closure: number;
  banner_image?: string;
  banner_file?: any;
  event_website?: string;
  instagram?: string;
  twitter?: string;
  contact_number: string;
  contact_name: string;
  beneficiary_name: string;
  account_type: string;
  bank_name: string;
  account_number: string;
  bank_ifsc: string;
  pan_number?: string;
  gstin_number?: string;
  upi_id?: string;
  refund_policy: string;
  guidelines?: string;
  custom_note?: string;
  need_content_help: string;
  need_creator_collaboration: string;
  whatsapp_notifications: boolean;
  email_reports: boolean;
  automatic_reminders: boolean;
  wheelchair_accessible: boolean;
  women_only: boolean;
  pet_friendly: boolean;
  languages_spoken?: string;
  faqs?: string;
  agree_to_terms: boolean;
  status: "active" | "draft" | "ended";
  created_at: string;
  updated_at: string;
}

export interface GetListingsResponse {
  success: boolean;
  listings?: EventListing[];
  total?: number;
  error?: string;
}

export class EventService {
  private static readonly API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  private static processImageUrl(
    url: string | null | undefined
  ): string | null {
    if (!url) return null;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    if (url.startsWith("vendor-event-banners/")) {
      const filename = url.split("/")[1];
      return `${supabaseUrl}/storage/v1/object/public/vendor-event-banners/${filename}`;
    } else if (
      url.includes("banner-") ||
      url.includes(".jpg") ||
      url.includes(".png") ||
      url.includes(".jpeg") ||
      url.includes(".webp")
    ) {
      return `${supabaseUrl}/storage/v1/object/public/vendor-event-banners/${url}`;
    }

    return url;
  }

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

  private static mapRefundPolicy(policy: string): string {
    switch (policy) {
      case "48hr-full":
        return "hr48_full";
      case "24hr-full":
        return "hr24_full";
      case "no-refund":
        return "no_refund";
      default:
        return policy;
    }
  }

  private static formatFormDataForAPI(formData: any): CreateEventRequest {
    // form time to ISO string
    const eventDate = new Date(`${formData.date}T${formData.startTime}:00`);

    return {
      event_name: formData.eventName,
      tagline: formData.tagline || undefined,
      category: formData.category,
      event_format: formData.eventFormat,
      short_description: formData.shortDescription,
      long_description: formData.longDescription,
      date: eventDate.toISOString(),
      start_time: formData.startTime,
      duration: parseFloat(formData.duration),
      city: formData.city,
      state: formData.state,
      venue: formData.venue,
      full_address: formData.fullAddress,
      landmark: formData.landmark || undefined,
      google_map_link: formData.googleMapLink || undefined,
      pricing_type: formData.pricingType,
      fixed_price:
        formData.pricingType === "fixed"
          ? parseFloat(formData.fixedPrice)
          : undefined,
      tiers:
        formData.pricingType === "tiered"
          ? formData.tiers
              .filter((tier: any) => tier.name && tier.price)
              .reduce((acc: Record<string, { price: number }>, tier: any) => {
                // Convert tier name to snake_case and remove spaces
                const tierKey = tier.name.toLowerCase().replace(/\s+/g, "_");
                acc[tierKey] = { price: parseFloat(tier.price) };
                return acc;
              }, {})
          : undefined,
      max_participants: parseInt(formData.maxParticipants),
      booking_closure: parseInt(formData.bookingClosure),
      banner_image: formData.bannerImage || undefined,
      event_website: formData.eventWebsite || undefined,
      instagram: formData.instagram || undefined,
      twitter: formData.twitter || undefined,
      contact_number: formData.contactNumber,
      contact_name: formData.contactName,
      beneficiary_name: formData.beneficiaryName,
      account_type: formData.accountType,
      bank_name: formData.bankName,
      account_number: formData.accountNumber,
      bank_ifsc: formData.bankIFSC,
      pan_number: formData.panNumber || undefined,
      gstin_number: formData.gstinNumber || undefined,
      upi_id: formData.upiId || undefined,
      refund_policy: this.mapRefundPolicy(formData.refundPolicy),
      guidelines: formData.guidelines || undefined,
      custom_note: formData.customNote || undefined,
      need_content_help: formData.needContentHelp,
      need_creator_collaboration: formData.needCreatorCollaboration,
      whatsapp_notifications: formData.whatsappNotifications,
      email_reports: formData.emailReports,
      automatic_reminders: formData.automaticReminders,
      wheelchair_accessible: formData.wheelchairAccessible,
      women_only: formData.womenOnly,
      pet_friendly: formData.petFriendly,
      languages_spoken: formData.languagesSpoken || undefined,
      faqs: formData.faqs || undefined,
      agree_to_terms: formData.agreeToTerms,
    };
  }

  static async createEvent(formData: any): Promise<CreateEventResponse> {
    try {
      // Get JWT token from Supabase auth
      const token = await this.getAuthToken();
      if (!token) {
        return {
          success: false,
          error: "Authentication required. Please log in again.",
        };
      }

      const eventData = this.formatFormDataForAPI(formData);

      // Log basic event creation info for debugging
      console.log("Creating event:", eventData.event_name);

      // Validate required fields
      if (!eventData.agree_to_terms) {
        return {
          success: false,
          error:
            "You must agree to the terms and conditions to create an event.",
        };
      }

      const response = await fetch(`${this.API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      // Log response status for debugging
      console.log(
        "Event creation response:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          "Event creation failed:",
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
            error: `Failed to create event: ${response.status} ${response.statusText}`,
          };
        }
      }

      const result = await response.json();
      console.log("Event created successfully:", result.event_id || result.id);

      return {
        success: true,
        event_id: result.event_id || result.id,
        message: result.message || "Event created successfully!",
      };
    } catch (error) {
      console.error("Event creation error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while creating the event.",
      };
    }
  }

  static async uploadBannerFile(
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("vendor-event-banners")
        .upload(fileName, file);

      if (error) {
        console.error("File upload error:", error);
        return {
          success: false,
          error: `Failed to upload banner image: ${error.message}`,
        };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("vendor-event-banners").getPublicUrl(fileName);

      return {
        success: true,
        url: publicUrl,
      };
    } catch (error) {
      console.error("File upload error:", error);
      return {
        success: false,
        error: "Failed to upload banner image",
      };
    }
  }

  static async getAllListings(): Promise<GetListingsResponse> {
    try {
      // Get JWT token from Supabase auth
      const token = await this.getAuthToken();
      if (!token) {
        return {
          success: false,
          error: "Authentication required. Please log in again.",
        };
      }

      // Make API call to get vendor events
      const response = await fetch(
        `${this.API_BASE_URL}/events/getevent/vendor`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);

        if (response.status === 401) {
          return {
            success: false,
            error: "Authentication failed. Please log in again.",
          };
        } else {
          return {
            success: false,
            error: `Failed to fetch listings: ${response.status} ${response.statusText}`,
          };
        }
      }

      const result = await response.json();

      // Map the API response data to match our EventListing interface
      const mappedListings =
        result.data?.map((event: any) => {
          const processedImageUrl = this.processImageUrl(event.banner_image);
          return {
            ...event,
            banner_image: processedImageUrl,
            status: "active", // Default status since API doesn't provide it
          };
        }) || [];

      return {
        success: true,
        listings: mappedListings,
        total: result.data?.length || 0,
      };
    } catch (error) {
      console.error("Get listings error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while fetching listings.",
      };
    }
  }

  static async getListingById(
    id: string
  ): Promise<{ success: boolean; listing?: EventListing; error?: string }> {
    try {
      // Get JWT token from Supabase auth
      const token = await this.getAuthToken();
      if (!token) {
        return {
          success: false,
          error: "Authentication required. Please log in again.",
        };
      }

      // Make API call to get specific listing
      const response = await fetch(`${this.API_BASE_URL}/events/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);

        if (response.status === 401) {
          return {
            success: false,
            error: "Authentication failed. Please log in again.",
          };
        } else if (response.status === 404) {
          return {
            success: false,
            error: "Listing not found.",
          };
        } else {
          return {
            success: false,
            error: `Failed to fetch listing: ${response.status} ${response.statusText}`,
          };
        }
      }

      const result = await response.json();

      const listing = result.event || result;

      return {
        success: true,
        listing: {
          ...listing,
          banner_image: this.processImageUrl(listing.banner_image),
        },
      };
    } catch (error) {
      console.error("Get listing error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while fetching the listing.",
      };
    }
  }

  static async deleteEvent(
    id: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Get JWT token from Supabase auth
      const token = await this.getAuthToken();
      if (!token) {
        return {
          success: false,
          error: "Authentication required. Please log in again.",
        };
      }

      // Make API call to delete event
      const response = await fetch(`${this.API_BASE_URL}/events/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);

        if (response.status === 401) {
          return {
            success: false,
            error: "Authentication failed. Please log in again.",
          };
        } else if (response.status === 404) {
          return {
            success: false,
            error: "Event not found.",
          };
        } else {
          return {
            success: false,
            error: `Failed to delete event: ${response.status} ${response.statusText}`,
          };
        }
      }

      const result = await response.json();

      return {
        success: true,
        message: result.message || "Event deleted successfully!",
      };
    } catch (error) {
      console.error("Delete event error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while deleting the event.",
      };
    }
  }

  static async updateEvent(
    id: string,
    formData: any
  ): Promise<UpdateEventResponse> {
    try {
      // Get JWT token from Supabase auth
      const token = await this.getAuthToken();
      if (!token) {
        return {
          success: false,
          error: "Authentication required. Please log in again.",
        };
      }

      // Format the form data for API
      const eventData = this.formatFormDataForAPI(formData);

      console.log("Updating event:", id, eventData.event_name);

      // Validate required fields
      if (!eventData.agree_to_terms) {
        return {
          success: false,
          error:
            "You must agree to the terms and conditions to update an event.",
        };
      }

      // Make API call to update event
      const response = await fetch(`${this.API_BASE_URL}/events/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      console.log(
        "Event update response:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          "Event update failed:",
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
        } else if (response.status === 404) {
          return {
            success: false,
            error: "Event not found.",
          };
        } else {
          return {
            success: false,
            error: `Failed to update event: ${response.status} ${response.statusText}`,
          };
        }
      }

      const result = await response.json();
      console.log("Event updated successfully:", id);

      return {
        success: true,
        message: result.message || "Event updated successfully!",
      };
    } catch (error) {
      console.error("Event update error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while updating the event.",
      };
    }
  }
}
