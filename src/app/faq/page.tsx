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
    title: "Arrivi e Partenze",
    icon: "🚗",
    items: [
      {
        question: "Quali sono gli orari di arrivo e partenza?",
        answer: "Nel giorno di arrivo al Camp, l'accoglienza apre alle ore 15:30. La pensione completa inizia con la cena. L'ultimo giorno è prevista la premiazione alle ore 10:30 circa, a seguire i ragazzi hanno il pranzo e possono essere ritirati a partire dalle ore 14:30. Siamo a disposizione per esigenze particolari dovute a viaggi con mezzi (bus, aereo, treno)."
      },
      {
        question: "È previsto un servizio transfer da e per il villaggio?",
        answer: "Sì, è possibile prenotare il servizio navetta inviando la richiesta via e-mail entro due settimane dall'inizio del turno. Vi è la possibilità di organizzare un trasferimento con bus privato con partenza da Napoli e/o provincia e arrivo direttamente in villaggio al costo di €60,00 A/R. Tale servizio è attivabile solo al raggiungimento della capienza massima consentita e potrebbe variare al momento della prenotazione."
      }
    ]
  },
  {
    title: "Cosa Portare",
    icon: "🎒",
    items: [
      {
        question: "Cosa devo mettere in valigia?",
        answer: "Il soggiorno dura una settimana e i ragazzi si allenano quasi tutti i giorni sia la mattina che il pomeriggio. I capi e le quantità che consigliamo sono: 7-8 slip, 10 calze o calzettoni di spugna, 4 pantaloncini da gioco, 5 T-shirt da gioco o canotte, 1 paio di scarpe da gioco (noi daremo loro un completo da gioco composto da pantaloncino e canotta/t-shirt), abiti per la sera e il tempo libero (pantaloni, jeans o bermuda, se ragazze anche gonne, vestitini...), magliette per il tempo libero e le attività serali, 2 costumi, almeno 1 asciugamano da mare, un paio di felpe, una maglia e un giubbino per la sera, pigiama, materiale per l'igiene personale, crema solare, fazzoletti di carta, ciabatte per la camera, ciabatte da mare, scarpe/ciabatte/sandali per il tempo libero, un ombrellino/k-way, un sacchetto per la biancheria sporca, un accappatoio."
      },
      {
        question: "Quali documenti devono essere consegnati?",
        answer: "Il camper dovrà avere il certificato medico, la stampa firmata della mail di avvenuta iscrizione e la ricevuta di versamento della caparra."
      },
      {
        question: "Che tipo di certificazione medica serve?",
        answer: "Serve il certificato per attività sportiva agonistica rilasciato dal medico sportivo o una fotocopia del certificato medico per attività sportiva già presente presso la società sportiva di appartenenza (si ricorda che il certificato ha validità annuale). In caso di terapie farmacologiche in corso sarà necessario consegnare tutti i medicinali al personale del M&B Camp unitamente a certificazione medica con posologia relativa e delega del genitore alla somministrazione."
      }
    ]
  },
  {
    title: "Sicurezza e Assistenza",
    icon: "🏥",
    items: [
      {
        question: "Com'è garantita la sicurezza durante la settimana?",
        answer: "La sicurezza del singolo partecipante e dell'intero entourage dipende da una efficace prevenzione e da un costante monitoraggio. Tutte le attività saranno realizzate all'interno della struttura che è adeguatamente attrezzata per le nostre esigenze. Non saranno ammesse all'interno persone estranee. Saranno valutati dallo staff sanitario eventuali interventi mirati su situazioni particolari che dovessero manifestarsi."
      },
      {
        question: "C'è uno staff sanitario nella struttura?",
        answer: "Sì, c'è uno Staff sanitario (medico ed infermiere) al seguito ed a supporto dei ragazzi. Sarà garantita un'assistenza costante a tutela del benessere di tutti i partecipanti."
      },
      {
        question: "Ci sono altri ospiti nel villaggio?",
        answer: "No, l'intero villaggio sarà esclusivamente a disposizione del Camp. Non sono ammesse persone estranee."
      }
    ]
  },
  {
    title: "Comunicazioni e Visite",
    icon: "📞",
    items: [
      {
        question: "A chi posso rivolgermi per avere info su mio figlio durante la settimana?",
        answer: "Per ogni domanda, necessità, chiarimento o in caso in cui il ragazzo non dovesse rispondere al proprio telefono cellulare, è possibile chiamare il numero di telefono di infoline 339 877 5790 oppure inviare una mail all'indirizzo di posta elettronica dedicato (info@miniandbasketcamp.it)."
      },
      {
        question: "Sono previste visite di genitori in struttura?",
        answer: "Sì, previa richiesta all'organizzazione. Contattaci per concordare data e orario della visita."
      }
    ]
  },
  {
    title: "Iscrizioni e Pagamenti",
    icon: "💳",
    items: [
      {
        question: "Come posso iscrivere mio figlio al camp?",
        answer: "Iscriversi al Camp è semplice e veloce. Prenota subito il tuo posto al Mini&Basket Camp compilando il modulo online nella sezione Iscrizioni. Per iscriversi è necessario effettuare un versamento dell'anticipo di €200 o dell'intero importo, specificando nella causale 'Anticipo Camp' o 'Quota Camp' ed il Nome e Cognome del partecipante."
      },
      {
        question: "Quali sono i metodi di pagamento accettati?",
        answer: "È possibile pagare tramite bonifico bancario intestato a ASD CA75 Basket Casalnuovo (IBAN: IT68S0100503401000000000033) oppure tramite carta di credito/debito attraverso il nostro sistema di pagamento sicuro online."
      },
      {
        question: "Entro quando va saldato l'importo?",
        answer: "L'intera quota va saldata entro e non oltre il 31 Maggio 2025. Per usufruire della tariffa Early Bird (sconto €20) l'iscrizione deve essere completata entro il 28 Febbraio 2025."
      },
      {
        question: "È possibile ottenere un rimborso in caso di disdetta?",
        answer: "Se un partecipante iscritto rinuncia, ha diritto al rimborso delle somme versate. La caparra verrà restituita interamente in caso di rinunce avvenute entro la data del saldo. Oltre il suddetto termine non saranno possibili rimborsi. Nessun rimborso è accordato a chi: non si presenta agli arrivi, si ritira durante lo svolgimento, non è in possesso dell'idoneità fisica o viene espulso dal Camp. La rinuncia al camp dovrà essere comunicata per iscritto tramite posta elettronica all'indirizzo info@miniandbasketcamp.it."
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

            {/* Camp Info Summary */}
            <div className="mt-16 bg-gradient-to-br from-brand-green/5 to-brand-orange/5 rounded-3xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 text-center">📋 Riepilogo Informazioni Camp 2025</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-brand-green mb-2">📅 Date</h4>
                  <p className="text-brand-gray">29 Giugno - 6 Luglio 2025</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-brand-green mb-2">📍 Location</h4>
                  <p className="text-brand-gray">Villaggio Residence Bahja****, Paola (CS)</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-brand-green mb-2">👥 Età</h4>
                  <p className="text-brand-gray">11-18 anni</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-brand-green mb-2">💰 Quote</h4>
                  <p className="text-brand-gray">Standard: €610 (€590 Early Bird)<br/>Alta Specializzazione: €800 (€760 Early Bird)</p>
                </div>
              </div>
            </div>

            {/* Still Have Questions */}
            <div className="mt-12 bg-gradient-to-br from-brand-green/10 to-brand-orange/10 rounded-3xl p-8 text-center">
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
                  href="tel:+393398775790"
                  className="inline-flex items-center justify-center gap-2 border-2 border-brand-green text-brand-green font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-brand-green hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +39 339 877 5790
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