"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80",
      alt: "Basketball court action"
    },
    {
      image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=1200&q=80",
      alt: "Kids playing basketball"
    },
    {
      image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=1200&q=80",
      alt: "Basketball on court"
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <header className="relative rounded-3xl overflow-hidden text-white min-h-[500px] md:min-h-[550px]">
      {/* Background Carousel with Parallax Effect */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-out ${
              currentSlide === index 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
          >
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
          </div>
        ))}
      </div>

      {/* Gradient Overlays - Multiple Layers for Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-brand-dark/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green/20 via-transparent to-brand-orange/20" />
      
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
        <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-brand-orange rounded-full animate-float-delayed opacity-50" />
      </div>

      {/* Carousel Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 group"
        aria-label="Previous slide"
      >
        <svg
          className="h-6 w-6 text-white group-hover:text-brand-orange transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 group"
        aria-label="Next slide"
      >
        <svg
          className="h-6 w-6 text-white group-hover:text-brand-orange transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "w-8 h-3 bg-brand-orange"
                : "w-3 h-3 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 min-h-[500px] md:min-h-[550px] transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
          <span className="text-sm font-medium">Iscrizioni Aperte 2025</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight">
          <span className="block text-white drop-shadow-lg">Mini & Basket</span>
          <span className="block bg-gradient-to-r from-brand-orange via-yellow-400 to-brand-orange bg-clip-text text-transparent animate-gradient">
            Camp 2025
          </span>
        </h1>

        {/* Subtitle */}
        <div className="mt-6 flex items-center gap-4 text-lg md:text-xl text-gray-200">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-white/50" />
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            29 Giugno - 6 Luglio 2025
          </span>
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-white/50" />
        </div>

        {/* Location Tag */}
        <div className="mt-3 flex items-center gap-2 text-gray-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Villaggio Residence Bahja****, Paola (CS)</span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/iscrizione"
            className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-green to-emerald-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-brand-green/50 hover:shadow-2xl hover:scale-105 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              <span>ISCRIVITI ORA</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <Link
            href="#experience"
            className="group relative inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/50 text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-brand-dark transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>SCOPRI DI PIÙ</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12">
          {[
            { value: "100+", label: "Partecipanti" },
            { value: "7", label: "Giorni" },
            { value: "15+", label: "Coach" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-brand-orange">{stat.value}</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-brand-beige">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>
    </header>
  );
}