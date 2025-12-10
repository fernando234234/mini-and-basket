"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie-consent";

type ConsentStatus = "accepted" | "declined" | null;

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus;
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
        setIsAnimating(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsAnimating(false);
    setTimeout(() => setShowBanner(false), 300);

    // Enable analytics if configured
    if (typeof window !== "undefined" && (window as unknown as { gtag?: (cmd: string, action: string, params: Record<string, boolean>) => void }).gtag) {
      (window as unknown as { gtag: (cmd: string, action: string, params: Record<string, boolean>) => void }).gtag("consent", "update", {
        analytics_storage: true,
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsAnimating(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-300 ${
        isAnimating ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Cookie Icon */}
            <div className="hidden md:flex items-center justify-center w-16 h-16 bg-brand-orange/10 rounded-2xl flex-shrink-0">
              <span className="text-4xl">🍪</span>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h3 className="font-bold text-brand-dark text-lg mb-2 flex items-center gap-2">
                <span className="md:hidden">🍪</span>
                Utilizziamo i Cookie
              </h3>
              <p className="text-brand-gray text-sm leading-relaxed">
                Questo sito utilizza cookie tecnici necessari per il funzionamento e cookie
                analitici per migliorare la tua esperienza. I cookie analitici ci aiutano a
                capire come utilizzi il nostro sito. Puoi accettare tutti i cookie o
                rifiutare quelli non essenziali.{" "}
                <Link
                  href="/privacy"
                  className="text-brand-green hover:underline font-medium"
                >
                  Leggi la nostra Privacy Policy
                </Link>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              <button
                onClick={handleDecline}
                className="px-6 py-3 rounded-full font-semibold text-brand-gray border-2 border-gray-200 hover:border-brand-dark hover:text-brand-dark transition-all duration-300 order-2 sm:order-1"
              >
                Rifiuta
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-brand-green to-emerald-500 hover:shadow-lg hover:scale-105 transition-all duration-300 order-1 sm:order-2"
              >
                Accetta Tutti
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-4 text-xs text-brand-gray">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-green rounded-full"></span>
                <span>Cookie tecnici: sempre attivi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-orange rounded-full"></span>
                <span>Cookie analitici: opzionali</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span>Cookie di marketing: non utilizzati</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper hook to check cookie consent
export function useCookieConsent(): ConsentStatus {
  const [consent, setConsent] = useState<ConsentStatus>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus;
    setConsent(stored);
  }, []);

  return consent;
}