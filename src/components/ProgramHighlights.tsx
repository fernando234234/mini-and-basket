"use client";

import { useState } from "react";

export default function ProgramHighlights() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const scheduleItems = [
    {
      time: "08:00 - 09:30",
      title: "ACCOGLIENZA E RISCALDAMENTO",
      description: "Arrivo dei partecipanti, attivazione muscolare e preparazione alla giornata sportiva.",
      icon: "🌅",
      color: "from-amber-400 to-orange-500",
      bgLight: "bg-amber-50",
      borderColor: "border-amber-400",
    },
    {
      time: "09:30 - 11:00",
      title: "ALLENAMENTI TECNICI",
      description: "Sessioni intensive focalizzate su fondamentali: palleggio, tiro, passaggio e movimenti senza palla.",
      icon: "🏀",
      color: "from-brand-green to-emerald-600",
      bgLight: "bg-green-50",
      borderColor: "border-green-400",
    },
    {
      time: "11:00 - 11:30",
      title: "PAUSA MERENDA",
      description: "Snack energetico e idratazione per ricaricare le batterie.",
      icon: "🍎",
      color: "from-yellow-400 to-amber-500",
      bgLight: "bg-yellow-50",
      borderColor: "border-yellow-400",
    },
    {
      time: "11:30 - 13:00",
      title: "PARTITE E MINI-TORNEI",
      description: "Competizioni 3vs3 e 5vs5 per mettere in pratica le tecniche apprese.",
      icon: "🏆",
      color: "from-brand-orange to-red-500",
      bgLight: "bg-orange-50",
      borderColor: "border-orange-400",
    },
    {
      time: "13:00 - 14:30",
      title: "PRANZO E RIPOSO",
      description: "Pasto completo bilanciato e tempo libero per socializzare e recuperare.",
      icon: "🍽️",
      color: "from-teal-400 to-cyan-500",
      bgLight: "bg-teal-50",
      borderColor: "border-teal-400",
    },
    {
      time: "14:30 - 16:00",
      title: "ATTIVITÀ RICREATIVE",
      description: "Giochi di squadra, sfide divertenti e attività ludico-sportive alternative.",
      icon: "🎮",
      color: "from-purple-400 to-indigo-500",
      bgLight: "bg-purple-50",
      borderColor: "border-purple-400",
    },
    {
      time: "16:00 - 17:00",
      title: "WORKSHOP E GIOCHI",
      description: "Sessioni speciali con ospiti, video-analisi e approfondimenti tattici.",
      icon: "💡",
      color: "from-pink-400 to-rose-500",
      bgLight: "bg-pink-50",
      borderColor: "border-pink-400",
    },
    {
      time: "17:00",
      title: "FINE GIORNATA",
      description: "Riepilogo della giornata, consegna ai genitori e arrivederci a domani!",
      icon: "👋",
      color: "from-slate-400 to-slate-600",
      bgLight: "bg-slate-50",
      borderColor: "border-slate-400",
    },
  ];

  return (
    <section
      aria-labelledby="program-heading"
      className="relative"
      id="program"
    >
      {/* Section Header */}
      <div className="text-center mb-10 relative">
        <div className="inline-block">
          <span className="text-sm font-bold text-brand-orange uppercase tracking-widest">Programma Giornaliero</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-2" id="program-heading">
            UNA GIORNATA AL CAMP
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="w-12 h-1 bg-brand-green rounded-full" />
            <span className="text-2xl">🏀</span>
            <span className="w-12 h-1 bg-brand-green rounded-full" />
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Central Timeline Line - Desktop */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-green via-brand-orange to-brand-green transform -translate-x-1/2" />

        {/* Mobile Timeline Line */}
        <div className="lg:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-green via-brand-orange to-brand-green" />

        {/* Schedule Items */}
        <div className="space-y-4 lg:space-y-6">
          {scheduleItems.map((item, index) => {
            const isLeft = index % 2 === 0;
            const isHovered = hoveredItem === index;

            return (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Mobile Layout */}
                <div className="lg:hidden flex items-start gap-4 pl-2">
                  {/* Timeline Node */}
                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 ${item.borderColor} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? "scale-110 shadow-lg" : ""}`}>
                    <span className="text-lg">{item.icon}</span>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 ${item.bgLight} rounded-xl p-4 shadow-md border-l-4 ${item.borderColor} transition-all duration-300 ${isHovered ? "shadow-lg -translate-y-1" : ""}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${item.color} text-white`}>
                        {item.time}
                      </span>
                    </div>
                    <h3 className="font-bold text-brand-dark text-sm mb-1">{item.title}</h3>
                    <p className="text-brand-gray text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className={`hidden lg:grid lg:grid-cols-2 lg:gap-8 ${isLeft ? "" : ""}`}>
                  {/* Left Side Content */}
                  <div className={`${isLeft ? "text-right pr-8" : "order-2 text-left pl-8"}`}>
                    <div className={`inline-block ${item.bgLight} rounded-2xl p-5 shadow-md transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-gray-200 ${isHovered ? "shadow-xl -translate-y-1" : ""} ${isLeft ? "text-right" : "text-left"}`}>
                      {/* Time Badge */}
                      <div className={`flex items-center gap-2 mb-3 ${isLeft ? "justify-end" : "justify-start"}`}>
                        <span className="text-2xl">{item.icon}</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${item.color} text-white shadow-sm`}>
                          {item.time}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-brand-dark text-lg mb-2">{item.title}</h3>
                      <p className="text-brand-gray text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Right Side - Empty or Spacer */}
                  <div className={`${isLeft ? "order-2" : ""}`} />

                  {/* Center Dot */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.color} shadow-md transition-all duration-300 ${isHovered ? "scale-150 shadow-lg" : ""}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-10 flex justify-center">
        <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-brand-green/10 to-brand-orange/10 rounded-full border border-brand-green/20">
          <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-brand-dark">Programma flessibile adattato alle esigenze del gruppo</span>
        </div>
      </div>
    </section>
  );
}