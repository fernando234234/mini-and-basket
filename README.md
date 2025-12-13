# Mini & Basket Camp - Website

Basketball summer camp registration website for Mini & Basket Camp (since 2004).

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)

## 🚀 Live Site

- **Production**: https://mini-and-basket.vercel.app/
- **Admin Dashboard**: https://mini-and-basket.vercel.app/admin

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe (Checkout)
- **Hosting**: Vercel
- **Storage**: Supabase Storage

## 📋 Features

### Public Pages
- Homepage with hero, pricing, staff preview
- Program details (Programma)
- Staff page with 14 professional trainers
- Gallery with 20 collections, 7,487 photos
- FAQ with accordion
- Contact form
- Registration wizard with validation
- Privacy policy and Rules pages

### Payment Integration
- Stripe Checkout with 6 payment methods
- Early bird pricing (before Feb 28, 2026)
- Deposit option (€100) or full payment
- Webhook for automatic status updates

### Admin Dashboard
- Registration management (CRM)
- Gallery management
- Statistics and analytics

## 🔧 Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Local Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📦 Production Build

```bash
npm run build
npm run start
```

## 🌐 Deploying to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel auto-detects Next.js settings
4. Add environment variables
5. Click Deploy

### Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 📖 Documentation

- [Vercel Setup](docs/VERCEL_SETUP.md) - Deployment and webhook configuration
- [Stripe Setup](docs/STRIPE_SETUP.md) - Payment integration guide
- [Database Design](docs/DATABASE_DESIGN.md) - Schema and migrations
- [Architecture](docs/ARCHITECTURE.md) - Project structure and data flow
- [Supabase Setup](docs/SUPABASE_NETLIFY_SETUP.md) - Database configuration

## 🔐 Admin Access

**Demo Login:**
- Email: `Demo@demo.com`
- Password: `demo123`

## 📅 Camp 2026 Info

- **Dates**: 28 Giugno - 5 Luglio 2026
- **Location**: Villaggio Residence Bahja****, Paola (CS)
- **Pricing**:
  - Standard: €610 (€590 early bird)
  - Alta Specializzazione: €800 (€760 early bird)
- **Early Bird Deadline**: 28 Febbraio 2026

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin panel pages
│   │   ├── api/            # API routes (checkout, webhooks)
│   │   ├── contatti/       # Contact page
│   │   ├── faq/            # FAQ page
│   │   ├── galleria/       # Gallery pages
│   │   ├── iscrizione/     # Registration wizard
│   │   ├── privacy/        # Privacy policy
│   │   ├── programma/      # Program details
│   │   ├── regolamento/    # Rules page
│   │   └── staff/          # Staff page
│   ├── components/         # React components
│   │   └── admin/          # Admin-specific components
│   ├── lib/                # Utilities and config
│   └── types/              # TypeScript types
├── docs/                   # Documentation
├── public/                 # Static assets
├── scripts/                # Utility scripts
└── supabase/              # Database migrations
```

## 👨‍💻 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run upload-gallery` | Upload gallery photos to Supabase |

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Service role key never exposed to client
- Stripe webhook signature verification
- HTTPS enforced in production

## 📝 License

This project is proprietary and created for Mini & Basket Camp.

---

Made with ❤️ for Mini & Basket Camp