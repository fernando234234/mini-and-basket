"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/programma", label: "Programma" },
    { href: "/staff", label: "Staff" },
    { href: "/galleria", label: "Galleria" },
    { href: "/faq", label: "FAQ" },
    { href: "/contatti", label: "Contatti" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Basketball Logo SVG
  const BasketballLogo = () => (
    <svg viewBox="0 0 40 40" className="w-9 h-9 group-hover:rotate-[360deg] transition-transform duration-700">
      <circle cx="20" cy="20" r="18" className="fill-brand-orange" />
      <path d="M20 2 L20 38" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <path d="M2 20 L38 20" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <path d="M20 2 C30 10 30 30 20 38" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <path d="M20 2 C10 10 10 30 20 38" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <circle cx="20" cy="20" r="18" fill="none" className="stroke-brand-orange-dark" strokeWidth="2" />
    </svg>
  );

  return (
    <>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-brand-orange via-orange-500 to-brand-orange text-white relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 animate-pulse" style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
            }} />
          </div>
          
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-2.5 flex items-center justify-center relative">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="animate-bounce">🏀</span>
              <span className="hidden sm:inline">Iscrizioni Aperte per l&apos;Edizione 2025</span>
              <span className="sm:hidden">Edizione 2025</span>
              <span className="hidden md:inline mx-2">—</span>
              <span className="hidden md:inline font-bold bg-white/20 px-2 py-0.5 rounded-full text-xs">29 Giugno - 6 Luglio</span>
              <Link
                href="/iscrizione"
                className="ml-2 bg-white text-brand-orange font-bold text-xs px-3 py-1 rounded-full hover:bg-brand-dark hover:text-white transition-colors"
              >
                Prenota Ora →
              </Link>
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Chiudi annuncio"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'shadow-lg bg-white/95 backdrop-blur-md'
          : 'shadow-subtle'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <BasketballLogo />
              <div className="flex flex-col">
                <span className="text-lg font-extrabold leading-tight text-brand-dark group-hover:text-brand-green transition-colors">
                  Mini & Basket
                </span>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                  Camp 2025
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-semibold transition-all duration-300 py-2 px-4 rounded-xl group ${
                    isActive(link.href)
                      ? "text-brand-green bg-brand-green/5"
                      : "text-brand-gray hover:text-brand-green hover:bg-gray-50"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Animated underline on hover */}
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-brand-green to-brand-orange rounded-full transform origin-left transition-transform duration-300 ${
                    isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              {/* Limited spots badge */}
              <span className="text-xs font-semibold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full animate-pulse">
                Posti Limitati
              </span>
              <Link
                href="/iscrizione"
                className={`relative overflow-hidden font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md group ${
                  pathname === "/iscrizione"
                    ? "bg-brand-orange text-white hover:bg-brand-orange-dark"
                    : "bg-gradient-to-r from-brand-green to-emerald-500 text-white hover:shadow-xl hover:scale-105"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Iscriviti Ora
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </Link>
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-brand-dark hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-[500px] pb-4' : 'max-h-0'
          }`}>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-semibold transition-all duration-200 py-3 px-4 rounded-xl flex items-center gap-3 ${
                      isActive(link.href)
                        ? "text-brand-green bg-brand-green/10"
                        : "text-brand-gray hover:text-brand-green hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {isActive(link.href) && (
                      <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                    )}
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-gray-100 space-y-3">
                  <div className="flex justify-center">
                    <span className="text-xs font-semibold text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-full">
                      🏀 Posti Limitati - Prenota Ora
                    </span>
                  </div>
                  <Link
                    href="/iscrizione"
                    className={`block text-center font-bold py-3.5 px-6 rounded-full transition-all duration-300 shadow-md ${
                      pathname === "/iscrizione"
                        ? "bg-brand-orange text-white"
                        : "bg-gradient-to-r from-brand-green to-emerald-500 text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iscriviti Ora →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}