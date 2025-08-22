import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      vendor_profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          address: string | null
          vendor_type: string | null
          avatar_url: string | null
          is_first_login: boolean
          business_name: string | null
          legal_name: string | null
          business_type: string | null
          business_registration_document: string | null
          website_or_social_link: string | null
          registered_address: string | null
          authorized_contact_person_name: string | null
          contact_phone_number: string | null
          contact_email: string | null
          id_proof_document: string | null
          account_holder_name: string | null
          bank_name: string | null
          account_number: string | null
          ifsc_code: string | null
          business_details_verified: boolean | null
          business_verification_status: string | null
          business_verification_completed_at: string | null
          business_verification_reminder_shown: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          address?: string | null
          vendor_type?: string | null
          avatar_url?: string | null
          is_first_login?: boolean
          business_name?: string | null
          legal_name?: string | null
          business_type?: string | null
          business_registration_document?: string | null
          website_or_social_link?: string | null
          registered_address?: string | null
          authorized_contact_person_name?: string | null
          contact_phone_number?: string | null
          contact_email?: string | null
          id_proof_document?: string | null
          account_holder_name?: string | null
          bank_name?: string | null
          account_number?: string | null
          ifsc_code?: string | null
          business_details_verified?: boolean | null
          business_verification_status?: string | null
          business_verification_completed_at?: string | null
          business_verification_reminder_shown?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string | null
          phone?: string | null
          address?: string | null
          vendor_type?: string | null
          avatar_url?: string | null
          is_first_login?: boolean
          business_name?: string | null
          legal_name?: string | null
          business_type?: string | null
          business_registration_document?: string | null
          website_or_social_link?: string | null
          registered_address?: string | null
          authorized_contact_person_name?: string | null
          contact_phone_number?: string | null
          contact_email?: string | null
          id_proof_document?: string | null
          account_holder_name?: string | null
          bank_name?: string | null
          account_number?: string | null
          ifsc_code?: string | null
          business_details_verified?: boolean | null
          business_verification_status?: string | null
          business_verification_completed_at?: string | null
          business_verification_reminder_shown?: boolean | null
          updated_at?: string
        }
      }
      // Keep old vendors table for reference (can be removed after migration)
      vendors: {
        Row: {
          id: string
          email: string
          password: string
          name: string | null
          phone: string | null
          address: string | null
          vendor_type: string | null
          avatar_url: string | null
          is_first_login: boolean
          created_at: string
          updated_at: string
        }
      }
    }
  }
}