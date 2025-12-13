-- ============================================
-- Fix Gallery Bucket Public Access
-- ============================================
-- This migration ensures the gallery bucket is public
-- and has proper RLS policies for public read access.

-- Update the gallery bucket to be public (idempotent)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'gallery';

-- Ensure the bucket exists and is public (in case it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policy if it exists (to recreate cleanly)
DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for gallery" ON storage.objects;

-- Create public read access policy for gallery bucket
CREATE POLICY "Public read access for gallery"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Grant anon access to read from storage (needed for public access)
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT ON storage.buckets TO anon;