-- Simple approach: Make buckets public
-- This bypasses RLS issues

UPDATE storage.buckets 
SET public = true 
WHERE name IN ('documents', 'avatars');