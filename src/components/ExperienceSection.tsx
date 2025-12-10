"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ExperienceSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Sicurezza Garantita",
      description: "Staff qualificato e protocolli rigorosi"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Crescita Personale",
      description: "Sviluppo tecnico e caratteriale"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Amicizie Durature",
      description: "Connessioni che vanno oltre il camp"
    },
  ];

  return (
    <section aria-labelledby="experience-heading" id="experience" className="relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl" />

      <div className="relative grid md:grid-cols-2 gap-10 items-center">
        {/* Content Side */}
        <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-green/10 to-brand-orange/10 rounded-full">
            <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-brand-dark">Dal 2015 al servizio dei giovani atleti</span>
          </div>

          {/* Heading */}
          <div>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-brand-dark leading-tight"
              id="experience-heading"
            >
              UN&apos;ESPERIENZA
              <span className="block bg-gradient-to-r from-brand-green to-brand-orange bg-clip-text text-transparent">
                INDIMENTICABILE
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-brand-gray text-lg leading-relaxed">
            Mini & Basket Camp offre un ambiente unico per giovani atleti dai 6
            ai 14 anni. Uniamo l&apos;apprendimento tecnico del basket al
            divertimento e allo sviluppo personale, sotto la guida di allenatori
            esperti e certificati.
          </p>

          {/* Features Grid */}
          <div className="grid gap-4 pt-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-subtle hover:shadow-strong transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-green to-emerald-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark">{feature.title}</h3>
                  <p className="text-sm text-brand-gray">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Side */}
        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
          {/* Main Image Container */}
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-brand-green to-brand-orange rounded-3xl transform rotate-3" />
            <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-br from-brand-orange to-brand-green rounded-3xl transform rotate-1 opacity-50" />
            
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                alt="Coach explaining a drill to a group of young campers."
                className="w-full h-auto object-cover aspect-[4/3]"
                src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80"
                width={600}
                height={450}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              
              {/* Stats Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex justify-around text-center">
                  <div>
                    <div className="text-2xl font-black text-brand-green">10+</div>
                    <div className="text-xs text-brand-gray uppercase">Edizioni</div>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div>
                    <div className="text-2xl font-black text-brand-orange">500+</div>
                    <div className="text-xs text-brand-gray uppercase">Alumni</div>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div>
                    <div className="text-2xl font-black text-brand-green">98%</div>
                    <div className="text-xs text-brand-gray uppercase">Soddisfatti</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-bounce-subtle">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-brand-dark">Top Rated</div>
                <div className="text-xs text-brand-gray">Camp 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}