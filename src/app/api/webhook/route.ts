import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

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
    payment_intent,
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
    // Determine payment status based on payment type
    // 'deposit' means partial payment, 'full' means fully paid
    const newPaymentStatus = paymentType === 'deposit' ? 'partial' : 'paid';
    const amountInEuros = (amount_total || 0) / 100; // Convert from cents to euros

    console.log(`Updating registration ${registrationId} in Supabase:`, {
      packageType,
      paymentType,
      paymentStatus: newPaymentStatus,
      amountPaid: amountInEuros,
    });

    try {
      // Update registration in Supabase using admin client (bypasses RLS)
      const { error } = await supabaseAdmin
        .from('registrations')
        .update({
          payment_status: newPaymentStatus,
          amount_paid: amountInEuros,
          stripe_session_id: session.id,
          payment_date: new Date().toISOString(),
          status: 'confirmed',
        })
        .eq('id', registrationId);

      if (error) {
        console.error('Failed to update registration in Supabase:', error);
      } else {
        console.log(`Successfully updated registration ${registrationId}`);
      }

      // Also create a payment record for tracking
      const { error: paymentError } = await supabaseAdmin
        .from('payments')
        .insert({
          registration_id: registrationId,
          payment_method: 'stripe',
          payment_type: paymentType === 'deposit' ? 'deposit' : 'full',
          amount: amountInEuros,
          status: 'completed',
          stripe_payment_intent_id: typeof payment_intent === 'string' ? payment_intent : payment_intent?.id || null,
          stripe_session_id: session.id,
          metadata: {
            packageType,
            participantName,
            customer_email,
          },
        });

      if (paymentError) {
        console.error('Failed to create payment record:', paymentError);
      } else {
        console.log(`Successfully created payment record for registration ${registrationId}`);
      }
    } catch (err) {
      console.error('Error updating Supabase:', err);
    }

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

  // Try to find and update the registration if we have metadata
  const registrationId = paymentIntent.metadata?.registrationId;
  
  if (registrationId) {
    try {
      const { error } = await supabaseAdmin
        .from('registrations')
        .update({
          payment_status: 'failed',
        })
        .eq('id', registrationId);

      if (error) {
        console.error('Failed to update registration payment status:', error);
      } else {
        console.log(`Updated registration ${registrationId} to failed status`);
      }
    } catch (err) {
      console.error('Error updating Supabase for failed payment:', err);
    }
  }

  // TODO: Send failure notification email
}