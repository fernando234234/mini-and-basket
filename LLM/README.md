# 🏀 Mini & Basket Camp - LLM Documentation

> **Your AI Assistant Guide to the Codebase**

Welcome, AI agent! This documentation folder is designed to help you understand and work with the Mini & Basket Camp website codebase. Read this file first, then navigate to specific documentation as needed.

---

## 📋 Quick Reference

| Aspect | Details |
|--------|---------|
| **Project** | Mini & Basket Camp 2026 Registration Website |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Payments** | Stripe Checkout |
| **Hosting** | Netlify |
| **Locale** | Italian (it-IT) |

---

## 🗂️ Documentation Index

| File | Purpose |
|------|---------|
| [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md) | What this project is, business logic, terminology |
| [`CODEBASE_STRUCTURE.md`](./CODEBASE_STRUCTURE.md) | Complete file tree with descriptions |
| [`COMPONENTS.md`](./COMPONENTS.md) | All React components documented |
| [`API_ROUTES.md`](./API_ROUTES.md) | All API endpoints with request/response examples |
| [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) | Supabase tables, columns, RLS policies |
| [`PAYMENT_FLOW.md`](./PAYMENT_FLOW.md) | Stripe integration, pricing logic, webhooks |
| [`COMMON_TASKS.md`](./COMMON_TASKS.md) | Step-by-step guides for common modifications |
| [`ENVIRONMENT.md`](./ENVIRONMENT.md) | Environment variables explained |
| [`KNOWN_ISSUES.md`](./KNOWN_ISSUES.md) | Past bugs and their solutions |

---

## 🚀 Tech Stack Summary

### Frontend
- **Next.js 14** with App Router (`src/app/`)
- **React 18** with Server and Client Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom brand colors

### Backend
- **Next.js API Routes** (`src/app/api/`)
- **Supabase** for database and authentication
- **Stripe** for payment processing

### Key Libraries
```json
{
  "@supabase/supabase-js": "^2.x",
  "@stripe/stripe-js": "^4.x",
  "stripe": "^17.x"
}
```

---

## 🎯 Common Tasks LLMs Might Be Asked

### Content Updates
- Update camp dates (currently: 28 June - 5 July 2026)
- Modify pricing (standard €590/€610, alta specializzazione €760/€800)
- Add new staff members to the staff page
- Update contact information

### Feature Development
- Add new form fields to registration wizard
- Create new pages (e.g., new camp type)
- Add new payment methods
- Implement email notifications

### Bug Fixes
- Fix registration form validation
- Resolve payment webhook issues
- Fix image loading problems
- Address mobile responsiveness issues

### Database Operations
- Add new columns to registrations table
- Create new database tables
- Modify RLS policies

---

## 📍 Key File Locations

### Pages (Routes)
```
src/app/
├── page.tsx                    # Homepage
├── iscrizione/page.tsx         # Registration page
├── iscrizione/success/page.tsx # Payment success page
├── programma/page.tsx          # Program/schedule page
├── staff/page.tsx              # Staff listing
├── galleria/page.tsx           # Photo gallery
├── contatti/page.tsx           # Contact page
├── faq/page.tsx                # FAQ page
└── admin/                      # Admin dashboard
```

### Core Components
```
src/components/
├── RegistrationWizard.tsx      # Multi-step registration form
├── StripeCheckout.tsx          # Payment component
├── Navigation.tsx              # Site navigation
├── Hero.tsx                    # Homepage hero section
└── Footer.tsx                  # Site footer
```

### API Routes
```
src/app/api/
├── register/route.ts           # POST - Save registration
├── checkout/route.ts           # POST/GET - Stripe session
├── webhook/route.ts            # POST - Stripe webhooks
└── admin/
    ├── stats/route.ts          # GET - Dashboard stats
    └── registrations/route.ts  # GET/PATCH - Manage registrations
```

### Configuration
```
src/lib/
├── stripe.ts                   # Stripe config & pricing
├── supabase.ts                 # Supabase client setup
├── validation.ts               # Form validation helpers
└── database.ts                 # Database helper functions
```

---

## 🇮🇹 Italian Terminology

This is an Italian website. Key terms you'll encounter:

| Italian | English | Context |
|---------|---------|---------|
| Iscrizione | Registration | Registration form/process |
| Genitore | Parent | Parent/guardian information |
| Camper/Atleta | Camper/Athlete | Child participant |
| Pacchetto | Package | Camp package type |
| Pagamento | Payment | Payment-related |
| Acconto | Deposit | Partial payment (€200) |
| Saldo | Balance | Remaining payment |
| Alta Specializzazione | High Specialization | Premium package |
| Codice Fiscale | Tax Code | Italian fiscal code (required) |
| Liberatoria | Release Form | Photo/video consent |
| Regolamento | Rules | Camp regulations |

---

## ⚡ Quick Start for Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Environment Setup
Copy `.env.local.example` to `.env.local` and fill in:
- Supabase URL and keys
- Stripe publishable and secret keys
- Stripe webhook secret

See [`ENVIRONMENT.md`](./ENVIRONMENT.md) for detailed setup.

---

## 🔑 Important Patterns

### 1. Client vs Server Components
- Files with `"use client"` at the top are client components
- API routes are server-side only
- Use `supabaseAdmin` (service role) for API routes to bypass RLS

### 2. Form Data Flow
```
RegistrationWizard → /api/register → Supabase
                   ↓
            /api/checkout → Stripe
                   ↓
            Stripe Webhook → /api/webhook → Update Supabase
```

### 3. Pricing Logic
```typescript
// In src/lib/stripe.ts
const isEarlyBird = () => {
  const now = new Date();
  const deadline = new Date('2026-02-28T23:59:59');
  return now <= deadline;
};
```

### 4. Error Handling Pattern
API routes return consistent JSON:
```typescript
// Success
return NextResponse.json({ success: true, data: ... });

// Error
return NextResponse.json({ error: 'message' }, { status: 400 });
```

---

## 📞 Getting Help

If you need more context:
1. Read the specific documentation file for that area
2. Check the actual source files referenced
3. Look at [`KNOWN_ISSUES.md`](./KNOWN_ISSUES.md) for past problems

---

*Last updated: December 2024*