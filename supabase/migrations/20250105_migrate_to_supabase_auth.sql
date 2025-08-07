-- Migration to Supabase Auth
-- This preserves all vendor data while integrating with Supabase Auth

-- Step 1: Create new vendor_profiles table for business data
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  phone TEXT,
  address TEXT,
  vendor_type TEXT,
  avatar_url TEXT,
  is_first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS on vendor_profiles
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for vendor_profiles
CREATE POLICY "Users can view own profile" ON vendor_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON vendor_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON vendor_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 4: Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.vendor_profiles (id, name, is_first_login)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 6: Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON vendor_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Step 7: Disable email confirmation for immediate signup
-- This allows users to sign up without email verification
-- Note: This may not work if auth.config doesn't exist - use dashboard settings instead

-- Note: Keep the old vendors table for now - we'll migrate data manually
-- ALTER TABLE vendors RENAME TO vendors_backup;