# ⚙️ Environment Variables Documentation

Complete guide to all environment variables used in the Mini & Basket Camp application.

---

## Overview

Environment variables are stored in `.env.local` (not committed to git).

Template file: [`.env.local.example`](../.env.local.example)

---

## Required Variables

### Supabase Configuration

```bash
# Supabase Project URL
# Get from: Supabase Dashboard → Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Supabase Anonymous Key (Public)
# Get from: Supabase Dashboard → Settings → API → anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (Secret - Server Only)
# Get from: Supabase Dashboard → Settings → API → service_role secret
# WARNING: Never expose this in client-side code!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Stripe Configuration

```bash
# Stripe Publishable Key (Public)
# Get from: Stripe Dashboard → Developers → API keys → Publishable key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_...

# Stripe Secret Key (Server Only)
# Get from: Stripe Dashboard → Developers → API keys → Secret key
STRIPE_SECRET_KEY=sk_test_... # or sk_live_...

# Stripe Webhook Secret
# Get from: Stripe Dashboard → Developers → Webhooks → Signing secret
# Or from: stripe listen --print-secret (local testing)
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Complete `.env.local` Template

```bash
# ===========================================
# Mini & Basket Camp Environment Variables
# ===========================================

# Supabase (Database)
# Get these from: https://supabase.com/dashboard → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (Payments)
# Get these from: https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Optional: Site URL (for Stripe redirects)
# Automatically detected in most cases
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Variable Details

### `NEXT_PUBLIC_SUPABASE_URL`

| Property | Value |
|----------|-------|
| **Prefix** | `NEXT_PUBLIC_` (exposed to browser) |
| **Required** | Yes (but has demo fallback) |
| **Format** | `https://<project-ref>.supabase.co` |
| **Example** | `https://abcdefghijkl.supabase.co` |

**Used by:**
- [`src/lib/supabase.ts`](../src/lib/supabase.ts:4)
- All database operations

**How to get:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy "Project URL"

---

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

| Property | Value |
|----------|-------|
| **Prefix** | `NEXT_PUBLIC_` (exposed to browser) |
| **Required** | Yes (but has demo fallback) |
| **Format** | JWT token (starts with `eyJ...`) |

**Used by:**
- [`src/lib/supabase.ts`](../src/lib/supabase.ts:5) - Anonymous client
- Client-side database queries

**How to get:**
1. Supabase Dashboard → Settings → API
2. Copy "anon public" key under "Project API keys"

**Security:** Safe to expose - enforces Row Level Security (RLS).

---

### `SUPABASE_SERVICE_ROLE_KEY`

| Property | Value |
|----------|-------|
| **Prefix** | None (server-only) |
| **Required** | Yes for production |
| **Format** | JWT token (starts with `eyJ...`) |

**Used by:**
- [`src/lib/supabase.ts`](../src/lib/supabase.ts:6) - Admin client
- [`src/app/api/register/route.ts`](../src/app/api/register/route.ts:2)
- [`src/app/api/webhook/route.ts`](../src/app/api/webhook/route.ts:3)
- All server-side operations that bypass RLS

**How to get:**
1. Supabase Dashboard → Settings → API
2. Copy "service_role" key (reveal first)

**Security:** 
- ⚠️ **NEVER expose this key client-side**
- Bypasses all RLS policies
- Full database access

---

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

| Property | Value |
|----------|-------|
| **Prefix** | `NEXT_PUBLIC_` (exposed to browser) |
| **Required** | Yes (but has demo fallback) |
| **Format** | `pk_test_...` or `pk_live_...` |

**Used by:**
- [`src/lib/stripe.ts`](../src/lib/stripe.ts:6) - Client-side Stripe
- [`src/components/StripeCheckout.tsx`](../src/components/StripeCheckout.tsx)

**How to get:**
1. [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → API keys
3. Copy "Publishable key"

**Test vs Live:**
- Test mode: `pk_test_...`
- Live mode: `pk_live_...`

---

### `STRIPE_SECRET_KEY`

| Property | Value |
|----------|-------|
| **Prefix** | None (server-only) |
| **Required** | Yes for payments |
| **Format** | `sk_test_...` or `sk_live_...` |

**Used by:**
- [`src/app/api/checkout/route.ts`](../src/app/api/checkout/route.ts:6)
- [`src/app/api/webhook/route.ts`](../src/app/api/webhook/route.ts:6)

**How to get:**
1. Stripe Dashboard → Developers → API keys
2. Reveal and copy "Secret key"

**Security:**
- ⚠️ **NEVER expose this key client-side**
- Can create charges, refunds, etc.

---

### `STRIPE_WEBHOOK_SECRET`

| Property | Value |
|----------|-------|
| **Prefix** | None (server-only) |
| **Required** | Yes for webhook verification |
| **Format** | `whsec_...` |

**Used by:**
- [`src/app/api/webhook/route.ts`](../src/app/api/webhook/route.ts:12)

**How to get (Production):**
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://miniandbasketcamp.it/api/webhook`
3. Copy "Signing secret"

**How to get (Local):**
```bash
stripe listen --forward-to localhost:3000/api/webhook
# Copy the webhook secret from output
```

---

## Local Development Setup

### Step 1: Create Supabase Project

1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Wait for project to be ready
4. Get API credentials from Settings → API

### Step 2: Create Stripe Account

1. Sign up at [stripe.com](https://stripe.com)
2. Go to Developers → API keys
3. Use test mode keys (prefix `pk_test_` and `sk_test_`)

### Step 3: Create `.env.local`

```bash
# Copy template
cp .env.local.example .env.local

# Edit with your credentials
nano .env.local  # or use any editor
```

### Step 4: Set Up Local Webhook

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook secret from the output.

---

## Production Setup (Netlify)

### Adding Variables in Netlify

1. Go to Netlify Dashboard
2. Select your site
3. Site settings → Environment variables
4. Add each variable

### Required Variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production service role key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Production webhook secret |

### Setting Up Production Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint
3. URL: `https://miniandbasketcamp.it/api/webhook`
4. Events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy signing secret to Netlify

---

## Demo Mode Behavior

When variables are not configured, the app runs in demo mode:

### Supabase Demo Mode

When `NEXT_PUBLIC_SUPABASE_URL` is missing or invalid:

```typescript
// From src/lib/supabase.ts
if (!isSupabaseConfigured()) {
  // Returns mock client that doesn't make real requests
  return createMockClient();
}
```

- Registrations return fake IDs
- Stats show mock data
- No actual database operations

### Stripe Demo Mode

When `STRIPE_SECRET_KEY` is missing:

```typescript
// From src/app/api/checkout/route.ts
if (!stripe) {
  return NextResponse.json({
    demoMode: true,
    sessionId: `demo_session_${Date.now()}`,
    // ... mock session data
  });
}
```

- No actual Stripe sessions created
- Payment flow simulated
- No charges processed

---

## Configuration Checks

### In Code

```typescript
// Check if Supabase is configured
import { isSupabaseConfigured, isSupabaseAdminConfigured } from '@/lib/supabase';

if (!isSupabaseConfigured()) {
  console.log('Running in demo mode - Supabase not configured');
}

// Check if Stripe is configured
import { isStripeConfigured } from '@/lib/stripe';

if (!isStripeConfigured()) {
  console.log('Running in demo mode - Stripe not configured');
}
```

### Configuration Validation

```typescript
// From src/lib/supabase.ts
export const isSupabaseConfigured = (): boolean => {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-') &&
    !supabaseAnonKey.includes('<') &&
    supabaseUrl !== 'your-supabase-url'
  );
};

export const isSupabaseAdminConfigured = (): boolean => {
  return !!(
    supabaseUrl &&
    supabaseServiceKey &&
    !supabaseUrl.includes('your-') &&
    supabaseServiceKey.length > 20
  );
};
```

---

## Environment-Specific Configurations

### Local Development

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Use test keys for Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Staging/Preview

```bash
NEXT_PUBLIC_SITE_URL=https://staging.miniandbasketcamp.it
# Still use test keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Production

```bash
NEXT_PUBLIC_SITE_URL=https://miniandbasketcamp.it
# Use live keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## Troubleshooting

### "Supabase not configured" Error

1. Check if `.env.local` exists
2. Verify `NEXT_PUBLIC_SUPABASE_URL` format
3. Ensure no placeholder values (`your-...`)
4. Restart dev server after changes

### "Stripe not configured" Error

1. Verify `STRIPE_SECRET_KEY` is set
2. Check key prefix (`sk_test_` or `sk_live_`)
3. Restart dev server

### Webhook Signature Verification Failed

1. Check `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. For local: Use secret from `stripe listen` output
3. Ensure webhook URL is correct

### Environment Variables Not Loading

```bash
# Restart the development server
npm run dev

# Or clear Next.js cache
rm -rf .next
npm run dev
```

---

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use environment-specific keys** - Different keys for dev/prod
3. **Rotate keys periodically** - Especially if compromised
4. **Limit service role usage** - Only in API routes
5. **Monitor Stripe Dashboard** - Check for unusual activity

---

*For known issues related to configuration, see [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)*