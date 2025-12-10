"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FinalCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    // Countdown to camp start (June 29, 2025)
    const targetDate = new Date("2025-06-29T00:00:00");
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative my-8 mx-4 md:mx-8 overflow-hidden">
      {/* Background with Multiple Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-emerald-600 to-brand-green-dark rounded-3xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 via-transparent to-brand-orange/20 rounded-3xl" />
      
      {/* Animated Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="ctaGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#ctaGrid)" />
        </svg>
      </div>

      {/* Floating Basketball Elements */}
      <div className="absolute top-8 left-8 w-24 h-24 opacity-10 animate-float">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="3" />
          <path d="M50 5 L50 95 M5 50 L95 50" stroke="white" strokeWidth="2" />
          <path d="M50 5 C70 25 70 75 50 95" fill="none" stroke="white" strokeWidth="2" />
          <path d="M50 5 C30 25 30 75 50 95" fill="none" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 w-32 h-32 opacity-10 animate-float-delayed">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="3" />
          <path d="M50 5 L50 95 M5 50 L95 50" stroke="white" strokeWidth="2" />
          <path d="M50 5 C70 25 70 75 50 95" fill="none" stroke="white" strokeWidth="2" />
          <path d="M50 5 C30 25 30 75 50 95" fill="none" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      {/* Lightning Bolts */}
      <div className="absolute top-4 left-1/4 text-white/10 animate-pulse">
        <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-1/4 text-white/10 animate-pulse" style={{ animationDelay: "1s" }}>
        <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 text-white text-center py-16 px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Urgency Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-sm font-semibold">Posti Limitati - Solo 100 disponibili!</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          Non Perdere
          <span className="block text-brand-orange">L&apos;Opportunità!</span>
        </h2>

        {/* Countdown Timer */}
        <div className="mt-8 flex justify-center gap-4 md:gap-8">
          {[
            { value: countdown.days, label: "Giorni" },
            { value: countdown.hours, label: "Ore" },
            { value: countdown.minutes, label: "Minuti" },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <span className="text-2xl md:text-4xl font-black">{item.value}</span>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-orange rounded-full" />
              </div>
              <p className="mt-3 text-xs md:text-sm uppercase tracking-wider text-white/70">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <p className="mt-8 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          Unisciti a noi per un&apos;estate indimenticabile di basket, amicizia e crescita personale.
        </p>

        {/* Features */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8">
          {["✓ Staff Qualificato", "✓ Strutture Premium", "✓ Tutto Incluso"].map((feature, i) => (
            <span key={i} className="text-sm text-white/80">{feature}</span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/iscrizione"
            className="group relative inline-flex items-center justify-center gap-2 bg-white text-brand-green font-bold py-4 px-10 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:scale-105 overflow-hidden"
          >
            <span className="absolute inset-0 bg-brand-orange translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
              <span>ISCRIVITI ORA</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <Link
            href="/contatti"
            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/50 text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>CONTATTACI</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {[
            { icon: "🔒", text: "Pagamento Sicuro" },
            { icon: "💯", text: "Soddisfatti o Rimborsati" },
            { icon: "📞", text: "Supporto 24/7" },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-white/70">
              <span className="text-lg">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full fill-brand-beige" preserveAspectRatio="none">
          <path d="M0,40 C480,80 960,0 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}