# 🔌 API Routes Documentation

Complete documentation for all API endpoints in the Mini & Basket Camp application.

---

## Overview

All API routes are located in [`src/app/api/`](../src/app/api/) and use Next.js 14 App Router conventions.

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/register` | POST | Save new registration |
| `/api/checkout` | POST, GET | Stripe checkout session |
| `/api/webhook` | POST | Stripe webhook handler |
| `/api/admin/stats` | GET | Dashboard statistics |
| `/api/admin/registrations` | GET, PATCH | Manage registrations |

---

## `/api/register`

### File: [`src/app/api/register/route.ts`](../src/app/api/register/route.ts:1)

### POST - Create Registration

Saves a new camp registration to Supabase.

#### Request

```typescript
// Headers
Content-Type: application/json

// Body
{
  package_type: 'standard' | 'alta_specializzazione',
  bus_transfer: boolean,
  
  // Parent info
  genitore_nome_cognome: string,
  genitore_codice_fiscale?: string,
  genitore_citta: string,
  genitore_cap: string,
  genitore_indirizzo: string,
  genitore_telefono: string,
  genitore_email: string,
  
  // Camper info
  camper_nome_cognome: string,
  camper_codice_fiscale: string,
  camper_luogo_nascita: string,
  camper_data_nascita: string, // YYYY-MM-DD
  camper_sesso: 'M' | 'F',
  camper_citta: string,
  camper_cap: string,
  camper_indirizzo: string,
  camper_scuola: string,
  camper_classe: string,
  camper_taglia: 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL',
  camper_altezza: number,
  camper_peso: number,
  camper_numero_scarpe: string,
  camper_esperienza: 'principiante' | 'intermedio' | 'avanzato',
  camper_societa?: string,
  
  // Medical info
  allergie_intolleranze?: string,
  patologie_note?: string,
  terapie_in_corso?: string,
  
  // Consents
  liberatoria_foto_video: boolean,
  accettazione_regolamento: boolean,
  privacy_policy: boolean,
  
  codice_invito?: string,
}
```

#### Response - Success (200)

```json
{
  "success": true,
  "registrationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Response - Demo Mode (200)

When Supabase is not configured:

```json
{
  "success": true,
  "registrationId": "DEV-M3X5K7"
}
```

#### Response - Error (500)

```json
{
  "error": "Database error message"
}
```

#### Key Implementation Details

```typescript
// Uses service role client to bypass RLS
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Demo mode fallback
if (!isSupabaseConfigured()) {
  return NextResponse.json({ 
    success: true, 
    registrationId: `DEV-${Date.now().toString(36).toUpperCase()}` 
  });
}

// Insert with service role (bypasses RLS policies)
const { data: registration, error } = await supabaseAdmin
  .from('registrations')
  .insert({ ... })
  .select()
  .single();
```

---

## `/api/checkout`

### File: [`src/app/api/checkout/route.ts`](../src/app/api/checkout/route.ts:1)

### POST - Create Checkout Session

Creates a Stripe Checkout session for payment.

#### Request

```typescript
// Headers
Content-Type: application/json

// Body
{
  packageType: 'standard' | 'alta_specializzazione',
  paymentType: 'full' | 'deposit',
  registrationData: {
    id?: string,
    participantName?: string,
    email?: string,
    camperNome?: string,
    camperCognome?: string,
    genitoreNome?: string,
    genitoreCognome?: string,
    genitoreEmail?: string,
    genitoreTelefono?: string,
  }
}
```

#### Response - Success (200)

```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "paymentMethods": ["card", "paypal", "klarna", "bancontact", "ideal", "sepa_debit"]
}
```

#### Response - Demo Mode (200)

When Stripe is not configured:

```json
{
  "demoMode": true,
  "sessionId": "demo_session_1702494000000",
  "amount": 59000,
  "priceDisplay": "€590",
  "packageName": "Camp Standard 2026",
  "paymentType": "full",
  "availablePaymentMethods": ["card", "paypal", "klarna"]
}
```

#### Response - Error (400)

```json
{
  "error": "Tipo di pacchetto non valido"
}
```

#### Stripe Session Configuration

```typescript
const sessionParams: Stripe.Checkout.SessionCreateParams = {
  payment_method_types: [
    'card',
    'paypal',
    'klarna',
    'bancontact',
    'ideal',
    'sepa_debit',
  ],
  
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: {
        name: `Mini & Basket Camp 2026 - ${packageInfo.name}`,
        description: paymentType === 'deposit'
          ? `Acconto per ${packageInfo.name}`
          : `Pagamento completo per ${packageInfo.name}`,
      },
      unit_amount: amount, // in cents
    },
    quantity: 1,
  }],
  
  mode: 'payment',
  locale: 'it',
  billing_address_collection: 'required',
  phone_number_collection: { enabled: true },
  allow_promotion_codes: true,
  
  custom_fields: [{
    key: 'codice_fiscale',
    label: { custom: 'Codice Fiscale (opzionale)', type: 'custom' },
    type: 'text',
    optional: true,
  }],
  
  invoice_creation: { enabled: true },
  expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
  
  success_url: `${baseUrl}/iscrizione/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/iscrizione?cancelled=true`,
  
  metadata: {
    package_type: packageType,
    payment_type: paymentType,
    registration_id: registrationData?.id,
    camper_nome: registrationData?.camperNome,
    // ... more metadata
  },
};
```

---

### GET - Retrieve Session Details

Retrieves Stripe session details for the success page.

#### Request

```
GET /api/checkout?session_id=cs_test_...
```

#### Response - Success (200)

```json
{
  "session": {
    "id": "cs_test_...",
    "payment_status": "paid",
    "status": "complete",
    "amount_total": 59000,
    "currency": "eur",
    "customer_email": "parent@example.com",
    "payment_method_types": ["card"],
    "metadata": {
      "package_type": "standard",
      "payment_type": "full",
      "camper_nome": "Marco",
      "camper_cognome": "Rossi"
    },
    "created": 1702494000,
    "payment_method": {
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242"
      }
    },
    "invoice_url": "https://invoice.stripe.com/..."
  }
}
```

#### Response - Demo Mode (200)

```json
{
  "demoMode": true,
  "session": {
    "id": "demo_session_...",
    "payment_status": "paid",
    "status": "complete",
    "amount_total": 45000,
    "currency": "eur",
    "customer_email": "demo@example.com",
    "metadata": {
      "package_type": "completa",
      "payment_type": "full",
      "camper_nome": "Demo",
      "camper_cognome": "User"
    }
  }
}
```

---

## `/api/webhook`

### File: [`src/app/api/webhook/route.ts`](../src/app/api/webhook/route.ts:1)

### POST - Stripe Webhook Handler

Handles Stripe webhook events for payment status updates.

#### Request

```
POST /api/webhook

Headers:
  stripe-signature: t=1702494000,v1=abc123...

Body: (raw Stripe event)
```

#### Response - Success (200)

```json
{
  "received": true
}
```

#### Response - Error (400)

```json
{
  "error": "Webhook signature verification failed"
}
```

#### Handled Events

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Update registration to paid/partial |
| `payment_intent.succeeded` | Log success |
| `payment_intent.payment_failed` | Update registration to failed |

#### `checkout.session.completed` Handler

```typescript
async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { metadata, customer_email, amount_total, payment_intent } = session;
  
  const registrationId = metadata?.registration_id;
  const paymentType = metadata?.payment_type;
  
  // Determine new payment status
  const newPaymentStatus = paymentType === 'deposit' ? 'partial' : 'paid';
  const amountInEuros = (amount_total || 0) / 100;
  
  // Update registration
  await supabaseAdmin
    .from('registrations')
    .update({
      payment_status: newPaymentStatus,
      amount_paid: amountInEuros,
      stripe_session_id: session.id,
      payment_date: new Date().toISOString(),
      status: 'confirmed',
    })
    .eq('id', registrationId);
  
  // Create payment record
  await supabaseAdmin
    .from('payments')
    .insert({
      registration_id: registrationId,
      payment_method: 'stripe',
      payment_type: paymentType === 'deposit' ? 'deposit' : 'full',
      amount: amountInEuros,
      status: 'completed',
      stripe_payment_intent_id: payment_intent,
      stripe_session_id: session.id,
      metadata: { packageType, participantName, customer_email },
    });
}
```

#### Important: Runtime Supabase Client

The webhook uses a runtime-created Supabase client because environment variables may not be available at build time in serverless environments:

```typescript
// From src/lib/supabase.ts
export function getSupabaseAdmin() {
  const runtimeUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const runtimeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  // Create fresh client at runtime
  const freshClient = createClient(runtimeUrl, runtimeServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  return { client: freshClient, isConfigured: true };
}
```

---

## `/api/admin/stats`

### File: [`src/app/api/admin/stats/route.ts`](../src/app/api/admin/stats/route.ts:1)

### GET - Dashboard Statistics

Returns aggregated statistics for the admin dashboard.

#### Request

```
GET /api/admin/stats
```

#### Response - Success (200)

```json
{
  "stats": {
    "total": 45,
    "pending": 12,
    "confirmed": 28,
    "cancelled": 5,
    "revenue": 16520,
    "pendingPayments": 8
  },
  "sizeDistribution": {
    "XXS": 2,
    "XS": 5,
    "S": 12,
    "M": 15,
    "L": 8,
    "XL": 3
  },
  "ageDistribution": {
    "6-8": 8,
    "9-11": 18,
    "12-14": 15,
    "15+": 4
  },
  "experienceDistribution": {
    "principiante": 12,
    "intermedio": 20,
    "avanzato": 13
  },
  "specialNeeds": {
    "withAllergies": 8,
    "withMedicalNotes": 5,
    "withAnyNotes": 10,
    "total": 45
  },
  "packageDistribution": {
    "standard": { "total": 35, "confirmed": 22 },
    "alta_specializzazione": { "total": 10, "confirmed": 6 }
  },
  "recentRegistrations": [
    {
      "id": "...",
      "camper_nome_cognome": "Marco Rossi",
      "created_at": "2024-12-10T10:30:00Z",
      "status": "confirmed",
      "payment_status": "paid"
    }
  ],
  "source": "supabase",
  "message": "Stats calculated from 45 registrations"
}
```

#### Response - Mock Mode (200)

When Supabase is not configured:

```json
{
  "stats": { ... },
  "source": "mock",
  "message": "Using mock data - Supabase not configured"
}
```

#### Statistics Calculations

```typescript
function calculateStats(registrations: RegistrationData[]) {
  const total = registrations.length;
  const pending = registrations.filter(r => r.status === 'pending').length;
  const confirmed = registrations.filter(r => r.status === 'confirmed').length;
  const cancelled = registrations.filter(r => r.status === 'cancelled').length;
  
  const revenue = registrations
    .filter(r => r.status === 'confirmed' || r.payment_status === 'paid')
    .reduce((sum, r) => sum + (r.amount_paid || 0), 0);
  
  // Age calculation from birth date
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    // ... adjust for month/day
    return age;
  };
  
  // ... more calculations
}
```

---

## `/api/admin/registrations`

### File: [`src/app/api/admin/registrations/route.ts`](../src/app/api/admin/registrations/route.ts:1)

### GET - List All Registrations

Returns all registrations for admin management.

#### Request

```
GET /api/admin/registrations
```

#### Response - Success (200)

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2024-12-10T10:30:00Z",
      "package_type": "standard",
      "bus_transfer": true,
      "genitore_nome_cognome": "Mario Rossi",
      "genitore_email": "mario@example.com",
      "genitore_telefono": "+39 333 1234567",
      "camper_nome_cognome": "Marco Rossi",
      "camper_data_nascita": "2012-05-15",
      "camper_taglia": "M",
      "camper_esperienza": "intermedio",
      "status": "confirmed",
      "payment_status": "paid",
      "amount_paid": 590
    }
  ],
  "source": "supabase",
  "message": "Successfully fetched 45 registrations"
}
```

---

### PATCH - Update Registration Status

Updates a registration's status.

#### Request

```typescript
// Headers
Content-Type: application/json

// Body
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "confirmed" | "cancelled" | "pending"
}
```

#### Response - Success (200)

```json
{
  "success": true,
  "source": "supabase",
  "message": "Registration 550e8400-... status updated to confirmed"
}
```

#### Response - Error (400)

```json
{
  "error": "Missing id or status"
}
```

#### Response - Error (500)

```json
{
  "error": "Database error message"
}
```

---

## Error Handling Pattern

All API routes follow this error handling pattern:

```typescript
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validation
    if (!data.requiredField) {
      return NextResponse.json(
        { error: 'Missing required field' },
        { status: 400 }
      );
    }
    
    // Operation
    const result = await someOperation(data);
    
    if (result.error) {
      console.error('Operation error:', result.error);
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: result.data });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Supabase Client Usage

### Anonymous Client (Client-side)
```typescript
import { supabase } from '@/lib/supabase';
// Used for public reads (gallery, etc.)
```

### Service Role Client (Server-side)
```typescript
import { supabaseAdmin } from '@/lib/supabase';
// Used for writes, bypasses RLS
```

### Runtime Client (Webhooks)
```typescript
import { getSupabaseAdmin } from '@/lib/supabase';
const { client, isConfigured, error } = getSupabaseAdmin();
// Creates fresh client at runtime
```

---

## Testing API Routes

### Using curl

```bash
# Create registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"package_type":"standard","bus_transfer":false,...}'

# Create checkout session
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"packageType":"standard","paymentType":"deposit",...}'

# Get session details
curl "http://localhost:3000/api/checkout?session_id=cs_test_..."

# Get stats
curl http://localhost:3000/api/admin/stats

# Get registrations
curl http://localhost:3000/api/admin/registrations

# Update registration
curl -X PATCH http://localhost:3000/api/admin/registrations \
  -H "Content-Type: application/json" \
  -d '{"id":"...","status":"confirmed"}'
```

### Stripe Webhook Testing

```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook

# Trigger test event
stripe trigger checkout.session.completed
```

---

*For database schema details, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)*