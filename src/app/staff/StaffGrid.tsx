"use client";

import { useState } from "react";
import Image from "next/image";

interface StaffMember {
  name: string;
  role: string;
  category: string;
  avatar: string;
  bio?: string;
  specializations?: string[];
  color: string;
}

const staffMembers: StaffMember[] = [
  // Direzione
  {
    name: "Antonio Nappi",
    role: "Responsabile Mini&Basket Camp",
    category: "Direzione",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
    bio: "Fondatore e direttore del Mini&Basket Camp dal 2004. La sua visione e passione hanno reso questo camp uno dei principali in Italia.",
    specializations: ["Leadership", "Organizzazione", "Formazione giovanile"],
    color: "from-brand-green to-emerald-600",
  },
  // Allenatori
  {
    name: "Gianluca Tucci",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    color: "from-brand-orange to-red-500",
  },
  {
    name: "Elia Confessore",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Gianluca Morena",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "Alessandra Finamore",
    role: "Allenatrice",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&q=80",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Matteo De Rosa",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
    color: "from-teal-500 to-cyan-600",
  },
  {
    name: "Mimmo Montuori",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Enzo Patrizio",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
    color: "from-lime-500 to-green-600",
  },
  {
    name: "Ciro Falasconi",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    color: "from-brand-green to-emerald-600",
  },
  {
    name: "Sergio Luise",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
    color: "from-brand-orange to-red-500",
  },
  {
    name: "Walter De Raffaele",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Vincenzo Di Meglio",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "Giovanni Benedetto",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    color: "from-teal-500 to-cyan-600",
  },
  {
    name: "Francesco Ponticiello",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Alfredo Lamberti",
    role: "Allenatore",
    category: "Allenatori",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    color: "from-lime-500 to-green-600",
  },
  // Campioni / Guest Stars
  {
    name: "Linton Johnson",
    role: "NBA / Guest Star",
    category: "Campioni",
    avatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&q=80",
    bio: "Ex giocatore NBA, protagonista del One Day Camp. Un'esperienza unica per i giovani cestisti.",
    specializations: ["NBA Experience", "Tecnica individuale"],
    color: "from-yellow-500 to-amber-600",
  },
  {
    name: "Gasper Vidmar",
    role: "Serie A / Umana",
    category: "Campioni",
    avatar: "https://images.unsplash.com/photo-1546961342-ea5f71b193f3?w=300&q=80",
    bio: "Giocatore professionista di Serie A, porta la sua esperienza ai giovani atleti del camp.",
    color: "from-red-500 to-rose-600",
  },
  {
    name: "Caterina Mattera",
    role: "Nazionale Italiana #20",
    category: "Campioni",
    avatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&q=80",
    bio: "Giocatrice della Nazionale Italiana, modello di riferimento per le giovani atlete.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Pino Corvo",
    role: "Nazionale Italiana",
    category: "Campioni",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
    bio: "Ex nazionale italiano con importanti trofei nel suo palmares.",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Marida Orazzo",
    role: "Nazionale Italiana",
    category: "Campioni",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80",
    bio: "Giocatrice della Nazionale Italiana femminile.",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Antonio Gallo",
    role: "Giocatore Professionista",
    category: "Campioni",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "Antonio Sabatino",
    role: "Staff Camp",
    category: "Campioni",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
    color: "from-teal-500 to-cyan-600",
  },
  {
    name: "Alessandro Morgillo",
    role: "Staff Camp",
    category: "Campioni",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    color: "from-orange-500 to-red-600",
  },
];

const categories = ["Tutti", "Direzione", "Allenatori", "Campioni"];

export default function StaffGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const filteredStaff = selectedCategory === "Tutti"
    ? staffMembers
    : staffMembers.filter((member) => member.category === selectedCategory);

  return (
    <div>
      {/* Section Intro */}
      <div className="text-center mb-10">
        <p className="text-brand-gray max-w-3xl mx-auto">
          Uno staff tecnico di altissimo profilo per sviluppare le capacità tecniche e tattiche 
          dei giovani partecipanti. Istruttori qualificati, preparatori fisici ed ex campioni 
          professionisti ti accompagneranno in questa esperienza unica.
        </p>
      </div>

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
            {category !== "Tutti" && (
              <span className="ml-2 text-xs opacity-70">
                ({staffMembers.filter(m => m.category === category).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredStaff.map((member, index) => {
          const isHovered = hoveredMember === index;

          return (
            <div
              key={member.name}
              className="group cursor-pointer"
              onClick={() => member.bio ? setSelectedMember(member) : null}
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div
                className={`relative bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-500 ${
                  isHovered ? "shadow-xl -translate-y-2" : ""
                }`}
              >
                {/* Top Gradient Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${member.color}`} />

                {/* Content */}
                <div className="p-4 text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-3">
                    <div
                      className={`absolute -inset-1 bg-gradient-to-br ${member.color} rounded-full opacity-0 blur-md transition-all duration-300 ${
                        isHovered ? "opacity-40" : ""
                      }`}
                    />
                    <div className="relative">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-3 border-white shadow-md"
                      />
                      {member.category === "Campioni" && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs">⭐</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <h3 className="font-bold text-brand-dark text-sm md:text-base leading-tight">{member.name}</h3>
                  <p className={`text-xs md:text-sm font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent mt-1`}>
                    {member.role}
                  </p>

                  {/* Category Badge */}
                  <div className="mt-2">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-brand-gray text-xs font-medium rounded-full">
                      {member.category}
                    </span>
                  </div>

                  {/* View More Hint (only if has bio) */}
                  {member.bio && (
                    <div
                      className={`mt-2 text-xs text-brand-green font-medium transition-all duration-300 ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Scopri di più →
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Count Summary */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-4 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-black text-brand-green">1</div>
            <div className="text-xs text-brand-gray">Direttore</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="text-2xl font-black text-brand-orange">14</div>
            <div className="text-xs text-brand-gray">Allenatori</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="text-2xl font-black text-yellow-500">8+</div>
            <div className="text-xs text-brand-gray">Guest Stars</div>
          </div>
        </div>
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
            <div className={`relative h-32 bg-gradient-to-br ${selectedMember.color}`}>
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
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute -inset-2 bg-white rounded-full" />
                  <Image
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    width={100}
                    height={100}
                    className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-16 pb-8 px-6 text-center">
              <h3 className="text-2xl font-extrabold text-brand-dark">{selectedMember.name}</h3>
              <p className={`text-lg font-semibold bg-gradient-to-r ${selectedMember.color} bg-clip-text text-transparent`}>
                {selectedMember.role}
              </p>

              {/* Category */}
              <div className="mt-3">
                <span className="inline-block px-4 py-1 bg-gray-100 text-brand-gray text-sm font-medium rounded-full">
                  {selectedMember.category}
                </span>
              </div>

              {/* Bio */}
              {selectedMember.bio && (
                <p className="text-brand-gray mt-6 text-sm leading-relaxed">{selectedMember.bio}</p>
              )}

              {/* Specializations */}
              {selectedMember.specializations && (
                <div className="mt-6">
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