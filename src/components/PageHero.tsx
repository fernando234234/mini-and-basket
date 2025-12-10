"use client";

import { useEffect, useState } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  backgroundImage?: string;
  gradient?: "green" | "orange" | "mixed";
}

export default function PageHero({
  title,
  subtitle,
  badge,
  backgroundImage = "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80",
  gradient = "mixed",
}: PageHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const gradientClasses = {
    green: "from-brand-green/90 via-brand-green/70 to-emerald-600/80",
    orange: "from-brand-orange/90 via-brand-orange/70 to-red-500/80",
    mixed: "from-brand-green/80 via-brand-dark/70 to-brand-orange/80",
  };

  return (
    <header className="relative rounded-3xl overflow-hidden text-white min-h-[280px] md:min-h-[350px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      </div>

      {/* Gradient Overlays */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradient]}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Basketball Pattern */}
        <div className="absolute -top-20 -right-20 w-64 h-64 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-white" />
            <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="2" className="text-white" />
            <path d="M50 5 C70 25 70 75 50 95" fill="none" stroke="currentColor" strokeWidth="2" className="text-white" />
            <path d="M50 5 C30 25 30 75 50 95" fill="none" stroke="currentColor" strokeWidth="2" className="text-white" />
          </svg>
        </div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow-reverse">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-orange" />
            <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="2" className="text-brand-orange" />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-brand-orange rounded-full animate-float opacity-60" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-brand-green rounded-full animate-float-delayed opacity-60" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full animate-float opacity-40" />
      </div>

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 md:py-20 min-h-[280px] md:min-h-[350px] transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Badge */}
        {badge && (
          <div className="mb-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            <span className="text-sm font-medium">{badge}</span>
          </div>
        )}

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight">
          <span className="block bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg">
            {title}
          </span>
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
            {subtitle}
          </p>
        )}

        {/* Decorative line */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="w-12 h-1 bg-brand-green rounded-full" />
          <span className="w-3 h-3 bg-brand-orange rounded-full animate-pulse" />
          <span className="w-12 h-1 bg-brand-green rounded-full" />
        </div>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full h-auto fill-brand-beige">
          <path d="M0,32L48,34.7C96,37,192,43,288,40C384,37,480,27,576,24C672,21,768,27,864,32C960,37,1056,43,1152,40C1248,37,1344,27,1392,21.3L1440,16L1440,60L1392,60C1344,60,1248,60,1152,60C1056,60,960,60,864,60C768,60,672,60,576,60C480,60,384,60,288,60C192,60,96,60,48,60L0,60Z" />
        </svg>
      </div>
    </header>
  );
}