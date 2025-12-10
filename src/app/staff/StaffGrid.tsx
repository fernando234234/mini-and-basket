"use client";

import { useState } from "react";
import Image from "next/image";

interface StaffMember {
  name: string;
  role: string;
  category: string;
  avatar: string;
  bio: string;
  specializations: string[];
  experience: string;
  color: string;
  social?: {
    instagram?: string;
    linkedin?: string;
  };
}

const staffMembers: StaffMember[] = [
  {
    name: "Marco Rossi",
    role: "Direttore Camp",
    category: "Direzione",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
    bio: "Ex giocatore professionista di Serie A con oltre 20 anni di esperienza nel basket giovanile. Marco ha dedicato la sua carriera post-agonistica alla formazione dei giovani talenti, portando la sua esperienza internazionale nel nostro camp.",
    specializations: ["Leadership", "Tattica di gioco", "Mentoring"],
    experience: "20+ anni",
    color: "from-blue-500 to-indigo-600",
    social: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    name: "Laura Bianchi",
    role: "Preparatrice Atletica",
    category: "Preparatori Atletici",
    avatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&q=80",
    bio: "Laureata in Scienze Motorie con specializzazione in preparazione atletica giovanile. Laura si occupa di sviluppare programmi di allenamento personalizzati che rispettano le fasi di crescita dei giovani atleti.",
    specializations: ["Preparazione fisica", "Prevenzione infortuni", "Nutrizione sportiva"],
    experience: "15+ anni",
    color: "from-brand-green to-emerald-600",
    social: {
      instagram: "https://instagram.com",
    },
  },
  {
    name: "Giuseppe Verdi",
    role: "Allenatore Tecnico",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    bio: "Coach certificato FIBA con esperienza internazionale. Giuseppe è specializzato nello sviluppo delle abilità tecniche individuali e nel perfezionamento dei fondamentali del basket.",
    specializations: ["Fondamentali", "Tiro", "Difesa individuale"],
    experience: "18+ anni",
    color: "from-brand-orange to-red-500",
    social: {
      linkedin: "https://linkedin.com",
    },
  },
  {
    name: "Anna Romano",
    role: "Allenatrice Minibasket",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80",
    bio: "Specialista nel minibasket e nell'avviamento allo sport per i più piccoli. Anna utilizza metodologie ludiche per insegnare i fondamentali del basket ai bambini dai 6 ai 10 anni.",
    specializations: ["Minibasket", "Metodologie ludiche", "Sviluppo motorio"],
    experience: "12+ anni",
    color: "from-pink-500 to-rose-600",
    social: {
      instagram: "https://instagram.com",
    },
  },
  {
    name: "Luca Ferrari",
    role: "Assistente Allenatore",
    category: "Assistenti",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    bio: "Giovane allenatore con grande passione per il basket giovanile. Luca supporta gli allenatori principali nelle sessioni di allenamento e si occupa del follow-up individuale degli atleti.",
    specializations: ["Supporto tecnico", "Video analysis", "Coaching individuale"],
    experience: "5+ anni",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "Sara Esposito",
    role: "Preparatrice Atletica",
    category: "Preparatori Atletici",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
    bio: "Fisioterapista e preparatrice atletica specializzata nel recupero funzionale. Sara si occupa della prevenzione degli infortuni e del benessere fisico di tutti i partecipanti al camp.",
    specializations: ["Fisioterapia sportiva", "Stretching", "Recovery"],
    experience: "10+ anni",
    color: "from-teal-500 to-cyan-600",
    social: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    name: "Davide Colombo",
    role: "Allenatore Tecnico",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
    bio: "Ex giocatore di Serie A2 con esperienza come coach in diverse squadre giovanili. Davide si concentra sullo sviluppo del gioco di squadra e delle dinamiche offensive.",
    specializations: ["Gioco di squadra", "Schemi offensivi", "Pick and roll"],
    experience: "14+ anni",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Marta Russo",
    role: "Responsabile Attività Ricreative",
    category: "Assistenti",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
    bio: "Educatrice professionale con esperienza in centri estivi e attività ricreative. Marta organizza le attività extra-sportive e si occupa del benessere emotivo dei partecipanti.",
    specializations: ["Team building", "Attività ludiche", "Animazione"],
    experience: "8+ anni",
    color: "from-lime-500 to-green-600",
    social: {
      instagram: "https://instagram.com",
    },
  },
];

const categories = ["Tutti", "Direzione", "Allenatori", "Preparatori Atletici", "Assistenti"];

export default function StaffGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const filteredStaff = selectedCategory === "Tutti"
    ? staffMembers
    : staffMembers.filter((member) => member.category === selectedCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-brand-green to-emerald-500 text-white shadow-lg"
                : "bg-white text-brand-gray hover:bg-brand-green/10 hover:text-brand-green border border-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStaff.map((member, index) => {
          const isHovered = hoveredMember === index;

          return (
            <div
              key={member.name}
              className="group cursor-pointer"
              onClick={() => setSelectedMember(member)}
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div
                className={`relative bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 ${
                  isHovered ? "shadow-2xl -translate-y-3" : ""
                }`}
              >
                {/* Top Gradient Bar */}
                <div className={`h-2 bg-gradient-to-r ${member.color}`} />

                {/* Content */}
                <div className="p-6 text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-4">
                    <div
                      className={`absolute -inset-2 bg-gradient-to-br ${member.color} rounded-full opacity-0 blur-lg transition-all duration-300 ${
                        isHovered ? "opacity-50" : ""
                      }`}
                    />
                    <div className="relative">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={100}
                        height={100}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      {/* Status Indicator */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center border-2 border-white`}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Name & Role */}
                  <h3 className="font-bold text-brand-dark text-lg">{member.name}</h3>
                  <p
                    className={`text-sm font-semibold bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}
                  >
                    {member.role}
                  </p>

                  {/* Category Badge */}
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-brand-gray text-xs font-medium rounded-full">
                      {member.category}
                    </span>
                  </div>

                  {/* Experience */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-brand-gray">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    <span>{member.experience} esperienza</span>
                  </div>

                  {/* Specializations Preview */}
                  <div className="mt-4 flex flex-wrap justify-center gap-1">
                    {member.specializations.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 bg-brand-green/10 text-brand-green text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                    {member.specializations.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-brand-gray text-xs rounded-full">
                        +{member.specializations.length - 2}
                      </span>
                    )}
                  </div>

                  {/* View More Hint */}
                  <div
                    className={`mt-4 text-sm text-brand-green font-medium transition-all duration-300 ${
                      isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    Clicca per saperne di più →
                  </div>
                </div>

                {/* Bottom Accent */}
                <div
                  className={`h-1 bg-gradient-to-r ${member.color} transform origin-left transition-transform duration-300 ${
                    isHovered ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Gradient */}
            <div className={`relative h-40 bg-gradient-to-br ${selectedMember.color}`}>
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="gridModal" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#gridModal)" />
                </svg>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Avatar */}
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute -inset-2 bg-white rounded-full" />
                  <Image
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    width={120}
                    height={120}
                    className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-18 pb-8 px-6 text-center">
              <div className="mt-10">
                <h3 className="text-2xl font-extrabold text-brand-dark">{selectedMember.name}</h3>
                <p
                  className={`text-lg font-semibold bg-gradient-to-r ${selectedMember.color} bg-clip-text text-transparent`}
                >
                  {selectedMember.role}
                </p>
              </div>

              {/* Category & Experience */}
              <div className="flex justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-brand-dark">{selectedMember.experience}</div>
                  <div className="text-xs text-brand-gray">Esperienza</div>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-lg font-bold text-brand-dark">{selectedMember.category}</div>
                  <div className="text-xs text-brand-gray">Ruolo</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-brand-gray mt-6 text-sm leading-relaxed">{selectedMember.bio}</p>

              {/* Specializations */}
              <div className="mt-6">
                <h4 className="text-sm font-bold text-brand-dark mb-3">Specializzazioni</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedMember.specializations.map((spec) => (
                    <span
                      key={spec}
                      className={`px-3 py-1 bg-gradient-to-r ${selectedMember.color} text-white text-sm rounded-full`}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              {selectedMember.social && (
                <div className="flex justify-center gap-4 mt-6">
                  {selectedMember.social.instagram && (
                    <a
                      href={selectedMember.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {selectedMember.social.linkedin && (
                    <a
                      href={selectedMember.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className={`mt-8 w-full bg-gradient-to-r ${selectedMember.color} text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}