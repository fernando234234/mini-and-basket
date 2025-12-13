-- ============================================
-- Gallery Collections Migration
-- Version: 1.0.0
-- ============================================

-- Create gallery_collections table
CREATE TABLE IF NOT EXISTS gallery_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image_url TEXT,
    year INTEGER,
    collection_type TEXT NOT NULL DEFAULT 'camp' CHECK (collection_type IN ('camp', 'one_day_camp', 'event')),
    order_index INTEGER DEFAULT 0
);

-- Indexes for gallery_collections
CREATE INDEX IF NOT EXISTS idx_gallery_collections_slug ON gallery_collections(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_collections_year ON gallery_collections(year);
CREATE INDEX IF NOT EXISTS idx_gallery_collections_type ON gallery_collections(collection_type);
CREATE INDEX IF NOT EXISTS idx_gallery_collections_order ON gallery_collections(order_index);

-- Trigger for updated_at
CREATE TRIGGER update_gallery_collections_updated_at
    BEFORE UPDATE ON gallery_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS for gallery_collections
ALTER TABLE gallery_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read gallery collections" ON gallery_collections
    FOR SELECT USING (true);

CREATE POLICY "Authenticated insert gallery collections" ON gallery_collections
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update gallery collections" ON gallery_collections
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete gallery collections" ON gallery_collections
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add collection_id column to gallery_photos
ALTER TABLE gallery_photos 
ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES gallery_collections(id) ON DELETE SET NULL;

-- Add storage_path column to gallery_photos for tracking storage location
ALTER TABLE gallery_photos 
ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Update category constraint to be more flexible (remove old constraint if exists)
ALTER TABLE gallery_photos 
DROP CONSTRAINT IF EXISTS gallery_photos_category_check;

-- Make category nullable and remove strict constraint for imported data
ALTER TABLE gallery_photos 
ALTER COLUMN category DROP NOT NULL;

-- Make year nullable for collection-based organization
ALTER TABLE gallery_photos 
ALTER COLUMN year DROP NOT NULL;

-- Create index for collection_id
CREATE INDEX IF NOT EXISTS idx_gallery_photos_collection ON gallery_photos(collection_id);

-- ============================================
-- Service Role Insert Policy for bulk uploads
-- ============================================

-- Allow service role to insert gallery photos (for upload script)
DROP POLICY IF EXISTS "Service role insert gallery" ON gallery_photos;
CREATE POLICY "Service role insert gallery" ON gallery_photos
    FOR INSERT WITH CHECK (true);

-- Allow service role to insert gallery collections (for upload script)
DROP POLICY IF EXISTS "Service role insert collections" ON gallery_collections;
CREATE POLICY "Service role insert collections" ON gallery_collections
    FOR INSERT WITH CHECK (true);