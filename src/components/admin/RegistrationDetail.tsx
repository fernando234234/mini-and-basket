'use client'

import { useState } from 'react'
import { MockRegistration } from '@/lib/mockData'
import { paymentStatusLabels } from '@/types/registration'

interface RegistrationDetailProps {
  registration: MockRegistration
  onClose: () => void
  onStatusChange?: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void
  onSendReminder?: (id: string, email: string, type: 'confirmation' | 'payment') => void
  onDelete?: (id: string) => void
}

const statusLabels = {
  pending: { label: 'In attesa', class: 'bg-amber-100 text-amber-800', icon: '⏳' },
  confirmed: { label: 'Confermato', class: 'bg-green-100 text-green-800', icon: '✅' },
  cancelled: { label: 'Annullato', class: 'bg-red-100 text-red-800', icon: '❌' },
}

const packageLabels = {
  standard: { label: 'Camp Standard', price: 610, color: 'bg-blue-100 text-blue-800' },
  alta_specializzazione: { label: 'Alta Specializzazione', price: 800, color: 'bg-purple-100 text-purple-800' },
}

const experienceLabels = {
  principiante: { label: 'Principiante', icon: '🌱' },
  intermedio: { label: 'Intermedio', icon: '🏀' },
  avanzato: { label: 'Avanzato', icon: '⭐' },
}

const sizeLabels: Record<string, string> = {
  XXS: 'Extra Extra Small',
  XS: 'Extra Small',
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  XL: 'Extra Large',
}

export default function RegistrationDetail({ 
  registration, 
  onClose, 
  onStatusChange,
  onSendReminder,
  onDelete 
}: RegistrationDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const handleSendReminder = async (type: 'confirmation' | 'payment') => {
    if (!onSendReminder) return
    setSendingReminder(type)
    await onSendReminder(registration.id!, registration.genitore_email, type)
    setTimeout(() => setSendingReminder(null), 2000)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(registration.id!)
      onClose()
    }
  }

  const packageInfo = packageLabels[registration.package_type]
  const paymentStatus = registration.payment_status || 'pending'
  const paymentInfo = paymentStatusLabels[paymentStatus]
  const amountPaid = registration.amount_paid || 0
  const totalPrice = packageInfo.price + (registration.bus_transfer ? 60 : 0)
  const amountDue = registration.amount_due || totalPrice
  const age = calculateAge(registration.camper_data_nascita)

  const hasAllergies = registration.allergie_intolleranze && registration.allergie_intolleranze.trim() !== ''
  const hasMedicalNotes = registration.patologie_note && registration.patologie_note.trim() !== ''

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Dettagli Iscrizione
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">#{registration.id?.slice(0, 8)}</span>
                <span>•</span>
                <span>{formatDateTime(registration.created_at!)}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Section 1: Pacchetto e Pagamento */}
            <div className="bg-gradient-to-r from-brand-green/5 to-brand-orange/5 rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Pacchetto e Pagamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Tipo Pacchetto</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${packageInfo.color}`}>
                    {packageInfo.label}
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-2">{formatCurrency(packageInfo.price)}</p>
                  {registration.bus_transfer && (
                    <p className="text-sm text-gray-500 mt-1">+ Bus transfer: {formatCurrency(60)}</p>
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Stato Pagamento</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentInfo.class}`}>
                    {paymentInfo.icon} {paymentInfo.label}
                  </span>
                  {registration.payment_type && (
                    <p className="text-xs text-gray-500 mt-2">
                      Tipo: {registration.payment_type === 'full' ? 'Saldo completo' : 'Acconto'}
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Importo Pagato</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(amountPaid)}</p>
                  {amountDue > 0 && paymentStatus !== 'paid' && (
                    <p className="text-sm text-red-600 mt-1">
                      Dovuto: {formatCurrency(amountDue)}
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Stato Iscrizione</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusLabels[registration.status].class}`}>
                    {statusLabels[registration.status].icon} {statusLabels[registration.status].label}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    Iscritta il: {formatDate(registration.created_at!)}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Camper Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informazioni Camper
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Nome Completo</p>
                  <p className="font-semibold text-gray-900 text-lg">{registration.camper_nome_cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Codice Fiscale</p>
                  <p className="font-mono font-medium text-gray-900">{registration.camper_codice_fiscale}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Data e Luogo di Nascita</p>
                  <p className="font-medium text-gray-900">{formatDate(registration.camper_data_nascita)}</p>
                  <p className="text-sm text-gray-500">{registration.camper_luogo_nascita}</p>
                  <p className="text-sm text-brand-green font-semibold">
                    {age} anni • {registration.camper_sesso === 'M' ? 'Maschio' : 'Femmina'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Taglia Maglietta</p>
                  <p className="font-semibold text-gray-900 text-2xl">{registration.camper_taglia}</p>
                  <p className="text-xs text-gray-500">{sizeLabels[registration.camper_taglia]}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Fisico</p>
                  <p className="font-medium text-gray-900">
                    {registration.camper_altezza} cm • {registration.camper_peso} kg
                  </p>
                  <p className="text-sm text-gray-500">Scarpe: EU {registration.camper_numero_scarpe}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Esperienza Basket</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <span>{experienceLabels[registration.camper_esperienza].icon}</span>
                    {experienceLabels[registration.camper_esperienza].label}
                  </p>
                  {registration.camper_societa && (
                    <p className="text-sm text-gray-500">Società: {registration.camper_societa}</p>
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2 lg:col-span-1">
                  <p className="text-sm text-gray-500 mb-1">Scuola</p>
                  <p className="font-medium text-gray-900">{registration.camper_scuola}</p>
                  <p className="text-sm text-gray-500">Classe: {registration.camper_classe}</p>
                </div>
                
                {/* Allergie - highlighted */}
                <div className={`rounded-lg p-4 shadow-sm lg:col-span-1 ${hasAllergies ? 'bg-red-50 border-2 border-red-200' : 'bg-white'}`}>
                  <p className={`text-sm mb-1 flex items-center gap-1 ${hasAllergies ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {hasAllergies && <span>⚠️</span>}
                    Allergie / Intolleranze
                  </p>
                  {hasAllergies ? (
                    <p className="font-semibold text-red-700">{registration.allergie_intolleranze}</p>
                  ) : (
                    <p className="text-gray-400 italic">Nessuna allergia segnalata</p>
                  )}
                </div>
                
                {/* Note Mediche - highlighted */}
                <div className={`rounded-lg p-4 shadow-sm lg:col-span-1 ${hasMedicalNotes ? 'bg-orange-50 border-2 border-orange-200' : 'bg-white'}`}>
                  <p className={`text-sm mb-1 flex items-center gap-1 ${hasMedicalNotes ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                    {hasMedicalNotes && <span>📋</span>}
                    Patologie Note
                  </p>
                  {hasMedicalNotes ? (
                    <p className="font-semibold text-orange-700">{registration.patologie_note}</p>
                  ) : (
                    <p className="text-gray-400 italic">Nessuna patologia segnalata</p>
                  )}
                </div>

                {/* Terapie in corso */}
                {registration.terapie_in_corso && (
                  <div className="bg-yellow-50 rounded-lg p-4 shadow-sm border-2 border-yellow-200">
                    <p className="text-sm text-yellow-600 font-medium mb-1 flex items-center gap-1">
                      💊 Terapie in Corso
                    </p>
                    <p className="font-semibold text-yellow-700">{registration.terapie_in_corso}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Genitore/Tutore */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Genitore / Tutore
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Nome Completo</p>
                  <p className="font-semibold text-gray-900">{registration.genitore_nome_cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Codice Fiscale</p>
                  <p className="font-mono font-medium text-gray-900">{registration.genitore_codice_fiscale || 'Non fornito'}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <a 
                    href={`mailto:${registration.genitore_email}`} 
                    className="font-medium text-brand-green hover:underline flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {registration.genitore_email}
                  </a>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Telefono</p>
                  <a 
                    href={`tel:${registration.genitore_telefono}`} 
                    className="font-medium text-brand-green hover:underline flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {registration.genitore_telefono}
                  </a>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Indirizzo</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {registration.genitore_indirizzo}, {registration.genitore_cap} {registration.genitore_citta}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Consensi */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Consensi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3">
                  <span className={`text-2xl ${registration.liberatoria_foto_video ? '✅' : '❌'}`}></span>
                  <div>
                    <p className="font-medium text-gray-900">Liberatoria Foto/Video</p>
                    <p className="text-sm text-gray-500">{registration.liberatoria_foto_video ? 'Accettata' : 'Non accettata'}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3">
                  <span className={`text-2xl ${registration.accettazione_regolamento ? '✅' : '❌'}`}></span>
                  <div>
                    <p className="font-medium text-gray-900">Regolamento Camp</p>
                    <p className="text-sm text-gray-500">{registration.accettazione_regolamento ? 'Accettato' : 'Non accettato'}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3">
                  <span className={`text-2xl ${registration.privacy_policy ? '✅' : '❌'}`}></span>
                  <div>
                    <p className="font-medium text-gray-900">Privacy Policy</p>
                    <p className="text-sm text-gray-500">{registration.privacy_policy ? 'Accettata' : 'Non accettata'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 space-y-4">
            {/* Action Buttons Row 1 */}
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {/* Quick Email */}
                <a
                  href={`mailto:${registration.genitore_email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Invia Email
                </a>
                
                {/* Quick Call */}
                <a
                  href={`tel:${registration.genitore_telefono}`}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Chiama
                </a>

                {/* Payment Reminder */}
                {(paymentStatus === 'pending' || paymentStatus === 'partial') && onSendReminder && (
                  <button
                    onClick={() => handleSendReminder('payment')}
                    disabled={sendingReminder === 'payment'}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm disabled:opacity-50"
                  >
                    {sendingReminder === 'payment' ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {sendingReminder === 'payment' ? 'Invio...' : 'Promemoria Pagamento'}
                  </button>
                )}
              </div>

              {/* Export PDF (placeholder) */}
              <button
                onClick={() => {
                  // TODO: Implement PDF export
                  alert('Funzionalità PDF in arrivo!')
                }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Esporta PDF
              </button>
            </div>

            {/* Action Buttons Row 2 - Status Changes */}
            <div className="flex flex-wrap gap-3 justify-between items-center pt-2 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {onStatusChange && (
                  <>
                    {registration.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          onStatusChange(registration.id!, 'cancelled')
                          onClose()
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Annulla iscrizione
                      </button>
                    )}
                    {registration.status === 'pending' && (
                      <button
                        onClick={() => {
                          onStatusChange(registration.id!, 'confirmed')
                          onClose()
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Conferma iscrizione
                      </button>
                    )}
                    {registration.status === 'cancelled' && (
                      <button
                        onClick={() => {
                          onStatusChange(registration.id!, 'pending')
                          onClose()
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Riattiva iscrizione
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Delete Button */}
              {onDelete && (
                <div>
                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Sei sicuro?</span>
                      <button
                        onClick={handleDelete}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Elimina
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                      >
                        Annulla
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Elimina
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}