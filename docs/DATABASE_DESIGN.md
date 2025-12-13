# Mini & Basket Camp - Database Design Document

## Overview

This document provides a comprehensive database design for the Mini & Basket Camp registration system. It includes the complete schema, local development setup, and migration strategy to Supabase production.

---

## Table of Contents

1. [Schema Analysis](#schema-analysis)
2. [Entity-Relationship Diagram](#entity-relationship-diagram)
3. [Table Definitions](#table-definitions)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
7. [Local Database Setup Recommendation](#local-database-setup-recommendation)
8. [Setup Instructions](#setup-instructions)
9. [Migration Strategy](#migration-strategy)
10. [Sample Data](#sample-data)

---

## Schema Analysis

### Current Schema Issues (docs/supabase-schema.sql)

The existing schema is **outdated** and doesn't match the TypeScript interfaces:

| Issue | Current Schema | Required by TypeScript |
|-------|----------------|----------------------|
| Package types | 'giornaliero', 'completa', 'weekend' | 'standard', 'alta_specializzazione' |
| Name fields | Separate (nome, cognome) | Combined (nome_cognome) |
| Bus transfer | Missing | Required boolean |
| Physical info | Missing | altezza, peso, numero_scarpe |
| School info | Missing | scuola, classe |
| Medical info | Partial | allergie_intolleranze, patologie_note, terapie_in_corso |
| Consents | Partial | liberatoria_foto_video, accettazione_regolamento, privacy_policy |
| Payment tracking | Missing | Full payment tracking fields |
| Contact form | No table | Needs contact_submissions table |

---

## Entity-Relationship Diagram

```mermaid
erDiagram
    REGISTRATIONS {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        text package_type
        boolean bus_transfer
        text genitore_nome_cognome
        text genitore_codice_fiscale
        text genitore_citta
        text genitore_cap
        text genitore_indirizzo
        text genitore_telefono
        text genitore_email
        text camper_nome_cognome
        text camper_codice_fiscale
        text camper_luogo_nascita
        date camper_data_nascita
        char camper_sesso
        text camper_citta
        text camper_cap
        text camper_indirizzo
        text camper_scuola
        text camper_classe
        text camper_taglia
        integer camper_altezza
        integer camper_peso
        text camper_numero_scarpe
        text camper_esperienza
        text camper_societa
        text allergie_intolleranze
        text patologie_note
        text terapie_in_corso
        boolean liberatoria_foto_video
        boolean accettazione_regolamento
        boolean privacy_policy
        text status
        text payment_status
        text payment_type
        integer amount_paid
        integer amount_due
        text stripe_session_id
        timestamp payment_date
        text codice_invito
    }

    PAYMENTS {
        uuid id PK
        uuid registration_id FK
        timestamp created_at
        text payment_method
        text payment_type
        integer amount
        text status
        text stripe_payment_intent_id
        text stripe_session_id
        text bonifico_reference
        jsonb metadata
    }

    GALLERY_COLLECTIONS {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        text name
        text slug UK
        text description
        text cover_image_url
        integer year
        text collection_type
        integer order_index
    }

    GALLERY_PHOTOS {
        uuid id PK
        uuid collection_id FK
        timestamp created_at
        timestamp updated_at
        text url
        text storage_path
        text alt_text
        integer year
        text category
        boolean featured
        integer sort_order
    }

    CONTACT_SUBMISSIONS {
        uuid id PK
        timestamp created_at
        text name
        text email
        text phone
        text subject
        text message
        text status
        timestamp responded_at
        text admin_notes
    }

    ADMIN_USERS {
        uuid id PK
        timestamp created_at
        text email UK
        text name
        text role
        boolean is_active
    }

    REGISTRATIONS ||--o{ PAYMENTS : has
    GALLERY_COLLECTIONS ||--o{ GALLERY_PHOTOS : contains
```

---

## Table Definitions

### 1. registrations

Main table for camp registrations, matching the TypeScript `Registration` interface.

```sql
CREATE TABLE registrations (
    -- Primary Key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Package Selection
    package_type TEXT NOT NULL CHECK (package_type IN ('standard', 'alta_specializzazione')),
    bus_transfer BOOLEAN DEFAULT false,
    
    -- Parent/Guardian Information (SEZIONE 1)
    genitore_nome_cognome TEXT NOT NULL,
    genitore_codice_fiscale TEXT, -- Optional
    genitore_citta TEXT NOT NULL,
    genitore_cap TEXT NOT NULL,
    genitore_indirizzo TEXT NOT NULL,
    genitore_telefono TEXT NOT NULL,
    genitore_email TEXT NOT NULL,
    
    -- Participant Information (SEZIONE 2)
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
    camper_altezza INTEGER NOT NULL, -- cm
    camper_peso INTEGER NOT NULL, -- kg
    camper_numero_scarpe TEXT NOT NULL, -- EU size
    
    -- Experience Level (SEZIONE 3)
    camper_esperienza TEXT NOT NULL CHECK (camper_esperienza IN ('principiante', 'intermedio', 'avanzato')),
    camper_societa TEXT, -- Optional: sports club
    
    -- Medical Information (SEZIONE 4) - All optional
    allergie_intolleranze TEXT,
    patologie_note TEXT,
    terapie_in_corso TEXT,
    
    -- Consents (SEZIONE 8)
    liberatoria_foto_video BOOLEAN NOT NULL DEFAULT false,
    accettazione_regolamento BOOLEAN NOT NULL DEFAULT false,
    privacy_policy BOOLEAN NOT NULL DEFAULT false,
    
    -- Registration Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    
    -- Payment Information
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'failed', 'refunded')),
    payment_type TEXT CHECK (payment_type IN ('full', 'deposit')),
    amount_paid INTEGER DEFAULT 0, -- cents
    amount_due INTEGER, -- cents
    stripe_session_id TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    
    -- Additional
    codice_invito TEXT
);

-- Index for common queries
CREATE INDEX idx_registrations_email ON registrations(genitore_email);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. payments

Detailed payment tracking for Stripe and Bonifico payments.

```sql
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Payment Details
    payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'bonifico')),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('deposit', 'full', 'balance')),
    amount INTEGER NOT NULL, -- cents
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Stripe specific
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    
    -- Bonifico specific
    bonifico_reference TEXT, -- CRO or reference number
    
    -- Additional data
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for queries
CREATE INDEX idx_payments_registration ON payments(registration_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session_id);
```

### 3. gallery_collections

Gallery collections for organizing photos by event/camp.

```sql
CREATE TABLE gallery_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Collection info
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image_url TEXT,
    year INTEGER,
    collection_type TEXT NOT NULL DEFAULT 'camp' CHECK (collection_type IN ('camp', 'one_day_camp', 'event')),
    order_index INTEGER DEFAULT 0
);

-- Indexes for gallery_collections
CREATE INDEX idx_gallery_collections_slug ON gallery_collections(slug);
CREATE INDEX idx_gallery_collections_year ON gallery_collections(year);
CREATE INDEX idx_gallery_collections_type ON gallery_collections(collection_type);
CREATE INDEX idx_gallery_collections_order ON gallery_collections(order_index);

-- Trigger for updated_at
CREATE TRIGGER update_gallery_collections_updated_at
    BEFORE UPDATE ON gallery_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 4. gallery_photos

Gallery management for camp photos.

```sql
CREATE TABLE gallery_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES gallery_collections(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Photo data
    url TEXT NOT NULL,
    storage_path TEXT,
    alt_text TEXT NOT NULL,
    year INTEGER, -- nullable, can use collection year
    category TEXT, -- nullable for flexibility
    
    -- Display options
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0
);

-- Index for queries
CREATE INDEX idx_gallery_year ON gallery_photos(year);
CREATE INDEX idx_gallery_category ON gallery_photos(category);
CREATE INDEX idx_gallery_featured ON gallery_photos(featured) WHERE featured = true;
CREATE INDEX idx_gallery_photos_collection ON gallery_photos(collection_id);

-- Trigger for updated_at
CREATE TRIGGER update_gallery_photos_updated_at
    BEFORE UPDATE ON gallery_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 5. contact_submissions

Contact form submissions.

```sql
CREATE TABLE contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contact info
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    -- Message
    subject TEXT NOT NULL CHECK (subject IN ('info', 'iscrizione', 'pagamenti', 'programma', 'altro')),
    message TEXT NOT NULL,
    
    -- Admin handling
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
    responded_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT
);

-- Index for queries
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_created_at ON contact_submissions(created_at DESC);
```

### 5. Helper Function

Shared function for updating timestamps.

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

## Relationships

| Parent Table | Child Table | Relationship | Foreign Key |
|--------------|-------------|--------------|-------------|
| registrations | payments | One-to-Many | payments.registration_id → registrations.id |
| gallery_collections | gallery_photos | One-to-Many | gallery_photos.collection_id → gallery_collections.id |

---

## Indexes

### Registrations Table
| Index Name | Column(s) | Purpose |
|------------|-----------|---------|
| idx_registrations_email | genitore_email | Quick lookup by parent email |
| idx_registrations_status | status | Filter by registration status |
| idx_registrations_payment_status | payment_status | Filter by payment status |
| idx_registrations_created_at | created_at DESC | Sort by newest first |

### Payments Table
| Index Name | Column(s) | Purpose |
|------------|-----------|---------|
| idx_payments_registration | registration_id | Lookup payments for registration |
| idx_payments_status | status | Filter by payment status |
| idx_payments_stripe_session | stripe_session_id | Webhook lookup |

### Gallery Collections Table
| Index Name | Column(s) | Purpose |
|------------|-----------|---------|
| idx_gallery_collections_slug | slug | URL slug lookup |
| idx_gallery_collections_year | year | Filter by year |
| idx_gallery_collections_type | collection_type | Filter by type |
| idx_gallery_collections_order | order_index | Sort order |

### Gallery Photos Table
| Index Name | Column(s) | Purpose |
|------------|-----------|---------|
| idx_gallery_year | year | Filter by year |
| idx_gallery_category | category | Filter by category |
| idx_gallery_featured | featured (partial) | Get featured photos |
| idx_gallery_photos_collection | collection_id | Lookup by collection |

### Contact Submissions Table
| Index Name | Column(s) | Purpose |
|------------|-----------|---------|
| idx_contact_status | status | Filter by status |
| idx_contact_created_at | created_at DESC | Sort by newest first |

---

## Row Level Security (RLS) Policies

### Registrations Table

```sql
-- Enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Public can insert new registrations
CREATE POLICY "Allow public inserts" ON registrations
    FOR INSERT 
    WITH CHECK (true);

-- Registrants can view their own registration by email
CREATE POLICY "Allow registrants to view own" ON registrations
    FOR SELECT 
    USING (genitore_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Authenticated admins can read all
CREATE POLICY "Allow admin read all" ON registrations
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Authenticated admins can update
CREATE POLICY "Allow admin updates" ON registrations
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Authenticated admins can delete
CREATE POLICY "Allow admin deletes" ON registrations
    FOR DELETE 
    USING (auth.role() = 'authenticated');
```

### Payments Table

```sql
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Service role only for inserts (from webhooks)
CREATE POLICY "Service role insert" ON payments
    FOR INSERT 
    WITH CHECK (auth.role() = 'service_role');

-- Authenticated admins can read
CREATE POLICY "Admin read payments" ON payments
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Authenticated admins can update
CREATE POLICY "Admin update payments" ON payments
    FOR UPDATE 
    USING (auth.role() = 'authenticated');
```

### Gallery Photos Table

```sql
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Everyone can view gallery
CREATE POLICY "Public read gallery" ON gallery_photos
    FOR SELECT 
    USING (true);

-- Authenticated admins can insert
CREATE POLICY "Admin insert gallery" ON gallery_photos
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated admins can update
CREATE POLICY "Admin update gallery" ON gallery_photos
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Authenticated admins can delete
CREATE POLICY "Admin delete gallery" ON gallery_photos
    FOR DELETE 
    USING (auth.role() = 'authenticated');
```

### Contact Submissions Table

```sql
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit contact form
CREATE POLICY "Public insert contacts" ON contact_submissions
    FOR INSERT 
    WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admin read contacts" ON contact_submissions
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Only admins can update
CREATE POLICY "Admin update contacts" ON contact_submissions
    FOR UPDATE 
    USING (auth.role() = 'authenticated');
```

---

## Local Database Setup Recommendation

### Option Comparison

| Feature | Supabase Local | PostgreSQL Docker | SQLite + better-sqlite3 | Prisma + SQLite |
|---------|----------------|-------------------|------------------------|-----------------|
| **Supabase Compatibility** | ⭐⭐⭐ Perfect | ⭐⭐ Good | ⭐ Poor | ⭐ Poor |
| **Code Changes Required** | None | Minimal | Major | Major |
| **Windows Setup** | Medium | Easy | Very Easy | Easy |
| **Docker Required** | Yes | Yes | No | No |
| **Auth Support** | Full | Manual | Manual | Manual |
| **RLS Support** | Full | Full | None | None |
| **Storage Support** | Full | None | None | None |
| **Migration to Prod** | Seamless | Easy | Complex | Medium |

### Recommendation: **Option A - Supabase Local (supabase/cli)**

**Why Supabase Local is the best choice:**

1. **Zero Code Changes** - Your existing `@supabase/supabase-js` client works identically
2. **Full Feature Parity** - Auth, RLS, Storage, Edge Functions all work locally
3. **Seamless Migration** - `supabase db push` deploys to production instantly
4. **Built-in Studio** - Visual database management at `localhost:54323`
5. **Hot Reload** - Schema changes apply immediately during development

**Trade-offs:**
- Requires Docker Desktop (but most modern dev setups have it)
- ~500MB disk space for containers
- First startup takes 1-2 minutes

---

## Setup Instructions

### Prerequisites

1. **Docker Desktop** - [Download for Windows](https://www.docker.com/products/docker-desktop/)
2. **Node.js 18+** - Already installed for Next.js

### Step 1: Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Verify installation
supabase --version
```

### Step 2: Initialize Supabase

```bash
# In project root directory
cd c:\Miniandbascketcamp

# Initialize Supabase (creates supabase/ directory)
supabase init
```

### Step 3: Start Local Supabase

```bash
# Start all services (first run downloads images ~500MB)
supabase start
```

This will output credentials like:
```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters
        anon key: eyJhbG...
service_role key: eyJhbG...
```

### Step 4: Create Migration File

```bash
# Create new migration
supabase migration new initial_schema
```

This creates `supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql`.

Copy the full schema from the [Complete Migration Script](#complete-migration-script) section below.

### Step 5: Apply Migration

```bash
# Apply migrations to local database
supabase db reset
```

### Step 6: Update Environment Variables

Create or update `.env.local`:

```env
# Local Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start output>
SUPABASE_SERVICE_ROLE_KEY=<service_role key from supabase start output>

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 7: Access Supabase Studio

Open http://localhost:54323 in your browser to:
- Browse tables visually
- Run SQL queries
- Manage auth users
- View logs

### Daily Development Commands

```bash
# Start Supabase (if not running)
supabase start

# Stop Supabase
supabase stop

# Reset database (applies all migrations fresh)
supabase db reset

# Create new migration after schema changes
supabase migration new <migration_name>

# Check status
supabase status
```

---

## Complete Migration Script

Create file: `supabase/migrations/20241210_initial_schema.sql`

```sql
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
```

---

## Migration Strategy

### From Local to Production

```mermaid
flowchart LR
    subgraph Local
        A[Local Development]
        B[supabase db reset]
        C[Test & Iterate]
    end
    
    subgraph Production
        D[supabase link]
        E[supabase db push]
        F[Production Ready]
    end
    
    A --> B --> C
    C -->|Ready| D --> E --> F
```

### Step-by-Step Migration

1. **Create Supabase Project** at [supabase.com](https://supabase.com)

2. **Link to Production**
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

3. **Push Migrations**
   ```bash
   supabase db push
   ```

4. **Update Environment Variables**
   ```env
   # Production Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<production-service-role-key>
   ```

5. **Create Admin User**
   - Go to Supabase Dashboard → Authentication → Users
   - Add admin user with email/password

---

## Sample Data

### Test Registration

```sql
INSERT INTO registrations (
    package_type,
    bus_transfer,
    genitore_nome_cognome,
    genitore_codice_fiscale,
    genitore_citta,
    genitore_cap,
    genitore_indirizzo,
    genitore_telefono,
    genitore_email,
    camper_nome_cognome,
    camper_codice_fiscale,
    camper_luogo_nascita,
    camper_data_nascita,
    camper_sesso,
    camper_citta,
    camper_cap,
    camper_indirizzo,
    camper_scuola,
    camper_classe,
    camper_taglia,
    camper_altezza,
    camper_peso,
    camper_numero_scarpe,
    camper_esperienza,
    camper_societa,
    allergie_intolleranze,
    liberatoria_foto_video,
    accettazione_regolamento,
    privacy_policy,
    status,
    payment_status
) VALUES (
    'standard',
    true,
    'Mario Rossi',
    'RSSMRA80A01H501Z',
    'Napoli',
    '80100',
    'Via Roma 123',
    '+39 333 1234567',
    'mario.rossi@email.com',
    'Luca Rossi',
    'RSSLCU12A01H501Z',
    'Napoli',
    '2012-06-15',
    'M',
    'Napoli',
    '80100',
    'Via Roma 123',
    'Scuola Media Carducci',
    '2° Media',
    'M',
    165,
    55,
    '40',
    'intermedio',
    'Basket Napoli ASD',
    NULL,
    true,
    true,
    true,
    'pending',
    'pending'
);
```

### Test Gallery Photos

```sql
INSERT INTO gallery_photos (url, alt_text, year, category, featured, sort_order) VALUES
    ('/images/gallery/allenamento-1.jpg', 'Allenamento tecnico', 2024, 'allenamenti', true, 1),
    ('/images/gallery/partita-1.jpg', 'Partita amichevole', 2024, 'partite', false, 2),
    ('/images/gallery/gruppo-1.jpg', 'Foto di gruppo 2024', 2024, 'gruppo', true, 3),
    ('/images/gallery/attivita-1.jpg', 'Attività in piscina', 2024, 'attivita', false, 4);
```

### Test Contact Submission

```sql
INSERT INTO contact_submissions (name, email, phone, subject, message, status) VALUES
    ('Anna Bianchi', 'anna.bianchi@email.com', '+39 333 9876543', 'info', 'Vorrei sapere se ci sono ancora posti disponibili per il camp estivo.', 'new');
```

---

## Schema Differences Summary

| Aspect | Old Schema | New Schema |
|--------|-----------|------------|
| Package types | giornaliero, completa, weekend | standard, alta_specializzazione |
| Bus transfer | Missing | ✓ Added |
| Name format | Separate fields | Combined nome_cognome |
| Physical info | Missing | ✓ altezza, peso, numero_scarpe |
| School info | Missing | ✓ scuola, classe |
| Birth details | Basic | ✓ luogo_nascita, sesso |
| Address | Parent only | ✓ Both parent and camper |
| Medical | Partial | ✓ allergie, patologie, terapie |
| Consents | Partial | ✓ liberatoria, regolamento, privacy |
| Payment tracking | Basic | ✓ Full payment fields |
| Payments table | Missing | ✓ New table |
| Contact submissions | Missing | ✓ New table |

---

## Next Steps

1. [ ] Install Docker Desktop if not present
2. [ ] Run `npm install -g supabase`
3. [ ] Run `supabase init` in project directory
4. [ ] Create migration file with provided schema
5. [ ] Run `supabase start` and `supabase db reset`
6. [ ] Update `.env.local` with local credentials
7. [ ] Test registration form against local database
8. [ ] When ready, link to production and push migrations