import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Accordion from "@/components/Accordion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Domande Frequenti | Mini & Basket Camp 2025",
  description: "Trova le risposte alle domande più frequenti sul Mini & Basket Camp 2025. Iscrizioni, pagamenti, logistica e molto altro.",
};

const faqCategories = [
  {
    title: "Iscrizioni e Pagamenti",
    icon: "💳",
    items: [
      {
        question: "Come posso iscrivere mio figlio al camp?",
        answer: "L'iscrizione può essere effettuata direttamente online attraverso il nostro sito web nella sezione 'Iscriviti'. Il processo è semplice e guidato: dovrai compilare i dati del partecipante, del genitore/tutore e scegliere il pacchetto desiderato. Una volta completata la registrazione, riceverai una email di conferma con tutti i dettagli."
      },
      {
        question: "Quali sono le modalità di pagamento accettate?",
        answer: "Accettiamo diverse modalità di pagamento per venire incontro alle esigenze di tutti: carta di credito/debito (Visa, Mastercard, American Express), bonifico bancario, PayPal. È possibile anche richiedere il pagamento in 2 rate per i pacchetti settimanali. Tutti i pagamenti sono sicuri e criptati."
      },
      {
        question: "È possibile ottenere un rimborso in caso di disdetta?",
        answer: "Sì, offriamo una politica di rimborso flessibile. In caso di disdetta comunicata almeno 30 giorni prima dell'inizio del camp, è previsto il rimborso totale della quota versata. Per disdette tra 15 e 30 giorni, il rimborso sarà del 50%. Per disdette entro 15 giorni dall'inizio, non è previsto rimborso ma è possibile cedere l'iscrizione a un altro partecipante."
      },
      {
        question: "Sono previsti sconti per fratelli o sorelle?",
        answer: "Assolutamente sì! Offriamo uno sconto del 15% sulla seconda iscrizione e del 20% dalla terza iscrizione in poi per famiglie con più figli. Gli sconti vengono applicati automaticamente al momento del checkout quando vengono registrati più partecipanti con lo stesso genitore/tutore."
      }
    ]
  },
  {
    title: "Il Camp",
    icon: "🏀",
    items: [
      {
        question: "Qual è l'età minima e massima per partecipare?",
        answer: "Il Mini & Basket Camp è aperto a giovani atleti dai 6 ai 14 anni. Abbiamo gruppi differenziati per fasce d'età: Minibasket (6-8 anni), Esordienti (9-11 anni) e Under 14 (12-14 anni). Ogni gruppo segue un programma adattato alle specifiche esigenze di sviluppo."
      },
      {
        question: "Cosa deve portare mio figlio al camp?",
        answer: "Ogni partecipante dovrà portare: abbigliamento sportivo (magliette, pantaloncini, calze), scarpe da basket (indoor), borraccia personale, cambio per attività all'aperto, costume da bagno e asciugamano, cappellino e crema solare. Il kit camp (maglietta ufficiale, pallone e gadget) viene fornito da noi. Ti invieremo una lista dettagliata via email dopo l'iscrizione."
      },
      {
        question: "Come è strutturata una giornata tipo al camp?",
        answer: "Una giornata tipo inizia alle 8:30 con l'accoglienza e riscaldamento. Dalle 9:00 alle 12:30 si svolgono le sessioni di allenamento tecnico. Dopo il pranzo (13:00-14:00) c'è un momento di relax. Nel pomeriggio (14:30-17:30) si alternano giochi, partite e attività ricreative. La giornata si conclude alle 18:00 con i saluti. I programmi possono variare leggermente in base all'età del gruppo."
      },
      {
        question: "Il pranzo è incluso nel prezzo?",
        answer: "Sì, il pranzo è sempre incluso in tutti i nostri pacchetti. Offriamo un menù equilibrato e adatto agli sportivi, preparato giornalmente dalla nostra cucina. Possiamo gestire esigenze alimentari specifiche (allergie, intolleranze, diete vegetariane) se segnalate al momento dell'iscrizione."
      }
    ]
  },
  {
    title: "Logistica",
    icon: "📍",
    items: [
      {
        question: "Dove si trova esattamente il camp?",
        answer: "Il Mini & Basket Camp si svolge presso il Centro Sportivo Comunale, situato in Via dello Sport 15, Milano. La struttura dispone di 3 campi da basket coperti, 2 campi all'aperto, spogliatoi moderni, area ristoro e ampi spazi verdi per le attività ricreative. È facilmente raggiungibile con i mezzi pubblici (metro linea 2, fermata Sport) e dispone di un ampio parcheggio gratuito."
      },
      {
        question: "È disponibile un servizio di trasporto?",
        answer: "Offriamo un servizio navetta opzionale con diversi punti di raccolta in città. Il costo aggiuntivo è di €50 per l'intera settimana o €10 al giorno. I punti di raccolta e gli orari verranno comunicati una settimana prima dell'inizio del camp. Per richiedere il servizio, seleziona l'opzione durante l'iscrizione o contattaci."
      },
      {
        question: "Quali sono gli orari di ingresso e uscita?",
        answer: "L'ingresso è previsto dalle 8:00 alle 8:30, mentre l'uscita è dalle 17:30 alle 18:00. È disponibile un servizio di pre-camp (dalle 7:30) e post-camp (fino alle 19:00) su richiesta, senza costi aggiuntivi. Ti chiediamo di rispettare gli orari per garantire un'organizzazione ottimale delle attività."
      },
      {
        question: "È possibile venire a trovare mio figlio durante il camp?",
        answer: "I genitori possono visitare il camp durante le attività ricreative pomeridiane (16:00-17:00) previo accordo con la segreteria. Organizziamo inoltre un Open Day finale l'ultimo giorno del camp, dove le famiglie sono invitate a partecipare alla cerimonia di chiusura e alla partita dimostrativa. Per motivi di sicurezza, non sono ammesse visite non programmate."
      }
    ]
  },
  {
    title: "Sicurezza e Salute",
    icon: "🏥",
    items: [
      {
        question: "Il personale del camp è qualificato?",
        answer: "Tutto il nostro staff è altamente qualificato. Gli allenatori sono certificati FIBA e FIP con esperienza pluriennale nel basket giovanile. I preparatori atletici sono laureati in Scienze Motorie. Tutto il personale ha completato corsi di primo soccorso (BLS) e sicurezza. Ogni gruppo di 10-12 ragazzi è seguito da almeno 2 operatori dedicati."
      },
      {
        question: "È presente un medico o personale sanitario?",
        answer: "Sì, durante tutte le attività è presente un fisioterapista sportivo qualificato. Inoltre, abbiamo una convenzione con un medico sportivo reperibile in 15 minuti e siamo a meno di 5 minuti dal pronto soccorso più vicino. Tutto lo staff è formato per gestire le emergenze e disponiamo di un defibrillatore (DAE) in struttura."
      },
      {
        question: "Come vengono gestite le allergie alimentari?",
        answer: "Prendiamo molto seriamente le allergie e le intolleranze alimentari. Durante l'iscrizione, chiediamo di segnalare qualsiasi esigenza alimentare. La nostra cucina prepara menù personalizzati e i pasti vengono etichettati per evitare contaminazioni. Il nostro personale è formato sulla gestione delle emergenze allergiche e abbiamo sempre disponibili farmaci di emergenza (previa autorizzazione medica)."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        <main className="p-4 md:p-8">
          <PageHero
            title="DOMANDE FREQUENTI"
            subtitle="Trova tutte le risposte alle domande più comuni sul Mini & Basket Camp"
            badge="❓ FAQ"
            backgroundImage="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80"
            gradient="mixed"
          />

          {/* FAQ Content */}
          <section className="mt-12 max-w-4xl mx-auto">
            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-10">
              <h3 className="font-bold text-brand-dark mb-4">🔍 Vai direttamente a:</h3>
              <div className="flex flex-wrap gap-3">
                {faqCategories.map((category) => (
                  <a
                    key={category.title}
                    href={`#${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-brand-green/10 text-brand-gray hover:text-brand-green rounded-full font-medium text-sm transition-all duration-300"
                  >
                    {category.icon} {category.title}
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-12">
              {faqCategories.map((category) => (
                <div
                  key={category.title}
                  id={category.title.toLowerCase().replace(/\s+/g, '-')}
                  className="scroll-mt-24"
                >
                  <Accordion
                    title={category.title}
                    icon={category.icon}
                    items={category.items}
                  />
                </div>
              ))}
            </div>

            {/* Still Have Questions */}
            <div className="mt-16 bg-gradient-to-br from-brand-green/10 to-brand-orange/10 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-brand-green to-brand-orange rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4">
                Non hai trovato la risposta che cercavi?
              </h3>
              <p className="text-brand-gray mb-6 max-w-md mx-auto">
                Il nostro team è sempre disponibile per rispondere a qualsiasi domanda. Contattaci!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contatti"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-green to-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contattaci
                </Link>
                <a
                  href="tel:+390212345678"
                  className="inline-flex items-center justify-center gap-2 border-2 border-brand-green text-brand-green font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-brand-green hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +39 02 1234567
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}