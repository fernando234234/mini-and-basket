-- ============================================
-- Storage Buckets for Mini & Basket Camp
-- ============================================
-- This migration creates storage buckets for:
-- 1. gallery - Public bucket for camp photo gallery
-- 2. documents - Private bucket for registration documents

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('gallery', 'gallery', true),
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Gallery Bucket Policies (Public Read, Authenticated Write)
-- ============================================

-- Gallery images are publicly accessible (anyone can view)
CREATE POLICY "Gallery images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

-- Authenticated users can upload gallery images
CREATE POLICY "Authenticated users can upload gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Authenticated users can update gallery images
CREATE POLICY "Authenticated users can update gallery images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Authenticated users can delete gallery images
CREATE POLICY "Authenticated users can delete gallery images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- ============================================
-- Documents Bucket Policies (Private, Authenticated Only)
-- ============================================

-- Only authenticated users can view documents
CREATE POLICY "Authenticated users can access documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Authenticated users can upload documents
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Authenticated users can update documents
CREATE POLICY "Authenticated users can update documents"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Authenticated users can delete documents
CREATE POLICY "Authenticated users can delete documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated');