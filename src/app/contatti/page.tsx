import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contatti | Mini & Basket Camp 2025",
  description: "Contattaci per qualsiasi informazione sul Mini & Basket Camp 2025. Siamo sempre disponibili per rispondere alle tue domande.",
};

export default function ContattiPage() {
  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        <main className="p-4 md:p-8">
          <PageHero
            title="CONTATTI"
            subtitle="Siamo qui per rispondere a tutte le tue domande"
            badge="📞 Contattaci"
            backgroundImage="https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=1200&q=80"
            gradient="green"
          />

          {/* Contact Section */}
          <section className="mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div>
                <div className="mb-6">
                  <span className="inline-block px-4 py-1 bg-brand-green/10 text-brand-green text-sm font-bold rounded-full mb-3">
                    ✉️ Scrivici
                  </span>
                  <h2 className="text-2xl font-bold text-brand-dark">Invia un messaggio</h2>
                  <p className="text-brand-gray mt-2">
                    Compila il form e ti risponderemo il prima possibile
                  </p>
                </div>
                <ContactForm />
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                {/* Info Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
                  <span className="inline-block px-4 py-1 bg-brand-orange/10 text-brand-orange text-sm font-bold rounded-full mb-4">
                    📍 Informazioni
                  </span>
                  <h2 className="text-2xl font-bold text-brand-dark mb-6">
                    Come raggiungerci
                  </h2>

                  <div className="space-y-6">
                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-dark">Indirizzo</h3>
                        <p className="text-brand-gray">
                          Via dello Sport, 15<br />
                          20100 Milano (MI)<br />
                          Italia
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-dark">Telefono</h3>
                        <p className="text-brand-gray">
                          <a href="tel:+390212345678" className="hover:text-brand-orange transition-colors">
                            +39 02 1234567
                          </a>
                        </p>
                        <p className="text-sm text-brand-gray-light">
                          Lun-Ven: 9:00-18:00
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-dark">Email</h3>
                        <p className="text-brand-gray">
                          <a href="mailto:info@miniandbasketcamp.it" className="hover:text-brand-green transition-colors">
                            info@miniandbasketcamp.it
                          </a>
                        </p>
                        <p className="text-sm text-brand-gray-light">
                          Risposta entro 24 ore
                        </p>
                      </div>
                    </div>

                    {/* Office Hours */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-dark">Orari Ufficio</h3>
                        <div className="text-brand-gray text-sm space-y-1">
                          <p>Lunedì - Venerdì: 9:00 - 18:00</p>
                          <p>Sabato: 9:00 - 13:00</p>
                          <p>Domenica: Chiuso</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="relative h-64 bg-gray-200">
                    {/* Map Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-green/20 to-brand-orange/20">
                      <div className="text-center p-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-brand-orange" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                        </div>
                        <p className="text-brand-dark font-semibold">
                          Via dello Sport, 15 - Milano
                        </p>
                        <a
                          href="https://maps.google.com/?q=Via+dello+Sport+15+Milano"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 text-brand-green hover:text-brand-green-dark font-medium text-sm"
                        >
                          Apri in Google Maps
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-gradient-to-br from-brand-dark to-gray-800 rounded-3xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-4">Seguici sui social</h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Resta aggiornato sulle novità e i dietro le quinte del camp
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                    </a>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* FAQ Link */}
                <div className="bg-gradient-to-br from-brand-green/10 to-brand-orange/10 rounded-3xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="text-2xl">❓</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-dark">Hai una domanda frequente?</h3>
                      <p className="text-brand-gray text-sm">
                        Consulta le nostre FAQ per risposte immediate
                      </p>
                    </div>
                    <Link
                      href="/faq"
                      className="flex-shrink-0 bg-white text-brand-green font-bold py-2 px-4 rounded-full hover:bg-brand-green hover:text-white transition-all duration-300 shadow-md"
                    >
                      Vai alle FAQ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}