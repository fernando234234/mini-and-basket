import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export async function getStripe(): Promise<Stripe | null> {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    console.warn('Stripe publishable key not configured - running in demo mode');
    return null;
  }
  
  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

export const isStripeConfigured = () => {
  return !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
};

// Check if early bird pricing applies (before Feb 28, 2026)
export const isEarlyBird = () => {
  const now = new Date();
  const earlyBirdDeadline = new Date('2026-02-28T23:59:59');
  return now <= earlyBirdDeadline;
};

// Early bird deadline for display
export const EARLY_BIRD_DEADLINE = '28 febbraio 2026';

// Price configuration for different packages
// Prices in cents for Stripe
export const PACKAGE_PRICES = {
  standard: {
    name: 'Camp Standard 2026',
    fullPrice: 61000, // €610 in cents
    earlyBirdPrice: 59000, // €590 early bird
    depositPrice: 20000, // €200 deposit in cents
    displayPrice: '€610',
    displayEarlyBird: '€590',
    displayDeposit: '€200',
  },
  alta_specializzazione: {
    name: 'Alta Specializzazione 2026',
    fullPrice: 80000, // €800 in cents
    earlyBirdPrice: 76000, // €760 early bird
    depositPrice: 20000, // €200 deposit in cents
    displayPrice: '€800',
    displayEarlyBird: '€760',
    displayDeposit: '€200',
    maxSpots: 20, // Only 20 campers
  },
} as const;

// Add-on prices
export const ADDON_PRICES = {
  bus_transfer: {
    name: 'Transfer Bus Napoli A/R',
    price: 6000, // €60 in cents
    displayPrice: '€60',
  },
} as const;

// Get the current price based on early bird status
export const getCurrentPrice = (packageType: PackageType, paymentType: 'full' | 'deposit'): number => {
  const pkg = PACKAGE_PRICES[packageType];
  if (paymentType === 'deposit') {
    return pkg.depositPrice;
  }
  return isEarlyBird() ? pkg.earlyBirdPrice : pkg.fullPrice;
};

// Get display price based on early bird status
export const getDisplayPrice = (packageType: PackageType): string => {
  const pkg = PACKAGE_PRICES[packageType];
  return isEarlyBird() ? pkg.displayEarlyBird : pkg.displayPrice;
};

export type PackageType = keyof typeof PACKAGE_PRICES;
export type AddonType = keyof typeof ADDON_PRICES;