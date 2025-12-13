# 🗄️ Database Schema Documentation

Complete documentation for the Supabase PostgreSQL database schema.

---

## Overview

The database uses **Supabase** (PostgreSQL) with Row Level Security (RLS) policies.

| Table | Purpose |
|-------|---------|
| `registrations` | Camp registrations |
| `payments` | Payment records |
| `gallery_collections` | Photo album collections |
| `gallery_photos` | Individual photos |
| `contact_submissions` | Contact form entries |

---

## Tables

### `registrations`

Main table storing all camp registration data.

#### Schema

```sql
CREATE TABLE registrations (
    -- Primary Key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Package Selection
    package_type TEXT NOT NULL CHECK (package_type IN ('standard', 'alta_specializzazione')),
    bus_transfer BOOLEAN DEFAULT false,
    
    -- Parent/Guardian Information
    genitore_nome_cognome TEXT NOT NULL,
    genitore_codice_fiscale TEXT,                    -- Optional
    genitore_citta TEXT NOT NULL,
    genitore_cap TEXT NOT NULL,
    genitore_indirizzo TEXT NOT NULL,
    genitore_telefono TEXT NOT NULL,
    genitore_email TEXT NOT NULL,
    
    -- Camper/Participant Information
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
    camper_altezza INTEGER NOT NULL,                 -- cm
    camper_peso INTEGER NOT NULL,                    -- kg
    camper_numero_scarpe TEXT NOT NULL,              -- EU size
    
    -- Experience
    camper_esperienza TEXT NOT NULL CHECK (camper_esperienza IN ('principiante', 'intermedio', 'avanzato')),
    camper_societa TEXT,                             -- Optional: sports club
    
    -- Medical Information (all optional)
    allergie_intolleranze TEXT,
    patologie_note TEXT,
    terapie_in_corso TEXT,
    
    -- Consents
    liberatoria_foto_video BOOLEAN NOT NULL DEFAULT false,
    accettazione_regolamento BOOLEAN NOT NULL DEFAULT false,
    privacy_policy BOOLEAN NOT NULL DEFAULT false,
    
    -- Registration Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    
    -- Payment Information
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'failed', 'refunded')),
    payment_type TEXT CHECK (payment_type IN ('full', 'deposit')),
    amount_paid INTEGER DEFAULT 0,                   -- In euros (not cents)
    amount_due INTEGER,                              -- In euros
    stripe_session_id TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    
    -- Additional
    codice_invito TEXT                               -- Invitation/referral code
);
```

#### Columns Reference

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `created_at` | TIMESTAMPTZ | Auto | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Auto | Last update timestamp |
| `package_type` | TEXT | Yes | 'standard' or 'alta_specializzazione' |
| `bus_transfer` | BOOLEAN | No | Naples bus transfer option |
| `genitore_nome_cognome` | TEXT | Yes | Parent full name |
| `genitore_codice_fiscale` | TEXT | No | Parent tax code |
| `genitore_citta` | TEXT | Yes | Parent city |
| `genitore_cap` | TEXT | Yes | Parent postal code |
| `genitore_indirizzo` | TEXT | Yes | Parent address |
| `genitore_telefono` | TEXT | Yes | Parent phone |
| `genitore_email` | TEXT | Yes | Parent email |
| `camper_nome_cognome` | TEXT | Yes | Child full name |
| `camper_codice_fiscale` | TEXT | Yes | Child tax code |
| `camper_luogo_nascita` | TEXT | Yes | Child birthplace |
| `camper_data_nascita` | DATE | Yes | Child birthdate |
| `camper_sesso` | CHAR(1) | Yes | 'M' or 'F' |
| `camper_citta` | TEXT | Yes | Child city |
| `camper_cap` | TEXT | Yes | Child postal code |
| `camper_indirizzo` | TEXT | Yes | Child address |
| `camper_scuola` | TEXT | Yes | School name |
| `camper_classe` | TEXT | Yes | Grade/class |
| `camper_taglia` | TEXT | Yes | T-shirt size |
| `camper_altezza` | INTEGER | Yes | Height in cm |
| `camper_peso` | INTEGER | Yes | Weight in kg |
| `camper_numero_scarpe` | TEXT | Yes | Shoe size (EU) |
| `camper_esperienza` | TEXT | Yes | Experience level |
| `camper_societa` | TEXT | No | Sports club |
| `allergie_intolleranze` | TEXT | No | Allergies |
| `patologie_note` | TEXT | No | Medical conditions |
| `terapie_in_corso` | TEXT | No | Current medications |
| `liberatoria_foto_video` | BOOLEAN | Yes | Photo/video consent |
| `accettazione_regolamento` | BOOLEAN | Yes | Rules acceptance |
| `privacy_policy` | BOOLEAN | Yes | Privacy acceptance |
| `status` | TEXT | No | Registration status |
| `payment_status` | TEXT | No | Payment status |
| `payment_type` | TEXT | No | 'full' or 'deposit' |
| `amount_paid` | INTEGER | No | Amount paid (€) |
| `amount_due` | INTEGER | No | Amount due (€) |
| `stripe_session_id` | TEXT | No | Stripe session ID |
| `payment_date` | TIMESTAMPTZ | No | Payment timestamp |
| `codice_invito` | TEXT | No | Invitation code |

#### Indexes

```sql
CREATE INDEX idx_registrations_email ON registrations(genitore_email);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);
```

#### Trigger

```sql
CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

#### RLS Policies

```sql
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (registration form)
CREATE POLICY "Allow public inserts" ON registrations
    FOR INSERT WITH CHECK (true);

-- Only authenticated users can read
CREATE POLICY "Allow authenticated reads" ON registrations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update
CREATE POLICY "Allow authenticated updates" ON registrations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete
CREATE POLICY "Allow authenticated deletes" ON registrations
    FOR DELETE USING (auth.role() = 'authenticated');
```

**Important:** API routes use `supabaseAdmin` (service role) to bypass RLS for inserts and updates.

---

### `payments`

Tracks individual payment transactions.

#### Schema

```sql
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'bonifico')),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('deposit', 'full', 'balance')),
    amount INTEGER NOT NULL,                         -- In euros
    
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    bonifico_reference TEXT,                         -- Bank transfer reference
    
    metadata JSONB DEFAULT '{}'::jsonb
);
```

#### Columns Reference

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `registration_id` | UUID | Yes | FK to registrations |
| `created_at` | TIMESTAMPTZ | Auto | Creation timestamp |
| `payment_method` | TEXT | Yes | 'stripe' or 'bonifico' |
| `payment_type` | TEXT | Yes | 'deposit', 'full', or 'balance' |
| `amount` | INTEGER | Yes | Amount in euros |
| `status` | TEXT | No | Payment status |
| `stripe_payment_intent_id` | TEXT | No | Stripe payment intent |
| `stripe_session_id` | TEXT | No | Stripe session ID |
| `bonifico_reference` | TEXT | No | Bank transfer ref |
| `metadata` | JSONB | No | Additional data |

#### Indexes

```sql
CREATE INDEX idx_payments_registration ON payments(registration_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session_id);
```

#### RLS Policies

```sql
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Service role or authenticated can insert
CREATE POLICY "Service role insert payments" ON payments
    FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Authenticated can read
CREATE POLICY "Admin read payments" ON payments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated can update
CREATE POLICY "Admin update payments" ON payments
    FOR UPDATE USING (auth.role() = 'authenticated');
```

---

### `gallery_collections`

Organizes photos into albums/collections.

#### Schema

```sql
CREATE TABLE gallery_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,                       -- URL-friendly identifier
    description TEXT,
    cover_image_url TEXT,
    year INTEGER,
    collection_type TEXT NOT NULL DEFAULT 'camp' CHECK (collection_type IN ('camp', 'one_day_camp', 'event')),
    order_index INTEGER DEFAULT 0
);
```

#### Columns Reference

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `created_at` | TIMESTAMPTZ | Auto | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Auto | Last update |
| `name` | TEXT | Yes | Display name |
| `slug` | TEXT | Yes | URL slug (unique) |
| `description` | TEXT | No | Collection description |
| `cover_image_url` | TEXT | No | Cover image URL |
| `year` | INTEGER | No | Year of collection |
| `collection_type` | TEXT | Yes | Type of collection |
| `order_index` | INTEGER | No | Display order |

#### Indexes

```sql
CREATE INDEX idx_gallery_collections_slug ON gallery_collections(slug);
CREATE INDEX idx_gallery_collections_year ON gallery_collections(year);
CREATE INDEX idx_gallery_collections_type ON gallery_collections(collection_type);
CREATE INDEX idx_gallery_collections_order ON gallery_collections(order_index);
```

---

### `gallery_photos`

Individual photos within collections.

#### Schema

```sql
CREATE TABLE gallery_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES gallery_collections(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    url TEXT NOT NULL,                               -- Public URL
    storage_path TEXT,                               -- Supabase storage path
    alt_text TEXT NOT NULL,
    year INTEGER,
    category TEXT,                                   -- Optional categorization
    
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0
);
```

#### Columns Reference

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `collection_id` | UUID | No | FK to collections |
| `created_at` | TIMESTAMPTZ | Auto | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Auto | Last update |
| `url` | TEXT | Yes | Public image URL |
| `storage_path` | TEXT | No | Supabase storage path |
| `alt_text` | TEXT | Yes | Image alt text |
| `year` | INTEGER | No | Year (can inherit from collection) |
| `category` | TEXT | No | Category tag |
| `featured` | BOOLEAN | No | Featured image flag |
| `sort_order` | INTEGER | No | Display order |

#### Indexes

```sql
CREATE INDEX idx_gallery_year ON gallery_photos(year);
CREATE INDEX idx_gallery_category ON gallery_photos(category);
CREATE INDEX idx_gallery_featured ON gallery_photos(featured) WHERE featured = true;
CREATE INDEX idx_gallery_photos_collection ON gallery_photos(collection_id);
```

#### RLS Policies

```sql
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Public can read (gallery is public)
CREATE POLICY "Public read gallery" ON gallery_photos
    FOR SELECT USING (true);

-- Only authenticated can modify
CREATE POLICY "Authenticated insert gallery" ON gallery_photos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update gallery" ON gallery_photos
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete gallery" ON gallery_photos
    FOR DELETE USING (auth.role() = 'authenticated');
```

---

### `contact_submissions`

Contact form submissions.

#### Schema

```sql
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
```

#### Columns Reference

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `created_at` | TIMESTAMPTZ | Auto | Submission time |
| `name` | TEXT | Yes | Sender name |
| `email` | TEXT | Yes | Sender email |
| `phone` | TEXT | Yes | Sender phone |
| `subject` | TEXT | Yes | Subject category |
| `message` | TEXT | Yes | Message content |
| `status` | TEXT | No | Processing status |
| `responded_at` | TIMESTAMPTZ | No | Response timestamp |
| `admin_notes` | TEXT | No | Internal notes |

#### Subject Categories

| Value | Italian | English |
|-------|---------|---------|
| `info` | Informazioni generali | General info |
| `iscrizione` | Iscrizioni | Registration |
| `pagamenti` | Pagamenti | Payments |
| `programma` | Programma | Program |
| `altro` | Altro | Other |

#### Indexes

```sql
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_created_at ON contact_submissions(created_at DESC);
```

#### RLS Policies

```sql
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Public insert contacts" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Only admin can read
CREATE POLICY "Admin read contacts" ON contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only admin can update
CREATE POLICY "Admin update contacts" ON contact_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');
```

---

## Helper Function

Automatic `updated_at` timestamp management:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

---

## TypeScript Types

Defined in [`src/lib/supabase.ts`](../src/lib/supabase.ts:129):

```typescript
export type Database = {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          package_type: 'standard' | 'alta_specializzazione'
          bus_transfer: boolean
          genitore_nome_cognome: string
          genitore_codice_fiscale: string | null
          // ... all columns
          status: 'pending' | 'confirmed' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded'
        }
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Insert>
      }
      payments: { ... }
      gallery_photos: { ... }
      contact_submissions: { ... }
    }
  }
}
```

---

## Storage Buckets

### `gallery` Bucket

For storing gallery photos.

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true);

-- Public read policy
CREATE POLICY "Public read gallery" ON storage.objects
    FOR SELECT USING (bucket_id = 'gallery');

-- Authenticated upload policy
CREATE POLICY "Authenticated upload gallery" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'gallery' AND 
        auth.role() = 'authenticated'
    );
```

**Storage URL Pattern:**
```
https://<project-ref>.supabase.co/storage/v1/object/public/gallery/<path>
```

---

## Migration Files

Located in [`supabase/migrations/`](../supabase/migrations/):

| File | Purpose |
|------|---------|
| `20241210_initial_schema.sql` | Main tables, indexes, RLS |
| `20241211_storage_buckets.sql` | Storage bucket setup |
| `20241213_gallery_collections.sql` | Gallery collections table |
| `20241213230000_make_gallery_public.sql` | Public gallery access |

---

## Common Queries

### Get all confirmed registrations

```sql
SELECT * FROM registrations 
WHERE status = 'confirmed' 
ORDER BY created_at DESC;
```

### Get registration with payments

```sql
SELECT r.*, p.amount, p.status as payment_record_status
FROM registrations r
LEFT JOIN payments p ON r.id = p.registration_id
WHERE r.id = 'uuid-here';
```

### Get revenue summary

```sql
SELECT 
    COUNT(*) as total,
    SUM(amount_paid) as total_revenue,
    COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as fully_paid,
    COUNT(CASE WHEN payment_status = 'partial' THEN 1 END) as deposits
FROM registrations
WHERE status != 'cancelled';
```

### Get size distribution

```sql
SELECT camper_taglia, COUNT(*) as count
FROM registrations
WHERE status != 'cancelled'
GROUP BY camper_taglia
ORDER BY 
    CASE camper_taglia
        WHEN 'XXS' THEN 1
        WHEN 'XS' THEN 2
        WHEN 'S' THEN 3
        WHEN 'M' THEN 4
        WHEN 'L' THEN 5
        WHEN 'XL' THEN 6
    END;
```

### Get gallery collection with photos

```sql
SELECT c.*, 
    (SELECT COUNT(*) FROM gallery_photos WHERE collection_id = c.id) as photo_count
FROM gallery_collections c
ORDER BY c.order_index;
```

---

## Local Development

### Start Supabase locally

```bash
supabase start
```

### Apply migrations

```bash
supabase db reset
```

### Access local Studio

```
http://localhost:54323
```

### Get local credentials

```bash
supabase status
```

---

*For payment flow details, see [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)*