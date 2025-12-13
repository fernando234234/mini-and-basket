# 💳 Payment Flow Documentation

Complete documentation for the Stripe payment integration in Mini & Basket Camp.

---

## Overview

The website uses **Stripe Checkout** for payment processing with multiple payment methods optimized for the Italian market.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Registration   │───▶│  Stripe Checkout │───▶│  Success Page   │
│     Wizard      │    │    (Hosted)      │    │  + DB Update    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ Webhook Handler  │
                       │  (DB Updates)    │
                       └──────────────────┘
```

---

## Pricing Configuration

### Package Prices

Defined in [`src/lib/stripe.ts`](../src/lib/stripe.ts:34):

```typescript
export const PACKAGE_PRICES = {
  standard: {
    name: 'Camp Standard 2026',
    fullPrice: 61000,       // €610 in cents
    earlyBirdPrice: 59000,  // €590 in cents
    depositPrice: 20000,    // €200 in cents
    displayPrice: '€610',
    displayEarlyBird: '€590',
    displayDeposit: '€200',
  },
  alta_specializzazione: {
    name: 'Alta Specializzazione 2026',
    fullPrice: 80000,       // €800 in cents
    earlyBirdPrice: 76000,  // €760 in cents
    depositPrice: 20000,    // €200 in cents
    displayPrice: '€800',
    displayEarlyBird: '€760',
    displayDeposit: '€200',
    maxSpots: 20,           // Limited availability
  },
} as const;
```

### Add-on Prices

```typescript
export const ADDON_PRICES = {
  bus_transfer: {
    name: 'Transfer Bus Napoli A/R',
    price: 6000,  // €60 in cents
    displayPrice: '€60',
  },
} as const;
```

---

## Early Bird Pricing Logic

Early bird discount applies until **February 28, 2026**.

```typescript
// From src/lib/stripe.ts
export const isEarlyBird = () => {
  const now = new Date();
  const earlyBirdDeadline = new Date('2026-02-28T23:59:59');
  return now <= earlyBirdDeadline;
};

export const EARLY_BIRD_DEADLINE = '28 febbraio 2026';

// Get current price based on early bird status
export const getCurrentPrice = (
  packageType: PackageType, 
  paymentType: 'full' | 'deposit'
): number => {
  const pkg = PACKAGE_PRICES[packageType];
  if (paymentType === 'deposit') {
    return pkg.depositPrice;
  }
  return isEarlyBird() ? pkg.earlyBirdPrice : pkg.fullPrice;
};
```

### Price Summary

| Package | Before Feb 28 | After Feb 28 | Deposit |
|---------|---------------|--------------|---------|
| Standard | €590 | €610 | €200 |
| Alta Specializzazione | €760 | €800 | €200 |
| Bus Transfer | €60 | €60 | N/A |

---

## Payment Methods

Configured in [`src/app/api/checkout/route.ts`](../src/app/api/checkout/route.ts:13):

```typescript
const PAYMENT_METHODS: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [
  'card',           // Credit/Debit cards (includes Apple Pay, Google Pay)
  'paypal',         // PayPal
  'klarna',         // Klarna (Buy now, pay later)
  'bancontact',     // Bancontact
  'ideal',          // iDEAL
  'sepa_debit',     // SEPA Direct Debit
];
```

### Cards Accepted
- Visa
- Mastercard
- American Express
- Maestro
- Apple Pay (via card)
- Google Pay (via card)

### Alternative Methods
- **PayPal** - Full PayPal integration
- **Klarna** - Buy now, pay later option
- **SEPA Direct Debit** - European bank transfers
- **iDEAL** - Netherlands bank payments
- **Bancontact** - Belgium bank payments

---

## Payment Flow Steps

### Step 1: Registration Form Submission

User completes the 5-step registration wizard:

```typescript
// RegistrationWizard.tsx - handleSubmit()
const handleSubmit = async () => {
  // Prepare registration data
  const registrationData: RegistrationInsert = {
    package_type: formData.packageType,
    bus_transfer: formData.busTransfer,
    // ... all form fields
    status: 'pending',
    payment_status: 'pending',
  };

  // Save to Supabase via API
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registrationData),
  });
  
  const result = await response.json();
  setRegistrationId(result.registrationId);
  setCurrentStep(6); // Proceed to payment step
};
```

### Step 2: Stripe Checkout Component

User selects payment type in [`StripeCheckout.tsx`](../src/components/StripeCheckout.tsx):

```typescript
// User chooses: Full Payment or Deposit
const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('deposit');

// Create checkout session
const handleCheckout = async () => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      packageType,
      paymentType,
      registrationData: {
        id: registrationData?.id,
        participantName: registrationData?.participantName,
        email: registrationData?.email,
      },
    }),
  });

  const { sessionId, url } = await response.json();
  
  // Redirect to Stripe Checkout
  window.location.href = url;
};
```

### Step 3: Checkout API Route

[`/api/checkout`](../src/app/api/checkout/route.ts:22) creates the Stripe session:

```typescript
export async function POST(request: NextRequest) {
  const { packageType, paymentType, registrationData } = await request.json();
  
  const packageInfo = PACKAGE_PRICES[packageType];
  const amount = paymentType === 'deposit' 
    ? packageInfo.depositPrice 
    : packageInfo.fullPrice;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: PAYMENT_METHODS,
    
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `Mini & Basket Camp 2026 - ${packageInfo.name}`,
          description: paymentType === 'deposit'
            ? `Acconto per ${packageInfo.name}`
            : `Pagamento completo per ${packageInfo.name}`,
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    
    mode: 'payment',
    locale: 'it',
    
    // Italian requirements
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    custom_fields: [{
      key: 'codice_fiscale',
      label: { custom: 'Codice Fiscale (opzionale)', type: 'custom' },
      type: 'text',
      optional: true,
    }],
    
    // Invoice generation
    invoice_creation: { enabled: true },
    
    // Session expiry (30 minutes)
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    
    // Redirect URLs
    success_url: `${baseUrl}/iscrizione/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/iscrizione?cancelled=true`,
    
    // Metadata for webhook
    metadata: {
      package_type: packageType,
      payment_type: paymentType,
      registration_id: registrationData?.id,
      camper_nome: registrationData?.participantName,
      genitore_email: registrationData?.email,
    },
  });

  return NextResponse.json({
    sessionId: session.id,
    url: session.url,
  });
}
```

### Step 4: Stripe Hosted Checkout

User completes payment on Stripe's hosted page:
- Enters card/payment details
- Billing address (required)
- Phone number
- Optional: Codice Fiscale

### Step 5: Webhook Processing

Stripe sends webhook to [`/api/webhook`](../src/app/api/webhook/route.ts:14):

```typescript
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  // Verify webhook signature
  const event = stripe.webhooks.constructEvent(
    body, 
    signature, 
    webhookSecret
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await handleSuccessfulPayment(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handleFailedPayment(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { metadata, amount_total, payment_intent } = session;
  
  const registrationId = metadata?.registration_id;
  const paymentType = metadata?.payment_type;
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
    });
}
```

### Step 6: Success Page

User is redirected to [`/iscrizione/success`](../src/app/iscrizione/success/page.tsx):

```typescript
// Get session details
const { searchParams } = new URL(request.url);
const sessionId = searchParams.get('session_id');

// Fetch session details from API
const response = await fetch(`/api/checkout?session_id=${sessionId}`);
const { session } = await response.json();

// Display confirmation
// - Payment amount
// - Camper name
// - Registration details
// - Invoice download link
```

---

## Payment Status Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ pending  │────▶│ partial  │────▶│   paid   │
└──────────┘     └──────────┘     └──────────┘
     │                                  ▲
     │           ┌──────────┐           │
     └──────────▶│  failed  │───────────┘
                 └──────────┘         (retry)
```

| Status | Description | Amount Paid |
|--------|-------------|-------------|
| `pending` | Not yet paid | €0 |
| `partial` | Deposit paid | €200 |
| `paid` | Fully paid | Full price |
| `failed` | Payment failed | €0 |
| `refunded` | Refund processed | Varies |

---

## Stripe Dashboard Configuration

### Webhook Endpoints

Configure at: `https://dashboard.stripe.com/webhooks`

**Production:**
```
URL: https://miniandbasketcamp.it/api/webhook
Events:
  - checkout.session.completed
  - payment_intent.succeeded
  - payment_intent.payment_failed
```

**Local Testing:**
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### Products (Optional)

Pre-create products in Stripe Dashboard:
- Mini & Basket Camp 2026 - Standard
- Mini & Basket Camp 2026 - Alta Specializzazione
- Transfer Bus Napoli A/R

---

## Test vs Production Mode

### Test Mode

Environment variables with `pk_test_` and `sk_test_` prefixes.

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # From stripe listen
```

**Test Cards:**
| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Succeeds |
| 4000 0000 0000 0002 | Declined |
| 4000 0025 0000 3155 | Requires 3D Secure |

### Production Mode

Environment variables with `pk_live_` and `sk_live_` prefixes.

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... # From Dashboard
```

---

## Demo Mode (No Stripe)

When Stripe is not configured, the system runs in demo mode:

```typescript
// In checkout API
if (!stripe) {
  return NextResponse.json({
    demoMode: true,
    sessionId: `demo_session_${Date.now()}`,
    amount,
    priceDisplay,
    packageName: packageInfo.name,
    paymentType,
    availablePaymentMethods: ['card', 'paypal', 'klarna'],
  });
}
```

Demo mode allows:
- Testing registration flow
- UI development
- No actual payments processed

---

## Key Files

| File | Purpose |
|------|---------|
| [`src/lib/stripe.ts`](../src/lib/stripe.ts:1) | Stripe client, pricing config |
| [`src/components/StripeCheckout.tsx`](../src/components/StripeCheckout.tsx) | Payment UI component |
| [`src/app/api/checkout/route.ts`](../src/app/api/checkout/route.ts:1) | Create/retrieve sessions |
| [`src/app/api/webhook/route.ts`](../src/app/api/webhook/route.ts:1) | Handle Stripe events |
| [`src/app/iscrizione/success/page.tsx`](../src/app/iscrizione/success/page.tsx) | Success page |

---

## Stripe Checkout Session Features

### Enabled Features

```typescript
{
  // Multiple payment methods
  payment_method_types: ['card', 'paypal', 'klarna', ...],
  
  // Italian localization
  locale: 'it',
  
  // Address collection
  billing_address_collection: 'required',
  
  // Phone collection
  phone_number_collection: { enabled: true },
  
  // Promotional codes
  allow_promotion_codes: true,
  
  // Save card for future
  payment_method_options: {
    card: { setup_future_usage: 'off_session' },
  },
  
  // Automatic invoice
  invoice_creation: { enabled: true },
  
  // Terms of service
  consent_collection: {
    terms_of_service: 'required',
  },
  
  // Custom fields
  custom_fields: [{
    key: 'codice_fiscale',
    label: { custom: 'Codice Fiscale (opzionale)' },
    type: 'text',
    optional: true,
  }],
}
```

---

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is correct
2. Verify webhook secret matches
3. Ensure HTTPS in production
4. Check Stripe Dashboard for failed deliveries

### Payment Status Not Updating

1. Check webhook logs: `console.log('[Webhook] ...')`
2. Verify `registration_id` in metadata
3. Check Supabase service role key
4. Test with `stripe trigger checkout.session.completed`

### Demo Mode Unexpectedly Active

Check environment variables:
```typescript
console.log('Stripe key:', process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT SET');
```

---

## Invoice & Receipt

Stripe automatically generates:
- **Invoice** - Italian-compliant invoice with VAT
- **Receipt** - Email receipt to customer

Access via:
- `session.invoice` in webhook
- Customer email
- Stripe Dashboard

---

*For environment setup, see [ENVIRONMENT.md](./ENVIRONMENT.md)*