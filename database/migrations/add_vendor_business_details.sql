-- Migration: Add vendor business details columns to existing vendor_profiles table
-- This adds business verification details required for experience listings

-- Add business verification columns to existing vendor_profiles table
ALTER TABLE vendor_profiles 
ADD COLUMN business_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN legal_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN business_type VARCHAR(50) DEFAULT NULL,
ADD COLUMN business_registration_document VARCHAR(500) DEFAULT NULL,
ADD COLUMN website_or_social_link VARCHAR(500) DEFAULT NULL,
ADD COLUMN registered_address TEXT DEFAULT NULL,
ADD COLUMN authorized_contact_person_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN contact_phone_number VARCHAR(20) DEFAULT NULL,
ADD COLUMN contact_email VARCHAR(255) DEFAULT NULL,
ADD COLUMN id_proof_document VARCHAR(500) DEFAULT NULL,
ADD COLUMN account_holder_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN bank_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN account_number VARCHAR(50) DEFAULT NULL,
ADD COLUMN ifsc_code VARCHAR(11) DEFAULT NULL,
ADD COLUMN business_details_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN business_verification_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN business_verification_completed_at TIMESTAMP NULL DEFAULT NULL,
ADD COLUMN business_verification_reminder_shown BOOLEAN DEFAULT FALSE;

-- Create indexes for faster verification checks
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_business_verified ON vendor_profiles(business_details_verified);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_verification_status ON vendor_profiles(business_verification_status);