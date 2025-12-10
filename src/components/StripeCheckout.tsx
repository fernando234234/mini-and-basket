"use client";

import { useState } from "react";
import { isStripeConfigured, PACKAGE_PRICES, PackageType } from "@/lib/stripe";
import PaymentMethods, { InstallmentCalculator, PromoCodeSection, KlarnaIcon } from "./PaymentMethods";

interface StripeCheckoutProps {
  packageType: string;
  registrationData: {
    id?: string;
    participantName: string;
    email: string;
    camperNome?: string;
    camperCognome?: string;
    genitoreNome?: string;
    genitoreCognome?: string;
    genitoreEmail?: string;
    genitoreTelefono?: string;
  };
  onSuccess: (paymentType: 'full' | 'deposit', sessionId: string) => void;
  onCancel: () => void;
}

export default function StripeCheckout({
  packageType,
  registrationData,
  onSuccess,
  onCancel,
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'full' | 'deposit'>('full');
  const [isDemoProcessing, setIsDemoProcessing] = useState(false);
  const [showInstallments, setShowInstallments] = useState(false);
  
  // Map package IDs
  const packageMap: Record<string, PackageType> = {
    'giornaliero': 'giornaliero',
    'settimanale': 'completa',
    'weekend': 'weekend',
  };

  const mappedPackage = packageMap[packageType] || 'completa';
  const packageInfo = PACKAGE_PRICES[mappedPackage];
  const stripeConfigured = isStripeConfigured();

  // Get the current amount based on payment type
  const currentAmount = selectedPaymentType === 'deposit'
    ? packageInfo.depositPrice
    : packageInfo.fullPrice;

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageType: mappedPackage,
          paymentType: selectedPaymentType,
          registrationData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la creazione del pagamento');
      }

      // Demo mode - simulate payment
      if (data.demoMode) {
        setIsDemoProcessing(true);
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 2000));
        onSuccess(selectedPaymentType, data.sessionId);
        return;
      }

      // Real Stripe checkout - redirect to Stripe hosted page
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL di checkout non disponibile');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il pagamento');
      setIsLoading(false);
      setIsDemoProcessing(false);
    }
  };

  // Demo payment simulation UI
  if (isDemoProcessing) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green to-emerald-500 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-brand-green animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-brand-dark mb-2">
          Elaborazione pagamento demo...
        </h3>
        <p className="text-brand-gray">
          Simulazione pagamento in corso
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Demo Mode Notice */}
      {!stripeConfigured && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-bold text-yellow-800">Modalità Demo</h4>
              <p className="text-sm text-yellow-700">
                Stripe non è configurato. Il pagamento verrà simulato.
                <br />
                <span className="font-mono">Carta test: 4242 4242 4242 4242</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Package Summary */}
      <div className="bg-gradient-to-r from-brand-green/10 to-brand-orange/10 rounded-2xl p-6">
        <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
          <span>💳</span> Riepilogo Pagamento
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-brand-gray">Pacchetto:</span>
          <span className="font-semibold text-brand-dark">{packageInfo.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-brand-gray">Atleta:</span>
          <span className="font-semibold text-brand-dark">{registrationData.participantName}</span>
        </div>
      </div>

      {/* Payment Options */}
      <div>
        <h4 className="font-bold text-brand-dark mb-4">Scegli il tipo di pagamento</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Payment */}
          <button
            onClick={() => setSelectedPaymentType('full')}
            className={`p-5 rounded-2xl text-left transition-all duration-300 ${
              selectedPaymentType === 'full'
                ? 'ring-4 ring-brand-green bg-brand-green/5 shadow-lg'
                : 'border-2 border-gray-200 hover:border-brand-green'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-brand-dark">Pagamento Completo</span>
              {selectedPaymentType === 'full' && (
                <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-3xl font-black text-brand-orange mb-2">{packageInfo.displayPrice}</p>
            <p className="text-sm text-brand-gray">
              Paga subito l&apos;intero importo e conferma il tuo posto
            </p>
          </button>

          {/* Deposit Payment */}
          <button
            onClick={() => setSelectedPaymentType('deposit')}
            className={`p-5 rounded-2xl text-left transition-all duration-300 ${
              selectedPaymentType === 'deposit'
                ? 'ring-4 ring-brand-orange bg-brand-orange/5 shadow-lg'
                : 'border-2 border-gray-200 hover:border-brand-orange'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-brand-dark">Solo Acconto</span>
              {selectedPaymentType === 'deposit' && (
                <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-3xl font-black text-brand-green mb-2">{packageInfo.displayDeposit}</p>
            <p className="text-sm text-brand-gray">
              Paga l&apos;acconto ora, il saldo prima dell&apos;inizio del camp
            </p>
            <p className="text-xs text-brand-orange mt-2 font-semibold">
              Rimanente: €{((packageInfo.fullPrice - packageInfo.depositPrice) / 100).toFixed(0)}
            </p>
          </button>
        </div>
      </div>


      {/* Klarna Installment Option */}
      {selectedPaymentType === 'full' && currentAmount >= 10000 && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowInstallments(!showInstallments)}
            className="w-full flex items-center justify-between p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <KlarnaIcon />
              <span className="font-semibold text-brand-dark">
                Paga in 3 rate senza interessi
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-brand-gray transition-transform ${showInstallments ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showInstallments && (
            <InstallmentCalculator amount={currentAmount} installments={3} />
          )}
        </div>
      )}

      {/* Promo Code Section */}
      <PromoCodeSection />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
          <p className="font-semibold">Errore</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-4 px-6 rounded-full font-bold border-2 border-gray-300 text-brand-gray hover:border-brand-dark hover:text-brand-dark transition-all duration-300 disabled:opacity-50"
        >
          ← Torna Indietro
        </button>
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className={`flex-1 py-4 px-6 rounded-full font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
            selectedPaymentType === 'full'
              ? 'bg-gradient-to-r from-brand-green to-emerald-500 hover:shadow-lg'
              : 'bg-gradient-to-r from-brand-orange to-red-500 hover:shadow-lg'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Elaborazione...</span>
            </>
          ) : (
            <>
              <span>
                {selectedPaymentType === 'full' ? 'PAGA ORA' : 'PAGA ACCONTO'} {' '}
                {selectedPaymentType === 'full' ? packageInfo.displayPrice : packageInfo.displayDeposit}
              </span>
              <span>→</span>
            </>
          )}
        </button>
      </div>

      {/* Payment Methods Icons */}
      <div className="space-y-3">
        <p className="text-sm text-brand-gray text-center">Metodi di pagamento accettati:</p>
        <PaymentMethods variant="inline" className="justify-center" />
      </div>

      {/* Security Notice */}
      <div className="text-center text-sm text-brand-gray space-y-2">
        <p className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Pagamento sicuro con crittografia SSL
        </p>
        <p>
          Powered by <span className="font-semibold text-[#635bff]">Stripe</span>
        </p>
        <p className="text-xs text-brand-gray/70">
          Apple Pay • Google Pay • PayPal • Klarna • Carte di credito
        </p>
      </div>
    </div>
  );
}