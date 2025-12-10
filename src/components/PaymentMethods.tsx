"use client";

import { useState } from "react";

// Payment method icons as SVG components
const VisaIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" aria-label="Visa">
    <rect width="48" height="32" rx="4" fill="#1A1F71" />
    <path
      d="M19.5 21.5h-2.8l1.8-10.5h2.8l-1.8 10.5zm7.8-10.2c-.6-.2-1.4-.4-2.5-.4-2.8 0-4.7 1.4-4.7 3.4 0 1.5 1.4 2.3 2.5 2.8 1.1.5 1.5.8 1.5 1.3 0 .7-.9 1-1.7 1-1.2 0-1.8-.2-2.7-.6l-.4-.2-.4 2.4c.7.3 1.9.5 3.2.5 3 0 4.9-1.4 4.9-3.5 0-1.2-.7-2.1-2.4-2.8-1-.5-1.6-.8-1.6-1.3 0-.4.5-.9 1.6-.9.9 0 1.6.2 2.1.4l.3.1.4-2.2zm7.2-.3h-2.2c-.7 0-1.2.2-1.5.9l-4.2 9.6h3l.6-1.6h3.6c.1.4.3 1.6.3 1.6h2.6l-2.2-10.5zm-3.5 6.8l1.1-2.8c0 0 .2-.6.4-1l.2.9.6 2.9h-2.3zm-16.2-6.8l-2.7 7.2-.3-1.4c-.5-1.6-2-3.4-3.7-4.3l2.5 9h3l4.5-10.5h-3.3z"
      fill="#fff"
    />
    <path
      d="M9.5 11l-.1.6c3.6.9 6 3 7 5.5l-1-4.9c-.2-.7-.7-.9-1.3-.9l-4.6-.3z"
      fill="#F9A533"
    />
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" aria-label="Mastercard">
    <rect width="48" height="32" rx="4" fill="#000" />
    <circle cx="18" cy="16" r="8" fill="#EB001B" />
    <circle cx="30" cy="16" r="8" fill="#F79E1B" />
    <path
      d="M24 10.3c1.8 1.4 3 3.5 3 5.7s-1.2 4.3-3 5.7c-1.8-1.4-3-3.5-3-5.7s1.2-4.3 3-5.7z"
      fill="#FF5F00"
    />
  </svg>
);

const AmexIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" aria-label="American Express">
    <rect width="48" height="32" rx="4" fill="#006FCF" />
    <path
      d="M8 16h3l1.5-3.5L14 16h3l-2.5-5h-4L8 16zm19.5 0h3v-5h-2v3l-2-3h-2.5v5h2v-3l2 3zm4.5-5v5h5v-1.5h-3v-.5h3v-1.5h-3v-.5h3V11h-5zm-24 9v5h5l1-1.5 1 1.5h4v-1.5l-.5.5h-2.5l-1-1.5-1 1.5H13v-3h2.5l1 1.5 1-1.5h6v5h2v-5h2.5l2 2.5 2-2.5h2.5v5H32l-2-2.5-2 2.5h-8v-5h-12.5z"
      fill="#fff"
    />
  </svg>
);

const PayPalIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" aria-label="PayPal">
    <rect width="48" height="32" rx="4" fill="#fff" stroke="#E5E7EB" />
    <path
      d="M19.5 8h5.8c2.6 0 4.4 1.4 4.2 3.8-.3 3.2-2.6 5-5.6 5h-1.4c-.4 0-.8.3-.9.8l-.8 5.2c0 .3-.3.5-.6.5h-2.8c-.3 0-.5-.3-.4-.6l2.2-14.2c.1-.3.4-.5.7-.5z"
      fill="#003087"
    />
    <path
      d="M31.5 8.5c.6.7.9 1.7.8 2.8-.4 3.5-2.8 5.5-6.2 5.5h-1.6c-.5 0-.9.4-1 .8l-.9 5.6c0 .2-.2.4-.5.4h-2.2"
      fill="#009CDE"
    />
  </svg>
);

const ApplePayIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" aria-label="Apple Pay">
    <rect width="48" height="32" rx="4" fill="#000" />
    <path
      d="M14.5 11c-.5.6-.8 1.3-.8 2.1 0 .8.3 1.5.9 2-.2.1-.5.1-.7.1-.8 0-1.5-.3-2-.8-.5-.5-.8-1.2-.8-2s.3-1.5.8-2c.5-.5 1.2-.8 2-.8.3 0 .5 0 .7.1-.1.5-.1.9-.1 1.4zm.8 1.5c0-1 .4-1.8 1.1-2.3.6-.5 1.4-.7 2.3-.7.2 0 .4 0 .6.1-.1.5-.1 1-.1 1.5 0 1 .4 1.8 1.1 2.3-.3.4-.7.7-1.2.9-.4.2-.8.3-1.3.3-.9 0-1.7-.4-2.2-1-.3-.4-.3-.7-.3-1.1z"
      fill="#fff"
    />
    <text x="22" y="19" fill="#fff" fontSize="8" fontFamily="system-ui, -apple-system" fontWeight="600">
      Pay
    </text>
  </svg>
);

const GooglePayIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" aria-label="Google Pay">
    <rect width="48" height="32" rx="4" fill="#fff" stroke="#E5E7EB" />
    <path d="M24.8 16.5v3.1h-1v-7.7h2.6c.6 0 1.2.2 1.7.6.5.4.7.9.7 1.5s-.2 1.1-.7 1.5c-.4.4-1 .6-1.7.6h-1.6zm0-3.6v2.7h1.7c.4 0 .7-.1 1-.4.3-.2.4-.5.4-.9 0-.4-.1-.7-.4-.9-.3-.3-.6-.4-1-.4h-1.7z" fill="#5F6368" />
    <path d="M32.1 14.2c.7 0 1.3.2 1.7.6.4.4.6.9.6 1.6v3.2h-.9v-.7c-.3.6-.9.9-1.6.9-.5 0-.9-.1-1.2-.4-.3-.3-.5-.6-.5-1.1 0-.5.2-.9.5-1.1.4-.3.9-.4 1.5-.4.5 0 1 .1 1.3.3v-.3c0-.4-.1-.7-.4-.9-.3-.2-.6-.3-1-.3-.6 0-1 .2-1.3.6l-.7-.5c.4-.6 1.1-.9 2-.9zm-.2 4.6c.4 0 .7-.1 1-.4.3-.2.4-.5.4-.8v-.4c-.3-.2-.6-.3-1.1-.3-.4 0-.7.1-.9.2-.2.2-.4.4-.4.7 0 .3.1.5.3.6.2.3.5.4.7.4z" fill="#5F6368" />
    <path d="M39.5 19.9c-.6 0-1.1-.2-1.5-.5l.1-.9.1.1c.3.3.8.5 1.2.5.5 0 .8-.2.8-.5 0-.3-.2-.4-.7-.6l-.3-.1c-.7-.2-1.2-.6-1.2-1.3 0-.7.6-1.3 1.5-1.3.5 0 1 .2 1.3.4l-.4.7c-.3-.2-.6-.3-.9-.3-.4 0-.6.2-.6.4 0 .3.2.4.6.5l.3.1c.8.3 1.3.6 1.3 1.4 0 .8-.6 1.4-1.6 1.4z" fill="#5F6368" />
    <path d="M20.9 16c0-.4-.1-.7-.2-1h-3.1v1.7h1.8c-.1.5-.3.8-.7 1.1-.4.3-.8.4-1.3.4-.5 0-1-.2-1.4-.5-.4-.3-.6-.8-.6-1.4 0-.6.2-1.1.6-1.4.4-.4.9-.5 1.4-.5.5 0 1 .2 1.3.5l.8-.8c-.5-.5-1.2-.8-2.1-.8-1 0-1.8.3-2.4.9-.6.6-1 1.4-1 2.3s.3 1.7 1 2.3c.6.6 1.4.9 2.4.9.9 0 1.7-.3 2.3-.9.5-.5.8-1.3.8-2.3 0-.2 0-.4-.1-.5z" fill="#4285F4" />
  </svg>
);

const KlarnaIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" aria-label="Klarna">
    <rect width="48" height="32" rx="4" fill="#FFB3C7" />
    <path
      d="M10 11h3.2v10H10V11zm14.6 0h-3c0 2.2-.9 4.2-2.4 5.6l-.8.7 3.5 4.7h3.8l-3.2-4.2c1.4-1.8 2.1-4 2.1-6.3v-.5zm-6.6 0h3v10h-3V11zm12 8c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm6.5-8h3v10h-3V11z"
      fill="#0A0B09"
    />
  </svg>
);

const SepaIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" aria-label="SEPA">
    <rect width="48" height="32" rx="4" fill="#004494" />
    <text x="24" y="18" fill="#FFCC00" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">
      SEPA
    </text>
    <circle cx="10" cy="16" r="4" fill="none" stroke="#FFCC00" strokeWidth="1" />
    <path d="M8 16h4M10 14v4" stroke="#FFCC00" strokeWidth="1" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 48 32" className="w-12 h-8" aria-label="Link by Stripe">
    <rect width="48" height="32" rx="4" fill="#00D66F" />
    <path
      d="M18 12h4l2 8-2-1-4-7zm8 0h4l-4 8-4-8h4z"
      fill="#fff"
    />
  </svg>
);

interface PaymentMethodsProps {
  variant?: 'inline' | 'grid' | 'compact';
  showLabels?: boolean;
  showKlarnaBadge?: boolean;
  className?: string;
}

const paymentMethods = [
  { id: 'visa', name: 'Visa', Icon: VisaIcon },
  { id: 'mastercard', name: 'Mastercard', Icon: MastercardIcon },
  { id: 'amex', name: 'American Express', Icon: AmexIcon },
  { id: 'paypal', name: 'PayPal', Icon: PayPalIcon },
  { id: 'applepay', name: 'Apple Pay', Icon: ApplePayIcon },
  { id: 'googlepay', name: 'Google Pay', Icon: GooglePayIcon },
  { id: 'klarna', name: 'Klarna', Icon: KlarnaIcon },
  { id: 'sepa', name: 'SEPA', Icon: SepaIcon },
  { id: 'link', name: 'Link', Icon: LinkIcon },
];

export default function PaymentMethods({
  variant = 'inline',
  showLabels = false,
  showKlarnaBadge = false,
  className = '',
}: PaymentMethodsProps) {
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null);

  if (variant === 'compact') {
    // Show only main methods
    const compactMethods = paymentMethods.filter(m => 
      ['visa', 'mastercard', 'paypal', 'applepay', 'googlepay'].includes(m.id)
    );

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {compactMethods.map(({ id, name, Icon }) => (
          <div
            key={id}
            className="opacity-70 hover:opacity-100 transition-opacity"
            title={name}
          >
            <Icon />
          </div>
        ))}
        <span className="text-xs text-brand-gray ml-1">e altri</span>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`space-y-4 ${className}`}>
        {showKlarnaBadge && (
          <div className="bg-gradient-to-r from-pink-100 to-pink-50 border-2 border-pink-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <KlarnaIcon />
              <div>
                <p className="font-bold text-brand-dark">Paga in 3 rate con Klarna</p>
                <p className="text-sm text-brand-gray">Senza interessi • Decisione immediata</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {paymentMethods.map(({ id, name, Icon }) => (
            <div
              key={id}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                hoveredMethod === id
                  ? 'bg-gray-100 scale-105'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onMouseEnter={() => setHoveredMethod(id)}
              onMouseLeave={() => setHoveredMethod(null)}
            >
              <Icon />
              {showLabels && (
                <span className="text-xs text-brand-gray text-center">{name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: inline variant
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {paymentMethods.map(({ id, name, Icon }) => (
        <div
          key={id}
          className="opacity-70 hover:opacity-100 transition-opacity cursor-default"
          title={name}
        >
          <Icon />
        </div>
      ))}
    </div>
  );
}

// Installment Calculator Component
interface InstallmentCalculatorProps {
  amount: number; // in cents
  installments?: number;
  className?: string;
}

export function InstallmentCalculator({
  amount,
  installments = 3,
  className = '',
}: InstallmentCalculatorProps) {
  const installmentAmount = Math.ceil(amount / installments / 100);
  const totalAmount = amount / 100;

  return (
    <div className={`bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <KlarnaIcon />
        <div className="flex-1">
          <p className="font-bold text-brand-dark">
            Paga in {installments} rate da €{installmentAmount}
          </p>
          <p className="text-sm text-brand-gray">
            {installments} × €{installmentAmount} = €{totalAmount} • Senza interessi
          </p>
          <div className="flex items-center gap-2 mt-2">
            {[...Array(installments)].map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-pink-500' : 'bg-pink-200'}`} />
                {i < installments - 1 && (
                  <div className="w-4 h-0.5 bg-pink-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Promo Code Section Component
interface PromoCodeSectionProps {
  className?: string;
}

export function PromoCodeSection({ className = '' }: PromoCodeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const promoCodes = [
    { code: 'EARLYBIRD', description: '10% di sconto', type: 'Prenotazione anticipata' },
    { code: 'FRATELLI', description: '15% di sconto', type: 'Per fratelli/sorelle' },
    { code: 'AMICI2025', description: '€50 di sconto', type: 'Porta un amico' },
  ];

  return (
    <div className={`border-2 border-dashed border-gray-200 rounded-xl overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-brand-dark">
          <span>🏷️</span>
          Hai un codice sconto?
        </span>
        <svg
          className={`w-5 h-5 text-brand-gray transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          <p className="text-sm text-brand-gray">
            I codici promozionali vengono applicati nella pagina di pagamento Stripe.
            Ecco alcuni codici disponibili:
          </p>
          
          <div className="space-y-2">
            {promoCodes.map((promo) => (
              <div
                key={promo.code}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div>
                  <code className="font-mono font-bold text-brand-green">{promo.code}</code>
                  <p className="text-xs text-brand-gray">{promo.type}</p>
                </div>
                <span className="text-sm font-semibold text-brand-orange">{promo.description}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-brand-gray italic">
            💡 Inserisci il codice nella schermata di checkout per applicare lo sconto.
          </p>
        </div>
      )}
    </div>
  );
}

// Individual payment method icons for external use
export {
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  PayPalIcon,
  ApplePayIcon,
  GooglePayIcon,
  KlarnaIcon,
  SepaIcon,
  LinkIcon,
};