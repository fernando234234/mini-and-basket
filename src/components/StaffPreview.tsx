"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function StaffPreview() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const staffMembers = [
    {
      name: "MARCO ROSSI",
      role: "Capo Allenatore",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
      bio: "20 anni di esperienza nel basket giovanile. Ex giocatore professionista Serie A2.",
      speciality: "Tattica & Strategia",
      experience: "20+ anni",
      color: "from-blue-500 to-indigo-600",
    },
    {
      name: "LAURA BIANCHI",
      role: "Preparatrice Atletica",
      avatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&q=80",
      bio: "Specializzata in preparazione atletica per giovani sportivi. Laurea in Scienze Motorie.",
      speciality: "Fitness & Wellness",
      experience: "15+ anni",
      color: "from-brand-green to-emerald-600",
    },
    {
      name: "ANNA VERDI",
      role: "Allenatrice",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80",
      bio: "Coach certificato FIBA con focus su fondamentali e sviluppo tecnico individuale.",
      speciality: "Tecnica Individuale",
      experience: "12+ anni",
      color: "from-brand-orange to-red-500",
    },
    {
      name: "ANDREA BANCHI",
      role: "Assistente",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
      bio: "Giovane allenatore in formazione con grande passione per il minibasket.",
      speciality: "Minibasket",
      experience: "5+ anni",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section aria-labelledby="staff-heading" id="staff" className="relative">
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold rounded-full mb-3">
          👥 Il Nostro Team
        </span>
        <h2
          className="text-2xl font-extrabold text-brand-dark"
          id="staff-heading"
        >
          STAFF D&apos;ECCELLENZA
        </h2>
        <p className="text-brand-gray text-sm mt-2">Professionisti appassionati</p>
      </div>

      {/* Staff Grid - Creative Layout */}
      <div className="relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-brand-orange/5 rounded-3xl -z-10" />

        {/* Hexagonal/Staggered Layout */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {staffMembers.map((member, index) => {
            const isHovered = hoveredMember === index;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative group cursor-pointer ${isEven ? "mt-0" : "mt-8"}`}
                onClick={() => setSelectedMember(index)}
                onMouseEnter={() => setHoveredMember(index)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                {/* Card */}
                <div className={`relative bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 ${
                  isHovered ? "shadow-2xl scale-105 -translate-y-2" : ""
                }`}>
                  {/* Top Gradient Bar */}
                  <div className={`h-2 bg-gradient-to-r ${member.color}`} />

                  {/* Avatar Container */}
                  <div className="relative pt-6 px-4 pb-4 flex flex-col items-center">
                    {/* Avatar with Ring */}
                    <div className="relative mb-4">
                      <div className={`absolute -inset-1.5 bg-gradient-to-br ${member.color} rounded-full opacity-50 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-300`} />
                      <div className="relative">
                        <Image
                          alt={`Photo of ${member.name}`}
                          className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg"
                          src={member.avatar}
                          width={80}
                          height={80}
                        />
                        {/* Status Indicator */}
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center border-2 border-white`}>
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Name & Role */}
                    <h3 className="font-bold text-brand-dark text-sm text-center leading-tight">
                      {member.name}
                    </h3>
                    <p className={`text-xs font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent mt-1`}>
                      {member.role}
                    </p>

                    {/* Speciality Badge */}
                    <div className="mt-3 px-3 py-1 bg-gray-100 rounded-full">
                      <span className="text-xs text-brand-gray">{member.speciality}</span>
                    </div>

                    {/* Experience Tag - Shows on Hover */}
                    <div className={`absolute bottom-2 left-2 right-2 flex justify-center transition-all duration-300 ${
                      isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}>
                      <span className="text-xs text-white bg-black/70 px-3 py-1 rounded-full backdrop-blur-sm">
                        {member.experience} esperienza
                      </span>
                    </div>
                  </div>

                  {/* Click Hint */}
                  <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${member.color} transform origin-left transition-transform duration-300 ${
                    isHovered ? "scale-x-100" : "scale-x-0"
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View All Link */}
      <Link
        href="/staff"
        className="mt-8 flex items-center justify-center gap-2 text-brand-green hover:text-brand-green-dark font-semibold transition-all duration-300 group"
      >
        <span>Scopri tutto lo staff</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>

      {/* Staff Detail Modal */}
      {selectedMember !== null && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Gradient */}
            <div className={`relative h-32 bg-gradient-to-br ${staffMembers[selectedMember].color}`}>
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Avatar - Positioned to overlap */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute -inset-2 bg-white rounded-full" />
                  <Image
                    src={staffMembers[selectedMember].avatar}
                    alt={staffMembers[selectedMember].name}
                    width={96}
                    height={96}
                    className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-16 pb-6 px-6 text-center">
              <h3 className="text-xl font-extrabold text-brand-dark">
                {staffMembers[selectedMember].name}
              </h3>
              <p className={`font-semibold bg-gradient-to-r ${staffMembers[selectedMember].color} bg-clip-text text-transparent`}>
                {staffMembers[selectedMember].role}
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-brand-dark">{staffMembers[selectedMember].experience}</div>
                  <div className="text-xs text-brand-gray">Esperienza</div>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-lg font-bold text-brand-dark">{staffMembers[selectedMember].speciality}</div>
                  <div className="text-xs text-brand-gray">Specialità</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-brand-gray mt-4 text-sm leading-relaxed">
                {staffMembers[selectedMember].bio}
              </p>

              {/* Action Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className={`mt-6 w-full bg-gradient-to-r ${staffMembers[selectedMember].color} text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}