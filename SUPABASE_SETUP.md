# Supabase Storage Setup for Avatar Upload

## Step 1: Run Database Migration

Execute the migration file to add the `avatar_url` column and set up storage:

```sql
-- Run this in your Supabase SQL Editor
-- Or use the migration file: supabase/migrations/20250105_add_avatar_url.sql
```

## Step 2: Create Storage Bucket (Manual Setup)

If the migration doesn't automatically create the bucket, follow these steps:

1. Go to **Storage** in your Supabase dashboard
2. Click **Create Bucket**
3. Set:
   - **Name**: `avatars`
   - **Public**: ✅ **Yes** (checked)
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/*`

## Step 3: Configure Storage Policies (Manual Setup)

If RLS policies weren't created by the migration, add these in the SQL Editor:

```sql
-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow vendors to upload their own avatars
CREATE POLICY "Vendors can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars'
);

-- Allow public viewing of avatars
CREATE POLICY "Avatars are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow vendors to update their own avatars
CREATE POLICY "Vendors can update avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars');

-- Allow vendors to delete their own avatars
CREATE POLICY "Vendors can delete avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars');
```

## Step 4: Update CORS Settings (If Needed)

If you experience CORS issues, add these origins in **Settings > API > CORS origins**:
- `http://localhost:5173` (for development)
- Your production domain

## Step 5: Verify Setup

Test the avatar upload functionality:

1. Go to ProfileSetup or EditProfile page
2. Try uploading an image
3. Check if the image appears in Storage > avatars bucket
4. Verify the avatar_url is saved in the vendors table

## Environment Variables

Make sure your `.env` file has the correct Supabase configuration:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Storage URL Structure

Uploaded avatars will be stored as:
- **Path**: `vendors/{vendorId}-{timestamp}.{extension}`
- **Public URL**: `https://your-project.supabase.co/storage/v1/object/public/avatars/vendors/{filename}`

## File Validation

The frontend includes these validations:
- ✅ File type: Images only (image/*)
- ✅ File size: Maximum 5MB
- ✅ Formats: JPG, PNG, GIF

## Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Unique file naming to prevent conflicts
- ✅ Automatic cleanup of old avatars when updated
- ✅ Public read access for profile display
- ✅ Proper error handling and rollback on failures