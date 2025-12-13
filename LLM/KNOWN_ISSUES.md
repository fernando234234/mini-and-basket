# 🐛 Known Issues and Solutions

Documentation of past bugs, their causes, and how they were resolved.

---

## Issue #1: Registration 401 Error (RLS Bypass)

### Problem

When submitting the registration form, users received a 401 Unauthorized error.

```
POST /api/register 401 Unauthorized
Error: new row violates row-level security policy for table "registrations"
```

### Cause

The Supabase `registrations` table has Row Level Security (RLS) enabled. The anonymous client (`supabase`) was being used, which doesn't have permission to insert.

### Solution

Use the service role client (`supabaseAdmin`) in the API route to bypass RLS:

**File:** [`src/app/api/register/route.ts`](../src/app/api/register/route.ts:2)

```typescript
// Before (broken)
import { supabase } from '@/lib/supabase';
const { data, error } = await supabase.from('registrations').insert(...);

// After (fixed)
import { supabaseAdmin } from '@/lib/supabase';
const { data, error } = await supabaseAdmin.from('registrations').insert(...);
```

### Related Files
- [`src/lib/supabase.ts`](../src/lib/supabase.ts:66) - Admin client definition
- [`supabase/migrations/20241210_initial_schema.sql`](../supabase/migrations/20241210_initial_schema.sql:95) - RLS policies

---

## Issue #2: Success Page Crash (ErrorBoundary)

### Problem

The payment success page crashed with an unhandled error when Stripe session data was invalid or missing.

```
TypeError: Cannot read properties of undefined (reading 'metadata')
```

### Cause

The success page attempted to read session metadata without null checks, and there was no error boundary to catch component errors.

### Solution

1. Added null checks for session data
2. Implemented ErrorBoundary component
3. Added loading states

**File:** [`src/app/iscrizione/success/page.tsx`](../src/app/iscrizione/success/page.tsx)

```typescript
// Before
const camperName = session.metadata.camper_nome;

// After
const camperName = session?.metadata?.camper_nome || 'Atleta';

// Plus try-catch wrapper and loading state
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

---

## Issue #3: Webhook Supabase Update Failure

### Problem

Stripe webhooks were received and verified, but database updates weren't happening. The registration remained in "pending" status after successful payment.

### Cause

In Netlify Functions (serverless), environment variables may not be available at module initialization time. The `supabaseAdmin` client was being created at build time with undefined credentials.

### Solution

Created a runtime client creation function:

**File:** [`src/lib/supabase.ts`](../src/lib/supabase.ts:77)

```typescript
// Helper function to get admin client with runtime env vars
export function getSupabaseAdmin(): { 
  client: SupabaseClient; 
  isConfigured: boolean; 
  error?: string 
} {
  // Re-read env vars at runtime (important for Netlify Functions)
  const runtimeUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const runtimeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  // Validation...
  
  // Create fresh client at runtime
  const freshClient = createClient(runtimeUrl, runtimeServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  return { client: freshClient, isConfigured: true };
}
```

**File:** [`src/app/api/webhook/route.ts`](../src/app/api/webhook/route.ts:36)

```typescript
// Use runtime client in webhook
const { client: supabaseAdmin, isConfigured, error } = getSupabaseAdmin();

if (!isConfigured) {
  console.error('[Webhook] Supabase not configured:', error);
  return;
}
```

---

## Issue #4: Gallery Images 403 Forbidden

### Problem

Gallery images stored in Supabase Storage returned 403 Forbidden errors.

```
GET https://xxx.supabase.co/storage/v1/object/public/gallery/photo.jpg 403
```

### Cause

The storage bucket was created as private. Public access requires explicit bucket configuration.

### Solution

Make the bucket public:

**File:** [`supabase/migrations/20241213230000_make_gallery_public.sql`](../supabase/migrations/20241213230000_make_gallery_public.sql)

```sql
-- Make gallery bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'gallery';

-- Add public read policy
CREATE POLICY "Public read gallery" ON storage.objects
    FOR SELECT USING (bucket_id = 'gallery');
```

Or via Supabase Dashboard:
1. Storage → gallery bucket
2. Click settings (gear icon)
3. Toggle "Public bucket" on

---

## Issue #5: Next.js Image Domain Error

### Problem

Next.js Image component refused to load external images:

```
Error: Invalid src prop on `next/image`, hostname "xxx.supabase.co" is not configured
```

### Cause

Next.js requires explicit configuration for external image domains for security.

### Solution

Update Next.js config:

**File:** [`next.config.mjs`](../next.config.mjs)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
```

---

## Issue #6: Metadata Snake_Case vs camelCase

### Problem

Webhook handler couldn't find `registration_id` in Stripe session metadata:

```
[Webhook] WARNING: No registration ID found in metadata!
[Webhook] Available metadata keys: ['registrationId', 'packageType', ...]
```

### Cause

Inconsistent metadata key naming between checkout creation and webhook handling. Frontend used camelCase, webhook expected snake_case.

### Solution

Check for both formats in webhook handler:

**File:** [`src/app/api/webhook/route.ts`](../src/app/api/webhook/route.ts:137)

```typescript
// Check both snake_case and camelCase keys
const registrationId = metadata?.registration_id || metadata?.registrationId;
const packageType = metadata?.package_type || metadata?.packageType;
const paymentType = metadata?.payment_type || metadata?.paymentType;
```

And standardize on snake_case in checkout:

**File:** [`src/app/api/checkout/route.ts`](../src/app/api/checkout/route.ts:59)

```typescript
const metadata: Record<string, string> = {
  package_type: packageType,     // snake_case
  payment_type: paymentType,
  registration_id: registrationData?.id || '',
  camper_nome: registrationData?.camperNome || '',
  // ...
};
```

---

## Issue #7: Hydration Mismatch

### Problem

Console showed hydration mismatch warnings:

```
Warning: Text content did not match. Server: "€590" Client: "€610"
```

### Cause

The `isEarlyBird()` function returned different values on server vs client due to timezone differences or timing.

### Solution

Use `useEffect` to set early bird status on client only:

**File:** [`src/components/RegistrationWizard.tsx`](../src/components/RegistrationWizard.tsx:147)

```typescript
const [earlyBird, setEarlyBird] = useState(true);  // Default value

useEffect(() => {
  setEarlyBird(isEarlyBird());  // Set actual value on client
}, []);
```

---

## Issue #8: Admin Route Not Loading Stats

### Problem

Admin dashboard showed "Loading..." indefinitely or mock data even though Supabase was configured.

### Cause

The API route was checking environment variables at module level, which may be empty during build.

### Solution

Check configuration at request time:

**File:** [`src/app/api/admin/stats/route.ts`](../src/app/api/admin/stats/route.ts:146)

```typescript
export async function GET() {
  // Get environment variables fresh on each request
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const isConfigured = !!(
    supabaseUrl &&
    supabaseServiceKey &&
    !supabaseUrl.includes('your-') &&
    supabaseServiceKey.length > 20
  );
  
  // Then use isConfigured...
}
```

---

## Issue #9: CORS Error on Stripe Redirect

### Problem

After Stripe checkout, redirect failed with CORS error.

### Cause

The `success_url` was using an incorrect or relative URL.

### Solution

Construct absolute URL from request headers:

**File:** [`src/app/api/checkout/route.ts`](../src/app/api/checkout/route.ts:42)

```typescript
const baseUrl = request.headers.get('origin') || 'https://miniandbasketcamp.it';

// Use in session config
success_url: `${baseUrl}/iscrizione/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${baseUrl}/iscrizione?cancelled=true`,
```

---

## Issue #10: Mobile Menu Not Closing on Navigation

### Problem

On mobile, clicking a navigation link opened the page but the hamburger menu stayed open.

### Cause

Missing `onClick` handler to close menu.

### Solution

Add close handler to all mobile nav links:

**File:** [`src/components/Navigation.tsx`](../src/components/Navigation.tsx:200)

```typescript
<Link
  href={link.href}
  className="..."
  onClick={() => setIsMenuOpen(false)}  // Close menu on click
>
  {link.label}
</Link>
```

---

## Debugging Tips

### Enable Verbose Logging

All API routes have detailed logging:

```typescript
console.log('[Webhook] ============================================');
console.log('[Webhook] Received webhook request at:', new Date().toISOString());
console.log('[Webhook] Event type:', event.type);
```

### Check Netlify Function Logs

```bash
netlify logs:function api-webhook
```

### Check Stripe Dashboard

1. Developers → Webhooks
2. Click on endpoint
3. View "Recent events"
4. Check "Response" for errors

### Local Webhook Testing

```bash
stripe listen --forward-to localhost:3000/api/webhook
stripe trigger checkout.session.completed
```

### Supabase Logs

1. Supabase Dashboard → Logs
2. Filter by table: `registrations`
3. Check for RLS policy violations

---

## Prevention Checklist

Before deploying changes:

- [ ] Test with Stripe test mode
- [ ] Verify environment variables on Netlify
- [ ] Check webhook endpoint is configured
- [ ] Test mobile responsiveness
- [ ] Verify database migrations applied
- [ ] Check for TypeScript errors (`npm run build`)
- [ ] Test demo mode behavior

---

## Reporting New Issues

When documenting new issues, include:

1. **Problem** - What error or unexpected behavior occurred
2. **Cause** - Root cause analysis
3. **Solution** - Code changes with file references
4. **Related Files** - Links to relevant source files

---

*For common task guides, see [COMMON_TASKS.md](./COMMON_TASKS.md)*