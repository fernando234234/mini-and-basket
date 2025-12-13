# 🧩 React Components Documentation

Comprehensive documentation for all React components in the Mini & Basket Camp website.

---

## Table of Contents

1. [Layout Components](#layout-components)
2. [Homepage Components](#homepage-components)
3. [Registration Components](#registration-components)
4. [Page Components](#page-components)
5. [Utility Components](#utility-components)
6. [Admin Components](#admin-components)

---

## Layout Components

### [`Navigation.tsx`](../src/components/Navigation.tsx:1)

**Purpose:** Main site navigation with announcement bar and mobile menu.

**Type:** Client Component (`"use client"`)

**Features:**
- Announcement bar with dismissible notification
- Sticky header with scroll detection
- Mobile hamburger menu
- Active link highlighting
- CTA button with shine effect

**State:**
```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isScrolled, setIsScrolled] = useState(false);
const [showAnnouncement, setShowAnnouncement] = useState(true);
```

**Navigation Links:**
```typescript
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/programma", label: "Programma" },
  { href: "/staff", label: "Staff" },
  { href: "/galleria", label: "Galleria" },
  { href: "/faq", label: "FAQ" },
  { href: "/contatti", label: "Contatti" },
];
```

**Key Logic:**
- Uses `usePathname()` for active link detection
- Scroll listener for sticky effect
- Custom basketball logo SVG

---

### [`Footer.tsx`](../src/components/Footer.tsx)

**Purpose:** Site footer with contact info, links, and social media.

**Sections:**
1. Logo and description
2. Quick links
3. Contact information
4. Social media icons
5. Copyright

---

### [`PageHero.tsx`](../src/components/PageHero.tsx)

**Purpose:** Reusable hero section for subpages.

**Props:**
```typescript
interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}
```

---

## Homepage Components

### [`Hero.tsx`](../src/components/Hero.tsx:1)

**Purpose:** Homepage hero section with image carousel.

**Type:** Client Component

**Features:**
- Auto-advancing image carousel (6-second interval)
- Parallax background effect
- Animated basketball pattern decorations
- Floating elements animation
- Stats row (participants, days, coaches)
- Dual CTA buttons

**State:**
```typescript
const [currentSlide, setCurrentSlide] = useState(0);
const [isLoaded, setIsLoaded] = useState(false);
```

**Carousel Images:**
```typescript
const slides = [
  { image: "https://images.unsplash.com/...", alt: "Basketball court action" },
  { image: "https://images.unsplash.com/...", alt: "Kids playing basketball" },
  { image: "https://images.unsplash.com/...", alt: "Basketball on court" },
];
```

---

### [`InfoBar.tsx`](../src/components/InfoBar.tsx)

**Purpose:** Key information display (dates, location, age range).

**Content:**
- Camp dates: 28 Giugno - 5 Luglio 2026
- Location: Villaggio Bahja, Paola (CS)
- Age range: 6-14 anni

---

### [`ExperienceSection.tsx`](../src/components/ExperienceSection.tsx)

**Purpose:** The "4 Pillars" of the camp experience.

**Pillars:**
1. Mini&Basket School - Technical improvement
2. Crescita Individuale - Personal growth
3. Active Holiday - Sports vacation
4. Tutor - Professional coaches

---

### [`ProgramHighlights.tsx`](../src/components/ProgramHighlights.tsx)

**Purpose:** Daily program overview with icons.

**Highlights:**
- Morning training sessions
- Technical skill development
- Pool and beach activities
- Evening entertainment

---

### [`PricingCards.tsx`](../src/components/PricingCards.tsx)

**Purpose:** Package comparison cards with pricing.

**Packages:**
```typescript
const packages = [
  {
    name: "Camp Standard",
    price: "€590", // or €610 after early bird
    features: ["7 giorni di Camp", "Pensione completa", "Assicurazione", "Kit Camp", "Assistenza H24"],
  },
  {
    name: "Alta Specializzazione",
    price: "€760", // or €800 after early bird
    features: ["Tutto Standard +", "7 ore tecnica individuale", "Max 20 posti"],
    highlighted: true,
  },
];
```

---

### [`StaffPreview.tsx`](../src/components/StaffPreview.tsx)

**Purpose:** Preview of staff members on homepage.

**Features:**
- Grid of coach photos
- Names and roles
- Link to full staff page

---

### [`GalleryPreview.tsx`](../src/components/GalleryPreview.tsx)

**Purpose:** Photo gallery preview with featured images.

---

### [`TestimonialsCarousel.tsx`](../src/components/TestimonialsCarousel.tsx)

**Purpose:** Parent/camper testimonials slider.

---

### [`PartnersGrid.tsx`](../src/components/PartnersGrid.tsx)

**Purpose:** Grid of partner basketball club logos.

**Partner Images:**
```
public/images/partners/
├── partners_01.png
├── partners_06.png
├── partners_07.png
├── partners_10.png
├── partners_15.png
├── partners_17.png
├── partners_19.png
└── partners_20.png
```

---

### [`FinalCTA.tsx`](../src/components/FinalCTA.tsx)

**Purpose:** Final call-to-action section before footer.

---

### [`DecorativeElements.tsx`](../src/components/DecorativeElements.tsx)

**Purpose:** Floating basketball decorative elements.

---

### [`FacilitiesGrid.tsx`](../src/components/FacilitiesGrid.tsx)

**Purpose:** Grid showing camp facilities.

**Facilities:**
- 4 Basketball courts
- Swimming pool
- Private beach

---

## Registration Components

### [`RegistrationWizard.tsx`](../src/components/RegistrationWizard.tsx:1)

**Purpose:** Multi-step registration form (main form component).

**Type:** Client Component

**File Size:** ~1342 lines (largest component)

**Steps:**
1. Package Selection (packageType, busTransfer)
2. Parent Information (parent object)
3. Camper Information (camper object)
4. Medical Information (medical object)
5. Review & Consents
6. Payment (Stripe integration)

**Form State:**
```typescript
interface FormData {
  packageType: 'standard' | 'alta_specializzazione' | '';
  busTransfer: boolean;
  parent: ParentInfo;
  camper: CamperInfo;
  medical: MedicalInfo;
  liberatoriaFotoVideo: boolean;
  accettazioneRegolamento: boolean;
  privacyPolicy: boolean;
  codiceInvito: string;
  sameAddress: boolean;
}
```

**Parent Info Interface:**
```typescript
interface ParentInfo {
  nomeCognome: string;
  codiceFiscale: string;
  citta: string;
  cap: string;
  indirizzo: string;
  telefono: string;
  email: string;
}
```

**Camper Info Interface:**
```typescript
interface CamperInfo {
  nomeCognome: string;
  codiceFiscale: string;
  luogoNascita: string;
  dataNascita: string;
  sesso: 'M' | 'F' | '';
  citta: string;
  cap: string;
  indirizzo: string;
  scuola: string;
  classe: string;
  taglia: string;
  altezza: string;
  peso: string;
  numeroScarpe: string;
  esperienza: string;
  societa: string;
}
```

**Key Functions:**
```typescript
// Validation per step
const validateStep = (step: number): boolean => { ... }

// Navigation
const handleNext = () => { ... }
const handlePrev = () => { ... }

// Form submission
const handleSubmit = async () => {
  // Calls /api/register
  // Then redirects to Step 6 for payment
}

// Price calculation
const calculateTotal = () => {
  let total = 0;
  if (formData.packageType === 'standard') {
    total = earlyBird ? 590 : 610;
  } else if (formData.packageType === 'alta_specializzazione') {
    total = earlyBird ? 760 : 800;
  }
  if (formData.busTransfer) {
    total += 60;
  }
  return total;
}
```

**API Integration:**
```typescript
// Save registration
const response = await fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(registrationData),
});
```

---

### [`StripeCheckout.tsx`](../src/components/StripeCheckout.tsx)

**Purpose:** Stripe payment integration component.

**Props:**
```typescript
interface StripeCheckoutProps {
  packageType: string;
  registrationData: {
    id?: string;
    participantName: string;
    email: string;
  };
  onSuccess: (paymentType: 'full' | 'deposit', sessionId: string) => void;
  onCancel: () => void;
}
```

**Features:**
- Full payment vs deposit selection
- Dynamic pricing display
- Early bird indicator
- Payment method icons
- Stripe Checkout redirect

**API Call:**
```typescript
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    packageType,
    paymentType,
    registrationData,
  }),
});
```

---

### [`PaymentInfo.tsx`](../src/components/PaymentInfo.tsx)

**Purpose:** Display payment information and instructions.

---

### [`PaymentMethods.tsx`](../src/components/PaymentMethods.tsx)

**Purpose:** Display available payment method icons.

**Methods:**
- Credit cards (Visa, Mastercard, Amex)
- Apple Pay / Google Pay
- PayPal
- Klarna
- SEPA Direct Debit

---

## Page Components

### [`StaffGrid.tsx`](../src/app/staff/StaffGrid.tsx)

**Purpose:** Grid layout for staff member cards.

**Staff Data:**
```typescript
const coaches = [
  { name: "Gianluca Tucci", image: "/images/staff/GianlucaTucci.webp" },
  { name: "Elia Confessore", image: "/images/staff/EliaConfessore.webp" },
  // ... more coaches
];
```

---

### [`GalleryGrid.tsx`](../src/app/galleria/GalleryGrid.tsx)

**Purpose:** Grid of gallery collection cards.

**Props:**
```typescript
interface GalleryGridProps {
  collections: GalleryCollection[];
}
```

---

### [`CollectionGalleryGrid.tsx`](../src/app/galleria/[slug]/CollectionGalleryGrid.tsx)

**Purpose:** Grid of photos within a single collection.

**Features:**
- Lightbox integration
- Image lazy loading
- Responsive grid

---

## Utility Components

### [`Accordion.tsx`](../src/components/Accordion.tsx)

**Purpose:** Expandable FAQ accordion component.

**Props:**
```typescript
interface AccordionProps {
  items: {
    question: string;
    answer: string;
  }[];
}
```

**Usage:**
```tsx
<Accordion items={faqItems} />
```

---

### [`ContactForm.tsx`](../src/components/ContactForm.tsx)

**Purpose:** Contact form with validation.

**Fields:**
- Name
- Email
- Phone
- Subject (dropdown)
- Message

**Subjects:**
```typescript
const subjects = [
  { value: 'info', label: 'Informazioni generali' },
  { value: 'iscrizione', label: 'Iscrizioni' },
  { value: 'pagamenti', label: 'Pagamenti' },
  { value: 'programma', label: 'Programma' },
  { value: 'altro', label: 'Altro' },
];
```

---

### [`CookieConsent.tsx`](../src/components/CookieConsent.tsx)

**Purpose:** GDPR cookie consent banner.

**Features:**
- LocalStorage persistence
- Accept/decline options
- Link to privacy policy

---

### [`BasketballShotAnimation.tsx`](../src/components/BasketballShotAnimation.tsx)

**Purpose:** Animated basketball shot sequence.

**Frame Images:**
```
public/animations/basketball-shot/
├── frame-1-ready.jpeg
├── frame-2-windup.jpeg
├── frame-3-release.jpeg
├── frame-4-flight.jpeg
├── frame-5-swish.jpeg
└── frame-6-celebration.jpeg
```

---

## Admin Components

### [`AdminHeader.tsx`](../src/components/admin/AdminHeader.tsx)

**Purpose:** Admin dashboard header.

**Features:**
- Page title
- User info
- Logout button

---

### [`AdminSidebar.tsx`](../src/components/admin/AdminSidebar.tsx)

**Purpose:** Admin navigation sidebar.

**Links:**
```typescript
const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'chart' },
  { href: '/admin/iscrizioni', label: 'Iscrizioni', icon: 'users' },
  { href: '/admin/galleria', label: 'Galleria', icon: 'photos' },
];
```

---

### [`StatsCard.tsx`](../src/components/admin/StatsCard.tsx)

**Purpose:** Dashboard statistics card.

**Props:**
```typescript
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  change?: string;
}
```

---

### [`RegistrationsTable.tsx`](../src/components/admin/RegistrationsTable.tsx)

**Purpose:** Data table for registration management.

**Features:**
- Sortable columns
- Status filtering
- Pagination
- Click to view detail

**Columns:**
- Camper name
- Parent email
- Package type
- Status
- Payment status
- Created date
- Actions

---

### [`RegistrationDetail.tsx`](../src/components/admin/RegistrationDetail.tsx)

**Purpose:** Modal showing full registration details.

**Sections:**
- Parent information
- Camper information
- Medical information
- Payment details
- Status management

---

### [`GalleryManager.tsx`](../src/components/admin/GalleryManager.tsx)

**Purpose:** Gallery CRUD interface.

**Features:**
- Create/edit collections
- Upload photos
- Reorder images
- Set cover image

---

### [`PhotoUploader.tsx`](../src/components/admin/PhotoUploader.tsx)

**Purpose:** Photo upload component for gallery.

**Features:**
- Drag and drop
- Multiple file selection
- Upload progress
- Image preview

---

## Component Patterns

### Client vs Server Components

```typescript
// Client Component (interactive)
"use client";
import { useState } from "react";
export default function ClientComponent() { ... }

// Server Component (default, no "use client")
export default async function ServerComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### Common Props Pattern

```typescript
interface ComponentProps {
  className?: string;  // Additional CSS classes
  children?: React.ReactNode;  // Child elements
}
```

### Error Handling Pattern

```typescript
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);

try {
  setIsLoading(true);
  // ... operation
} catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error');
} finally {
  setIsLoading(false);
}
```

---

## Styling Conventions

### Tailwind Classes Pattern
```tsx
// Base + conditional + hover states
<button className={`
  base-classes px-4 py-2 rounded-xl font-bold
  ${isActive ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600'}
  hover:bg-brand-green/90 transition-all duration-300
`}>
```

### Brand Colors
```css
/* Defined in globals.css / tailwind.config */
--brand-green: #10B981;
--brand-orange: #F97316;
--brand-dark: #1F2937;
--brand-gray: #6B7280;
--brand-beige: #FEF7ED;
```

---

*For API integration details, see [API_ROUTES.md](./API_ROUTES.md)*