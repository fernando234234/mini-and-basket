import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe only if secret key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.log('Stripe webhook not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 400 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handleFailedPayment(paymentIntent);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const {
    metadata,
    customer_email,
    amount_total,
    payment_status,
  } = session;

  console.log('Payment successful:', {
    sessionId: session.id,
    email: customer_email,
    amount: amount_total,
    status: payment_status,
    metadata,
  });

  // Extract registration data from metadata
  const registrationId = metadata?.registrationId;
  const packageType = metadata?.packageType;
  const paymentType = metadata?.paymentType;
  const participantName = metadata?.participantName;

  if (registrationId) {
    // TODO: Update registration status in database
    // This would typically update the registration record to mark it as paid
    // For now, we'll just log the information
    console.log(`Updating registration ${registrationId}:`, {
      packageType,
      paymentType,
      paymentStatus: 'paid',
      paidAmount: amount_total,
    });

    // TODO: Send confirmation email
    // This would typically send an email to the customer
    console.log(`Sending confirmation email to ${customer_email} for ${participantName}`);
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', {
    paymentIntentId: paymentIntent.id,
    error: paymentIntent.last_payment_error?.message,
  });

  // TODO: Update registration status in database
  // TODO: Send failure notification email
}