import { supabase } from '../lib/supabase'
import { VendorType } from '../types/vendorTypes'
import type { User } from '@supabase/supabase-js'

export interface Vendor {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  vendorType: VendorType | null;
  avatar_url: string | null;
  isFirstLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Business verification fields
  business_name?: string | null;
  legal_name?: string | null;
  business_type?: string | null;
  business_registration_document?: string | null;
  website_or_social_link?: string | null;
  registered_address?: string | null;
  authorized_contact_person_name?: string | null;
  contact_phone_number?: string | null;
  contact_email?: string | null;
  id_proof_document?: string | null;
  account_holder_name?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  business_details_verified?: boolean;
  business_verification_status?: string;
  business_verification_completed_at?: Date | null;
  business_verification_reminder_shown?: boolean;
  // Supabase Auth user data
  authUser?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface VendorProfile {
  name: string;
  phone: string;
  address: string;
  vendorType: VendorType;
  avatar_url?: string | null;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export class AuthService {
  static async loginVendor(credentials: LoginCredentials): Promise<Vendor | null> {
    const { email, password } = credentials;
    
    try {
      // Use Supabase Auth for login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Login error:', authError.message);
        return null;
      }

      if (!authData.user) {
        return null;
      }

      // Get vendor profile data
      const { data: profileData, error: profileError } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
        return null;
      }

      // If no profile exists, create one
      if (!profileData) {
        const { data: newProfile, error: createError } = await supabase
          .from('vendor_profiles')
          .insert({
            id: authData.user.id,
            name: authData.user.user_metadata?.full_name || null,
            is_first_login: true
          })
          .select()
          .single();

        if (createError) {
          console.error('Profile creation error:', createError);
          return null;
        }

        return {
          id: authData.user.id,
          email: authData.user.email!,
          name: newProfile.name,
          phone: newProfile.phone,
          address: newProfile.address,
          vendorType: newProfile.vendor_type as VendorType,
          avatar_url: newProfile.avatar_url,
          isFirstLogin: newProfile.is_first_login,
          createdAt: new Date(newProfile.created_at),
          updatedAt: new Date(newProfile.updated_at),
          authUser: authData.user
        };
      }

      return {
        id: authData.user.id,
        email: authData.user.email!,
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        vendorType: profileData.vendor_type as VendorType,
        avatar_url: profileData.avatar_url,
        isFirstLogin: profileData.is_first_login,
        createdAt: new Date(profileData.created_at),
        updatedAt: new Date(profileData.updated_at),
        authUser: authData.user
      };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  static async registerVendor(credentials: RegisterCredentials): Promise<Vendor | null> {
    const { email, password, confirmPassword } = credentials;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    try {
      // Using Supabase Auth for registration (no email confirmation required)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            // Add any additional user metadata here
            full_name: null
          }
        }
      });

      if (authError) {
        console.error('Registration error:', authError);
        // If user already exists, try to sign them in instead
        if (authError.message.includes('User already registered') || authError.message.includes('already registered')) {
          console.log('User already exists, attempting login instead...');
          return await this.loginVendor({ email, password });
        }
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create vendor profile - RLS is now disabled so this will work
      console.log('Creating vendor profile for new user:', authData.user.id);
      
      const { data: newProfile, error: createError } = await supabase
        .from('vendor_profiles')
        .insert({
          id: authData.user.id,
          name: authData.user.user_metadata?.full_name || 'New User',
          is_first_login: true
        })
        .select()
        .single();

      if (createError) {
        console.error('Profile creation error:', createError);
        throw new Error('Failed to create vendor profile: ' + createError.message);
      }

      const profileData = newProfile;

      return {
        id: authData.user.id,
        email: authData.user.email!,
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        vendorType: profileData.vendor_type as VendorType,
        avatar_url: profileData.avatar_url,
        isFirstLogin: profileData.is_first_login,
        createdAt: new Date(profileData.created_at),
        updatedAt: new Date(profileData.updated_at),
        authUser: authData.user
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async updateVendorProfile(vendorId: string, profile: VendorProfile): Promise<Vendor | null> {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .update({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          vendor_type: profile.vendorType,
          is_first_login: false
        })
        .eq('id', vendorId)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        return null;
      }

      // Get current auth user
      const { data: { user } } = await supabase.auth.getUser();

      return {
        id: data.id,
        email: user?.email || '',
        name: data.name,
        phone: data.phone,
        address: data.address,
        vendorType: data.vendor_type,
        avatar_url: data.avatar_url,
        isFirstLogin: data.is_first_login,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        authUser: user || undefined
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return null;
    }
  }

  static async getVendor(vendorId: string): Promise<Vendor | null> {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (error) {
        console.error('Get vendor profile error:', error);
        return null;
      }

      // Get current auth user
      const { data: { user } } = await supabase.auth.getUser();

      return {
        id: data.id,
        email: user?.email || '',
        name: data.name,
        phone: data.phone,
        address: data.address,
        vendorType: data.vendor_type,
        avatar_url: data.avatar_url,
        isFirstLogin: data.is_first_login,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        // Business verification fields
        business_name: data.business_name,
        legal_name: data.legal_name,
        business_type: data.business_type,
        business_registration_document: data.business_registration_document,
        website_or_social_link: data.website_or_social_link,
        registered_address: data.registered_address,
        authorized_contact_person_name: data.authorized_contact_person_name,
        contact_phone_number: data.contact_phone_number,
        contact_email: data.contact_email,
        id_proof_document: data.id_proof_document,
        account_holder_name: data.account_holder_name,
        bank_name: data.bank_name,
        account_number: data.account_number,
        ifsc_code: data.ifsc_code,
        business_details_verified: data.business_details_verified,
        business_verification_status: data.business_verification_status,
        business_verification_completed_at: data.business_verification_completed_at ? new Date(data.business_verification_completed_at) : null,
        business_verification_reminder_shown: data.business_verification_reminder_shown,
        authUser: user || undefined
      };
    } catch (error) {
      console.error('Get vendor error:', error);
      return null;
    }
  }

  static async signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google SSO error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Google SSO error:', error);
      return { success: false, error: 'Failed to sign in with Google' };
    }
  }

  static async handleAuthCallback(): Promise<Vendor | null> {
    try {
      // First, try to get the session from the URL hash if it exists
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return null;
      }

      // If no session, wait for the auth state to be set from URL hash
      if (!session) {
        console.log('No session found, waiting for auth state...');
        // Wait a bit for Supabase to process URL hash
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try again
        const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
        
        if (retryError || !retrySession) {
          console.error('Auth callback error:', retryError);
          return null;
        }
        
        return this.processAuthenticatedUser(retrySession.user);
      }

      return this.processAuthenticatedUser(session.user);
    } catch (error) {
      console.error('Auth callback error:', error);
      return null;
    }
  }

  private static async processAuthenticatedUser(user: any): Promise<Vendor | null> {
    try {
      // Check if vendor profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
        return null;
      }

      if (existingProfile) {
        return {
          id: existingProfile.id,
          email: user.email!,
          name: existingProfile.name || user.user_metadata?.full_name || null,
          phone: existingProfile.phone,
          address: existingProfile.address,
          vendorType: existingProfile.vendor_type,
          avatar_url: existingProfile.avatar_url,
          isFirstLogin: existingProfile.is_first_login,
          createdAt: new Date(existingProfile.created_at),
          updatedAt: new Date(existingProfile.updated_at),
          authUser: user
        };
      } else {
        // Create new vendor profile (trigger should handle this, but backup)
        const { data: newProfile, error: insertError } = await supabase
          .from('vendor_profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.full_name || null,
            is_first_login: true
          })
          .select()
          .single();

        if (insertError) {
          console.error('Failed to create vendor profile:', insertError);
          return null;
        }

        return {
          id: newProfile.id,
          email: user.email!,
          name: newProfile.name,
          phone: newProfile.phone,
          address: newProfile.address,
          vendorType: newProfile.vendor_type,
          avatar_url: newProfile.avatar_url,
          isFirstLogin: newProfile.is_first_login,
          createdAt: new Date(newProfile.created_at),
          updatedAt: new Date(newProfile.updated_at),
          authUser: user
        };
      }
    } catch (error) {
      console.error('Process authenticated user error:', error);
      return null;
    }
  }

  // New methods for Supabase Auth session management
  static async getCurrentUser(): Promise<Vendor | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      return this.getVendor(user.id);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  static onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
  }
}