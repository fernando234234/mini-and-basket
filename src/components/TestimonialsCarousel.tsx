"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      quote: "Mio figlio è tornato entusiasta! Un'organizzazione impeccabile e un ambiente fantastico. Non vediamo l'ora di iscriverlo di nuovo!",
      name: "Maria R.",
      role: "Mamma di Luca, 10 anni",
      rating: 5,
    },
    {
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      quote: "Mio figlio si è formato non solo come giocatore, ma anche come persona. Un servizio eccezionale che consiglio a tutti i genitori.",
      name: "Paolo F.",
      role: "Papà di Marco, 12 anni",
      rating: 5,
    },
    {
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      quote: "Un'esperienza fantastica! Mia figlia ha fatto nuove amicizie e ha migliorato tantissimo le sue abilità di pallacanestro.",
      name: "Laura B.",
      role: "Mamma di Sofia, 9 anni",
      rating: 5,
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section
      aria-labelledby="testimonials-heading"
      id="testimonials"
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-bold rounded-full mb-3">
          ⭐ Recensioni Verificate
        </span>
        <h2
          className="text-2xl font-extrabold text-brand-dark"
          id="testimonials-heading"
        >
          COSA DICONO DI NOI
        </h2>
        <div className="mt-3 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Background Decoration */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-orange/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand-green/10 rounded-full blur-2xl" />

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-xl border border-gray-100">
          {/* Quote Mark Decoration */}
          <div className="absolute top-4 left-4 text-6xl text-brand-orange/10 font-serif leading-none">
            &ldquo;
          </div>

          {/* Carousel Content */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 p-8 pt-12">
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative mb-6">
                      <div className="absolute -inset-2 bg-gradient-to-br from-brand-green to-brand-orange rounded-full opacity-30 blur-sm" />
                      <Image
                        alt={`Photo of ${testimonial.name}`}
                        className="relative w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        src={testimonial.avatar}
                        width={80}
                        height={80}
                      />
                      {/* Verified Badge */}
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-green rounded-full flex items-center justify-center border-2 border-white shadow">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-brand-gray italic leading-relaxed mb-6 text-lg">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Author Info */}
                    <div>
                      <p className="font-bold text-brand-dark text-lg">{testimonial.name}</p>
                      <p className="text-sm text-brand-orange">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 -left-3 w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-100 group z-10"
          aria-label="Previous testimonial"
        >
          <svg
            className="h-5 w-5 text-gray-400 group-hover:text-brand-orange transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 -right-3 w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-100 group z-10"
          aria-label="Next testimonial"
        >
          <svg
            className="h-5 w-5 text-gray-400 group-hover:text-brand-orange transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index
                ? "w-8 h-3 bg-gradient-to-r from-brand-green to-brand-orange"
                : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Trust Indicator */}
      <div className="mt-6 text-center">
        <p className="text-xs text-brand-gray flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          100+ famiglie soddisfatte
        </p>
      </div>
    </section>
  );
}