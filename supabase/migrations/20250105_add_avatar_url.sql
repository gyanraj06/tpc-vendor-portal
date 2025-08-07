-- Add avatar_url column to vendors table
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create avatars storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies for avatars bucket
CREATE POLICY "Vendors can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendors can view their own avatars" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendors can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendors can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to avatars (since they're profile pictures)
CREATE POLICY "Avatars are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');