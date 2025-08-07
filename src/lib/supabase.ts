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