-- ============================================
-- Mini & Basket Camp Database Schema
-- Version: 1.0.0
-- ============================================

-- Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- REGISTRATIONS TABLE
-- ============================================

CREATE TABLE registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Package Selection
    package_type TEXT NOT NULL CHECK (package_type IN ('standard', 'alta_specializzazione')),
    bus_transfer BOOLEAN DEFAULT false,
    
    -- Parent/Guardian Information
    genitore_nome_cognome TEXT NOT NULL,
    genitore_codice_fiscale TEXT,
    genitore_citta TEXT NOT NULL,
    genitore_cap TEXT NOT NULL,
    genitore_indirizzo TEXT NOT NULL,
    genitore_telefono TEXT NOT NULL,
    genitore_email TEXT NOT NULL,
    
    -- Participant Information
    camper_nome_cognome TEXT NOT NULL,
    camper_codice_fiscale TEXT NOT NULL,
    camper_luogo_nascita TEXT NOT NULL,
    camper_data_nascita DATE NOT NULL,
    camper_sesso CHAR(1) NOT NULL CHECK (camper_sesso IN ('M', 'F')),
    camper_citta TEXT NOT NULL,
    camper_cap TEXT NOT NULL,
    camper_indirizzo TEXT NOT NULL,
    camper_scuola TEXT NOT NULL,
    camper_classe TEXT NOT NULL,
    camper_taglia TEXT NOT NULL CHECK (camper_taglia IN ('XXS', 'XS', 'S', 'M', 'L', 'XL')),
    camper_altezza INTEGER NOT NULL,
    camper_peso INTEGER NOT NULL,
    camper_numero_scarpe TEXT NOT NULL,
    
    -- Experience
    camper_esperienza TEXT NOT NULL CHECK (camper_esperienza IN ('principiante', 'intermedio', 'avanzato')),
    camper_societa TEXT,
    
    -- Medical Information
    allergie_intolleranze TEXT,
    patologie_note TEXT,
    terapie_in_corso TEXT,
    
    -- Consents
    liberatoria_foto_video BOOLEAN NOT NULL DEFAULT false,
    accettazione_regolamento BOOLEAN NOT NULL DEFAULT false,
    privacy_policy BOOLEAN NOT NULL DEFAULT false,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    
    -- Payment
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'failed', 'refunded')),
    payment_type TEXT CHECK (payment_type IN ('full', 'deposit')),
    amount_paid INTEGER DEFAULT 0,
    amount_due INTEGER,
    stripe_session_id TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    
    -- Additional
    codice_invito TEXT
);

CREATE INDEX idx_registrations_email ON registrations(genitore_email);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);

CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS for registrations
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON registrations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates" ON registrations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated deletes" ON registrations
    FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- PAYMENTS TABLE
-- ============================================

CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'bonifico')),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('deposit', 'full', 'balance')),
    amount INTEGER NOT NULL,
    
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    bonifico_reference TEXT,
    
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_payments_registration ON payments(registration_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session_id);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role insert payments" ON payments
    FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Admin read payments" ON payments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update payments" ON payments
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- GALLERY PHOTOS TABLE
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

CREATE INDEX idx_gallery_year ON gallery_photos(year);
CREATE INDEX idx_gallery_category ON gallery_photos(category);
CREATE INDEX idx_gallery_featured ON gallery_photos(featured) WHERE featured = true;

CREATE TRIGGER update_gallery_photos_updated_at
    BEFORE UPDATE ON gallery_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read gallery" ON gallery_photos
    FOR SELECT USING (true);

CREATE POLICY "Authenticated insert gallery" ON gallery_photos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update gallery" ON gallery_photos
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete gallery" ON gallery_photos
    FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================

CREATE TABLE contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL CHECK (subject IN ('info', 'iscrizione', 'pagamenti', 'programma', 'altro')),
    message TEXT NOT NULL,
    
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
    responded_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT
);

CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_created_at ON contact_submissions(created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert contacts" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read contacts" ON contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update contacts" ON contact_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');