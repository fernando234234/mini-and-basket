import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Mini & Basket Camp 2025",
  description: "Informativa sulla privacy e trattamento dei dati personali del Mini & Basket Camp.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        <main className="p-4 md:p-8">
          <PageHero
            title="PRIVACY POLICY"
            subtitle="Informativa sul trattamento dei dati personali"
            badge="🔒 Privacy"
            backgroundImage="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80"
            gradient="green"
          />

          <section className="mt-12 max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">
                Informativa ai sensi del Regolamento Europeo N. 679/2016 (GDPR)
              </h2>
              <p className="text-brand-gray leading-relaxed mb-4">
                La presente informativa viene resa ai sensi dell'art. 13 del Regolamento UE 2016/679 
                (di seguito "GDPR") agli utenti che interagiscono con il sito web www.miniandbasketcamp.it 
                e ai partecipanti al Mini & Basket Camp.
              </p>
            </div>

            {/* Titolare del Trattamento */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold">1</span>
                Titolare del Trattamento
              </h3>
              <p className="text-brand-gray leading-relaxed mb-4">
                Il Titolare del trattamento dei dati personali è:
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-brand-dark">ASD CA75 Basket Casalnuovo</p>
                <p className="text-brand-gray">P.IVA/C.F.: 92042810637</p>
                <p className="text-brand-gray">Email: info@miniandbasketcamp.it</p>
                <p className="text-brand-gray">Tel: +39 339 877 5790</p>
              </div>
            </div>

            {/* Finalità del Trattamento */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold">2</span>
                Finalità del Trattamento
              </h3>
              <p className="text-brand-gray leading-relaxed mb-4">
                I dati personali raccolti saranno trattati per le seguenti finalità:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <span className="text-brand-gray">
                    <strong>Gestione delle iscrizioni:</strong> Elaborazione e gestione delle iscrizioni al Camp, 
                    comunicazioni relative alla partecipazione, gestione dei pagamenti.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <span className="text-brand-gray">
                    <strong>Assistenza sanitaria:</strong> Gestione delle informazioni mediche necessarie per 
                    garantire la sicurezza e il benessere dei partecipanti durante il Camp.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <span className="text-brand-gray">
                    <strong>Obblighi di legge:</strong> Adempimento degli obblighi previsti dalla legge, 
                    regolamenti e normativa comunitaria.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <span className="text-brand-gray">
                    <strong>Comunicazioni informative:</strong> Invio di comunicazioni relative alle attività 
                    del Camp e iniziative correlate (previo consenso).
                  </span>
                </li>
              </ul>
            </div>

            {/* Tipologia di Dati */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold">3</span>
                Tipologia di Dati Raccolti
              </h3>
              <p className="text-brand-gray leading-relaxed mb-4">
                I dati personali trattati includono:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-brand-dark mb-2">Dati identificativi</h4>
                  <p className="text-brand-gray text-sm">Nome, cognome, data e luogo di nascita, codice fiscale, indirizzo di residenza</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-brand-dark mb-2">Dati di contatto</h4>
                  <p className="text-brand-gray text-sm">Numero di telefono, indirizzo email</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-brand-dark mb-2">Dati relativi alla salute</h4>
                  <p className="text-brand-gray text-sm">Allergie, intolleranze alimentari, patologie note, terapie in corso</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-brand-dark mb-2">Immagini e video</h4>
                  <p className="text-brand-gray text-sm">Fotografie e riprese effettuate durante le attività del Camp</p>
                </div>
              </div>
            </div>

            {/* Base Giuridica */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold">4</span>
                Base Giuridica del Trattamento
              </h3>
              <p className="text-brand-gray leading-relaxed mb-4">
                Il trattamento dei dati personali si fonda sulle seguenti basi giuridiche:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">•</span>
                  <span className="text-brand-gray">
                    Esecuzione di un contratto di cui l'interessato è parte (iscrizione al Camp)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">•</span>
                  <span className="text-brand-gray">
                    Consenso dell'interessato per il trattamento di dati particolari (dati sanitari, immagini)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">•</span>
                  <span className="text-brand-gray">
                    Adempimento di obblighi legali cui è soggetto il titolare
                  </span>
                </li>
              </ul>
            </div>

            {/* Conservazione Dati */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold">5</span>
                Periodo di Conservazione
              </h3>
              <p className="text-brand-gray leading-relaxed">
                I dati personali saranno conservati per il tempo strettamente necessario al conseguimento 
                delle finalità per cui sono stati raccolti e comunque per un periodo non superiore a quello 
                imposto dagli obblighi di legge. I dati relativi alle iscrizioni verranno conservati per 
                10 anni dalla conclusione del rapporto contrattuale.
              </p>
            </div>

            {/* Diritti dell'Interessato */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold">6</span>
                Diritti dell'Interessato
              </h3>
              <p className="text-brand-gray leading-relaxed mb-4">
                In qualità di interessato, hai diritto di:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-brand-green">→</span>
                  <span className="text-brand-gray text-sm">Accesso ai tuoi dati personali</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-brand-green">→</span>
                  <span className="text-brand-gray text-sm">Rettifica dei dati inesatti</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-brand-green">→</span>
                  <span className="text-brand-gray text-sm">Cancellazione dei dati</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-brand-green">→</span>
                  <span className="text-brand-gray text-sm">Limitazione del trattamento</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-brand-green">→</span>
                  <span className="text-brand-gray text-sm">Portabilità dei dati</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-brand-green">→</span>
                  <span className="text-brand-gray text-sm">Opposizione al trattamento</span>
                </div>
              </div>
              <p className="text-brand-gray text-sm mt-4">
                Per esercitare i tuoi diritti, puoi contattarci all'indirizzo email: info@miniandbasketcamp.it
              </p>
            </div>

            {/* Immagini e Video */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold">7</span>
                Utilizzo di Immagini e Video
              </h3>
              <p className="text-brand-gray leading-relaxed mb-4">
                Durante le attività del Mini & Basket Camp verranno effettuate fotografie e riprese video. 
                Con l'iscrizione al Camp, il genitore/tutore autorizza l'utilizzo di tali immagini per:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <span className="text-brand-gray">Pubblicazione sui canali social del Mini & Basket Camp (Facebook, Instagram)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <span className="text-brand-gray">Materiale promozionale (brochure, locandine, sito web)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <span className="text-brand-gray">Documentazione delle attività svolte</span>
                </li>
              </ul>
              <p className="text-brand-gray text-sm mt-4 italic">
                L'uso sarà sempre nel rispetto della dignità personale e del decoro dei partecipanti.
              </p>
            </div>

            {/* Cookie Policy */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold">8</span>
                Cookie Policy
              </h3>
              <p className="text-brand-gray leading-relaxed mb-4">
                Il nostro sito web utilizza cookie tecnici necessari per il corretto funzionamento del sito 
                e cookie analitici per comprendere come i visitatori interagiscono con il sito.
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-brand-dark mb-2">Cookie utilizzati:</h4>
                <ul className="text-brand-gray text-sm space-y-1">
                  <li>• Cookie di sessione (tecnici, necessari)</li>
                  <li>• Cookie di preferenze (consenso cookie)</li>
                  <li>• Cookie analitici (statistiche anonime)</li>
                </ul>
              </div>
            </div>

            {/* Contatti */}
            <div className="bg-gradient-to-br from-brand-green/10 to-emerald-500/10 rounded-3xl p-8 text-center">
              <h3 className="text-xl font-bold text-brand-dark mb-4">
                Hai domande sulla privacy?
              </h3>
              <p className="text-brand-gray mb-6 max-w-md mx-auto">
                Per qualsiasi domanda relativa al trattamento dei tuoi dati personali, non esitare a contattarci.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@miniandbasketcamp.it"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-green to-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@miniandbasketcamp.it
                </a>
                <Link
                  href="/contatti"
                  className="inline-flex items-center justify-center gap-2 border-2 border-brand-green text-brand-green font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-brand-green hover:text-white"
                >
                  Pagina Contatti
                </Link>
              </div>
            </div>

            {/* Last Update */}
            <div className="mt-8 text-center text-sm text-brand-gray">
              Ultimo aggiornamento: Dicembre 2024
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}