# Vercel Deployment Guide

This guide covers deploying Mini & Basket Camp to Vercel.

## Why Vercel?

- **Native Next.js Support**: Vercel created Next.js, providing the best optimization and support
- **Better Free Tier**: More generous limits than other platforms
- **Faster Builds**: Optimized build pipeline for Next.js
- **Zero Configuration**: No special config files needed

## Quick Deployment

### Option 1: Import from GitHub (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign up/log in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel auto-detects Next.js settings
5. Add environment variables (see below)
6. Click **Deploy**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

## Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fzmueqalhxnkddadmtno.supabase.co` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | Yes |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | Yes |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (new for Vercel) | Yes |

### Environment Scopes

When adding variables, select the appropriate environment:
- **Production**: For the live site
- **Preview**: For PR/branch previews
- **Development**: For local development (optional)

## ⚠️ Important: Stripe Webhook Update

After deployment, you **MUST** update the Stripe webhook URL:

### Steps:

1. **Get your Vercel URL**
   - After first deploy, note your URL: `https://your-project.vercel.app`
   - Or set up a custom domain

2. **Update Stripe Dashboard**
   - Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
   - If migrating: Edit existing webhook or create new one
   - Set endpoint URL to: `https://your-project.vercel.app/api/webhook`

3. **Get New Webhook Secret**
   - After creating/updating the webhook, copy the signing secret
   - It starts with `whsec_`
   - Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

4. **Redeploy if needed**
   - If you updated environment variables after deploy, trigger a redeploy:
   - Vercel Dashboard → Deployments → Redeploy

### Webhook Events Required

Ensure these events are selected in Stripe:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## Custom Domain Setup

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `miniandbasketcamp.it`)
3. Follow DNS configuration instructions:
   - For root domain: Add `A` record pointing to `76.76.19.19`
   - For www: Add `CNAME` record pointing to `cname.vercel-dns.com`
4. Wait for DNS propagation (usually 5-30 minutes)
5. Vercel automatically provisions SSL certificate

## Build Configuration

Vercel auto-detects everything from `package.json` and `next.config.mjs`:

- **Build Command**: `npm run build` (automatic)
- **Output Directory**: `.next` (automatic)
- **Node.js Version**: 20.x (automatic)
- **Framework**: Next.js (auto-detected)

No `vercel.json` is needed for this project.

## Comparing Netlify vs Vercel

| Feature | Netlify | Vercel |
|---------|---------|--------|
| Next.js Support | Via plugin | Native (created Next.js) |
| Build Time | Standard | Faster |
| Free Tier Bandwidth | 100GB/month | 100GB/month |
| Free Tier Build Minutes | 300/month | 6000/month |
| Serverless Functions | 125K/month | 100K/month |
| Config Required | `netlify.toml` | None for Next.js |

## Troubleshooting

### Build Fails

1. Check build logs in Vercel Dashboard
2. Ensure all environment variables are set
3. Try building locally first: `npm run build`

### API Routes Not Working

1. Check function logs in Vercel Dashboard → Logs
2. Verify environment variables are set for Production environment
3. Ensure Supabase URLs are correct

### Stripe Webhook Failures

1. Check webhook logs in Stripe Dashboard
2. Verify endpoint URL is correct
3. Ensure `STRIPE_WEBHOOK_SECRET` matches the webhook in use
4. Check Vercel function logs for errors

### Images Not Loading

The `next.config.mjs` already allows remote images from:
- `placeholder.pics`
- `images.unsplash.com`

Add additional domains if needed.

## Migration Checklist

When migrating from Netlify to Vercel:

- [ ] Create Vercel account and import project
- [ ] Add all environment variables
- [ ] Create new Stripe webhook for Vercel URL
- [ ] Update `STRIPE_WEBHOOK_SECRET` with new value
- [ ] Test payment flow on Vercel preview
- [ ] Update DNS to point to Vercel (if using custom domain)
- [ ] Verify all pages load correctly
- [ ] Test admin login and dashboard
- [ ] Remove Netlify site after confirming Vercel works

## Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/solutions/nextjs)
- [Stripe Webhook Testing](https://stripe.com/docs/webhooks/test)