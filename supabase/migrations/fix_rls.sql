-- Disable RLS on vendor_profiles table to fix permission issues
ALTER TABLE vendor_profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON vendor_profiles;