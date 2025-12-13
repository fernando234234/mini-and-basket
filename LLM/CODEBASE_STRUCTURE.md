# 📁 Codebase Structure

Complete file tree with descriptions for the Mini & Basket Camp website.

---

## Root Directory

```
/
├── src/                    # Source code (main application)
├── public/                 # Static assets (images, fonts)
├── supabase/               # Database migrations and config
├── scripts/                # Node.js utility scripts
├── docs/                   # Project documentation
├── LLM/                    # AI agent documentation (this folder)
├── screenshots/            # Development screenshots
├── Images/                 # Source images (coaches, partners)
├── AnimationIdea/          # AI-generated animation concepts
├── Current Site/           # Screenshots of original website
├── GeneralIdea/            # Initial design concepts
└── [config files]          # Various configuration files
```

---

## `/src` - Main Application

### `/src/app` - Next.js App Router Pages

```
src/app/
├── layout.tsx              # Root layout (Navigation, Footer, metadata)
├── page.tsx                # Homepage
├── globals.css             # Global styles (Tailwind + custom CSS)
├── robots.ts               # SEO robots.txt generation
├── sitemap.ts              # SEO sitemap generation
│
├── admin/                  # Admin dashboard (protected routes)
│   ├── layout.tsx          # Admin layout with sidebar
│   ├── page.tsx            # Admin login page
│   ├── dashboard/
│   │   └── page.tsx        # Main dashboard with stats
│   ├── galleria/
│   │   └── page.tsx        # Gallery management
│   └── iscrizioni/
│       └── page.tsx        # Registration management
│
├── api/                    # API Routes (backend)
│   ├── register/
│   │   └── route.ts        # POST: Save new registration
│   ├── checkout/
│   │   └── route.ts        # POST: Create Stripe session, GET: Session details
│   ├── webhook/
│   │   └── route.ts        # POST: Stripe webhook handler
│   └── admin/
│       ├── stats/
│       │   └── route.ts    # GET: Dashboard statistics
│       └── registrations/
│           └── route.ts    # GET/PATCH: Manage registrations
│
├── contatti/
│   └── page.tsx            # Contact page with form
│
├── faq/
│   └── page.tsx            # FAQ accordion page
│
├── galleria/
│   ├── page.tsx            # Gallery overview (all collections)
│   ├── GalleryGrid.tsx     # Grid component for collections
│   └── [slug]/
│       ├── page.tsx        # Individual collection page
│       └── CollectionGalleryGrid.tsx  # Photos grid for collection
│
├── iscrizione/
│   ├── page.tsx            # Registration page (contains wizard)
│   └── success/
│       └── page.tsx        # Payment success page
│
├── privacy/
│   └── page.tsx            # Privacy policy page
│
├── programma/
│   └── page.tsx            # Camp program/schedule page
│
├── regolamento/
│   └── page.tsx            # Camp rules page
│
├── staff/
│   ├── page.tsx            # Staff listing page
│   └── StaffGrid.tsx       # Staff cards grid component
│
└── test-payment/
    └── page.tsx            # Stripe payment testing page (dev only)
```

### `/src/components` - React Components

```
src/components/
│
├── # Core Layout Components
├── Navigation.tsx          # Main site navigation with mobile menu
├── Footer.tsx              # Site footer with links and contact
├── PageHero.tsx            # Reusable hero section for pages
│
├── # Homepage Components
├── Hero.tsx                # Homepage hero with carousel
├── InfoBar.tsx             # Key info bar (dates, location)
├── ExperienceSection.tsx   # "4 Pillars" experience section
├── ProgramHighlights.tsx   # Program highlights cards
├── PricingCards.tsx        # Package pricing comparison
├── StaffPreview.tsx        # Staff preview for homepage
├── GalleryPreview.tsx      # Gallery preview for homepage
├── TestimonialsCarousel.tsx # Testimonials slider
├── PartnersGrid.tsx        # Partners logo grid
├── FinalCTA.tsx            # Final call-to-action section
├── DecorativeElements.tsx  # Floating decorative elements
├── FacilitiesGrid.tsx      # Facilities icons grid
│
├── # Registration Components
├── RegistrationWizard.tsx  # Multi-step registration form (1342 lines)
├── StripeCheckout.tsx      # Stripe payment component
├── PaymentInfo.tsx         # Payment information display
├── PaymentMethods.tsx      # Available payment methods display
│
├── # Utility Components
├── Accordion.tsx           # FAQ accordion component
├── ContactForm.tsx         # Contact form component
├── CookieConsent.tsx       # GDPR cookie consent banner
├── BasketballShotAnimation.tsx # Animation component
│
└── admin/                  # Admin-specific components
    ├── AdminHeader.tsx     # Admin page header
    ├── AdminSidebar.tsx    # Admin navigation sidebar
    ├── StatsCard.tsx       # Dashboard stat card
    ├── RegistrationsTable.tsx # Registrations data table
    ├── RegistrationDetail.tsx # Registration detail modal
    ├── GalleryManager.tsx  # Gallery CRUD interface
    └── PhotoUploader.tsx   # Photo upload component
```

### `/src/lib` - Utilities and Configuration

```
src/lib/
├── stripe.ts               # Stripe client, pricing config, helpers
├── supabase.ts             # Supabase client setup (anon + admin)
├── database.ts             # Database helper functions
├── validation.ts           # Form validation (phone, codice fiscale)
├── calendar.ts             # Date/calendar utilities
├── auth.ts                 # Authentication helpers
└── mockData.ts             # Mock data for development/demo mode
```

### `/src/types` - TypeScript Interfaces

```
src/types/
├── registration.ts         # Registration interface & related types
└── gallery.ts              # Gallery types (photos, collections)
```

---

## `/public` - Static Assets

```
public/
├── manifest.json           # PWA manifest
│
├── images/
│   ├── LogoMinIBasket.png  # Main logo
│   ├── staff/              # Coach photos (14 images)
│   │   ├── AlessandraFinamore.webp
│   │   ├── GianlucaTucci.webp
│   │   └── ... (12 more)
│   ├── partners/           # Partner logos (8 images)
│   │   ├── partners_01.png
│   │   └── ... (7 more)
│   └── sponsors/           # Sponsor logos
│       ├── Sponsor_1.webp
│       └── Sponsor_2.webp
│
└── animations/
    └── basketball-shot/    # Animation frame images
        ├── frame-1-ready.jpeg
        ├── frame-2-windup.jpeg
        ├── frame-3-release.jpeg
        ├── frame-4-flight.jpeg
        ├── frame-5-swish.jpeg
        └── frame-6-celebration.jpeg
```

---

## `/supabase` - Database

```
supabase/
├── config.toml             # Supabase local config
├── seed.sql                # Database seed data
├── .gitignore              # Ignore local files
│
└── migrations/
    ├── 20241210_initial_schema.sql      # Main tables (registrations, etc.)
    ├── 20241211_storage_buckets.sql     # Storage bucket setup
    ├── 20241213_gallery_collections.sql # Gallery collections table
    └── 20241213230000_make_gallery_public.sql # Public gallery access
```

---

## `/scripts` - Utility Scripts

```
scripts/
├── check-gallery-data.mjs  # Check gallery data in Supabase
├── create-gallery-bucket.mjs # Create storage bucket
└── upload-gallery.mjs      # Upload photos to Supabase storage
```

---

## `/docs` - Documentation

```
docs/
├── ARCHITECTURE.md         # System architecture overview
├── DATABASE_DESIGN.md      # Complete database design document
├── ORIGINAL_SITE_CONTENT.md # Content extracted from old site
├── PAYMENT_TEST_RESULTS.md # Payment testing documentation
├── REDESIGN_PLAN.md        # Redesign project plan
├── STRIPE_SETUP.md         # Stripe configuration guide
├── SUPABASE_NETLIFY_SETUP.md # Deployment configuration
├── VERCEL_SETUP.md         # Alternative Vercel deployment
└── supabase-schema.sql     # Legacy schema file
```

---

## Root Configuration Files

```
/
├── package.json            # Dependencies and scripts
├── package-lock.json       # Locked dependency versions
├── next.config.mjs         # Next.js configuration
├── next-env.d.ts           # Next.js TypeScript declarations
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration (implicit)
├── tsconfig.json           # TypeScript configuration (implicit)
├── netlify.toml            # Netlify deployment configuration
├── .env.local.example      # Environment variables template
├── .gitignore              # Git ignore patterns
└── README.md               # Project readme
```

---

## Key Files Detailed

### [`src/app/layout.tsx`](../src/app/layout.tsx)
Root layout wrapping all pages. Includes:
- Google Fonts (Inter)
- Navigation component
- Footer component
- Cookie consent
- Metadata (title, description, OpenGraph)

### [`src/app/page.tsx`](../src/app/page.tsx)
Homepage composition:
```tsx
<Hero />
<InfoBar />
<ExperienceSection />
<ProgramHighlights />
<PricingCards />
<StaffPreview />
<GalleryPreview />
<TestimonialsCarousel />
<PartnersGrid />
<FinalCTA />
```

### [`src/components/RegistrationWizard.tsx`](../src/components/RegistrationWizard.tsx:1)
Largest component (1342 lines). Multi-step form with:
- 6 steps (Package → Parent → Camper → Medical → Confirm → Payment)
- Form validation
- Supabase integration
- Stripe checkout redirect

### [`src/lib/stripe.ts`](../src/lib/stripe.ts:1)
Stripe configuration:
- `getStripe()` - Client-side Stripe instance
- `isEarlyBird()` - Early bird pricing check
- `PACKAGE_PRICES` - Pricing constants
- `ADDON_PRICES` - Add-on pricing
- `getCurrentPrice()` - Dynamic price calculation

### [`src/lib/supabase.ts`](../src/lib/supabase.ts:1)
Supabase clients:
- `supabase` - Anonymous client (public access)
- `supabaseAdmin` - Service role client (bypasses RLS)
- `getSupabaseAdmin()` - Runtime client creation for webhooks
- `isSupabaseConfigured()` - Configuration check
- Database type definitions

---

## File Naming Conventions

| Pattern | Meaning |
|---------|---------|
| `page.tsx` | Next.js route page |
| `layout.tsx` | Next.js layout wrapper |
| `route.ts` | Next.js API route |
| `[slug]/` | Dynamic route segment |
| `*.tsx` | React component |
| `*.ts` | TypeScript utility/config |
| `*.mjs` | ES Module script |
| `*.sql` | SQL migration |

---

## Import Path Aliases

Configured in `tsconfig.json`:

```typescript
// Use @ alias for src directory
import { supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';
import type { Registration } from '@/types/registration';
```

---

*For component-specific documentation, see [COMPONENTS.md](./COMPONENTS.md)*