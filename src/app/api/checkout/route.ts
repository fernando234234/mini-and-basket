import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PACKAGE_PRICES, PackageType } from '@/lib/stripe';

// Initialize Stripe only if secret key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
    })
  : null;

// Payment methods available in Italy
const PAYMENT_METHODS: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [
  'card',           // Credit/Debit cards (includes Apple Pay, Google Pay)
  'paypal',         // PayPal
  'klarna',         // Klarna (Buy now, pay later)
  'bancontact',     // Bancontact
  'ideal',          // iDEAL
  'sepa_debit',     // SEPA Direct Debit
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packageType,
      paymentType, // 'full' or 'deposit'
      registrationData,
    } = body;

    // Validate package type
    if (!packageType || !PACKAGE_PRICES[packageType as PackageType]) {
      return NextResponse.json(
        { error: 'Tipo di pacchetto non valido' },
        { status: 400 }
      );
    }

    const packageInfo = PACKAGE_PRICES[packageType as PackageType];
    const amount = paymentType === 'deposit' ? packageInfo.depositPrice : packageInfo.fullPrice;
    const priceDisplay = paymentType === 'deposit' ? packageInfo.displayDeposit : packageInfo.displayPrice;
    const baseUrl = request.headers.get('origin') || 'https://miniandbasketcamp.it';

    // If Stripe is not configured, return demo mode response
    if (!stripe) {
      console.log('Stripe not configured - returning demo mode response');
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

    // Build metadata from registration data
    const metadata: Record<string, string> = {
      package_type: packageType,
      payment_type: paymentType,
      registration_id: registrationData?.id || '',
      camper_nome: registrationData?.camperNome || registrationData?.participantName || '',
      camper_cognome: registrationData?.camperCognome || '',
      genitore_nome: registrationData?.genitoreNome || '',
      genitore_cognome: registrationData?.genitoreCognome || '',
      genitore_email: registrationData?.genitoreEmail || registrationData?.email || '',
      genitore_telefono: registrationData?.genitoreTelefono || '',
    };

    // Create enhanced Stripe Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      // Multiple payment methods for Italy
      payment_method_types: PAYMENT_METHODS,
      
      // Line items
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Mini & Basket Camp 2025 - ${packageInfo.name}`,
              description: paymentType === 'deposit'
                ? `Acconto per ${packageInfo.name} - Saldo da pagare: €${((packageInfo.fullPrice - packageInfo.depositPrice) / 100).toFixed(0)}`
                : `Pagamento completo per ${packageInfo.name}`,
              images: ['https://miniandbasketcamp.it/images/camp-logo.png'],
              metadata: {
                package: packageType,
                payment_type: paymentType,
              },
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      
      mode: 'payment',
      
      // Payment method options
      payment_method_options: {
        card: {
          setup_future_usage: 'off_session', // Allow saving card for future payments
        },
      },
      
      // Italian locale
      locale: 'it',
      
      // Collect billing address
      billing_address_collection: 'required',
      
      // Prefill customer email
      customer_email: registrationData?.genitoreEmail || registrationData?.email,
      
      // Allow promotional codes
      allow_promotion_codes: true,
      
      // Collect phone number
      phone_number_collection: {
        enabled: true,
      },
      
      // Custom fields for Italian requirements
      custom_fields: [
        {
          key: 'codice_fiscale',
          label: {
            custom: 'Codice Fiscale (opzionale)',
            type: 'custom',
          },
          type: 'text',
          optional: true,
        },
      ],
      
      // Consent collection
      consent_collection: {
        terms_of_service: 'required',
        promotions: 'auto',
      },
      
      // Invoice creation for receipts
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Iscrizione Mini & Basket Camp 2025 - ${packageInfo.name}`,
          metadata: metadata,
          footer: 'Grazie per aver scelto Mini & Basket Camp! 🏀',
          custom_fields: [
            {
              name: 'Atleta',
              value: metadata.camper_nome + (metadata.camper_cognome ? ' ' + metadata.camper_cognome : ''),
            },
          ],
        },
      },
      
      // Session expires in 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      
      // Success and cancel URLs with session data
      success_url: `${baseUrl}/iscrizione/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/iscrizione?cancelled=true`,
      
      // Metadata for webhook handling
      metadata: metadata,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      paymentMethods: PAYMENT_METHODS,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    
    // Return more specific error messages
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: 'Errore Stripe: ' + error.message,
          code: error.code,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Errore nella creazione della sessione di pagamento' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve session details (for success page)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID mancante' },
        { status: 400 }
      );
    }

    // Demo mode
    if (!stripe || sessionId.startsWith('demo_')) {
      return NextResponse.json({
        demoMode: true,
        session: {
          id: sessionId,
          payment_status: 'paid',
          status: 'complete',
          amount_total: 45000,
          currency: 'eur',
          customer_email: 'demo@example.com',
          payment_method_types: ['card'],
          metadata: {
            package_type: 'completa',
            payment_type: 'full',
            camper_nome: 'Demo',
            camper_cognome: 'User',
          },
        },
      });
    }

    // Retrieve session with expanded data
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'invoice', 'customer'],
    });

    // Get payment method details if available
    let paymentMethodDetails = null;
    if (session.payment_intent && typeof session.payment_intent === 'object') {
      const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
      if (paymentIntent.payment_method && typeof paymentIntent.payment_method === 'string') {
        try {
          const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
          paymentMethodDetails = {
            type: paymentMethod.type,
            card: paymentMethod.card ? {
              brand: paymentMethod.card.brand,
              last4: paymentMethod.card.last4,
            } : null,
          };
        } catch (e) {
          console.warn('Could not retrieve payment method:', e);
        }
      }
    }

    // Get invoice URL if available
    let invoiceUrl = null;
    if (session.invoice && typeof session.invoice === 'object') {
      const invoice = session.invoice as Stripe.Invoice;
      invoiceUrl = invoice.hosted_invoice_url || invoice.invoice_pdf;
    }

    return NextResponse.json({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_email,
        payment_method_types: session.payment_method_types,
        metadata: session.metadata,
        created: session.created,
        payment_method: paymentMethodDetails,
        invoice_url: invoiceUrl,
      },
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero della sessione' },
      { status: 500 }
    );
  }
}