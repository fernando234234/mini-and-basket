'use client';

import { useState } from 'react';
import { isStripeConfigured, PACKAGE_PRICES, ADDON_PRICES, getStripe } from '@/lib/stripe';

export default function TestPaymentPage() {
  const [packageType, setPackageType] = useState<'standard' | 'alta_specializzazione'>('standard');
  const [busTransfer, setBusTransfer] = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('-');
  const [error, setError] = useState<string | null>(null);

  const stripeConfigured = isStripeConfigured();
  const stripeMode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') 
    ? 'Test Mode' 
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_') 
      ? 'Live Mode' 
      : 'Not Configured';

  // Calculate current price
  const packagePrice = PACKAGE_PRICES[packageType];
  const busPrice = busTransfer ? ADDON_PRICES.bus_transfer.price : 0;
  const totalAmount = paymentType === 'deposit' 
    ? packagePrice.depositPrice + busPrice 
    : packagePrice.fullPrice + busPrice;
  const displayTotal = `€${(totalAmount / 100).toFixed(0)}`;

  const handleTestPayment = async () => {
    setIsLoading(true);
    setError(null);
    setLastResponse('Loading...');

    try {
      // Step 1: Create a mock registration in Supabase
      const registrationData = {
        package_type: packageType,
        bus_transfer: busTransfer,
        genitore_nome_cognome: 'Test User Parent',
        genitore_codice_fiscale: 'TSTUSR00A01H501A',
        genitore_citta: 'Roma',
        genitore_cap: '00100',
        genitore_indirizzo: 'Via Test 123',
        genitore_telefono: '+39 333 1234567',
        genitore_email: 'test@test.com',
        camper_nome_cognome: 'Test Camper',
        camper_codice_fiscale: 'TSTCMP10A01H501B',
        camper_luogo_nascita: 'Roma',
        camper_data_nascita: '2015-01-01',
        camper_sesso: 'M',
        camper_citta: 'Roma',
        camper_cap: '00100',
        camper_indirizzo: 'Via Test 123',
        camper_scuola: 'Scuola Test',
        camper_classe: '5',
        camper_taglia: 'M',
        camper_altezza: 150,
        camper_peso: 40,
        camper_numero_scarpe: '38',
        camper_esperienza: 'intermedio',
        camper_societa: null,
        allergie_intolleranze: null,
        patologie_note: null,
        terapie_in_corso: null,
        liberatoria_foto_video: true,
        accettazione_regolamento: true,
        privacy_policy: true,
        codice_invito: null,
      };

      // Create registration
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const registerResult = await registerResponse.json();
      
      if (!registerResponse.ok) {
        throw new Error(registerResult.error || 'Registration failed');
      }

      setLastResponse(`Registration created: ${registerResult.registrationId}`);

      // Step 2: Create Stripe checkout session
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageType,
          paymentType,
          registrationData: {
            id: registerResult.registrationId,
            genitoreEmail: 'test@test.com',
            camperNome: 'Test',
            camperCognome: 'Camper',
            genitoreNome: 'Test',
            genitoreCognome: 'Parent',
            genitoreTelefono: '+39 333 1234567',
          },
        }),
      });

      const checkoutResult = await checkoutResponse.json();
      
      if (!checkoutResponse.ok) {
        throw new Error(checkoutResult.error || 'Checkout failed');
      }

      setLastResponse(JSON.stringify(checkoutResult, null, 2));

      // Step 3: Redirect to Stripe or handle demo mode
      if (checkoutResult.demoMode) {
        setLastResponse(`Demo Mode - Session ID: ${checkoutResult.sessionId}\nAmount: ${checkoutResult.priceDisplay}\nPackage: ${checkoutResult.packageName}`);
        // Redirect to success page with demo session
        window.location.href = `/iscrizione/success?session_id=${checkoutResult.sessionId}`;
      } else if (checkoutResult.url) {
        // Redirect to Stripe Checkout
        window.location.href = checkoutResult.url;
      } else if (checkoutResult.sessionId) {
        // Use Stripe.js to redirect
        const stripe = await getStripe();
        if (stripe) {
          const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId: checkoutResult.sessionId,
          });
          if (stripeError) {
            throw new Error(stripeError.message);
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLastResponse(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">🧪</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Stripe Payment Test</h1>
          <p className="text-sm text-red-500 mt-2">⚠️ This page is for testing only - not linked in navigation</p>
        </div>

        {/* Package Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package
          </label>
          <select
            value={packageType}
            onChange={(e) => setPackageType(e.target.value as 'standard' | 'alta_specializzazione')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="standard">Standard - €610</option>
            <option value="alta_specializzazione">Alta Specializzazione - €800</option>
          </select>
        </div>

        {/* Bus Transfer */}
        <div className="mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={busTransfer}
              onChange={(e) => setBusTransfer(e.target.checked)}
              className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-gray-700">Bus Transfer (+€60)</span>
          </label>
        </div>

        {/* Payment Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                value="full"
                checked={paymentType === 'full'}
                onChange={() => setPaymentType('full')}
                className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="text-gray-700">
                Full Payment ({packageType === 'standard' ? '€610' : '€800'}{busTransfer ? ' + €60 bus' : ''})
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                value="deposit"
                checked={paymentType === 'deposit'}
                onChange={() => setPaymentType('deposit')}
                className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="text-gray-700">
                Deposit Only (€200{busTransfer ? ' + €60 bus' : ''})
              </span>
            </label>
          </div>
        </div>

        {/* Total */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total:</span>
            <span className="text-2xl font-bold text-orange-600">{displayTotal}</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Test Payment Button */}
        <button
          onClick={handleTestPayment}
          disabled={isLoading}
          className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Processing...
            </>
          ) : (
            <>
              💳 Test Payment
            </>
          )}
        </button>

        {/* Debug Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Debug Info:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">• Stripe:</span>
              <span className={stripeConfigured ? 'text-green-600' : 'text-red-600'}>
                {stripeConfigured ? '✅' : '❌'} {stripeConfigured ? 'Configured' : 'Not Configured'} ({stripeMode})
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500">• Last Response:</span>
              <pre className="text-xs bg-gray-50 p-2 rounded flex-1 overflow-x-auto max-h-40 whitespace-pre-wrap">
                {lastResponse}
              </pre>
            </div>
          </div>
        </div>

        {/* Test Card Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">🔵 Stripe Test Cards:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code> - Successful payment</li>
            <li>• <code className="bg-blue-100 px-1 rounded">4000 0000 0000 0002</code> - Declined card</li>
            <li>• <code className="bg-blue-100 px-1 rounded">4000 0027 6000 3184</code> - 3D Secure required</li>
            <li>• Use any future date for expiry, any 3-digit CVC</li>
          </ul>
        </div>
      </div>
    </div>
  );
}