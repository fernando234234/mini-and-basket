# 🏀 Mini & Basket Camp 2025

A modern, responsive website redesign for Mini & Basket Camp - a youth basketball camp in Italy.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Optional-3ECF8E)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black)

## 🌐 Demo

**Live Site:** [Coming Soon - To be deployed on Vercel]

**Admin Panel:** `/admin`
- Email: `admin@miniandbasketcamp.it`
- Password: `demo123`

## ✨ Features

### Public Website
- 🏠 **Home** - Hero section, program highlights, testimonials, gallery preview
- 📅 **Programma** - Detailed camp schedule and activities
- 👥 **Staff** - Meet our coaches and trainers
- 📸 **Galleria** - Photo gallery with filtering by year and category
- 📝 **Iscrizione** - Multi-step registration wizard
- ❓ **FAQ** - Frequently asked questions
- 📞 **Contatti** - Contact form and information

### Admin Panel
- 📊 **Dashboard** - Registration statistics and overview
- 📋 **Iscrizioni** - Manage and view all registrations
- 🖼️ **Galleria** - Upload and manage gallery photos

### Technical Features
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations
- 🔒 Demo mode (works without Supabase)
- 🚀 Optimized for performance
- ♿ Accessibility-focused

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mini-basket-camp.git
   cd mini-basket-camp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Leave empty for demo mode, or add your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Building for Production

```bash
npm run build
```

The build output will be in the `.next` folder.

## 🌐 Deploying to Vercel (Recommended)

Vercel is the recommended deployment platform because they created Next.js and provide the best native support.

### Quick Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel auto-detects Next.js settings (no config needed!)
4. Add environment variables (see below)
5. Click Deploy

### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel --prod
```

### Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes |

> **⚠️ Important:** After deploying, update your Stripe webhook URL to `https://your-project.vercel.app/api/webhook` and get a new webhook secret.

For detailed setup instructions, see [`docs/VERCEL_SETUP.md`](docs/VERCEL_SETUP.md).

### Alternative: Netlify

The project also supports Netlify deployment. See `netlify.toml` for configuration.

## 🗄️ Database Setup (Optional)

If you want to use a real database:

1. Create a [Supabase](https://supabase.com) project
2. Run the SQL schema from `docs/supabase-schema.sql`
3. Add your Supabase credentials to the environment variables
4. Set up Row Level Security (RLS) policies as needed

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin panel pages
│   │   ├── contatti/       # Contact page
│   │   ├── faq/            # FAQ page
│   │   ├── galleria/       # Gallery page
│   │   ├── iscrizione/     # Registration page
│   │   ├── programma/      # Program page
│   │   ├── staff/          # Staff page
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   └── admin/          # Admin-specific components
│   ├── lib/                # Utilities and config
│   │   ├── auth.ts         # Authentication helpers
│   │   ├── mockData.ts     # Demo/mock data
│   │   └── supabase.ts     # Supabase client
│   └── types/              # TypeScript types
├── docs/                   # Documentation
│   ├── VERCEL_SETUP.md    # Vercel deployment guide
│   ├── STRIPE_SETUP.md    # Stripe payment setup
│   └── ...
├── netlify.toml           # Netlify configuration (legacy)
└── package.json
```

## 🎨 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **Payments:** Stripe
- **Deployment:** Vercel (recommended) or Netlify
- **Icons:** Heroicons (via SVG)
- **Images:** Next.js Image Optimization

## 🔐 Admin Access

### Demo Mode
When Supabase is not configured, the admin panel works in demo mode:
- **Email:** `admin@miniandbasketcamp.it`
- **Password:** `demo123`

### Production Mode
Configure your own admin users in Supabase Authentication.

## 📝 License

This project is proprietary and created for Mini & Basket Camp.

## 👨‍💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (recommended)

## 📞 Support

For questions about the website, please contact the development team.

---

Made with ❤️ for Mini & Basket Camp 2025