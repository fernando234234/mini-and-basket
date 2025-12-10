import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Il Programma | Mini & Basket Camp 2025",
  description: "Scopri il programma completo del Mini & Basket Camp 2025: una settimana di basket, divertimento e crescita al Villaggio Residence Bahja di Paola.",
};

export default function ProgrammaPage() {
  const fourPillars = [
    {
      title: "MINI&BASKET SCHOOL",
      description: "Un'attività per ragazzi e ragazze volta al miglioramento e al perfezionamento tecnico.",
      icon: "🏀",
      color: "from-brand-green to-emerald-600",
    },
    {
      title: "CRESCITA INDIVIDUALE",
      description: "Un'esperienza aggregativa unica per i ragazzi, un'occasione imperdibile di condividere il proprio amore per il basket con coetanei di diversa provenienza.",
      icon: "📈",
      color: "from-brand-orange to-red-500",
    },
    {
      title: "ACTIVE HOLIDAY",
      description: "Un'originale formula di vacanza sportiva con momenti di intrattenimento ed aggregazione organizzati (musica, giochi, animazione, escursioni, spiaggia).",
      icon: "🌴",
      color: "from-teal-500 to-cyan-600",
    },
    {
      title: "TUTOR",
      description: "Allenamenti gestiti dai migliori Istruttori, Preparatori fisici ed Allenatori.",
      icon: "👨‍🏫",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  const facilities = [
    { number: "4", label: "Campi di Basket & Mini Basket", icon: "🏀" },
    { number: "1", label: "Piscina", icon: "🏊" },
    { number: "1", label: "Spiaggia Privata", icon: "🏖️" },
    { number: "24/7", label: "Assistenza Staff", icon: "👥" },
  ];

  const dailySchedule = [
    { time: "08:00", activity: "Sveglia e Colazione", icon: "🌅", period: "mattina" },
    { time: "09:30", activity: "Allenamento Tecnico", icon: "🏀", period: "mattina" },
    { time: "11:00", activity: "Pausa e Merenda", icon: "🍎", period: "mattina" },
    { time: "11:30", activity: "Attività in Piscina/Spiaggia", icon: "🏊", period: "mattina" },
    { time: "13:00", activity: "Pranzo", icon: "🍽️", period: "pomeriggio" },
    { time: "14:00", activity: "Attività Guidata in Tempo Libero", icon: "🎮", period: "pomeriggio" },
    { time: "16:30", activity: "Allenamento Pomeridiano", icon: "⛹️", period: "pomeriggio" },
    { time: "19:00", activity: "Docce e Tempo Libero", icon: "🚿", period: "sera" },
    { time: "20:00", activity: "Cena", icon: "🍝", period: "sera" },
    { time: "21:30", activity: "Attività Serale & Animazione", icon: "🎉", period: "sera" },
    { time: "23:00", activity: "Rientro in Camera", icon: "🌙", period: "sera" },
  ];

  const included = [
    { item: "Pensione Completa", description: "Colazione, pranzo e cena", icon: "🍽️" },
    { item: "Alloggio", description: "Camera in residence 4 stelle", icon: "🏨" },
    { item: "Allenamenti", description: "2 sessioni tecniche giornaliere", icon: "🏀" },
    { item: "Staff Qualificato", description: "Istruttori e preparatori professionisti", icon: "👨‍🏫" },
    { item: "Kit Camp", description: "Maglietta, pantaloncini e gadget", icon: "👕" },
    { item: "Animazione", description: "Attività serali e intrattenimento", icon: "🎭" },
    { item: "Piscina & Spiaggia", description: "Accesso a tutte le strutture", icon: "🏊" },
    { item: "Assicurazione", description: "Copertura completa", icon: "🛡️" },
  ];

  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        <main className="p-4 md:p-8">
          <PageHero
            title="IL PROGRAMMA"
            subtitle="Un'esperienza unica di basket, crescita e divertimento"
            badge="📋 Edizione 2025"
            backgroundImage="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80"
            gradient="green"
          />

          {/* Intro Section */}
          <section className="mt-16 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 px-4 py-2 rounded-full mb-6">
              <span className="text-brand-orange font-bold">📅 29 Giugno - 6 Luglio 2025</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
              Benvenuti al <span className="text-brand-green">Mini & Basket Camp</span>
            </h2>
            <p className="mt-6 text-lg text-brand-gray leading-relaxed">
              Il nuovo &quot;Mini and Basket Camp&quot; nasce nel 2013 a Scanzano Jonico, rinnovando la trascorsa 
              esperienza del &quot;Sea and Basket Camp&quot;, attestandosi da subito tra i principali Basket Camp 
              d&apos;Italia per numero di partecipanti, qualità del lavoro tecnico svolto, prestigio degli 
              istruttori ospiti nonché per la bellezza e l&apos;efficienza della location.
            </p>
            <p className="mt-4 text-lg text-brand-gray leading-relaxed">
              Uno dei grandi Camp italiani dedicato al <strong>Minibasket e alla Pallacanestro</strong>, il 
              Mini and Basket Camp rappresenta il modello ideale di Camp per l&apos;intero movimento in Campania e non solo.
            </p>
          </section>

          {/* 4 Pillars Section */}
          <section className="mt-20">
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-brand-orange uppercase tracking-widest">Il Nostro Approccio</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-2">
                IL FULCRO DEL CAMP
              </h2>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="w-12 h-1 bg-brand-green rounded-full" />
                <span className="text-2xl">🏀</span>
                <span className="w-12 h-1 bg-brand-green rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fourPillars.map((pillar, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {pillar.icon}
                  </div>
                  <h3 className="font-bold text-brand-dark text-lg mb-2">{pillar.title}</h3>
                  <p className="text-brand-gray text-sm leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Philosophy Section */}
          <section className="mt-20 bg-gradient-to-br from-brand-green/5 to-brand-orange/5 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-bold text-brand-green uppercase tracking-widest">La Filosofia</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-2">
                  UN PROGETTO SPORTIVO-EDUCATIVO
                </h2>
                <p className="mt-6 text-brand-gray leading-relaxed">
                  Il Mini and Basket Camp è una vera e propria &quot;scuola&quot; estiva di minibasket e pallacanestro. 
                  Un lavoro meticoloso sul perfezionamento dei prerequisiti della futura pallacanestro attraverso 
                  l&apos;allenamento delle capacità motorie con particolare riferimento a quelle coordinative.
                </p>
                <p className="mt-4 text-brand-gray leading-relaxed">
                  Un &quot;corso fisico e tecnico&quot; modulato in modo da permettere a chi già gioca di perfezionare 
                  la propria tecnica ed i propri fondamentali e a chi invece è alle prime armi di avvicinarsi 
                  gradatamente alla Pallacanestro.
                </p>
                <div className="mt-8 p-4 bg-white rounded-xl border-l-4 border-brand-orange">
                  <p className="font-bold text-brand-dark">Le nostre keywords:</p>
                  <p className="text-brand-orange font-semibold mt-1">Competenza, Qualità, Affidabilità, Professionalità!</p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&q=80"
                    alt="Basketball training"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-brand-green text-white rounded-2xl p-4 shadow-xl">
                  <div className="text-3xl font-black">21+</div>
                  <div className="text-sm">Anni di Esperienza</div>
                </div>
              </div>
            </div>
          </section>

          {/* Edizione 2025 Section */}
          <section className="mt-20">
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-brand-orange uppercase tracking-widest">Nuova Edizione</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-2">
                CAMP 2025
              </h2>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="w-12 h-1 bg-brand-green rounded-full" />
                <span className="text-2xl">🌟</span>
                <span className="w-12 h-1 bg-brand-green rounded-full" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-dark via-gray-900 to-brand-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="text-3xl">📍</span> La Location
                    </h3>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h4 className="text-xl font-bold text-brand-orange mb-2">
                        Villaggio Residence Bahja ⭐⭐⭐⭐
                      </h4>
                      <p className="text-white/80 mb-4">Paola (CS) - Calabria</p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Un connubio di esperienze: il basket, l&apos;amore e la passione per questo sport 
                        e la vacanza all&apos;insegna del puro divertimento e dell&apos;aggregazione.
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <span>🎯</span> A Chi È Rivolto
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        <span className="bg-brand-green/20 text-brand-green px-4 py-2 rounded-full text-sm font-semibold border border-brand-green/30">
                          Ragazzi 11-18 anni
                        </span>
                        <span className="bg-brand-orange/20 text-brand-orange px-4 py-2 rounded-full text-sm font-semibold border border-brand-orange/30">
                          Tutti i livelli
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="text-3xl">🏟️</span> Le Attrezzature
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {facilities.map((facility, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="text-3xl mb-2">{facility.icon}</div>
                          <div className="text-2xl font-black text-brand-orange">{facility.number}</div>
                          <div className="text-sm text-white/70">{facility.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Alta Specializzazione Section */}
          <section className="mt-12">
            <div className="bg-gradient-to-r from-brand-orange to-red-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                🔥 POSTI LIMITATI
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-5xl">🏆</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black mb-4">ALTA SPECIALIZZAZIONE</h3>
                  <p className="text-white/90 leading-relaxed mb-4">
                    L&apos;alta specializzazione prevede sessioni di lavoro extra, ancora più intensive, in aggiunta 
                    al già accurato programma del Mini&Basket Camp. È rivolto a tutti gli atleti che intendono 
                    perfezionare i propri fondamentali con lavoro specifico e personalizzato sui campi.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <span className="font-bold">+7 ore</span>
                      <span className="text-white/80 ml-2">di tecnica individuale</span>
                    </div>
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <span className="font-bold">Max 30</span>
                      <span className="text-white/80 ml-2">campers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What's Included Section */}
          <section className="mt-20">
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-brand-orange uppercase tracking-widest">Tutto Incluso</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-2">
                COSA INCLUDE
              </h2>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="w-12 h-1 bg-brand-green rounded-full" />
                <span className="text-2xl">✅</span>
                <span className="w-12 h-1 bg-brand-green rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {included.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center"
                >
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-brand-green/10 to-brand-orange/10 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-brand-dark text-sm mb-1">{item.item}</h3>
                  <p className="text-brand-gray text-xs">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Daily Schedule Section */}
          <section className="mt-20">
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-brand-orange uppercase tracking-widest">Il Programma</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-2">
                UNA GIORNATA TIPO
              </h2>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="w-12 h-1 bg-brand-green rounded-full" />
                <span className="text-2xl">📅</span>
                <span className="w-12 h-1 bg-brand-green rounded-full" />
              </div>
              <p className="mt-4 text-brand-gray max-w-2xl mx-auto">
                La giornata sarà organizzata in ogni dettaglio, per evitare tempi morti e garantire 
                un costante livello di apprendimento e divertimento.
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-brand-green to-indigo-600 md:-translate-x-1/2" />

              <div className="space-y-4">
                {dailySchedule.map((item, index) => {
                  const isLeft = index % 2 === 0;
                  const periodColors = {
                    mattina: "from-amber-400 to-orange-500",
                    pomeriggio: "from-brand-green to-emerald-600",
                    sera: "from-indigo-500 to-purple-600",
                  };
                  const periodBg = {
                    mattina: "bg-amber-50 border-amber-200",
                    pomeriggio: "bg-green-50 border-green-200",
                    sera: "bg-indigo-50 border-indigo-200",
                  };

                  return (
                    <div key={index} className="relative">
                      {/* Mobile Layout */}
                      <div className="md:hidden flex items-start gap-4 pl-2">
                        <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${periodColors[item.period as keyof typeof periodColors]} flex items-center justify-center text-xl shadow-lg`}>
                          {item.icon}
                        </div>
                        <div className={`flex-1 ${periodBg[item.period as keyof typeof periodBg]} rounded-xl p-4 border shadow-sm`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${periodColors[item.period as keyof typeof periodColors]} text-white`}>
                              {item.time}
                            </span>
                          </div>
                          <h3 className="font-bold text-brand-dark text-sm">{item.activity}</h3>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className={`hidden md:grid md:grid-cols-2 md:gap-8`}>
                        <div className={`${isLeft ? "text-right pr-12" : "order-2 text-left pl-12"}`}>
                          <div className={`inline-block ${periodBg[item.period as keyof typeof periodBg]} rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow`}>
                            <div className={`flex items-center gap-2 mb-1 ${isLeft ? "justify-end" : "justify-start"}`}>
                              <span className="text-xl">{item.icon}</span>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${periodColors[item.period as keyof typeof periodColors]} text-white`}>
                                {item.time}
                              </span>
                            </div>
                            <h3 className="font-bold text-brand-dark">{item.activity}</h3>
                          </div>
                        </div>
                        <div className={`${isLeft ? "order-2" : ""}`} />
                        
                        {/* Center Dot */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${periodColors[item.period as keyof typeof periodColors]} shadow-md ring-4 ring-white`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-brand-green/10 to-brand-orange/10 rounded-full border border-brand-green/20">
                <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-brand-dark">
                  Ogni sera sarà comunicato il programma dettagliato delle attività del giorno seguente
                </span>
              </div>
            </div>
          </section>

          {/* Staff & Animation Section */}
          <section className="mt-20 bg-gradient-to-br from-brand-green/5 to-brand-orange/5 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-green/10 px-3 py-1 rounded-full mb-4">
                  <span className="text-brand-green">👨‍🏫</span>
                  <span className="text-sm font-bold text-brand-green">Staff Tecnico</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">
                  Il Lavoro Tecnico
                </h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Uno staff tecnico di altissimo profilo proverà a sviluppare le capacità tecniche e tattiche 
                  dei giovani partecipanti. Saranno approfonditi specificatamente i fondamentali di gioco 
                  (difesa, palleggio, tiro e passaggio) per quanto riguarda il basket e tantissima cura sarà 
                  riservata allo sviluppo delle capacità motorie per il minibasket.
                </p>
                <p className="text-brand-gray leading-relaxed">
                  Tanta attenzione anche all&apos;aspetto fisico con un lavoro di preparazione mirato e 
                  funzionale all&apos;apprendimento Tecnico.
                </p>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-orange/10 px-3 py-1 rounded-full mb-4">
                  <span className="text-brand-orange">🎭</span>
                  <span className="text-sm font-bold text-brand-orange">Animazione</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">
                  JEM Animation
                </h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  Il MiniandBasket Camp si avvale, per l&apos;intera attività di animazione (gare in piscina e al mare, 
                  spettacoli e serate ecc.) l&apos;esclusività della <strong>JEM ANIMATION</strong> che cura tale aspetto 
                  fondamentale del CAMP con scrupolosità e dedizione.
                </p>
                <div className="bg-white rounded-xl p-4 border border-brand-orange/20">
                  <p className="text-brand-dark font-semibold">
                    🌟 Evento Speciale: &quot;All Star Game&quot;
                  </p>
                  <p className="text-brand-gray text-sm mt-1">
                    La serata &quot;All Star Game&quot; vedrà la selezione dei migliori giocatori insieme agli ospiti 
                    contrapporsi agli istruttori.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-20 relative overflow-hidden">
            <div className="bg-gradient-to-br from-brand-green via-emerald-600 to-brand-green-dark rounded-3xl p-8 md:p-16 text-white text-center relative">
              {/* Decorative Elements */}
              <div className="absolute top-8 left-8 w-24 h-24 opacity-10 animate-float">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="3" />
                  <path d="M50 5 L50 95 M5 50 L95 50" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <div className="absolute bottom-8 right-8 w-32 h-32 opacity-10 animate-float-delayed">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="3" />
                  <path d="M50 5 L50 95 M5 50 L95 50" stroke="white" strokeWidth="2" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                  <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">Prenota il tuo posto!</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">
                  Affrettati ad Iscriverti!
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  I posti sono limitati. Segui le istruzioni per versare l&apos;anticipo e compila la scheda
                  di iscrizione. Per iscriversi è necessario effettuare un versamento di <strong>€200,00</strong> (anticipo) o
                  dell&apos;intero importo. Il saldo va effettuato entro il 31 Maggio 2025.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/iscrizione"
                    className="group relative inline-flex items-center justify-center gap-2 bg-white text-brand-green font-bold py-4 px-10 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:scale-105 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-brand-orange translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
                      <span>ISCRIVITI ORA</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    href="/contatti"
                    className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/50 text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>CONTATTACI</span>
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-6">
                  {[
                    { icon: "📞", text: "+39 339 877 5790" },
                    { icon: "📧", text: "info@miniandbasketcamp.it" },
                  ].map((contact, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                      <span className="text-lg">{contact.icon}</span>
                      <span>{contact.text}</span>
                    </div>
                  ))}
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