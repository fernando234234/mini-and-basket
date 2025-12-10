"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PACKAGE_PRICES, PackageType } from "@/lib/stripe";
import { generateCalendarEvent, downloadCalendarFile } from "@/lib/calendar";
import PaymentMethods from "@/components/PaymentMethods";
import BasketballShotAnimation from "@/components/BasketballShotAnimation";

// Payment method display info
const PAYMENT_METHOD_LABELS: Record<string, { label: string; icon: string }> = {
  card: { label: "Carta di credito/debito", icon: "💳" },
  paypal: { label: "PayPal", icon: "🅿️" },
  klarna: { label: "Klarna (rate)", icon: "🛍️" },
  sepa_debit: { label: "Addebito SEPA", icon: "🏦" },
  bancontact: { label: "Bancontact", icon: "🏧" },
  ideal: { label: "iDEAL", icon: "🇳🇱" },
  link: { label: "Link by Stripe", icon: "⚡" },
};

// Card brand display
const CARD_BRANDS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  jcb: "JCB",
  unionpay: "UnionPay",
};

interface SessionData {
  id: string;
  payment_status: string;
  status: string;
  amount_total: number;
  currency: string;
  customer_email: string;
  payment_method_types: string[];
  metadata: {
    package_type?: string;
    payment_type?: string;
    camper_nome?: string;
    camper_cognome?: string;
  };
  created: number;
  payment_method?: {
    type: string;
    card?: {
      brand: string;
      last4: string;
    };
  };
  invoice_url?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Get data from URL params
  const sessionId = searchParams.get("session_id");
  const registrationId = searchParams.get("registration_id");
  const paymentTypeParam = searchParams.get("payment_type") as "full" | "deposit" | null;
  const camperNameParam = searchParams.get("camper_name");
  const packageIdParam = searchParams.get("package");
  const emailParam = searchParams.get("email");

  // Map package IDs
  const packageMap: Record<string, PackageType> = {
    standard: "standard",
    alta_specializzazione: "alta_specializzazione",
    // Legacy fallbacks
    completa: "standard",
    settimanale: "standard",
  };

  // Fetch session data from Stripe with timeout and fallback
  const fetchSessionData = useCallback(async () => {
    // If no session ID, use URL params or demo data immediately
    if (!sessionId) {
      // Create fallback data from URL params if available
      const fallbackData: SessionData = {
        id: registrationId || 'demo-session',
        payment_status: 'paid',
        status: 'complete',
        amount_total: 0,
        currency: 'eur',
        customer_email: emailParam || 'iscritto@example.com',
        payment_method_types: ['card'],
        metadata: {
          package_type: packageIdParam || 'completa',
          payment_type: paymentTypeParam || 'full',
          camper_nome: camperNameParam?.split(' ')[0] || 'Atleta',
          camper_cognome: camperNameParam?.split(' ').slice(1).join(' ') || '',
        },
        created: Date.now() / 1000,
      };
      setSessionData(fallbackData);
      setIsLoading(false);
      return;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`/api/checkout?session_id=${sessionId}`, {
        signal: controller.signal
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSessionData(data.session || data);
    } catch (err) {
      console.error("Error fetching session:", err);
      
      // Check if it's an abort error (timeout)
      if (err instanceof Error && err.name === 'AbortError') {
        setError("Timeout nel recupero dei dati. I dettagli verranno inviati via email.");
      } else {
        setError(err instanceof Error ? err.message : "Errore nel recupero dei dati");
      }
      
      // Create fallback data on error so page still shows success content
      const fallbackData: SessionData = {
        id: sessionId,
        payment_status: 'paid',
        status: 'complete',
        amount_total: 0,
        currency: 'eur',
        customer_email: emailParam || '',
        payment_method_types: ['card'],
        metadata: {
          package_type: packageIdParam || 'completa',
          payment_type: paymentTypeParam || 'full',
          camper_nome: camperNameParam?.split(' ')[0] || '',
          camper_cognome: camperNameParam?.split(' ').slice(1).join(' ') || '',
        },
        created: Date.now() / 1000,
      };
      setSessionData(fallbackData);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [sessionId, registrationId, emailParam, packageIdParam, paymentTypeParam, camperNameParam]);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  // Safety timeout - ensure loading never lasts more than 5 seconds
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Safety timeout triggered - forcing loading to complete');
        setIsLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(safetyTimeout);
  }, [isLoading]);

  // Derive values from session data or URL params
  const paymentType = sessionData?.metadata?.payment_type || paymentTypeParam || "full";
  const camperName = sessionData?.metadata?.camper_nome
    ? `${sessionData.metadata.camper_nome} ${sessionData.metadata.camper_cognome || ""}`.trim()
    : camperNameParam;
  const packageId = sessionData?.metadata?.package_type || packageIdParam;
  const email = sessionData?.customer_email || emailParam;
  
  const mappedPackage = packageMap[packageId || ""] || "completa";
  const packageInfo = PACKAGE_PRICES[mappedPackage];
  
  // Get payment method info
  const paymentMethodType = sessionData?.payment_method?.type || sessionData?.payment_method_types?.[0];
  const paymentMethodInfo = paymentMethodType ? PAYMENT_METHOD_LABELS[paymentMethodType] : null;
  const cardBrand = sessionData?.payment_method?.card?.brand;
  const cardLast4 = sessionData?.payment_method?.card?.last4;

  // Format amount
  const amountPaid = sessionData?.amount_total
    ? `€${(sessionData.amount_total / 100).toFixed(2)}`
    : paymentType === "deposit"
      ? packageInfo.displayDeposit
      : packageInfo.displayPrice;

  // Handle animation completion
  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
    // Add slight delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 300);
  }, []);

  const handleDownloadCalendar = () => {
    const event = generateCalendarEvent();
    downloadCalendarFile(event);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-green/10 to-brand-orange/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green to-emerald-500 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-brand-green animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-brand-dark">
            Verifica pagamento in corso...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green/10 to-brand-orange/10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
          {/* Basketball Shot Animation */}
          <div className="mb-8">
            <BasketballShotAnimation
              onComplete={handleAnimationComplete}
              autoPlay={true}
            />
          </div>

          {/* Success Icon - Shows after animation */}
          <div
            className={`transition-all duration-500 ${
              showContent
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-brand-green to-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1
            className={`text-3xl font-extrabold text-brand-dark mb-4 transition-all duration-500 delay-100 ${
              showContent
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            Pagamento Completato! 🎉
          </h1>
          <div
            className={`transition-all duration-500 delay-200 ${
              showContent
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-sm text-yellow-700">
                <p>⚠️ {error}</p>
                <p className="text-xs mt-1">I dettagli del pagamento verranno inviati via email.</p>
              </div>
            )}

            <p className="text-brand-gray text-lg mb-8">
              Grazie per aver iscritto <span className="font-bold text-brand-dark">{camperName || "il tuo atleta"}</span> al Mini & Basket Camp 2025!
            </p>
          </div>

          {/* Registration Details */}
          <div
            className={`bg-gradient-to-r from-brand-green/10 to-brand-orange/10 rounded-2xl p-6 mb-8 text-left transition-all duration-500 delay-300 ${
              showContent
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            <h3 className="font-bold text-brand-dark mb-4 text-center">
              📋 Dettagli Iscrizione
            </h3>
            <div className="space-y-3 text-sm">
              {(registrationId || sessionId) && (
                <div className="flex justify-between">
                  <span className="text-brand-gray">N° Riferimento:</span>
                  <span className="font-mono font-bold text-brand-dark text-xs">
                    {registrationId || sessionId?.slice(0, 20)}...
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-brand-gray">Pacchetto:</span>
                <span className="font-semibold text-brand-dark">
                  {packageInfo.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Tipo Pagamento:</span>
                <span className="font-semibold text-brand-dark">
                  {paymentType === "deposit" ? "Acconto" : "Completo"}
                </span>
              </div>
              
              {/* Payment Method Used */}
              {paymentMethodInfo && (
                <div className="flex justify-between items-center">
                  <span className="text-brand-gray">Metodo Pagamento:</span>
                  <span className="font-semibold text-brand-dark flex items-center gap-1">
                    <span>{paymentMethodInfo.icon}</span>
                    {cardBrand && cardLast4 ? (
                      <span>{CARD_BRANDS[cardBrand] || cardBrand} •••• {cardLast4}</span>
                    ) : (
                      <span>{paymentMethodInfo.label}</span>
                    )}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-brand-gray">Importo Pagato:</span>
                <span className="font-bold text-brand-orange text-lg">
                  {amountPaid}
                </span>
              </div>
              {paymentType === "deposit" && (
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-brand-gray">Saldo Rimanente:</span>
                  <span className="font-semibold text-brand-dark">
                    €{((packageInfo.fullPrice - packageInfo.depositPrice) / 100).toFixed(0)}
                  </span>
                </div>
              )}
              
              {/* Klarna Installment Status */}
              {paymentMethodType === "klarna" && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-pink-700 font-semibold text-xs flex items-center gap-1">
                      🛍️ Pagamento in 3 rate con Klarna
                    </p>
                    <p className="text-pink-600 text-xs mt-1">
                      Riceverai i dettagli delle rate via email da Klarna
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Invoice/Receipt Link */}
          {sessionData?.invoice_url && showContent && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 animate-fade-in-up">
              <a
                href={sessionData.invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-brand-green font-semibold hover:text-brand-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Scarica Ricevuta/Fattura
              </a>
            </div>
          )}

          {/* Email Confirmation */}
          <div
            className={`bg-blue-50 rounded-xl p-4 mb-8 transition-all duration-500 delay-400 ${
              showContent
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            <p className="text-blue-700 font-semibold">
              📧 Email di conferma inviata a:
            </p>
            <p className="text-brand-dark font-bold text-lg">{email}</p>
            <p className="text-sm text-blue-600 mt-2">
              Controlla anche la cartella spam se non la trovi.
            </p>
          </div>

          {/* Camp Info */}
          <div
            className={`bg-brand-orange/10 rounded-xl p-5 mb-8 text-left transition-all duration-500 delay-500 ${
              showContent
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            <h4 className="font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span>📍</span> Informazioni Camp
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-brand-gray">📅 Date:</span>
                <span className="font-semibold text-brand-dark">
                  29 Giugno - 6 Luglio 2025
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-brand-gray">🏨 Location:</span>
                <span className="font-semibold text-brand-dark">
                  Villaggio Residence Bahja, Paola (CS)
                </span>
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 transition-all duration-500 delay-600 ${
              showContent
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            <button
              onClick={handleDownloadCalendar}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-white border-2 border-brand-green text-brand-green font-bold rounded-full hover:bg-brand-green hover:text-white transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Aggiungi al Calendario
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-white border-2 border-brand-orange text-brand-orange font-bold rounded-full hover:bg-brand-orange hover:text-white transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Stampa Conferma
            </button>
          </div>

          {/* Deposit Reminder */}
          {paymentType === "deposit" && showContent && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-8 animate-fade-in-up">
              <p className="text-yellow-800 font-semibold mb-2">
                ⚠️ Promemoria Saldo
              </p>
              <p className="text-sm text-yellow-700">
                Il saldo rimanente di{" "}
                <strong>
                  €{((packageInfo.fullPrice - packageInfo.depositPrice) / 100).toFixed(0)}
                </strong>{" "}
                dovrà essere pagato entro il 20 Giugno 2025. Riceverai un promemoria via email.
              </p>
            </div>
          )}

          {/* Actions */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 delay-700 ${
              showContent
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            <Link
              href="/"
              className="bg-gradient-to-r from-brand-green to-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Torna alla Home
            </Link>
            <Link
              href="/contatti"
              className="border-2 border-brand-green text-brand-green font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-brand-green hover:text-white"
            >
              Hai Domande?
            </Link>
          </div>
        </div>

        {/* Payment Methods Footer */}
        <div
          className={`mt-6 text-center transition-all duration-500 delay-800 ${
            showContent
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        >
          <p className="text-xs text-brand-gray mb-2">Pagamento sicuro con</p>
          <PaymentMethods variant="compact" className="justify-center opacity-60" />
        </div>

        {/* Social Share */}
        <div
          className={`mt-8 text-center transition-all duration-500 delay-900 ${
            showContent
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        >
          <p className="text-brand-gray mb-4">
            Condividi con i tuoi amici! 🏀
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://miniandbasketcamp.it")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent("Ho appena iscritto mio figlio al Mini & Basket Camp 2025! 🏀 https://miniandbasketcamp.it")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-brand-green/10 to-brand-orange/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-gray">Caricamento...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}