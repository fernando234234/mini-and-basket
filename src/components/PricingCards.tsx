"use client";

import { useState } from "react";
import Link from "next/link";
import PaymentMethods from "./PaymentMethods";

// Klarna icon for installment display
const KlarnaSmallIcon = () => (
  <svg viewBox="0 0 48 32" className="w-8 h-5" aria-label="Klarna">
    <rect width="48" height="32" rx="4" fill="#FFB3C7" />
    <path
      d="M10 11h3.2v10H10V11zm14.6 0h-3c0 2.2-.9 4.2-2.4 5.6l-.8.7 3.5 4.7h3.8l-3.2-4.2c1.4-1.8 2.1-4 2.1-6.3v-.5zm-6.6 0h3v10h-3V11zm12 8c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm6.5-8h3v10h-3V11z"
      fill="#0A0B09"
    />
  </svg>
);

export default function PricingCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const pricingPlans = [
    {
      title: "PACCHETTO GIORNALIERO",
      subtitle: "Prova l'esperienza",
      price: "€250",
      priceInCents: 25000,
      originalPrice: null,
      perDay: "€35/giorno",
      installment: "3 × €84",
      features: [
        { text: "Alloggio Incluso", included: true },
        { text: "3 Pasti al Giorno", included: true },
        { text: "Kit Camp Esclusivo", included: true },
        { text: "Foto e Video", included: false },
        { text: "Certificato Partecipazione", included: false },
      ],
      highlighted: false,
      badge: null,
      gradient: "from-slate-600 to-slate-800",
      buttonGradient: "from-slate-600 to-slate-700",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
    {
      title: "SETTIMANA COMPLETA",
      subtitle: "L'esperienza completa",
      price: "€450",
      priceInCents: 45000,
      originalPrice: "€550",
      perDay: "€56/giorno",
      installment: "3 × €150",
      features: [
        { text: "Alloggio Incluso", included: true },
        { text: "3 Pasti al Giorno", included: true },
        { text: "Kit Camp Esclusivo", included: true },
        { text: "Foto e Video", included: true },
        { text: "Certificato Partecipazione", included: true },
      ],
      highlighted: true,
      badge: "🔥 PIÙ POPOLARE",
      gradient: "from-brand-orange to-red-500",
      buttonGradient: "from-brand-orange to-red-500",
      iconBg: "bg-orange-100",
      iconColor: "text-brand-orange",
    },
    {
      title: "PACCHETTO WEEKEND",
      subtitle: "Avventura breve",
      price: "€150",
      priceInCents: 15000,
      originalPrice: null,
      perDay: "€75/giorno",
      installment: "3 × €50",
      features: [
        { text: "Alloggio Incluso", included: true },
        { text: "3 Pasti al Giorno", included: true },
        { text: "Kit Camp Esclusivo", included: false },
        { text: "Foto e Video", included: false },
        { text: "Certificato Partecipazione", included: false },
      ],
      highlighted: false,
      badge: null,
      gradient: "from-brand-green to-emerald-600",
      buttonGradient: "from-brand-green to-emerald-600",
      iconBg: "bg-green-100",
      iconColor: "text-brand-green",
    },
  ];

  return (
    <section
      aria-labelledby="pricing-heading"
      className="relative"
      id="pricing"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-orange/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-brand-green/5 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="text-center mb-12 relative">
        <span className="inline-block px-4 py-1 bg-brand-orange/10 text-brand-orange text-sm font-bold rounded-full mb-4">
          💰 Prezzi Trasparenti
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark" id="pricing-heading">
          SCEGLI IL TUO PACCHETTO
        </h2>
        <p className="text-brand-gray mt-3 max-w-md mx-auto">
          Trova l&apos;opzione perfetta per vivere un&apos;estate indimenticabile
        </p>
        
        {/* Decorative line */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="w-12 h-1 bg-brand-green rounded-full" />
          <span className="w-3 h-3 bg-brand-orange rounded-full" />
          <span className="w-12 h-1 bg-brand-green rounded-full" />
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-6">
        {pricingPlans.map((plan, index) => {
          const isHovered = hoveredCard === index;
          const isHighlighted = plan.highlighted;

          return (
            <div
              key={index}
              className={`relative group overflow-visible ${isHighlighted ? "md:-mt-4 md:mb-4" : ""}`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Badge - positioned outside the card for visibility */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-orange to-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap animate-pulse">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Highlighted Card Glow Effect */}
              {isHighlighted && (
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange via-red-500 to-brand-orange rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
              )}

              {/* Card */}
              <div
                className={`relative h-full bg-white rounded-3xl overflow-hidden transition-all duration-500 ${
                  isHighlighted
                    ? "shadow-2xl border-2 border-brand-orange"
                    : isHovered
                    ? "shadow-xl border-2 border-brand-green -translate-y-2"
                    : "shadow-lg border border-gray-100"
                }`}
              >
                {/* Top Gradient Bar */}
                <div className={`h-2 bg-gradient-to-r ${plan.gradient}`} />

                {/* Content */}
                <div className={`p-6 ${plan.badge ? 'pt-4' : 'pt-6'}`}>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-brand-gray uppercase tracking-wider mb-1">{plan.subtitle}</p>
                    <h3 className="text-xl font-extrabold text-brand-dark">{plan.title}</h3>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-xl text-gray-400 line-through">{plan.originalPrice}</span>
                        <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">-18%</span>
                      </div>
                    )}
                    <div className="flex items-end justify-center gap-1">
                      <span className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-sm text-brand-gray mt-2">{plan.perDay}</p>
                    
                    {/* Klarna Installment Badge */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 bg-pink-50 text-pink-700 text-xs font-medium px-3 py-1.5 rounded-full">
                      <KlarnaSmallIcon />
                      <span>oppure {plan.installment}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className={`px-4 py-1 text-xs font-semibold ${plan.iconBg} ${plan.iconColor} rounded-full`}>
                        Cosa include
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className={`flex items-center gap-3 ${
                          feature.included ? "text-brand-dark" : "text-gray-300"
                        }`}
                      >
                        {feature.included ? (
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full ${plan.iconBg} ${plan.iconColor} flex items-center justify-center`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        ) : (
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                        <span className={`text-sm ${feature.included ? 'font-medium' : ''}`}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href="/iscrizione"
                    className={`relative block w-full text-center font-bold py-4 px-8 rounded-2xl transition-all duration-300 overflow-hidden group/btn ${
                      isHighlighted
                        ? "bg-gradient-to-r from-brand-orange to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        : "bg-gradient-to-r " + plan.buttonGradient + " text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>ISCRIVITI ORA</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </Link>

                  {/* Extra info for highlighted */}
                  {isHighlighted && (
                    <p className="text-center text-xs text-brand-gray mt-4 flex items-center justify-center gap-1">
                      <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Garanzia soddisfatti o rimborsati
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Klarna Info Banner */}
      <div className="mt-10 bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <KlarnaSmallIcon />
            </div>
            <div>
              <h4 className="font-bold text-brand-dark">Paga in 3 rate senza interessi</h4>
              <p className="text-sm text-brand-gray">
                Con Klarna puoi dividere il pagamento in 3 comode rate mensili
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-brand-gray">Esempio per Settimana Completa</p>
            <p className="font-bold text-pink-600">3 × €150/mese</p>
          </div>
        </div>
      </div>

      {/* Bottom Trust Badges */}
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        {[
          { icon: "🔒", text: "Pagamenti Sicuri" },
          { icon: "💳", text: "Rate con Klarna" },
          { icon: "📞", text: "Supporto 24/7" },
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-brand-gray">
            <span className="text-lg">{badge.icon}</span>
            <span>{badge.text}</span>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="mt-8 text-center">
        <p className="text-sm text-brand-gray mb-3">Metodi di pagamento accettati</p>
        <PaymentMethods variant="compact" className="justify-center" />
      </div>
    </section>
  );
}