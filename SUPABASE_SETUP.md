# Supabase Storage Setup Guide

This project has been migrated from Cloudinary to Supabase Storage for image uploads.

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Create Storage Buckets
In your Supabase dashboard:
1. Go to Storage
2. Create a new bucket named `products`
3. Set up the following Row Level Security policies:

```sql
-- Allow public access to read images
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

-- Allow users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Environment Variables
Add the following to your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Development Server
```bash
npm run dev
```

## Features

- **Image Upload**: Direct file uploads to Supabase Storage
- **Multiple Images**: Support for uploading multiple product images
- **QR Code Images**: Separate upload for QR code images
- **Image Preview**: Visual preview of uploaded images with delete functionality
- **Secure Storage**: Uses Supabase's security features for file access

## API Endpoints

- `POST /api/upload` - Upload images to Supabase Storage
  - Accepts: FormData with `file` and optional `bucket`
  - Returns: `{ url: string }` with the public URL of the uploaded file

## Changes Made

1. **Dependencies**: Replaced `cloudinary` with `@supabase/supabase-js`
2. **Configuration**: Updated Next.js config for Supabase domains
3. **Forms**: Updated product creation/edit forms to use file uploads
4. **API**: Created new upload endpoint for Supabase Storage
5. **Client**: Added Supabase client with helper functions

## File Structure

```
lib/
  supabase.js          # Supabase client and upload helpers
app/
  api/
    upload/
      route.ts         # Upload API endpoint
  seller/
    products/
      new/
        page.tsx        # Updated with file upload
      [id]/
        edit/
          page.tsx      # Updated with file upload
```
