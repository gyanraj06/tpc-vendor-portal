-- TEMPORARY: Disable RLS on storage for testing
-- This makes uploads work but is less secure
-- Use only for development/testing

ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;