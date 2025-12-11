import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase';

// Initialize Stripe only if secret key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  console.log('[Webhook] ============================================');
  console.log('[Webhook] Received webhook request at:', new Date().toISOString());
  
  // Check Stripe configuration
  if (!stripe) {
    console.log('[Webhook] ERROR: Stripe not configured (missing STRIPE_SECRET_KEY)');
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 400 }
    );
  }
  
  if (!webhookSecret) {
    console.log('[Webhook] ERROR: Webhook secret not configured (missing STRIPE_WEBHOOK_SECRET)');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 400 }
    );
  }

  // Check Supabase configuration at runtime
  const { client: supabaseAdmin, isConfigured: supabaseConfigured, error: supabaseError } = getSupabaseAdmin();
  
  console.log('[Webhook] Environment check:');
  console.log('[Webhook]   - Stripe: configured');
  console.log('[Webhook]   - Webhook secret: configured');
  console.log('[Webhook]   - Supabase admin:', supabaseConfigured ? 'configured' : `NOT CONFIGURED - ${supabaseError}`);
  console.log('[Webhook]   - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'NOT SET');
  console.log('[Webhook]   - SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set (length: ' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ')' : 'NOT SET');
  
  if (!supabaseConfigured) {
    console.log('[Webhook] WARNING: Supabase not configured - database updates will be skipped!');
    // Continue processing but log clearly that DB updates won't work
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  console.log('[Webhook] Request body length:', body.length);
  console.log('[Webhook] Signature present:', !!signature);

  if (!signature) {
    console.log('[Webhook] ERROR: Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('[Webhook] Signature verified successfully');
  } catch (err) {
    console.error('[Webhook] ERROR: Signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log('[Webhook] Event type:', event.type);
  console.log('[Webhook] Event ID:', event.id);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('[Webhook] Processing checkout.session.completed');
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('[Webhook] Payment intent succeeded:', paymentIntent.id);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('[Webhook] Payment intent failed:', paymentIntent.id);
      await handleFailedPayment(paymentIntent);
      break;
    }
    default:
      console.log('[Webhook] Unhandled event type:', event.type);
  }

  console.log('[Webhook] ============================================');
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

  console.log('[Webhook] -------- handleSuccessfulPayment --------');
  console.log('[Webhook] Session ID:', session.id);
  console.log('[Webhook] Customer email:', customer_email);
  console.log('[Webhook] Amount total (cents):', amount_total);
  console.log('[Webhook] Payment status:', payment_status);
  console.log('[Webhook] Raw metadata:', JSON.stringify(metadata, null, 2));

  // Get Supabase admin client with runtime check
  const { client: supabaseAdmin, isConfigured: supabaseConfigured, error: supabaseError } = getSupabaseAdmin();
  
  if (!supabaseConfigured) {
    console.error('[Webhook] CRITICAL: Supabase admin client not configured!');
    console.error('[Webhook] Error:', supabaseError);
    console.error('[Webhook] Cannot update database - payment received but not recorded!');
    console.error('[Webhook] Manual intervention required for session:', session.id);
    // We still return success to Stripe to prevent retries, but log the error
    return;
  }

  // Extract registration data from metadata
  // IMPORTANT: The checkout API uses snake_case keys, so we need to check both formats
  const registrationId = metadata?.registration_id || metadata?.registrationId;
  const packageType = metadata?.package_type || metadata?.packageType;
  const paymentType = metadata?.payment_type || metadata?.paymentType;
  const participantName = metadata?.camper_nome
    ? `${metadata.camper_nome} ${metadata.camper_cognome || ''}`.trim()
    : metadata?.participantName;

  console.log('[Webhook] Extracted values:');
  console.log('[Webhook]   - registrationId:', registrationId);
  console.log('[Webhook]   - packageType:', packageType);
  console.log('[Webhook]   - paymentType:', paymentType);
  console.log('[Webhook]   - participantName:', participantName);

  if (!registrationId) {
    console.log('[Webhook] WARNING: No registration ID found in metadata!');
    console.log('[Webhook] Available metadata keys:', Object.keys(metadata || {}));
    console.log('[Webhook] This payment will not be linked to a registration.');
    console.log('[Webhook] Manual intervention may be required for session:', session.id);
    return;
  }

  // Determine payment status based on payment type
  // 'deposit' means partial payment, 'full' means fully paid
  const newPaymentStatus = paymentType === 'deposit' ? 'partial' : 'paid';
  const amountInEuros = (amount_total || 0) / 100; // Convert from cents to euros

  console.log('[Webhook] Calculated values:');
  console.log('[Webhook]   - newPaymentStatus:', newPaymentStatus);
  console.log('[Webhook]   - amountInEuros:', amountInEuros);

  try {
    console.log('[Webhook] Attempting to update registration in Supabase...');
    console.log('[Webhook] Using Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // First, check if the registration exists
    const { data: existingReg, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('id, status, payment_status')
      .eq('id', registrationId)
      .single();
    
    if (fetchError) {
      console.error('[Webhook] ERROR fetching existing registration:', fetchError);
      console.error('[Webhook] This could mean:');
      console.error('[Webhook]   1. Registration ID does not exist in database');
      console.error('[Webhook]   2. Database connection issue');
      console.error('[Webhook]   3. RLS policy blocking access (should not happen with service role)');
    } else if (!existingReg) {
      console.error('[Webhook] Registration not found for ID:', registrationId);
    } else {
      console.log('[Webhook] Existing registration found:', JSON.stringify(existingReg, null, 2));
    }

    // Update registration in Supabase using admin client (bypasses RLS)
    const updatePayload = {
      payment_status: newPaymentStatus,
      amount_paid: amountInEuros,
      stripe_session_id: session.id,
      payment_date: new Date().toISOString(),
      status: 'confirmed',
    };
    
    console.log('[Webhook] Update payload:', JSON.stringify(updatePayload, null, 2));
    
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('registrations')
      .update(updatePayload)
      .eq('id', registrationId)
      .select();

    if (updateError) {
      console.error('[Webhook] ERROR updating registration in Supabase:', updateError);
      console.error('[Webhook] Error code:', updateError.code);
      console.error('[Webhook] Error message:', updateError.message);
      console.error('[Webhook] Error details:', updateError.details);
      console.error('[Webhook] Error hint:', updateError.hint);
    } else if (!updateData || updateData.length === 0) {
      console.error('[Webhook] WARNING: Update returned no data - registration may not exist');
      console.error('[Webhook] Registration ID:', registrationId);
    } else {
      console.log('[Webhook] SUCCESS! Registration updated:', JSON.stringify(updateData, null, 2));
    }

    // Also create a payment record for tracking
    console.log('[Webhook] Creating payment record...');
    
    const paymentPayload = {
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
    };
    
    console.log('[Webhook] Payment payload:', JSON.stringify(paymentPayload, null, 2));
    
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert(paymentPayload)
      .select();

    if (paymentError) {
      console.error('[Webhook] ERROR creating payment record:', paymentError);
      console.error('[Webhook] Error code:', paymentError.code);
      console.error('[Webhook] Error message:', paymentError.message);
      console.error('[Webhook] Error hint:', paymentError.hint);
    } else {
      console.log('[Webhook] SUCCESS! Payment record created:', JSON.stringify(paymentData, null, 2));
    }
  } catch (err) {
    console.error('[Webhook] EXCEPTION in Supabase operations:', err);
    if (err instanceof Error) {
      console.error('[Webhook] Exception name:', err.name);
      console.error('[Webhook] Exception message:', err.message);
      console.error('[Webhook] Exception stack:', err.stack);
    }
  }

  // TODO: Send confirmation email
  console.log('[Webhook] TODO: Send confirmation email to', customer_email, 'for', participantName);
  console.log('[Webhook] -------- End handleSuccessfulPayment --------');
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  console.log('[Webhook] -------- handleFailedPayment --------');
  console.log('[Webhook] Payment Intent ID:', paymentIntent.id);
  console.log('[Webhook] Error message:', paymentIntent.last_payment_error?.message);
  console.log('[Webhook] Error type:', paymentIntent.last_payment_error?.type);
  console.log('[Webhook] Metadata:', JSON.stringify(paymentIntent.metadata, null, 2));

  // Get Supabase admin client with runtime check
  const { client: supabaseAdmin, isConfigured: supabaseConfigured, error: supabaseError } = getSupabaseAdmin();
  
  if (!supabaseConfigured) {
    console.error('[Webhook] CRITICAL: Supabase admin client not configured for failed payment handling!');
    console.error('[Webhook] Error:', supabaseError);
    return;
  }

  // Try to find and update the registration if we have metadata
  // Check both snake_case and camelCase keys
  const registrationId = paymentIntent.metadata?.registration_id || paymentIntent.metadata?.registrationId;
  
  console.log('[Webhook] Registration ID:', registrationId);

  if (registrationId) {
    try {
      console.log('[Webhook] Updating registration to failed status...');
      
      const { data, error } = await supabaseAdmin
        .from('registrations')
        .update({
          payment_status: 'failed',
        })
        .eq('id', registrationId)
        .select();

      if (error) {
        console.error('[Webhook] ERROR updating registration payment status:', error);
      } else if (!data || data.length === 0) {
        console.error('[Webhook] WARNING: No registration found to update for ID:', registrationId);
      } else {
        console.log('[Webhook] SUCCESS! Updated registration to failed:', JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error('[Webhook] EXCEPTION updating Supabase for failed payment:', err);
    }
  } else {
    console.log('[Webhook] No registration ID found in metadata, skipping update');
  }

  // TODO: Send failure notification email
  console.log('[Webhook] -------- End handleFailedPayment --------');
}