'use client'

import { Registration } from '@/types/registration'

interface RegistrationDetailProps {
  registration: Registration
  onClose: () => void
  onStatusChange?: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void
}

const statusLabels = {
  pending: { label: 'In attesa', class: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confermato', class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annullato', class: 'bg-red-100 text-red-800' },
}

const packageLabels = {
  giornaliero: 'Giornaliero',
  completa: 'Settimana Completa',
  weekend: 'Weekend',
}

const experienceLabels = {
  nessuna: 'Nessuna esperienza',
  '1-2-anni': '1-2 anni di esperienza',
  '3+-anni': '3+ anni di esperienza',
}

export default function RegistrationDetail({ registration, onClose, onStatusChange }: RegistrationDetailProps) {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Dettagli Iscrizione
              </h2>
              <p className="text-sm text-gray-500">
                #{registration.id?.slice(0, 8)} • {formatDateTime(registration.created_at!)}
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
            {/* Status and Package */}
            <div className="flex flex-wrap items-center gap-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusLabels[registration.status].class}`}>
                {statusLabels[registration.status].label}
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium">
                {packageLabels[registration.package_type]}
              </span>
            </div>

            {/* Camper Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informazioni Camper
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nome completo</p>
                  <p className="font-medium text-gray-900">{registration.camper_nome} {registration.camper_cognome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data di nascita</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(registration.camper_data_nascita)} ({calculateAge(registration.camper_data_nascita)} anni)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Taglia maglietta</p>
                  <p className="font-medium text-gray-900">{registration.camper_taglia}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Esperienza basket</p>
                  <p className="font-medium text-gray-900">{experienceLabels[registration.camper_esperienza]}</p>
                </div>
                {registration.camper_allergie && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Allergie</p>
                    <p className="font-medium text-red-600">{registration.camper_allergie}</p>
                  </div>
                )}
                {registration.camper_note_mediche && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Note mediche</p>
                    <p className="font-medium text-amber-600">{registration.camper_note_mediche}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Parent Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Informazioni Genitore
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nome completo</p>
                  <p className="font-medium text-gray-900">{registration.genitore_nome} {registration.genitore_cognome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Codice Fiscale</p>
                  <p className="font-medium text-gray-900">{registration.genitore_codice_fiscale}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${registration.genitore_email}`} className="font-medium text-brand-green hover:underline">
                    {registration.genitore_email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefono</p>
                  <a href={`tel:${registration.genitore_telefono}`} className="font-medium text-brand-green hover:underline">
                    {registration.genitore_telefono}
                  </a>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Indirizzo</p>
                  <p className="font-medium text-gray-900">{registration.genitore_indirizzo}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contatto di Emergenza
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium text-gray-900">{registration.emergenza_nome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relazione</p>
                  <p className="font-medium text-gray-900">{registration.emergenza_relazione}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefono</p>
                  <a href={`tel:${registration.emergenza_telefono}`} className="font-medium text-red-600 hover:underline">
                    {registration.emergenza_telefono}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          {onStatusChange && (
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-wrap gap-3 justify-end">
              {registration.status !== 'cancelled' && (
                <button
                  onClick={() => {
                    onStatusChange(registration.id!, 'cancelled')
                    onClose()
                  }}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Annulla iscrizione
                </button>
              )}
              {registration.status === 'pending' && (
                <button
                  onClick={() => {
                    onStatusChange(registration.id!, 'confirmed')
                    onClose()
                  }}
                  className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors"
                >
                  Conferma iscrizione
                </button>
              )}
              {registration.status === 'cancelled' && (
                <button
                  onClick={() => {
                    onStatusChange(registration.id!, 'pending')
                    onClose()
                  }}
                  className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors"
                >
                  Riattiva iscrizione
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}