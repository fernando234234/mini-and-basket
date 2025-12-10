"use client";

import { useState } from "react";
import Image from "next/image";

export default function FacilitiesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);

  const facilities = [
    {
      image: "https://images.unsplash.com/photo-1577416412292-747c6607f055?w=800&q=80",
      alt: "Modern indoor basketball court.",
      label: "PALESTRE ALL'AVANGUARDIA",
      description: "Campi da basket indoor con pavimentazione professionale, illuminazione LED e climatizzazione per il massimo comfort.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: "from-blue-600 to-indigo-700",
      accentColor: "bg-blue-500",
    },
    {
      image: "https://images.unsplash.com/photo-1529926706528-db9e5010cd3e?w=800&q=80",
      alt: "Sunny outdoor sports facilities.",
      label: "STRUTTURE ESTERNE",
      description: "Campi all'aperto, aree verdi per attività ricreative e spazi per allenamenti en plein air.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      gradient: "from-green-500 to-emerald-600",
      accentColor: "bg-green-500",
    },
    {
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
      alt: "Comfortable and colorful relaxation and play area.",
      label: "AREE RELAX E GIOCO",
      description: "Zone dedicate al riposo e al divertimento con giochi da tavolo, console e spazi socializzazione.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-600",
      accentColor: "bg-purple-500",
    },
    {
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      alt: "Healthy and delicious food served in the cafeteria.",
      label: "MENSE DI QUALITÀ",
      description: "Pasti bilanciati preparati da chef esperti con ingredienti freschi e menu adatti ai giovani atleti.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-orange-500 to-red-600",
      accentColor: "bg-orange-500",
    },
  ];

  return (
    <section aria-labelledby="facilities-heading" id="facilities" className="relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <span className="text-sm font-bold text-brand-orange uppercase tracking-widest">Le Nostre Strutture</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-2" id="facilities-heading">
            FACILITIES
          </h2>
        </div>
        <p className="text-brand-gray mt-2 md:mt-0 md:max-w-xs text-sm">
          Strutture moderne e sicure per un&apos;esperienza sportiva di alta qualità
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {facilities.map((facility, index) => (
          <div
            key={index}
            className="group relative rounded-3xl overflow-hidden cursor-pointer transform-gpu transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl will-change-transform"
            style={{
              height: "280px",
              borderRadius: "1.5rem",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              perspective: 1000,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setSelectedFacility(index)}
          >
            {/* Image */}
            <Image
              alt={facility.alt}
              className={`w-full h-full object-cover transition-all duration-700 ${
                hoveredIndex === index ? "scale-110 blur-[2px]" : "scale-100"
              }`}
              src={facility.image}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${facility.gradient} transition-opacity duration-500 ${
              hoveredIndex === index ? "opacity-80" : "opacity-60"
            }`} />

            {/* Decorative Corner */}
            <div className="absolute top-4 right-4">
              <div className={`w-12 h-12 rounded-2xl ${facility.accentColor} bg-opacity-30 backdrop-blur-sm flex items-center justify-center text-white transform transition-all duration-300 ${
                hoveredIndex === index ? "rotate-12 scale-110" : ""
              }`}>
                {facility.icon}
              </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              {/* Label with animated underline */}
              <div className="relative inline-block">
                <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-wide">
                  {facility.label}
                </h3>
                <div className={`h-1 ${facility.accentColor} rounded-full transition-all duration-500 ${
                  hoveredIndex === index ? "w-full" : "w-16"
                }`} />
              </div>

              {/* Description - Slides up on hover */}
              <div className={`overflow-hidden transition-all duration-500 ${
                hoveredIndex === index ? "max-h-24 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
              }`}>
                <p className="text-white/90 text-sm leading-relaxed">
                  {facility.description}
                </p>
              </div>

              {/* CTA Button */}
              <div className={`transition-all duration-500 ${
                hoveredIndex === index ? "opacity-100 translate-y-0 mt-4" : "opacity-0 translate-y-4 mt-0"
              }`}>
                <span className="inline-flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Scopri di più</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Corner Decorations */}
            <div className={`absolute bottom-0 left-0 w-24 h-24 transition-all duration-500 ${
              hoveredIndex === index ? "opacity-20" : "opacity-0"
            }`}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="0" cy="100" r="80" fill="none" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedFacility !== null && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFacility(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-fade-in transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative h-56">
              <Image
                src={facilities[selectedFacility].image}
                alt={facilities[selectedFacility].alt}
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${facilities[selectedFacility].gradient} opacity-60`} />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedFacility(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon Badge */}
              <div className="absolute bottom-4 left-4">
                <div className={`w-14 h-14 rounded-2xl ${facilities[selectedFacility].accentColor} flex items-center justify-center text-white shadow-lg`}>
                  {facilities[selectedFacility].icon}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h3 className="text-2xl font-extrabold text-brand-dark mb-2">
                {facilities[selectedFacility].label}
              </h3>
              <div className={`h-1 w-16 ${facilities[selectedFacility].accentColor} rounded-full mb-4`} />
              <p className="text-brand-gray leading-relaxed">
                {facilities[selectedFacility].description}
              </p>

              {/* Features List */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {["Sicurezza", "Pulizia", "Accessibilità", "Comfort"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-brand-gray">
                    <svg className={`w-4 h-4 ${facilities[selectedFacility].accentColor.replace('bg-', 'text-')}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedFacility(null)}
                className={`mt-6 w-full bg-gradient-to-r ${facilities[selectedFacility].gradient} text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}