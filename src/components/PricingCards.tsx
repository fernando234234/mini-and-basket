"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PaymentMethods from "./PaymentMethods";

// Check if early bird pricing applies (before Feb 28, 2025)
const isEarlyBird = () => {
  const now = new Date();
  const earlyBirdDeadline = new Date('2025-02-28T23:59:59');
  return now <= earlyBirdDeadline;
};

export default function PricingCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [earlyBird, setEarlyBird] = useState(true);

  useEffect(() => {
    setEarlyBird(isEarlyBird());
  }, []);

  const pricingPlans = [
    {
      id: "standard",
      title: "CAMP STANDARD",
      subtitle: "7 giorni di Camp",
      price: earlyBird ? "€590" : "€610",
      priceInCents: earlyBird ? 59000 : 61000,
      originalPrice: earlyBird ? "€610" : null,
      deposit: "€200",
      features: [
        { text: "7 giorni di Camp: un'esperienza aggregativa unica", included: true },
        { text: "Soggiorno in pensione completa in villaggio", included: true },
        { text: "Assicurazione", included: true },
        { text: "Assistenza H24", included: true },
        { text: "Kit Mini & Basket Camp", included: true },
      ],
      highlighted: true,
      badge: earlyBird ? "🔥 EARLY BIRD -€20" : "🏀 PIÙ POPOLARE",
      gradient: "from-brand-green to-emerald-600",
      buttonGradient: "from-brand-green to-emerald-600",
      iconBg: "bg-green-100",
      iconColor: "text-brand-green",
    },
    {
      id: "alta_specializzazione",
      title: "ALTA SPECIALIZZAZIONE",
      subtitle: "Camp Premium",
      price: earlyBird ? "€760" : "€800",
      priceInCents: earlyBird ? 76000 : 80000,
      originalPrice: earlyBird ? "€800" : null,
      deposit: "€200",
      features: [
        { text: "Tutto incluso nel Camp Standard", included: true },
        { text: "+7 ore supplementari di tecnica individuale", included: true },
        { text: "Abbigliamento personalizzato", included: true },
        { text: "Lavoro specifico e personalizzato", included: true },
        { text: "Limitato a 30 campers", included: true },
      ],
      highlighted: false,
      badge: "🏆 MAX 30 POSTI",
      gradient: "from-brand-orange to-red-500",
      buttonGradient: "from-brand-orange to-red-500",
      iconBg: "bg-orange-100",
      iconColor: "text-brand-orange",
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

      {/* Early Bird Banner */}
      {earlyBird && (
        <div className="mb-8 bg-gradient-to-r from-brand-orange to-red-500 rounded-2xl p-4 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">⏰</span>
            <span className="font-bold text-lg">EARLY BIRD ATTIVO!</span>
          </div>
          <p className="text-sm text-white/90">
            Iscriviti entro il <strong>28 Febbraio 2025</strong> per risparmiare fino a €40
          </p>
        </div>
      )}

      {/* Section Header */}
      <div className="text-center mb-12 relative">
        <span className="inline-block px-4 py-1 bg-brand-orange/10 text-brand-orange text-sm font-bold rounded-full mb-4">
          💰 Prezzi Trasparenti
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark" id="pricing-heading">
          SCEGLI IL TUO PACCHETTO
        </h2>
        <p className="text-brand-gray mt-3 max-w-md mx-auto">
          Camp 2025: 29 Giugno - 6 Luglio | Villaggio Bahja, Paola (CS)
        </p>
        
        {/* Decorative line */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="w-12 h-1 bg-brand-green rounded-full" />
          <span className="w-3 h-3 bg-brand-orange rounded-full" />
          <span className="w-12 h-1 bg-brand-green rounded-full" />
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch pt-6 max-w-4xl mx-auto">
        {pricingPlans.map((plan, index) => {
          const isHovered = hoveredCard === index;
          const isHighlighted = plan.highlighted;

          return (
            <div
              key={plan.id}
              className={`relative group overflow-visible ${isHighlighted ? "md:-mt-4 md:mb-4" : ""}`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Badge - positioned outside the card for visibility */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap ${earlyBird && plan.highlighted ? 'animate-pulse' : ''}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Highlighted Card Glow Effect */}
              {isHighlighted && (
                <div className={`absolute -inset-1 bg-gradient-to-r ${plan.gradient} rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
              )}

              {/* Card */}
              <div
                className={`relative h-full bg-white rounded-3xl overflow-hidden transition-all duration-500 ${
                  isHighlighted
                    ? "shadow-2xl border-2 border-brand-green"
                    : isHovered
                    ? "shadow-xl border-2 border-brand-orange -translate-y-2"
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
                        <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">EARLY BIRD</span>
                      </div>
                    )}
                    <div className="flex items-end justify-center gap-1">
                      <span className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-sm text-brand-gray mt-2">Acconto: {plan.deposit}</p>
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
                    className={`relative block w-full text-center font-bold py-4 px-8 rounded-2xl transition-all duration-300 overflow-hidden group/btn bg-gradient-to-r ${plan.buttonGradient} text-white shadow-md hover:shadow-lg hover:scale-[1.02]`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>ISCRIVITI ORA</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bus Transfer Add-on */}
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-2xl">
                🚌
              </div>
              <div>
                <h4 className="font-bold text-brand-dark">Servizio Transfer Bus</h4>
                <p className="text-sm text-brand-gray">
                  Napoli e/o provincia ↔ Villaggio (Andata e Ritorno)
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-brand-gray">Costo aggiuntivo</p>
              <p className="font-bold text-blue-600 text-2xl">€60</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-10 max-w-4xl mx-auto bg-gray-50 rounded-2xl p-6">
        <h4 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
          <span>📋</span> Informazioni Importanti
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-brand-green text-lg">💰</span>
            <div>
              <p className="font-semibold text-brand-dark">Acconto</p>
              <p className="text-brand-gray">€200 da versare all&apos;iscrizione</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-brand-orange text-lg">📅</span>
            <div>
              <p className="font-semibold text-brand-dark">Saldo Completo</p>
              <p className="text-brand-gray">Entro il 31 Maggio 2025</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-lg">🏨</span>
            <div>
              <p className="font-semibold text-brand-dark">Tassa di Soggiorno</p>
              <p className="text-brand-gray">€1,50/notte per partecipanti 13+ anni</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-purple-500 text-lg">🏦</span>
            <div>
              <p className="font-semibold text-brand-dark">Bonifico Bancario</p>
              <p className="text-brand-gray">ASD CA75 Basket Casalnuovo<br />IBAN: IT68S0100503401000000000033</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Badges */}
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        {[
          { icon: "🔒", text: "Pagamenti Sicuri" },
          { icon: "🛡️", text: "Assicurazione Inclusa" },
          { icon: "📞", text: "Assistenza H24" },
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