import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import RegistrationWizard from "@/components/RegistrationWizard";
import PaymentInfo from "@/components/PaymentInfo";

export const metadata: Metadata = {
  title: "Iscrizione | Mini & Basket Camp 2025",
  description: "Iscriviti al Mini & Basket Camp 2025. Compila il modulo di iscrizione e assicura un posto al tuo giovane atleta.",
};

export default function IscrizionePage() {
  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        <main className="p-4 md:p-8">
          <PageHero
            title="ISCRIZIONE"
            subtitle="Assicura un posto al tuo giovane atleta per un'estate indimenticabile"
            badge="📝 Iscriviti Ora"
            backgroundImage="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80"
            gradient="orange"
          />

          {/* Registration Section */}
          <section className="mt-12 mb-16">
            {/* Info Banner */}
            <div className="bg-gradient-to-r from-brand-green/10 to-brand-orange/10 rounded-2xl p-6 mb-10 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🏀</span>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="font-bold text-brand-dark text-lg">
                    Mini & Basket Camp 2025
                  </h3>
                  <p className="text-brand-gray">
                    29 Giugno - 6 Luglio 2025 • Villaggio Residence Bahja, Paola (CS)
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-orange">100+</div>
                    <div className="text-xs text-brand-gray">Posti</div>
                  </div>
                  <div className="w-px h-10 bg-gray-300" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-green">8</div>
                    <div className="text-xs text-brand-gray">Giorni</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="max-w-4xl mx-auto mb-10">
              <PaymentInfo />
            </div>

            {/* Registration Wizard */}
            <RegistrationWizard />

            {/* Trust Badges */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-brand-green/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-brand-dark text-sm">Sicuro</h4>
                  <p className="text-xs text-brand-gray mt-1">Pagamenti criptati</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-brand-orange/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-brand-dark text-sm">Flessibile</h4>
                  <p className="text-xs text-brand-gray mt-1">Rate disponibili</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-brand-dark text-sm">Rimborsabile</h4>
                  <p className="text-xs text-brand-gray mt-1">Fino a 30gg prima</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-brand-dark text-sm">Supporto</h4>
                  <p className="text-xs text-brand-gray mt-1">Assistenza 24/7</p>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-brand-green to-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-bold text-brand-dark text-lg">
                    Hai bisogno di aiuto con l&apos;iscrizione?
                  </h3>
                  <p className="text-brand-gray text-sm">
                    Il nostro team è disponibile per assisterti in ogni fase del processo
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+393398775790"
                    className="inline-flex items-center justify-center gap-2 border-2 border-brand-green text-brand-green font-bold py-2 px-6 rounded-full hover:bg-brand-green hover:text-white transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Chiamaci
                  </a>
                  <a
                    href="mailto:info@miniandbasketcamp.it"
                    className="inline-flex items-center justify-center gap-2 bg-brand-green text-white font-bold py-2 px-6 rounded-full hover:bg-brand-green-dark transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Scrivici
                  </a>
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