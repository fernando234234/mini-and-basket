"use client";

import { useState } from "react";
import Image from "next/image";

export default function PartnersGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const partners = [
    { src: "/images/partners/partners_01.png", alt: "Partner 1", name: "Partner" },
    { src: "/images/partners/partners_06.png", alt: "Partner 2", name: "Partner" },
    { src: "/images/partners/partners_07.png", alt: "Partner 3", name: "Partner" },
    { src: "/images/partners/partners_10.png", alt: "Partner 4", name: "Partner" },
    { src: "/images/partners/partners_15.png", alt: "Partner 5", name: "Partner" },
    { src: "/images/partners/partners_17.png", alt: "Partner 6", name: "Partner" },
    { src: "/images/partners/partners_19.png", alt: "Partner 7", name: "Partner" },
    { src: "/images/partners/partners_20.png", alt: "Partner 8", name: "Partner" },
  ];

  const sponsors = [
    { src: "/images/sponsors/Sponsor_1.webp", alt: "Sponsor 1", name: "Sponsor Principale" },
    { src: "/images/sponsors/Sponsor_2.webp", alt: "Sponsor 2", name: "Sponsor" },
  ];

  return (
    <section aria-labelledby="sponsors-heading" id="sponsors" className="relative">
      {/* Section Header */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 bg-brand-dark/5 text-brand-gray text-xs font-bold rounded-full mb-3">
          🤝 I Nostri Partner
        </span>
        <h2
          className="text-xl font-extrabold text-brand-dark"
          id="sponsors-heading"
        >
          PARTNERS & SPONSORS
        </h2>
      </div>

      {/* Partners Grid */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
        <div className="grid grid-cols-4 gap-3">
          {partners.map((partner, index) => (
            <div
              key={index}
              className={`relative group flex items-center justify-center p-3 rounded-xl bg-white border border-gray-100 transition-all duration-300 cursor-pointer ${
                hoveredIndex === index 
                  ? "shadow-md scale-105 border-brand-green/30" 
                  : "hover:shadow-sm"
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                alt={partner.alt}
                src={partner.src}
                width={80}
                height={40}
                className={`w-full h-auto object-contain transition-all duration-300 ${
                  hoveredIndex === index 
                    ? "grayscale-0 opacity-100" 
                    : "grayscale opacity-50 group-hover:opacity-70"
                }`}
              />
              
              {/* Tooltip */}
              <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-brand-dark text-white text-xs rounded whitespace-nowrap transition-all duration-300 ${
                hoveredIndex === index 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}>
                {partner.name}
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent -z-10" />
      </div>

      {/* Sponsors Section */}
      <div className="mt-8">
        <div className="text-center mb-4">
          <span className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold rounded-full">
            🏆 Main Sponsors
          </span>
        </div>
        <div className="flex justify-center gap-6">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="relative group flex items-center justify-center p-4 rounded-xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Image
                alt={sponsor.alt}
                src={sponsor.src}
                width={120}
                height={60}
                className="w-auto h-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <p className="text-xs text-brand-gray">
          Interessato a una partnership? <a href="/contatti" className="text-brand-green hover:text-brand-green-dark font-semibold transition-colors">Contattaci →</a>
        </p>
      </div>
    </section>
  );
}