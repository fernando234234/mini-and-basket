# Mini & Basket Camp - Website Redesign Plan

## Executive Summary

This document outlines a comprehensive redesign strategy for the Mini & Basket Camp website, transitioning from the current static HTML site to a modern, mobile-first web application with Supabase backend and Netlify hosting. The redesign focuses on improved user experience, streamlined registration flows, and a new admin dashboard system.

**Design Foundation:** This redesign is based on an approved design concept (see `GeneralIdea/code.html` and `GeneralIdea/screen.png`) which establishes the visual direction, layout structure, and component patterns for the new site.

---

## Table of Contents

1. [Current Site Analysis](#current-site-analysis)
2. [Identified UI/UX Issues](#identified-uiux-issues)
3. [Proposed Tech Stack](#proposed-tech-stack)
4. [New Site Architecture](#new-site-architecture)
5. [Page-by-Page Redesign Recommendations](#page-by-page-redesign-recommendations)
6. [Component Structure](#component-structure)
7. [User Flow Diagrams](#user-flow-diagrams)
8. [Database Schema Concept](#database-schema-concept)
9. [Implementation Roadmap](#implementation-roadmap)

---

## Current Site Analysis

### Site Structure Overview

The current website consists of **8 main pages** with the following structure:

| Page | URL Pattern | Purpose |
|------|-------------|---------|
| Camp (General) | `/camp.html` | Overview of the basketball camp program |
| Camp 2025 | `/camp-2025.html` | Specific information for 2025 edition |
| Staff/Guest Stars | `/staff.html` | Trainers and champions showcase |
| One Day Camp | `/one-day-camp.html` | Special one-day events |
| Gallery | `/gallery` | Photo galleries by year and event |
| Registration | `/iscrizioni` | Registration forms and pricing |
| Contacts | `/contatti.html` | Contact information and forms |
| FAQ | `/faq.html` | Frequently asked questions |

### Current Features Inventory

#### Global Elements
- **Header**: Logo + Event date (29 Giu - 6 Lug 2025) + Navigation menu
- **Navigation**: 9 menu items (Camp, Camp 2025, Guest Stars, One Day Camp, Epiphany Day, Gallery, Iscrizioni, Contatti, FAQ)
- **Footer**: Partners logos, Sponsors section, Contact info (varies by page)
- **Cookie Banner**: GDPR compliance notice at top

#### Page-Specific Features

**Camp 2025 Page:**
- Camp description with pricing (610€ base, 800€ specialization)
- Facilities icons (swimming pool, equipment, accommodation)
- Daily program schedule
- Inline registration form with email collection
- Partners/Sponsors logo grid

**Camp (General) Page:**
- Hero image with action shots
- "Il progetto camp" description
- "Il camp" details
- "Il fulcro del Mini-Basket Camp" section
- Registration call-to-action
- Footer with contacts

**Staff Page:**
- Hero action image
- Guest Stars section (featured: Antonio Mago)
- Trainers grid (14 staff members)
- Champions grid (8 athletes)
- Each profile: Photo + Name + Brief description

**One Day Camp Page:**
- Hero image
- Featured guest (Linton Johnson)
- Event description
- Large promotional image
- Sponsors

**Gallery Page:**
- Organized by category:
  - Il Camp: 6 years (2018-2024, excluding 2020)
  - Epiphany Day: 2 years (2019-2020)
  - OneDay Camp: 6 locations
- Thumbnail grid with year/location labels
- Pagination controls

**Registration Page (Iscrizioni):**
- Hero banner
- Process step icons (Payment, Form, Confirmation, Badge)
- Pricing cards with included items checklist
- Payment instructions (bank transfer, PayPal)
- Downloadable PDF form option
- Online registration form with fields:
  - Parent/Guardian information
  - Child information
  - Medical certifications
  - Privacy consents
- Detailed terms and conditions (Regolamento)

**Contacts Page:**
- Organization details (address, phone, email)
- Social media links
- "How to Register" section with PDF download
- Online inquiry form

**FAQ Page:**
- Simple Q&A accordion format
- Topics: logistics, medical, accommodation, safety

### Visual Identity

**Color Palette:**
- Primary Green: `#7CB342` (lime green)
- Secondary Orange: `#FF9800` (orange accents)
- Text: Dark gray/black
- Background: White/Off-white

**Typography:**
- Headers: Decorative script fonts (custom)
- Body: Sans-serif (appears to be system fonts)

**Imagery:**
- Basketball action shots
- Group photos of campers
- Staff portraits
- Facility images

---

## Identified UI/UX Issues

### Critical Issues

1. **Fragmented Registration Experience**
   - Users must choose between PDF download or online form
   - Email-based subscription model is outdated
   - No confirmation or tracking of submissions
   - Form validation unclear

2. **Poor Mobile Responsiveness**
   - Desktop-first design approach
   - Small touch targets for mobile users
   - Horizontal navigation difficult on mobile
   - Forms not optimized for mobile input

3. **Information Architecture Problems**
   - Redundant pages (Camp vs Camp 2025)
   - "Epiphany Day" separate from navigation but in Gallery
   - Unclear hierarchy between event types

4. **No Admin Visibility**
   - No backend for viewing registrations
   - Manual email processing required
   - No data analytics capability

### Moderate Issues

5. **Inconsistent Design Language**
   - Footer varies between pages
   - Different section styling approaches
   - Cookie banner design doesn't match site

6. **Content Accessibility**
   - Dense Italian text blocks
   - Small font sizes in forms
   - Low contrast in some areas
   - No language alternatives

7. **Visual Hierarchy**
   - CTAs not prominent enough
   - Important dates buried in text
   - Pricing information hard to scan

8. **Performance Concerns**
   - Large unoptimized images
   - No lazy loading visible
   - Static HTML limits caching strategies

### Minor Issues

9. **Partner/Sponsor Display**
   - Inconsistent logo sizing
   - No links to partner sites
   - Appears on too many pages

10. **Gallery UX**
    - No lightbox functionality visible
    - Limited organization tools
    - No search or filter options

11. **FAQ Design**
    - Plain text formatting
    - No search capability
    - Could benefit from categories

---

## Proposed Tech Stack

### Frontend Framework: **Next.js 14+ (App Router)**

**Rationale:**
- Excellent Netlify integration via `@netlify/plugin-nextjs`
- Server-side rendering for SEO (important for Italian market)
- Static site generation for fast page loads
- React ecosystem for component reusability
- Built-in image optimization
- TypeScript support
- App Router provides modern React patterns

### Styling: **Tailwind CSS + shadcn/ui**

**Rationale:**
- Utility-first approach for rapid development
- Consistent design system
- shadcn/ui provides accessible, customizable components
- Dark mode support out of the box
- Mobile-first responsive design
- Small bundle size with purging

### Backend: **Supabase**

**Features to Use:**
- PostgreSQL database for registrations
- Row Level Security for admin access
- Authentication for admin dashboard
- Real-time subscriptions for live updates
- Storage for gallery images (future)
- Edge Functions for email notifications

### Form Handling: **React Hook Form + Zod**

**Rationale:**
- Type-safe form validation
- Excellent performance (minimal re-renders)
- Easy integration with Supabase
- Supports complex form logic

### Hosting: **Netlify**

**Features to Use:**
- Automatic deployments from Git
- Preview deployments for PRs
- Netlify Forms as backup (optional)
- Edge functions for dynamic content
- Asset optimization
- Split testing capability

### Additional Tools

| Tool | Purpose |
|------|---------|
| `next-intl` | Internationalization (Italian + English future) |
| `@tanstack/react-query` | Data fetching and caching |
| `framer-motion` | Smooth animations |
| `react-hot-toast` | Notification system |
| `date-fns` | Date formatting |
| `lucide-react` | Icon library |

### Development Tools

- **TypeScript** - Type safety
- **ESLint + Prettier** - Code quality
- **Husky** - Git hooks
- **Vitest** - Unit testing
- **Playwright** - E2E testing

---

## New Site Architecture

### URL Structure

```
/                           → Home (merged Camp + Camp 2025)
/camp                       → Current year camp details
/camp/[year]               → Archive of past camps
/eventi                     → Events hub (One Day Camp, Epiphany)
/eventi/one-day-camp       → One Day Camp details
/eventi/epiphany-day       → Epiphany Day details
/staff                      → All staff and champions
/galleria                   → Photo gallery
/galleria/[category]/[year] → Filtered gallery view
/iscrizione                 → Registration flow (single page app)
/contatti                   → Contact page
/faq                        → FAQ page
/admin                      → Admin dashboard (protected)
/admin/registrazioni       → View registrations
/admin/impostazioni        → Settings
```

### Page Hierarchy

```
┌─────────────────────────────────────────┐
│                 HOME                     │
│    (Hero + Key Info + CTAs + Dates)     │
└────────────────────┬────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌────────┐    ┌───────────┐    ┌───────────┐
│  CAMP  │    │  EVENTI   │    │   STAFF   │
└────┬───┘    └─────┬─────┘    └───────────┘
     │              │
     ▼              ├─── One Day Camp
┌─────────┐        └─── Epiphany Day
│ Archive │
└─────────┘

    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌────────┐    ┌───────────┐    ┌───────────┐
│GALLERIA│    │ISCRIZIONE │    │ CONTATTI  │
└────────┘    └───────────┘    └───────────┘
                                    │
                                    ▼
                               ┌─────────┐
                               │   FAQ   │
                               └─────────┘
```

### Navigation Structure

**Primary Navigation (Desktop):**
```
[Logo]  Camp   Eventi ▼   Staff   Galleria   [ISCRIVITI - Primary CTA]

        Eventi dropdown:
        ├── One Day Camp
        └── Epiphany Day
```

**Primary Navigation (Mobile):**
```
[Logo]              [ISCRIVITI]  [☰ Menu]

Mobile menu:
├── Home
├── Camp
├── Eventi
│   ├── One Day Camp
│   └── Epiphany Day
├── Staff
├── Galleria
├── FAQ
└── Contatti
```

**Footer Navigation:**
```
┌─────────────────────────────────────────────────────┐
│  [Logo]     Il Camp    Info      Seguici            │
│             ────────   ────────  ────────           │
│  Date       • Camp     • FAQ     [fb] [ig]          │
│  Location   • Eventi   • Contatti                   │
│             • Staff    • Privacy                    │
│             • Galleria                              │
│                                                     │
│  Partners: [logo] [logo] [logo] [logo]              │
│  Sponsors: [logo] [logo]                            │
│                                                     │
│  © 2025 Mini & Basket Camp | P.IVA | Credits        │
└─────────────────────────────────────────────────────┘
```

---

## Page-by-Page Redesign Recommendations

### 1. Home Page (New)

**Purpose:** Single landing page combining Camp and Camp 2025 information

**Sections:**

1. **Hero Section**
   - Full-width video background or hero image carousel
   - Large headline: "Mini & Basket Camp 2025"
   - Dates prominently displayed: "29 Giugno - 6 Luglio 2025"
   - Primary CTA: "Iscriviti Ora" (button)
   - Secondary CTA: "Scopri di più" (scroll arrow)

2. **Quick Stats Bar**
   - Years of experience (since 2004)
   - Number of participants
   - Star trainers count
   - Location info

3. **Camp Overview**
   - What is Mini & Basket Camp (concise)
   - 3 key value propositions with icons
   - Image/video preview

4. **Program Highlights**
   - Visual timeline or cards
   - Daily schedule overview
   - Specialization tracks

5. **Facilities**
   - Icon grid with labels
   - Interactive hover states
   - Photo gallery link

6. **Pricing Cards**
   - Clear pricing display
   - What's included lists
   - CTA on each card

7. **Testimonials** (New)
   - Parent/camper quotes
   - Star ratings
   - Carousel format

8. **Staff Preview**
   - Featured trainers (3-4)
   - Link to full staff page

9. **Gallery Preview**
   - Recent photos grid
   - Link to full gallery

10. **Partners & Sponsors**
    - Logo carousel
    - Minimal, clean display

11. **Final CTA Section**
    - "Non perdere l'occasione"
    - Registration button
    - Countdown timer

### 2. Camp Page (Archive)

**Purpose:** Detailed information about current camp + access to past years

**Sections:**

1. **Year Selector** (tabs or dropdown)
2. **Camp Details**
   - Full program schedule
   - Daily activities breakdown
   - Specialization options
3. **Facilities Deep Dive**
   - Photo gallery of facilities
   - Detailed descriptions
4. **What to Bring**
   - Packing list
   - Medical requirements
5. **Location & Logistics**
   - Embedded map
   - Transport information
   - Check-in/out times

### 3. Events Page (New Hub)

**Purpose:** Central hub for One Day Camp and Epiphany Day

**Sections:**

1. **Active Events**
   - Cards for upcoming events
   - Date, location, featured guest
   - Registration links

2. **Event Types**
   - One Day Camp explanation
   - Epiphany Day explanation

3. **Past Events**
   - Gallery of previous events
   - Testimonials

### 4. Staff Page

**Purpose:** Showcase trainers and champions

**Redesign Focus:**
- Better profile cards with hover effects
- Category filters (Trainers, Champions, Guest Stars)
- Individual profile modal/page with bio
- Social media links for athletes
- Achievement badges

**Sections:**

1. **Featured Guest Stars**
   - Large feature cards
   - Video introductions (if available)

2. **Trainers Grid**
   - Filterable by specialty
   - Photo, name, role, brief bio

3. **Champions Showcase**
   - Achievement highlights
   - Current teams/leagues

### 5. Gallery Page

**Purpose:** Browse photos from all events

**Redesign Focus:**
- Masonry or grid layout
- Category/year filtering
- Lightbox with navigation
- Download option (low-res)
- Share buttons

**Sections:**

1. **Filter Bar**
   - Year dropdown
   - Event type selector
   - Search

2. **Photo Grid**
   - Lazy loaded images
   - Infinite scroll or pagination

3. **Album View**
   - Organized by event/year
   - Cover photo + count

### 6. Registration Page (Complete Overhaul)

**Purpose:** Streamlined registration flow saving to Supabase

**New Flow:**

```
Step 1: Camp Selection
├── Choose camp type (Standard/Specialization)
├── Select dates
└── Review pricing

Step 2: Participant Info
├── Child details (name, DOB, etc.)
├── Medical info
├── T-shirt size
└── Dietary requirements

Step 3: Parent/Guardian Info
├── Contact details
├── Emergency contacts
└── Authorization for activities

Step 4: Documents
├── Upload medical certificate
├── Accept terms & conditions
├── Privacy consent

Step 5: Payment Selection
├── Bank transfer info
├── PayPal option
└── Payment reference generation

Step 6: Confirmation
├── Summary of registration
├── Confirmation email sent
├── PDF receipt download
└── What happens next
```

**Key Improvements:**
- Progress indicator
- Save draft functionality
- Field validation in real-time
- Mobile-optimized inputs
- No PDF download option (online only)
- Confirmation tracking

### 7. Contacts Page

**Purpose:** Contact information and inquiry form

**Sections:**

1. **Contact Cards**
   - Email (clickable)
   - Phone (clickable for mobile)
   - Address with map

2. **Social Media**
   - Icon buttons with follower counts

3. **Inquiry Form**
   - Simple form (name, email, message)
   - Topic selector
   - Spam protection

4. **Office Hours**
   - When to expect responses

### 8. FAQ Page

**Purpose:** Answer common questions

**Redesign Focus:**
- Searchable
- Categorized accordions
- Related questions suggestions
- Contact CTA if answer not found

**Categories:**
- Iscrizione e Pagamento
- Logistica e Trasporto
- Salute e Sicurezza
- Il Programma
- Alloggio e Vitto

### 9. Admin Dashboard (New)

**Purpose:** View and manage registrations

**Sections:**

1. **Login Page**
   - Supabase Auth
   - Email/password or magic link

2. **Dashboard Overview**
   - Total registrations count
   - Payment status summary
   - Recent registrations

3. **Registrations List**
   - Searchable table
   - Filter by status, date, camp type
   - Export to CSV

4. **Registration Detail**
   - Full participant info
   - Documents viewer
   - Status management
   - Notes field

5. **Settings**
   - Camp configuration
   - Pricing management
   - Email templates

---

## Component Structure

### Homepage Component Architecture

The homepage follows the approved design concept layout with a 3-column grid (2 + 1 sidebar) on XL screens.

```
┌─────────────────────────────────────────────────────────────────┐
│                          NAVIGATION                              │
├───────────────────────────────────┬─────────────────────────────┤
│                                   │                             │
│  ┌─────────────────────────────┐  │  ┌───────────────────────┐  │
│  │         HERO               │  │  │    TESTIMONIALS       │  │
│  │   (Carousel + CTAs)        │  │  │    (Carousel)         │  │
│  └─────────────────────────────┘  │  └───────────────────────┘  │
│                                   │                             │
│  ┌─────────────────────────────┐  │  ┌───────────────────────┐  │
│  │       INFO BAR             │  │  │    STAFF PREVIEW      │  │
│  │   (Stats gradient bar)     │  │  │    (4 profiles)       │  │
│  └─────────────────────────────┘  │  └───────────────────────┘  │
│                                   │                             │
│  ┌─────────────────────────────┐  │  ┌───────────────────────┐  │
│  │   EXPERIENCE SECTION       │  │  │   GALLERY PREVIEW     │  │
│  │   (Text + Image grid)      │  │  │   (5 images + link)   │  │
│  └─────────────────────────────┘  │  └───────────────────────┘  │
│                                   │                             │
│  ┌─────────────────────────────┐  │  ┌───────────────────────┐  │
│  │   PROGRAM HIGHLIGHTS       │  │  │   PARTNERS GRID       │  │
│  │   (Timeline with icons)    │  │  │   (Logo grid)         │  │
│  └─────────────────────────────┘  │  └───────────────────────┘  │
│                                   │                             │
│  ┌─────────────────────────────┐  │                             │
│  │   FACILITIES GRID          │  │                             │
│  │   (2x2 image cards)        │  │                             │
│  └─────────────────────────────┘  │                             │
│                                   │                             │
│  ┌─────────────────────────────┐  │                             │
│  │   PRICING CARDS            │  │                             │
│  │   (3 cards, middle featured)│  │                             │
│  └─────────────────────────────┘  │                             │
│                                   │                             │
├───────────────────────────────────┴─────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    FINAL CTA SECTION                        ││
│  │              (Full-width green banner)                      ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                           FOOTER                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Inventory (Based on Design Template)

| Component | Location | Description |
|-----------|----------|-------------|
| `Navigation` | Layout | Site-wide navigation header (NOT in current template - needs to be added) |
| `Hero` | Homepage | Image carousel with title, dates, CTAs, sparkle effects |
| `InfoBar` | Homepage | Gradient bar with 4 stats (campers, coaches, duration, features) |
| `ExperienceSection` | Homepage | 2-column text + image layout |
| `ProgramHighlights` | Homepage | Timeline with 5 icon nodes and dashed connectors |
| `FacilitiesGrid` | Homepage | 2x2 grid of image cards with overlays |
| `PricingCards` | Homepage | 3 pricing cards with middle one featured |
| `TestimonialsCarousel` | Homepage Sidebar | Testimonial cards with avatars and navigation |
| `StaffPreview` | Homepage Sidebar | 4 staff member circles with names/roles |
| `GalleryPreview` | Homepage Sidebar | 3x2 grid with 5 images + "view all" link |
| `PartnersGrid` | Homepage Sidebar | 4x2 grayscale logo grid |
| `FinalCTA` | Homepage | Full-width green section with CTA |
| `Footer` | Layout | Dark footer with links and social icons |

### Directory Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout with Navigation + Footer
│   ├── iscrizione/
│   │   └── page.tsx              # Registration page
│   ├── staff/
│   │   └── page.tsx              # Staff directory
│   ├── galleria/
│   │   └── page.tsx              # Photo gallery
│   ├── faq/
│   │   └── page.tsx              # FAQ page
│   ├── contatti/
│   │   └── page.tsx              # Contact page
│   └── admin/                    # Future phase
│       ├── layout.tsx            # Admin layout with auth
│       ├── page.tsx              # Admin login
│       └── dashboard/
│           └── page.tsx          # Dashboard
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── accordion.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── Navigation.tsx        # Site header with nav links
│   │   ├── MobileMenu.tsx        # Mobile hamburger menu
│   │   ├── Footer.tsx            # Site footer
│   │   └── PageContainer.tsx     # Max-width centered container
│   │
│   ├── homepage/                 # Homepage-specific sections
│   │   ├── Hero.tsx              # Hero with carousel
│   │   ├── InfoBar.tsx           # Stats gradient bar
│   │   ├── ExperienceSection.tsx # About section
│   │   ├── ProgramHighlights.tsx # Timeline component
│   │   ├── FacilitiesGrid.tsx    # Facilities image grid
│   │   ├── PricingCards.tsx      # Pricing display
│   │   ├── TestimonialsCarousel.tsx
│   │   ├── StaffPreview.tsx
│   │   ├── GalleryPreview.tsx
│   │   ├── PartnersGrid.tsx
│   │   └── FinalCTA.tsx
│   │
│   ├── staff/
│   │   ├── StaffGrid.tsx
│   │   ├── StaffCard.tsx
│   │   └── StaffFilter.tsx
│   │
│   ├── gallery/
│   │   ├── GalleryGrid.tsx
│   │   ├── GalleryFilter.tsx
│   │   └── Lightbox.tsx
│   │
│   ├── registration/
│   │   ├── RegistrationWizard.tsx
│   │   ├── StepIndicator.tsx
│   │   ├── CampSelection.tsx
│   │   ├── ParticipantForm.tsx
│   │   ├── GuardianForm.tsx
│   │   ├── DocumentsUpload.tsx
│   │   ├── ConsentForm.tsx
│   │   ├── PaymentSelection.tsx
│   │   └── Confirmation.tsx
│   │
│   ├── faq/
│   │   ├── FAQSearch.tsx
│   │   └── FAQAccordion.tsx
│   │
│   └── contact/
│       ├── ContactForm.tsx
│       └── ContactInfo.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── utils.ts
│   └── constants.ts
│
├── hooks/
│   ├── useCarousel.ts
│   ├── useRegistration.ts
│   └── useMediaQuery.ts
│
├── types/
│   ├── index.ts
│   ├── registration.ts
│   └── staff.ts
│
└── styles/
    └── globals.css               # Tailwind + custom styles
```

### Key Component Specifications

#### Navigation Component (TO BE ADDED)
```typescript
// Not in current template - needs to be designed and added
interface NavigationProps {
  transparent?: boolean;  // For hero overlay mode
}

// Features:
// - Logo (Mini & Basket Camp)
// - Navigation links (Camp, Staff, Gallery, FAQ, Contacts)
// - Primary CTA button ("Iscriviti Ora")
// - Mobile hamburger menu
// - Scroll-aware styling (transparent -> solid)
```

#### Hero Component
```typescript
interface HeroProps {
  slides: {
    image: string;
    alt: string;
  }[];
  title: string;           // "Mini & Basket"
  titleAccent: string;     // "Camp 2025" (orange)
  dates: string;           // "29 Giugno - 6 Luglio 2025"
  primaryCTA: CTAProps;    // "Iscriviti Ora"
  secondaryCTA: CTAProps;  // "Scopri di Più"
}

// Styling from template:
// - bg-black with rounded-2xl
// - Background image with opacity-30
// - Carousel navigation arrows
// - Sparkle effects (optional)
// - text-shadow for readability
```

#### InfoBar Component
```typescript
interface InfoBarProps {
  stats: {
    icon: ReactNode;
    label: string;      // e.g., "100+ CAMPERS"
  }[];
}

// Styling from template:
// - bg-gradient-to-r from-brand-green to-brand-orange
// - rounded-2xl p-6
// - 4-column grid (2 on mobile)
// - White text and icons
```

#### PricingCards Component
```typescript
interface PricingCardProps {
  title?: string;         // e.g., "PACCHETTO GIORNALIERO"
  price: number;
  features: string[];
  isFeatured?: boolean;   // Middle card styling
  ctaLabel: string;
  ctaHref: string;
}

// Styling from template:
// Featured card:
// - border-2 border-brand-orange
// - shadow-strong
// - scale-105
// - "Best Value" badge

// Standard card:
// - border border-gray-200
// - shadow-subtle
```

#### ProgramHighlights (Timeline) Component
```typescript
interface TimelineItem {
  icon: ReactNode;
  label: string;
  isHighlighted?: boolean;  // Orange styling
  details?: string[];       // Pop-out list for highlighted item
}

// Styling from template:
// - Horizontal timeline with dashed connectors
// - Circle icons (bg-brand-green, or bg-brand-orange for highlighted)
// - Pop-out detail box on highlighted item
```

#### TestimonialsCarousel Component
```typescript
interface Testimonial {
  avatar: string;
  quote: string;
  author: string;
}

// Styling from template:
// - Carousel with prev/next buttons
// - Pagination dots
// - Avatar with green border
// - Italic quote text
```

---

## User Flow Diagrams

### Main User Journey

```
                         ┌─────────────┐
                         │   VISITOR   │
                         └──────┬──────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
            ┌───────────────┐       ┌───────────────┐
            │  Organic/SEO  │       │ Social Media  │
            └───────┬───────┘       └───────┬───────┘
                    │                       │
                    └───────────┬───────────┘
                                ▼
                    ┌───────────────────────┐
                    │      HOME PAGE        │
                    │  - See hero + dates   │
                    │  - Understand value   │
                    └───────────┬───────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │  Learn More   │   │   View Staff  │   │   View Pics   │
    │  About Camp   │   │   & Champions │   │   in Gallery  │
    └───────┬───────┘   └───────────────┘   └───────────────┘
            │
            ▼
    ┌───────────────────────┐
    │   DECIDE TO REGISTER  │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │   Registration Flow   │
    │   Step 1: Selection   │──────▶ Choose camp type
    │   Step 2: Participant │──────▶ Enter child info
    │   Step 3: Guardian    │──────▶ Enter parent info
    │   Step 4: Documents   │──────▶ Upload & consent
    │   Step 5: Payment     │──────▶ Select method
    │   Step 6: Confirm     │──────▶ Get confirmation
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │   REGISTRATION SAVED  │
    │   - Email sent        │
    │   - Data in Supabase  │
    │   - Admin notified    │
    └───────────────────────┘
```

### Registration Flow Detail

```
┌─────────────────────────────────────────────────────────────┐
│                    REGISTRATION FLOW                         │
└─────────────────────────────────────────────────────────────┘

[1. SELECT CAMP] ──▶ [2. PARTICIPANT] ──▶ [3. GUARDIAN]
      │                    │                   │
      ▼                    ▼                   ▼
 ┌─────────┐         ┌─────────┐         ┌─────────┐
 │ Choose: │         │ Enter:  │         │ Enter:  │
 │ Standard│         │ Name    │         │ Name    │
 │ or Alta │         │ DOB     │         │ Email   │
 │ Special.│         │ Gender  │         │ Phone   │
 │         │         │ School  │         │ Address │
 │ Review  │         │ Medical │         │ Relation│
 │ pricing │         │ T-shirt │         │ Emergency│
 └─────────┘         │ Diet    │         └─────────┘
                     └─────────┘

      ▼                    ▼                   ▼

[4. DOCUMENTS] ──▶ [5. PAYMENT] ──▶ [6. CONFIRMATION]
      │                │                   │
      ▼                ▼                   ▼
 ┌─────────┐     ┌───────────┐      ┌───────────┐
 │ Upload: │     │ Choose:   │      │ Display:  │
 │ Medical │     │ Bonifico  │      │ Summary   │
 │ Cert.   │     │ or PayPal │      │ Reference │
 │         │     │           │      │ Number    │
 │ Accept: │     │ Show      │      │           │
 │ Terms   │     │ payment   │      │ Next      │
 │ Privacy │     │ details   │      │ steps     │
 └─────────┘     └───────────┘      └───────────┘
```

### Admin Dashboard Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN FLOW                                │
└─────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   /admin    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   LOGIN     │
                    │  - Email    │
                    │  - Password │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │       Supabase Auth     │
              └────────────┬────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  DASHBOARD  │
                    │  - Stats    │
                    │  - Recent   │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
  │REGISTRATIONS│   │  SETTINGS   │   │   LOGOUT    │
  │ - List view │   │ - Pricing   │   └─────────────┘
  │ - Filters   │   │ - Dates     │
  │ - Search    │   │ - Content   │
  │ - Export    │   └─────────────┘
  └──────┬──────┘
         │
         ▼
  ┌─────────────────┐
  │ REGISTRATION    │
  │ DETAIL VIEW     │
  │ - All info      │
  │ - Documents     │
  │ - Status update │
  │ - Add notes     │
  │ - Send email    │
  └─────────────────┘
```

---

## Database Schema Concept

### Supabase Tables

```sql
-- Registrations table
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Registration info
  reference_code VARCHAR(20) UNIQUE NOT NULL,
  camp_year INTEGER NOT NULL,
  camp_type VARCHAR(20) NOT NULL, -- 'standard' | 'specialization'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'confirmed' | 'paid' | 'cancelled'
  
  -- Participant info
  participant_first_name VARCHAR(100) NOT NULL,
  participant_last_name VARCHAR(100) NOT NULL,
  participant_dob DATE NOT NULL,
  participant_gender VARCHAR(10),
  participant_school VARCHAR(200),
  participant_tshirt_size VARCHAR(5),
  participant_dietary_requirements TEXT,
  participant_medical_notes TEXT,
  
  -- Guardian info
  guardian_first_name VARCHAR(100) NOT NULL,
  guardian_last_name VARCHAR(100) NOT NULL,
  guardian_email VARCHAR(255) NOT NULL,
  guardian_phone VARCHAR(50) NOT NULL,
  guardian_address TEXT,
  guardian_city VARCHAR(100),
  guardian_postal_code VARCHAR(20),
  guardian_relation VARCHAR(50),
  
  -- Emergency contact
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(50),
  
  -- Payment
  payment_method VARCHAR(20), -- 'bank_transfer' | 'paypal'
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Consents
  terms_accepted BOOLEAN DEFAULT FALSE,
  privacy_accepted BOOLEAN DEFAULT FALSE,
  photo_consent BOOLEAN DEFAULT FALSE,
  
  -- Admin fields
  admin_notes TEXT,
  
  -- Constraints
  CONSTRAINT valid_camp_type CHECK (camp_type IN ('standard', 'specialization')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled'))
);

-- Documents table
CREATE TABLE registration_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL, -- 'medical_certificate' | 'id_document'
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users (managed by Supabase Auth)
-- Additional profile info
CREATE TABLE admin_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name VARCHAR(200),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log
CREATE TABLE admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  registration_id UUID REFERENCES registrations(id),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_documents ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can view registrations
CREATE POLICY "Admins can view all registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert registrations"
  ON registrations FOR INSERT
  TO anon
  WITH CHECK (true);
```

---

## Implementation Roadmap

### Overview

The implementation follows an iterative approach, porting the approved design template (`GeneralIdea/code.html`) to Next.js components. We are NOT building from scratch - we are adapting an existing, approved design.

### Phase 1: Project Setup & Foundation

**Goal:** Initialize project with correct configuration matching the design template.

- [ ] Initialize Next.js 14+ project with App Router and TypeScript
- [ ] Configure Tailwind CSS with custom colors (brand-beige, brand-green, brand-orange, etc.)
- [ ] Add Poppins font via Google Fonts
- [ ] Configure custom box shadows (subtle, strong)
- [ ] Install shadcn/ui and configure theme
- [ ] Set up project structure (components/, lib/, hooks/, types/)
- [ ] Create globals.css with custom styles from template (timeline connectors, sparkles, etc.)
- [ ] Deploy initial setup to Netlify

### Phase 2: Layout & Navigation

**Goal:** Create the site shell and navigation (not in current template).

- [ ] Create PageContainer component (max-w-[1440px], centered, responsive padding)
- [ ] Design and build Navigation component (logo, links, CTA, mobile menu)
- [ ] Build Footer component (port from template)
- [ ] Create root layout.tsx with Navigation and Footer
- [ ] Test responsive behavior at all breakpoints

### Phase 3: Homepage - Port Design Template

**Goal:** Convert the HTML template to React components, preserving all styling.

**Left Column (Main Content):**
- [ ] Port Hero section with carousel functionality
- [ ] Port InfoBar (stats gradient bar)
- [ ] Port ExperienceSection (2-column text + image)
- [ ] Port ProgramHighlights (timeline with connectors)
- [ ] Port FacilitiesGrid (2x2 image grid with overlays)
- [ ] Port PricingCards (3 cards with featured styling)

**Right Column (Sidebar):**
- [ ] Port TestimonialsCarousel with navigation
- [ ] Port StaffPreview (4 circular avatars)
- [ ] Port GalleryPreview (5 images + link)
- [ ] Port PartnersGrid (grayscale logo grid)

**Full Width:**
- [ ] Port FinalCTA section (green banner)

**Assembly:**
- [ ] Build homepage with 3-column XL / single-column mobile grid
- [ ] Test responsive collapsing behavior
- [ ] Verify all hover effects and transitions

### Phase 4: Additional Public Pages

**Goal:** Build remaining public pages with consistent styling.

- [ ] Staff Page (`/staff`)
  - Full staff grid with all team members
  - Category filtering (Trainers, Champions, Guest Stars)
  - Profile expansion/modal
- [ ] Gallery Page (`/galleria`)
  - Masonry or grid layout
  - Year/category filtering
  - Lightbox functionality
- [ ] FAQ Page (`/faq`)
  - Search functionality
  - Accordion categories
  - Contact CTA
- [ ] Contacts Page (`/contatti`)
  - Contact form
  - Contact information cards
  - Map embed

### Phase 5: Registration System

**Goal:** Build complete registration flow with Supabase backend.

- [ ] Set up Supabase project and database schema
- [ ] Create registration wizard component
- [ ] Build step indicator
- [ ] Implement form steps:
  - [ ] Camp selection with pricing
  - [ ] Participant information
  - [ ] Guardian/parent information
  - [ ] Document upload (medical certificate)
  - [ ] Consent checkboxes
  - [ ] Payment method selection
  - [ ] Confirmation screen
- [ ] Add form validation with Zod
- [ ] Implement draft saving to localStorage
- [ ] Create Supabase submission logic
- [ ] Build confirmation email with Supabase Edge Functions
- [ ] Test complete registration flow

### Phase 6: Content & Polish

**Goal:** Replace placeholder content and optimize for production.

- [ ] Replace all placeholder images with actual camp photos
- [ ] Add real testimonials
- [ ] Input actual staff profiles
- [ ] Set correct pricing information
- [ ] Add real partner/sponsor logos
- [ ] Translate any remaining English text to Italian
- [ ] SEO optimization (meta tags, Open Graph, sitemap)
- [ ] Performance optimization (image optimization, lazy loading)
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Cross-browser testing
- [ ] Mobile device testing

### Phase 7: Admin Dashboard (Future)

**Goal:** Build admin interface for managing registrations.

- [ ] Set up Supabase authentication
- [ ] Create admin login page
- [ ] Build admin dashboard layout
- [ ] Create registrations list with filters
- [ ] Build registration detail view
- [ ] Add export to CSV functionality
- [ ] Implement activity logging

### Launch Checklist

- [ ] Final content review
- [ ] Performance benchmarks (Core Web Vitals)
- [ ] Security review
- [ ] Backup and recovery plan
- [ ] DNS configuration
- [ ] SSL certificate verification
- [ ] Analytics setup
- [ ] Error tracking (e.g., Sentry)
- [ ] Go live!

---

## Appendix: Design Specifications

### Design Foundation

The redesign is based on the approved design concept located at:
- **HTML Template:** `GeneralIdea/code.html`
- **Screenshot:** `GeneralIdea/screen.png`

This design establishes:
- A warm, inviting aesthetic with the beige background
- Modern card-based layout with rounded corners (2xl radius)
- 3-column grid on XL screens, single column on mobile
- Gradient accents for visual interest
- Clean typography with Poppins font family

### Color System

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Brand Beige | `#FFF9F0` | `brand-beige` | Page background |
| Brand Green | `#84C14A` | `brand-green` | Primary CTAs, highlights, icons |
| Brand Green Dark | `#73A942` | `brand-green-dark` | Hover states |
| Brand Orange | `#F7941D` | `brand-orange` | Secondary CTAs, badges, featured items |
| Brand Dark | `#333333` | `brand-dark` | Headings, footer background |
| Brand Gray | `#555555` | `brand-gray` | Body text, captions |
| Error | `#DC2626` | - | Form errors |
| Success | `#16A34A` | - | Confirmations |

### Tailwind Configuration

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'brand-beige': '#FFF9F0',
        'brand-green': '#84C14A',
        'brand-green-dark': '#73A942',
        'brand-orange': '#F7941D',
        'brand-dark': '#333333',
        'brand-gray': '#555555',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 15px rgba(0, 0, 0, 0.05)',
        'strong': '0 8px 25px rgba(0, 0, 0, 0.1)',
      }
    }
  }
}
```

### Typography

**Font Family:** Poppins (Google Fonts)
- Weights: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)

| Element | Size (Mobile) | Size (Desktop) | Weight |
|---------|---------------|----------------|--------|
| H1 | 2.25rem (text-4xl) | 3.75rem (text-6xl) | 800 (extrabold) |
| H2 | 1.875rem (text-3xl) | 1.875rem (text-3xl) | 700 (bold) |
| H3 | 1.25rem (text-xl) | 1.25rem (text-xl) | 700 (bold) |
| Body | 1rem (text-base) | 1rem (text-base) | 400 (regular) |
| Small | 0.875rem (text-sm) | 0.875rem (text-sm) | 400/600 |

### Layout System

**Responsive Grid:**
- Mobile: Single column (`grid-cols-1`)
- Tablet (MD): 2 columns where appropriate
- Desktop (XL): 3-column layout (`xl:grid-cols-3`)
  - Left column: 2/3 width (`xl:col-span-2`) - Main content
  - Right column: 1/3 width (`xl:col-span-1`) - Sidebar

**Container:**
- Max width: 1440px (`max-w-[1440px]`)
- Centered: `mx-auto`
- Padding: `p-4 md:p-8`

**Card Styling:**
- Border radius: `rounded-2xl`
- Shadow: `shadow-subtle` or `shadow-strong`
- Background: White (`bg-white`)
- Border: Optional `border border-gray-200`

### Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Large phones, small tablets |
| md | 768px | Tablets, some layout changes |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops - triggers 3-column layout |
| 2xl | 1536px | Large screens |

---

## Site Pages

### Page Structure

| Page | Route | Priority | Description |
|------|-------|----------|-------------|
| Homepage | `/` | P0 | Main landing page with all sections |
| Registration | `/iscrizione` | P0 | Multi-step registration form |
| Staff | `/staff` | P1 | Full staff directory with profiles |
| Gallery | `/galleria` | P1 | Photo gallery with filtering |
| FAQ | `/faq` | P1 | Searchable FAQ accordion |
| Contacts | `/contatti` | P1 | Contact form and information |
| Admin Login | `/admin` | P2 | Admin authentication (future phase) |
| Admin Dashboard | `/admin/dashboard` | P2 | Registration management (future phase) |

### Page Details

#### Homepage (`/`)
The homepage implements the approved design concept with all sections. It serves as the primary landing page and includes:
- Hero section with image carousel
- Info bar with key statistics
- Experience section
- Program highlights timeline
- Facilities grid
- Pricing cards
- Testimonials carousel (sidebar)
- Staff preview (sidebar)
- Gallery preview (sidebar)
- Partners grid (sidebar)
- Final CTA section
- Footer

#### Registration Page (`/iscrizione`)
Multi-step registration wizard with:
- Camp selection and pricing display
- Participant information form
- Guardian/parent information form
- Document upload (medical certificate)
- Consent checkboxes (terms, privacy, photos)
- Payment method selection
- Confirmation and next steps

#### Staff Page (`/staff`)
Full staff directory featuring:
- Guest stars section (featured)
- Trainers grid with filters
- Champions showcase
- Expandable profile cards with full bios
- Social media links where available

#### Gallery Page (`/galleria`)
Photo gallery with:
- Year/category filtering
- Masonry or grid layout
- Lightbox functionality
- Lazy-loaded images
- Album organization

#### FAQ Page (`/faq`)
FAQ section with:
- Search functionality
- Category filters
- Accordion-style Q&A
- Contact CTA for unanswered questions

#### Contacts Page (`/contatti`)
Contact information including:
- Email, phone, address
- Embedded map
- Inquiry form
- Social media links
- Office hours

---

*Document created: December 2024*
*Last updated: December 2024*
*Version: 2.0*