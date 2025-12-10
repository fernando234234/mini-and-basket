-- Create registrations table
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Package
  package_type TEXT NOT NULL CHECK (package_type IN ('giornaliero', 'completa', 'weekend')),
  
  -- Camper info
  camper_nome TEXT NOT NULL,
  camper_cognome TEXT NOT NULL,
  camper_data_nascita DATE NOT NULL,
  camper_taglia TEXT NOT NULL,
  camper_esperienza TEXT NOT NULL,
  camper_allergie TEXT,
  camper_note_mediche TEXT,
  
  -- Parent info
  genitore_nome TEXT NOT NULL,
  genitore_cognome TEXT NOT NULL,
  genitore_email TEXT NOT NULL,
  genitore_telefono TEXT NOT NULL,
  genitore_codice_fiscale TEXT NOT NULL,
  genitore_indirizzo TEXT NOT NULL,
  
  -- Emergency contact
  emergenza_nome TEXT NOT NULL,
  emergenza_relazione TEXT NOT NULL,
  emergenza_telefono TEXT NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  terms_accepted BOOLEAN NOT NULL,
  privacy_accepted BOOLEAN NOT NULL
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon users (public registration)
CREATE POLICY "Allow public inserts" ON registrations
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read (for admin)
CREATE POLICY "Allow authenticated reads" ON registrations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update (for admin)
CREATE POLICY "Allow authenticated updates" ON registrations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete (for admin)
CREATE POLICY "Allow authenticated deletes" ON registrations
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- Gallery Photos Table
-- ============================================

CREATE TABLE gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('allenamenti', 'partite', 'attivita', 'gruppo')),
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Public can read gallery photos
CREATE POLICY "Public read gallery" ON gallery_photos
  FOR SELECT USING (true);

-- Only authenticated users can insert (for admin)
CREATE POLICY "Authenticated insert gallery" ON gallery_photos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update (for admin)
CREATE POLICY "Authenticated update gallery" ON gallery_photos
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete (for admin)
CREATE POLICY "Authenticated delete gallery" ON gallery_photos
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_gallery_photos_updated_at
  BEFORE UPDATE ON gallery_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();