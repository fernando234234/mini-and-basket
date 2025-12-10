"use client";

import { useEffect, useState } from "react";

// Basketball SVG Component
export function BasketballIcon({ className = "", animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg 
      className={`${className} ${animate ? 'animate-spin-slow' : ''}`} 
      viewBox="0 0 100 100" 
      fill="none"
    >
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" />
      <path d="M50 5 L50 95" stroke="currentColor" strokeWidth="2" />
      <path d="M5 50 L95 50" stroke="currentColor" strokeWidth="2" />
      <path d="M50 5 C70 25 70 75 50 95" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M50 5 C30 25 30 75 50 95" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Floating Basketball Elements
export function FloatingBasketballs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-[10%] w-16 h-16 text-brand-orange/10 animate-float">
        <BasketballIcon className="w-full h-full" />
      </div>
      <div className="absolute top-1/3 right-[15%] w-12 h-12 text-brand-green/10 animate-float-delayed">
        <BasketballIcon className="w-full h-full" />
      </div>
      <div className="absolute bottom-1/4 left-[20%] w-8 h-8 text-brand-orange/10 animate-float">
        <BasketballIcon className="w-full h-full" />
      </div>
      <div className="absolute bottom-1/3 right-[10%] w-20 h-20 text-brand-green/10 animate-float-delayed">
        <BasketballIcon className="w-full h-full" />
      </div>
    </div>
  );
}

// Court Lines Pattern
export function CourtLines({ className = "" }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="none" viewBox="0 0 400 300">
      <defs>
        <pattern id="courtPattern" patternUnits="userSpaceOnUse" width="100" height="100">
          <rect width="100" height="100" fill="none" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#courtPattern)" />
    </svg>
  );
}

// Animated Particles
export function AnimatedParticles({ count = 20, color = "brand-orange" }: { count?: number; color?: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full bg-${color} opacity-20 animate-float`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Section Divider with Basketball
export function SectionDivider({ variant = "default" }: { variant?: "default" | "wave" | "angled" }) {
  if (variant === "wave") {
    return (
      <div className="relative h-24 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          className="absolute bottom-0 w-full h-full fill-brand-beige"
          preserveAspectRatio="none"
        >
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>
    );
  }

  if (variant === "angled") {
    return (
      <div className="relative h-16 overflow-hidden">
        <svg
          viewBox="0 0 1440 100"
          className="absolute bottom-0 w-full h-full fill-brand-beige"
          preserveAspectRatio="none"
        >
          <polygon points="0,100 1440,100 1440,0" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <span className="w-16 h-1 bg-gradient-to-r from-transparent to-brand-green rounded-full" />
      <div className="mx-4 w-8 h-8 text-brand-orange">
        <BasketballIcon className="w-full h-full animate-spin-slow" />
      </div>
      <span className="w-16 h-1 bg-gradient-to-l from-transparent to-brand-green rounded-full" />
    </div>
  );
}

// Decorative Circles
export function DecorativeCircles({ position = "left" }: { position?: "left" | "right" | "both" }) {
  return (
    <>
      {(position === "left" || position === "both") && (
        <div className="absolute -left-20 top-1/4 w-40 h-40 rounded-full border-4 border-brand-green/10 pointer-events-none" />
      )}
      {(position === "left" || position === "both") && (
        <div className="absolute -left-10 top-1/3 w-20 h-20 rounded-full bg-brand-orange/5 pointer-events-none" />
      )}
      {(position === "right" || position === "both") && (
        <div className="absolute -right-20 bottom-1/4 w-40 h-40 rounded-full border-4 border-brand-orange/10 pointer-events-none" />
      )}
      {(position === "right" || position === "both") && (
        <div className="absolute -right-10 bottom-1/3 w-20 h-20 rounded-full bg-brand-green/5 pointer-events-none" />
      )}
    </>
  );
}

// Trophy/Star Decoration
export function TrophyDecoration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// Net Pattern for Basketball Hoop Effect  
export function NetPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 120" fill="none">
      <ellipse cx="50" cy="10" rx="40" ry="10" stroke="currentColor" strokeWidth="3" />
      <path d="M10 10 L20 60 L30 110" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 10 L35 60 L40 110" stroke="currentColor" strokeWidth="1.5" />
      <path d="M50 10 L50 60 L50 110" stroke="currentColor" strokeWidth="1.5" />
      <path d="M70 10 L65 60 L60 110" stroke="currentColor" strokeWidth="1.5" />
      <path d="M90 10 L80 60 L70 110" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 35 L85 35" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M20 60 L80 60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M30 85 L70 85" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}

// Animated Stats Counter
export function AnimatedCounter({ 
  value, 
  suffix = "", 
  prefix = "",
  duration = 2000 
}: { 
  value: number; 
  suffix?: string; 
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  );
}

// Export default component that combines decorations
export default function DecorativeBackground({ 
  variant = "default",
  intensity = "normal" 
}: { 
  variant?: "default" | "basketball" | "court" | "minimal";
  intensity?: "light" | "normal" | "strong";
}) {
  const opacityClass = intensity === "light" ? "opacity-30" : intensity === "strong" ? "opacity-70" : "opacity-50";

  if (variant === "basketball") {
    return (
      <div className={`absolute inset-0 pointer-events-none ${opacityClass}`}>
        <FloatingBasketballs />
      </div>
    );
  }

  if (variant === "court") {
    return (
      <div className={`absolute inset-0 pointer-events-none ${opacityClass}`}>
        <CourtLines className="text-brand-green" />
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`absolute inset-0 pointer-events-none ${opacityClass}`}>
        <DecorativeCircles position="both" />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${opacityClass}`}>
      <FloatingBasketballs />
      <DecorativeCircles position="both" />
    </div>
  );
}