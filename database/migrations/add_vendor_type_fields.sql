-- Migration: Add vendor type fields to vendors table
-- Date: 2025-01-04
-- Description: Add vendor_type and event_sub_type columns to support vendor categorization

-- Add vendor_type column
ALTER TABLE vendors 
ADD COLUMN vendor_type TEXT CHECK (vendor_type IN ('TREK_ORGANIZER', 'LOCAL_EVENT_HOST'));

-- Add event_sub_type column (only used for LOCAL_EVENT_HOST)
ALTER TABLE vendors 
ADD COLUMN event_sub_type TEXT CHECK (event_sub_type IN ('ONE_DAY_HOSTED', 'EXPERIENCE_BASED') OR event_sub_type IS NULL);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vendors_vendor_type ON vendors(vendor_type);
CREATE INDEX IF NOT EXISTS idx_vendors_event_sub_type ON vendors(event_sub_type);

-- Add comments for documentation
COMMENT ON COLUMN vendors.vendor_type IS 'Type of vendor: TREK_ORGANIZER or LOCAL_EVENT_HOST';
COMMENT ON COLUMN vendors.event_sub_type IS 'Sub-type for LOCAL_EVENT_HOST: ONE_DAY_HOSTED or EXPERIENCE_BASED';

-- Optional: Update existing vendors to have NULL values (already done by ALTER TABLE)
-- This is safe as we handle NULL values in the application