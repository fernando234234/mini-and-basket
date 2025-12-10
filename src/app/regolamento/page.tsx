import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Regolamento | Mini & Basket Camp 2025",
  description: "Regolamento ufficiale del Mini & Basket Camp 2025. Tutte le regole e condizioni di partecipazione.",
};

const regolamentoArticoli = [
  {
    numero: 1,
    titolo: "MODALITÀ",
    contenuto: "Il \"Mini&Basket Camp\" si svolge nel luogo, nel periodo e con le modalità indicate in questo regolamento."
  },
  {
    numero: 2,
    titolo: "PARTECIPANTI",
    contenuto: "È prevista attività di Minibasket e Pallacanestro. Gli iscritti vengono suddivisi in gruppi a seconda dell'età e delle capacità valutate dalla Direzione Tecnica. L'attività pratica ha luogo sui campi attrezzati all'aperto del villaggio."
  },
  {
    numero: 3,
    titolo: "SISTEMAZIONE",
    contenuto: "I partecipanti sono alloggiati presso le unità abitative del Villaggio."
  },
  {
    numero: 4,
    titolo: "ISCRIZIONI",
    contenuto: "Per l'iscrizione sono necessari: a) scheda di iscrizione - b) anticipo previsto - c) certificato medico."
  },
  {
    numero: 5,
    titolo: "QUOTA DI PARTECIPAZIONE",
    contenuto: "È indicata sul sito www.miniandbasketcamp.it e sul materiale pubblicitario. È comprensiva dell'anticipo e si intende singola. La quota NON comprende gli extra di carattere personale, le telefonate ed in genere tutto quanto non espressamente indicato come compreso."
  },
  {
    numero: 6,
    titolo: "ANTICIPO",
    contenuto: "È compresa nella quota di partecipazione e si intende a persona. La Caparra verrà restituita interamente in caso di rinunce avvenute entro la data del saldo, oltre il suddetto termine non saranno possibili rimborsi."
  },
  {
    numero: 7,
    titolo: "RIMBORSI",
    contenuto: "Se un partecipante iscrittosi rinuncia, ha diritto al rimborso delle somme versate. La caparra verrà trattenuta dall'organizzazione solo nel caso previsto dal punto 6 del presente Regolamento. Nessun rimborso è accordato a chi: non si presenta agli arrivi - si ritira durante lo svolgimento - non è in possesso dell'idoneità fisica - viene espulso dal Camp. La rinuncia al camp dovrà essere comunicata per iscritto tramite posta elettronica all'indirizzo email info@miniandbasketcamp.it."
  },
  {
    numero: 8,
    titolo: "DISCIPLINA",
    contenuto: "Ogni seria violazione alle regole del Camp così come il danneggiare le strutture sportive e ricettive, il mancato rispetto verso gli istruttori e gli assistenti, il comportamento irriguardoso sia durante lo svolgimento delle lezioni sia nelle ore di tempo libero comporta provvedimenti decisi discrezionalmente dalla direzione, quali ad esempio l'immediata espulsione dell'interessato il quale dovrà rifondere i danni eventualmente arrecati."
  },
  {
    numero: 9,
    titolo: "ANNULLAMENTO",
    contenuto: "L'organizzazione si riserva di annullare il Camp in qualsiasi momento senza che da ciò derivi altro suo obbligo di quello della tempestiva comunicazione agli interessati con restituzione delle somme versate."
  },
  {
    numero: 10,
    titolo: "MODIFICHE",
    contenuto: "L'organizzazione si riserva di apportare modifiche al programma di svolgimento del camp qualora particolari circostanze lo richiedano."
  },
  {
    numero: 11,
    titolo: "RESPONSABILITÀ",
    contenuto: "L'organizzazione del Camp declina ogni responsabilità per eventuali smarrimenti, furti e danni a cose e/o persone prima, durante e dopo lo svolgimento dello stesso. L'organizzazione risulta eventualmente responsabile solo ed esclusivamente nei termini previsti dalla polizza assicurativa stipulata."
  },
  {
    numero: 12,
    titolo: "TRATTAMENTO DATI PERSONALI",
    contenuto: "Alla sottoscrizione del modulo d'iscrizione consegue l'autorizzazione al trattamento dei dati personali, in esso contenuti, ai sensi del Regolamento Europeo N. 679/2016."
  },
  {
    numero: 13,
    titolo: "UTILIZZO IMMAGINI FOTOGRAFICHE E RIPRESE AUDIO VISIVE",
    contenuto: "Alla sottoscrizione del modulo d'iscrizione consegue l'autorizzazione all'utilizzo di tutte le immagini fotografiche e di tutte le riprese audiovisive acquisite durante i Camp, da parte del Mini&Basket Camp e dei propri partners."
  }
];

export default function RegolamentoPage() {
  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        <main className="p-4 md:p-8">
          <PageHero
            title="REGOLAMENTO"
            subtitle="Regolamento ufficiale del Mini & Basket Camp 2025"
            badge="📋 Regole"
            backgroundImage="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80"
            gradient="green"
          />

          {/* Introduction */}
          <section className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-brand-green/10 to-emerald-500/10 rounded-3xl p-8 border border-brand-green/20 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark text-lg mb-2">Importante</h3>
                  <p className="text-brand-gray">
                    La partecipazione al Mini & Basket Camp implica l'accettazione integrale del presente regolamento. 
                    Ti invitiamo a leggere attentamente tutti gli articoli prima di procedere con l'iscrizione.
                  </p>
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-6">
              {regolamentoArticoli.map((articolo) => (
                <div
                  key={articolo.numero}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-green to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                      {articolo.numero}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-dark text-lg mb-2">
                        Art. {articolo.numero} - {articolo.titolo}
                      </h3>
                      <p className="text-brand-gray leading-relaxed">
                        {articolo.contenuto}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Dates */}
            <div className="mt-12 bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-brand-dark mb-6 text-center">📅 Date Importanti</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-brand-green/10 to-emerald-500/10 rounded-xl p-4 text-center">
                  <div className="text-sm text-brand-gray mb-1">Early Bird</div>
                  <div className="font-bold text-brand-green">28 Febbraio 2025</div>
                  <div className="text-xs text-brand-gray mt-1">Sconto €20 sulla quota</div>
                </div>
                <div className="bg-gradient-to-br from-brand-orange/10 to-red-500/10 rounded-xl p-4 text-center">
                  <div className="text-sm text-brand-gray mb-1">Saldo Quota</div>
                  <div className="font-bold text-brand-orange">31 Maggio 2025</div>
                  <div className="text-xs text-brand-gray mt-1">Termine ultimo pagamento</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-4 text-center">
                  <div className="text-sm text-brand-gray mb-1">Camp 2025</div>
                  <div className="font-bold text-blue-600">29 Giu - 6 Lug 2025</div>
                  <div className="text-xs text-brand-gray mt-1">Una settimana di basket!</div>
                </div>
              </div>
            </div>

            {/* Contact for Questions */}
            <div className="mt-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 text-center">
              <h3 className="text-xl font-bold text-brand-dark mb-4">
                Hai domande sul regolamento?
              </h3>
              <p className="text-brand-gray mb-6 max-w-md mx-auto">
                Contattaci per qualsiasi chiarimento sui termini e condizioni di partecipazione.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contatti"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-green to-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Contattaci
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center gap-2 border-2 border-brand-green text-brand-green font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-brand-green hover:text-white"
                >
                  Leggi le FAQ
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}