"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function InfoBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      value: "100+",
      label: "CAMPERS",
      tooltip: "Unisciti a 100+ partecipanti soddisfatti ogni anno!",
      href: "#testimonials",
      delay: "0ms",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      value: "10+",
      label: "COACHES",
      tooltip: "Staff qualificato con esperienza professionale",
      href: "/staff",
      delay: "100ms",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      value: "29 GIU",
      label: "6 LUGLIO 2025",
      tooltip: "Una settimana di sport, divertimento e nuove amicizie",
      href: "/programma",
      delay: "200ms",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: "✓",
      label: "TUTTO INCLUSO",
      tooltip: "Alloggio • Pasti • Kit Camp • Assicurazione • Attività",
      href: null,
      delay: "300ms",
      expandable: true,
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: "DAL",
      label: "2015",
      tooltip: "10 anni di esperienza e passione per il basket giovanile",
      href: null,
      delay: "400ms",
    },
  ];

  const StatContent = ({ stat, index }: { stat: typeof stats[0]; index: number }) => (
    <div
      className={`group relative flex flex-col items-center text-center text-white transition-all duration-700 transform cursor-pointer ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: stat.delay }}
      onMouseEnter={() => setActiveTooltip(index)}
      onMouseLeave={() => setActiveTooltip(null)}
      onClick={() => setActiveTooltip(activeTooltip === index ? null : index)}
    >
      {/* Tooltip */}
      <div className={`absolute -top-16 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ${
        activeTooltip === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}>
        <div className="bg-brand-dark text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl whitespace-nowrap max-w-[200px] text-center">
          {stat.tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-brand-dark" />
        </div>
      </div>

      {/* Card Container */}
      <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300 w-full">
        {/* Icon Container */}
        <div className="relative mb-2 flex justify-center">
          <div className="relative bg-white/10 p-3 rounded-xl group-hover:bg-white/20 group-hover:rotate-6 transition-all duration-300">
            {stat.icon}
          </div>
        </div>

        {/* Value */}
        <div className="text-2xl md:text-3xl font-black tracking-tight group-hover:scale-105 transition-transform duration-300">
          {stat.value}
        </div>

        {/* Label */}
        <div className="text-xs font-semibold text-white/70 uppercase tracking-wider mt-1">
          {stat.label}
        </div>

        {/* Click indicator for mobile */}
        {stat.href && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-visible">
      {/* Main Container with Complex Gradient */}
      <div className="relative rounded-3xl overflow-visible">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-emerald-500 to-brand-green rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 via-transparent to-brand-orange/20 rounded-3xl" />
        
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 rounded-3xl overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Basketball Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="3" />
            <path d="M50 5 L50 95" stroke="white" strokeWidth="2" />
            <path d="M5 50 L95 50" stroke="white" strokeWidth="2" />
            <path d="M50 5 C70 25 70 75 50 95" fill="none" stroke="white" strokeWidth="2" />
            <path d="M50 5 C30 25 30 75 50 95" fill="none" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10 transform -translate-x-6 translate-y-6">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="3" />
            <path d="M50 5 L50 95" stroke="white" strokeWidth="2" />
            <path d="M5 50 L95 50" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative px-4 py-6 md:px-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {stats.map((stat, index) => (
              stat.href ? (
                <Link key={index} href={stat.href} className="contents">
                  <StatContent stat={stat} index={index} />
                </Link>
              ) : (
                <StatContent key={index} stat={stat} index={index} />
              )
            ))}
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-b-3xl" />
      </div>

      {/* Shadow Effect */}
      <div className="absolute -bottom-4 left-8 right-8 h-8 bg-gradient-to-b from-brand-green/20 to-transparent blur-xl" />
    </section>
  );
}