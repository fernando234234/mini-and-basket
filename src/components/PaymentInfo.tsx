"use client";

import { useState } from "react";

export default function PaymentInfo() {
  const [activeTab, setActiveTab] = useState<"online" | "bonifico">("online");

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-lg">
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-1 bg-brand-green/10 text-brand-green text-sm font-bold rounded-full mb-3">
          💳 Metodi di Pagamento
        </span>
        <h3 className="text-2xl font-extrabold text-brand-dark">
          Come Pagare l&apos;Iscrizione
        </h3>
        <p className="text-brand-gray mt-2 text-sm">
          Scegli il metodo di pagamento più comodo per te
        </p>
      </div>

      {/* Tab Buttons */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab("online")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === "online"
              ? "bg-gradient-to-r from-brand-green to-emerald-500 text-white shadow-lg"
              : "bg-white text-brand-gray hover:bg-gray-100 border border-gray-200"
          }`}
        >
          💳 Pagamento Online
        </button>
        <button
          onClick={() => setActiveTab("bonifico")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === "bonifico"
              ? "bg-gradient-to-r from-brand-orange to-red-500 text-white shadow-lg"
              : "bg-white text-brand-gray hover:bg-gray-100 border border-gray-200"
          }`}
        >
          🏦 Bonifico Bancario
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        {activeTab === "online" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-brand-dark text-lg">Pagamento Online con Stripe</h4>
                <p className="text-sm text-brand-gray">Sicuro, veloce e protetto</p>
              </div>
            </div>

            <p className="text-brand-gray">
              Paga in sicurezza con i seguenti metodi:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: "💳", label: "Carta di Credito/Debito", desc: "Visa, Mastercard, Amex" },
                { icon: "🅿️", label: "PayPal", desc: "Account PayPal" },
                { icon: "📱", label: "Klarna", desc: "3 rate senza interessi" },
                { icon: "🏦", label: "SEPA Direct Debit", desc: "Addebito bancario" },
              ].map((method, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <span className="text-2xl block mb-1">{method.icon}</span>
                  <p className="font-semibold text-brand-dark text-sm">{method.label}</p>
                  <p className="text-xs text-brand-gray">{method.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="font-semibold text-green-800">Pagamento 100% Sicuro</p>
                  <p className="text-sm text-green-700">
                    I tuoi dati sono protetti con crittografia SSL. Non memorizziamo i dati della tua carta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-brand-dark text-lg">Bonifico Bancario</h4>
                <p className="text-sm text-brand-gray">Trasferimento diretto</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h5 className="font-bold text-brand-dark mb-3">Coordinate Bancarie:</h5>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-brand-gray text-sm">Intestatario:</span>
                  <span className="font-semibold text-brand-dark">ASD CA75 Basket Casalnuovo</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-brand-gray text-sm">IBAN:</span>
                  <span className="font-mono font-semibold text-brand-dark text-sm">IT 68 S 01005 03401 000000000033</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h5 className="font-bold text-amber-800 mb-2">📝 Causale del Bonifico:</h5>
              <p className="font-mono text-amber-900 bg-white px-3 py-2 rounded-lg border border-amber-300">
                Iscrizione Camp 2025 - [Nome e Cognome Partecipante]
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-blue-800">Conferma Pagamento</p>
                  <p className="text-sm text-blue-700">
                    Dopo aver effettuato il bonifico, invia la ricevuta a{" "}
                    <a href="mailto:info@miniandbasketcamp.it" className="font-semibold underline">
                      info@miniandbasketcamp.it
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
          <span className="text-2xl">💰</span>
          <div>
            <p className="font-semibold text-brand-dark">Acconto</p>
            <p className="text-sm text-brand-gray">€200 da versare all&apos;iscrizione</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
          <span className="text-2xl">📅</span>
          <div>
            <p className="font-semibold text-brand-dark">Saldo</p>
            <p className="text-sm text-brand-gray">Entro il 31 Maggio 2025</p>
          </div>
        </div>
      </div>
    </section>
  );
}