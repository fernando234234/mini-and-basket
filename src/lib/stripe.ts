import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn('Stripe publishable key not configured - running in demo mode');
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export const isStripeConfigured = () => {
  return !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
};

// Price configuration for different packages
export const PACKAGE_PRICES = {
  giornaliero: {
    name: 'One Day Camp',
    fullPrice: 25000, // €250 in cents
    depositPrice: 5000, // €50 deposit in cents
    displayPrice: '€250',
    displayDeposit: '€50',
  },
  completa: {
    name: 'Settimana Completa',
    fullPrice: 45000, // €450 in cents
    depositPrice: 15000, // €150 deposit in cents
    displayPrice: '€450',
    displayDeposit: '€150',
  },
  weekend: {
    name: 'Solo Weekend',
    fullPrice: 15000, // €150 in cents
    depositPrice: 5000, // €50 deposit in cents
    displayPrice: '€150',
    displayDeposit: '€50',
  },
} as const;

export type PackageType = keyof typeof PACKAGE_PRICES;