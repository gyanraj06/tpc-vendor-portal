-- Supabase Storage RLS Policies for Document and Avatar Uploads
-- Run this in your Supabase SQL Editor
-- Note: RLS is already enabled on storage.objects by default

-- ==============================================
-- DOCUMENTS BUCKET POLICIES
-- ==============================================

-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow authenticated users to view documents
CREATE POLICY "Users can view documents" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'documents');

-- Allow authenticated users to update their own documents
CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own documents
CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==============================================
-- AVATARS BUCKET POLICIES
-- ==============================================

-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow authenticated users to view avatars
CREATE POLICY "Users can view avatars" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

-- Allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==============================================
-- ALTERNATIVE: DISABLE RLS (NOT RECOMMENDED)
-- ==============================================
-- Uncomment the line below if you want to disable RLS entirely (less secure)
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;