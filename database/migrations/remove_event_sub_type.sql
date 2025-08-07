-- Migration: Remove event_sub_type column from vendors table
-- Date: 2025-01-04
-- Description: Remove event_sub_type field since event type should be dynamic, not static

-- Drop the index first
DROP INDEX IF EXISTS idx_vendors_event_sub_type;

-- Drop the event_sub_type column
ALTER TABLE vendors DROP COLUMN IF EXISTS event_sub_type;