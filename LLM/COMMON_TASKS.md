# 🔧 Common Tasks Guide

Step-by-step instructions for common modifications to the Mini & Basket Camp website.

---

## Table of Contents

1. [Adding a New Page](#adding-a-new-page)
2. [Modifying Pricing](#modifying-pricing)
3. [Updating Camp Dates](#updating-camp-dates)
4. [Adding a New Staff Member](#adding-a-new-staff-member)
5. [Adding a Gallery Collection](#adding-a-gallery-collection)
6. [Adding a Form Field](#adding-a-form-field)
7. [Changing the Early Bird Deadline](#changing-the-early-bird-deadline)
8. [Adding a New Payment Method](#adding-a-new-payment-method)
9. [Updating Contact Information](#updating-contact-information)
10. [Adding FAQ Items](#adding-faq-items)

---

## Adding a New Page

### Step 1: Create the Page File

Create a new file in `src/app/<route-name>/page.tsx`:

```typescript
// src/app/nuova-pagina/page.tsx
import { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Titolo Pagina - Mini & Basket Camp',
  description: 'Descrizione della pagina per SEO',
};

export default function NuovaPagina() {
  return (
    <main className="bg-brand-beige min-h-screen">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <PageHero 
          title="Titolo Pagina" 
          subtitle="Sottotitolo opzionale" 
        />
        
        <div className="mt-12">
          {/* Page content here */}
        </div>
      </section>
    </main>
  );
}
```

### Step 2: Add to Navigation

Edit [`src/components/Navigation.tsx`](../src/components/Navigation.tsx:21):

```typescript
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/programma", label: "Programma" },
  { href: "/staff", label: "Staff" },
  { href: "/galleria", label: "Galleria" },
  { href: "/nuova-pagina", label: "Nuova Pagina" },  // Add here
  { href: "/faq", label: "FAQ" },
  { href: "/contatti", label: "Contatti" },
];
```

### Step 3: Update Sitemap

Edit [`src/app/sitemap.ts`](../src/app/sitemap.ts):

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ... existing pages
    {
      url: 'https://miniandbasketcamp.it/nuova-pagina',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
```

---

## Modifying Pricing

### Step 1: Update Price Constants

Edit [`src/lib/stripe.ts`](../src/lib/stripe.ts:34):

```typescript
export const PACKAGE_PRICES = {
  standard: {
    name: 'Camp Standard 2026',
    fullPrice: 65000,        // Change: €650 (in cents)
    earlyBirdPrice: 62000,   // Change: €620 (in cents)
    depositPrice: 25000,     // Change: €250 (in cents)
    displayPrice: '€650',    // Update display
    displayEarlyBird: '€620',
    displayDeposit: '€250',
  },
  // ... alta_specializzazione
};
```

### Step 2: Update Registration Wizard Display

The [`RegistrationWizard.tsx`](../src/components/RegistrationWizard.tsx:67) reads from `PACKAGE_PRICES`, but also has display values:

```typescript
// Update the packages array (around line 67)
const packages = [
  {
    id: "standard",
    title: "CAMP STANDARD",
    price: isEarlyBird() ? "€620" : "€650",  // Update these
    originalPrice: isEarlyBird() ? "€650" : null,
    // ...
  },
];
```

### Step 3: Update Homepage Pricing Cards

Edit [`src/components/PricingCards.tsx`](../src/components/PricingCards.tsx) if prices are hardcoded there.

---

## Updating Camp Dates

### Files to Update

1. **Hero Component** - [`src/components/Hero.tsx`](../src/components/Hero.tsx:169):
```typescript
<span>28 Giugno - 5 Luglio 2026</span>  // Update dates
```

2. **Info Bar** - [`src/components/InfoBar.tsx`](../src/components/InfoBar.tsx):
```typescript
// Update date display
```

3. **Registration Wizard** - [`src/components/RegistrationWizard.tsx`](../src/components/RegistrationWizard.tsx:528):
```typescript
<p className="text-brand-gray mb-6">
  Camp 2026: 28 Giugno - 5 Luglio | Villaggio Bahja, Paola (CS)
</p>
```

4. **Navigation Announcement** - [`src/components/Navigation.tsx`](../src/components/Navigation.tsx:67):
```typescript
<span className="hidden md:inline font-bold">29 Giugno - 6 Luglio</span>
```

### Search for All Date References

```bash
# Find all date mentions
grep -r "Giugno\|Luglio\|June\|July" src/
```

---

## Adding a New Staff Member

### Step 1: Add Image

Place the image in `public/images/staff/`:
```
public/images/staff/NuovoAllenatore.webp
```

### Step 2: Update Staff Data

Edit [`src/app/staff/StaffGrid.tsx`](../src/app/staff/StaffGrid.tsx) or the staff page:

```typescript
const coaches = [
  // ... existing coaches
  {
    name: "Nuovo Allenatore",
    role: "Istruttore",
    image: "/images/staff/NuovoAllenatore.webp",
    bio: "Descrizione dell'allenatore...",
  },
];
```

### Step 3: Update Staff Preview (Optional)

If featured on homepage, update [`src/components/StaffPreview.tsx`](../src/components/StaffPreview.tsx).

---

## Adding a Gallery Collection

### Step 1: Create Collection in Database

```sql
INSERT INTO gallery_collections (name, slug, description, year, collection_type, order_index)
VALUES (
  'Camp 2025',
  'camp-2025',
  'Foto del Mini & Basket Camp 2025',
  2025,
  'camp',
  1
);
```

### Step 2: Upload Photos to Supabase Storage

Using the upload script:

```bash
node scripts/upload-gallery.mjs
```

Or via Supabase Dashboard:
1. Go to Storage → gallery bucket
2. Create folder: `camp-2025/`
3. Upload images

### Step 3: Add Photos to Database

```sql
INSERT INTO gallery_photos (collection_id, url, storage_path, alt_text, year, sort_order)
VALUES 
  ('collection-uuid', 'https://...supabase.co/.../photo1.jpg', 'camp-2025/photo1.jpg', 'Allenamento mattutino', 2025, 1),
  ('collection-uuid', 'https://...supabase.co/.../photo2.jpg', 'camp-2025/photo2.jpg', 'Partita pomeridiana', 2025, 2);
```

### Step 4: Update Collection Cover

```sql
UPDATE gallery_collections 
SET cover_image_url = 'https://...supabase.co/.../cover.jpg'
WHERE slug = 'camp-2025';
```

---

## Adding a Form Field

### Step 1: Add to TypeScript Interface

Edit [`src/types/registration.ts`](../src/types/registration.ts):

```typescript
export interface Registration {
  // ... existing fields
  nuovo_campo: string;  // Add new field
}
```

### Step 2: Add to Form State

Edit [`src/components/RegistrationWizard.tsx`](../src/components/RegistrationWizard.tsx:49):

```typescript
interface CamperInfo {
  // ... existing fields
  nuovoCampo: string;
}

// Initialize in state
const [formData, setFormData] = useState<FormData>({
  // ...
  camper: {
    // ...
    nuovoCampo: '',
  },
});
```

### Step 3: Add Form Input

Add in the appropriate step of the wizard:

```tsx
<div>
  <label className="block text-sm font-semibold text-brand-dark mb-2">
    Nuovo Campo *
  </label>
  <input
    type="text"
    value={formData.camper.nuovoCampo}
    onChange={(e) => updateCamper("nuovoCampo", e.target.value)}
    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
      errors["camper.nuovoCampo"] 
        ? "border-red-400 bg-red-50" 
        : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
    }`}
    placeholder="Placeholder..."
  />
  {errors["camper.nuovoCampo"] && (
    <p className="mt-1 text-sm text-red-500">{errors["camper.nuovoCampo"]}</p>
  )}
</div>
```

### Step 4: Add Validation

In `validateStep()`:

```typescript
case 3: // Camper step
  if (!formData.camper.nuovoCampo.trim()) {
    newErrors["camper.nuovoCampo"] = "Campo obbligatorio";
  }
  break;
```

### Step 5: Add to API Payload

In `handleSubmit()`:

```typescript
const registrationData: RegistrationInsert = {
  // ...
  nuovo_campo: formData.camper.nuovoCampo,
};
```

### Step 6: Add to Database

Create a migration:

```sql
-- supabase/migrations/YYYYMMDD_add_nuovo_campo.sql
ALTER TABLE registrations ADD COLUMN nuovo_campo TEXT;
```

Apply with:
```bash
supabase db reset  # Local
supabase db push   # Production
```

---

## Changing the Early Bird Deadline

### Step 1: Update the Check Function

Edit [`src/lib/stripe.ts`](../src/lib/stripe.ts:23):

```typescript
export const isEarlyBird = () => {
  const now = new Date();
  const earlyBirdDeadline = new Date('2026-03-31T23:59:59');  // New date
  return now <= earlyBirdDeadline;
};

export const EARLY_BIRD_DEADLINE = '31 marzo 2026';  // Update display
```

### Step 2: Update Display Text

Search and update all mentions:

```bash
grep -r "28 Feb\|febbraio" src/
```

Common locations:
- `RegistrationWizard.tsx` - Line ~533
- `PricingCards.tsx`

---

## Adding a New Payment Method

### Step 1: Add to Checkout Route

Edit [`src/app/api/checkout/route.ts`](../src/app/api/checkout/route.ts:13):

```typescript
const PAYMENT_METHODS: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [
  'card',
  'paypal',
  'klarna',
  'bancontact',
  'ideal',
  'sepa_debit',
  'eps',        // Add new method
  'giropay',    // Add another
];
```

### Step 2: Update Payment Methods Display

Edit [`src/components/PaymentMethods.tsx`](../src/components/PaymentMethods.tsx) to show new icons.

### Step 3: Check Stripe Availability

Not all payment methods are available in all countries. Check:
https://stripe.com/docs/payments/payment-methods/integration-options

---

## Updating Contact Information

### Files to Update

1. **Footer** - [`src/components/Footer.tsx`](../src/components/Footer.tsx):
```typescript
// Update phone, email, address
```

2. **Contact Page** - [`src/app/contatti/page.tsx`](../src/app/contatti/page.tsx):
```typescript
// Update all contact details
```

3. **FAQ Page** - [`src/app/faq/page.tsx`](../src/app/faq/page.tsx):
```typescript
// Update phone number in FAQ answers
```

### Search for All Contact Info

```bash
grep -r "339 877 5790\|info@miniandbasketcamp" src/
```

---

## Adding FAQ Items

### Step 1: Edit FAQ Data

Edit [`src/app/faq/page.tsx`](../src/app/faq/page.tsx):

```typescript
const faqItems = [
  // ... existing items
  {
    question: "Nuova domanda frequente?",
    answer: "Risposta dettagliata alla domanda. Può includere <strong>HTML</strong> per formattazione.",
  },
];
```

### Step 2: For Categorized FAQs

If using categories:

```typescript
const faqCategories = [
  {
    title: "Iscrizioni",
    items: [
      { question: "...", answer: "..." },
    ],
  },
  {
    title: "Pagamenti",
    items: [
      { question: "...", answer: "..." },
    ],
  },
];
```

---

## Quick Reference Commands

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Database

```bash
# Start local Supabase
supabase start

# Reset database (apply all migrations)
supabase db reset

# Create new migration
supabase migration new <name>

# Push to production
supabase db push
```

### Stripe Testing

```bash
# Start webhook listener
stripe listen --forward-to localhost:3000/api/webhook

# Trigger test event
stripe trigger checkout.session.completed
```

### Deployment

```bash
# Push to GitHub (Netlify auto-deploys)
git push origin main
```

---

## Debugging Tips

### Check Console Logs

```typescript
console.log('[Component] Debug info:', variable);
```

### API Route Logging

All API routes use prefixed logging:
```
[API] Message
[Webhook] Message
```

### Supabase Queries

```typescript
const { data, error } = await supabase.from('table').select();
if (error) console.error('Supabase error:', error);
```

---

*For known issues and solutions, see [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)*