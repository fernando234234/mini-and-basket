'use client'

import { useState } from 'react'
import { Registration } from '@/types/registration'
import RegistrationDetail from './RegistrationDetail'

interface RegistrationsTableProps {
  registrations: Registration[]
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

export default function RegistrationsTable({ registrations, onStatusChange }: RegistrationsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [packageFilter, setPackageFilter] = useState<string>('all')
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter registrations
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.camper_nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.camper_cognome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.genitore_email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter
    const matchesPackage = packageFilter === 'all' || reg.package_type === packageFilter

    return matchesSearch && matchesStatus && matchesPackage
  })

  // Pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, startIndex + itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedRegistrations.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedRegistrations.map(r => r.id!))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const exportToCSV = () => {
    const dataToExport = selectedIds.length > 0 
      ? registrations.filter(r => selectedIds.includes(r.id!))
      : filteredRegistrations

    const headers = [
      'ID', 'Data Iscrizione', 'Pacchetto', 'Nome Camper', 'Cognome Camper', 
      'Data Nascita', 'Taglia', 'Esperienza', 'Allergie', 'Note Mediche',
      'Nome Genitore', 'Cognome Genitore', 'Email', 'Telefono', 'CF', 'Indirizzo',
      'Contatto Emergenza', 'Relazione', 'Tel. Emergenza', 'Stato'
    ]

    const rows = dataToExport.map(r => [
      r.id, formatDate(r.created_at!), r.package_type, r.camper_nome, r.camper_cognome,
      r.camper_data_nascita, r.camper_taglia, r.camper_esperienza, r.camper_allergie || '',
      r.camper_note_mediche || '', r.genitore_nome, r.genitore_cognome, r.genitore_email,
      r.genitore_telefono, r.genitore_codice_fiscale, r.genitore_indirizzo,
      r.emergenza_nome, r.emergenza_relazione, r.emergenza_telefono, r.status
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `iscrizioni_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div>
      {/* Filters and Actions */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cerca per nome o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
          >
            <option value="all">Tutti gli stati</option>
            <option value="pending">In attesa</option>
            <option value="confirmed">Confermati</option>
            <option value="cancelled">Annullati</option>
          </select>

          {/* Package Filter */}
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
          >
            <option value="all">Tutti i pacchetti</option>
            <option value="giornaliero">Giornaliero</option>
            <option value="completa">Settimana Completa</option>
            <option value="weekend">Weekend</option>
          </select>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {filteredRegistrations.length} iscrizioni trovate
            {selectedIds.length > 0 && ` (${selectedIds.length} selezionate)`}
          </div>
          <div className="flex gap-2">
            {selectedIds.length > 0 && onStatusChange && (
              <button
                onClick={() => {
                  selectedIds.forEach(id => onStatusChange(id, 'confirmed'))
                  setSelectedIds([])
                }}
                className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors text-sm"
              >
                Conferma selezionati
              </button>
            )}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Esporta CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedRegistrations.length && paginatedRegistrations.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-brand-green focus:ring-brand-green"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camper</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Età</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pacchetto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Genitore</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>Nessuna iscrizione trovata</p>
                  </td>
                </tr>
              ) : (
                paginatedRegistrations.map((registration) => (
                  <tr 
                    key={registration.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedRegistration(registration)}
                  >
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(registration.id!)}
                        onChange={() => handleSelectOne(registration.id!)}
                        className="rounded border-gray-300 text-brand-green focus:ring-brand-green"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      #{registration.id?.slice(0, 8)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {formatDate(registration.created_at!)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {registration.camper_nome} {registration.camper_cognome}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {calculateAge(registration.camper_data_nascita)} anni
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {packageLabels[registration.package_type]}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {registration.genitore_email}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusLabels[registration.status].class}`}>
                        {statusLabels[registration.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRegistration(registration)}
                          className="p-1 text-gray-500 hover:text-brand-green transition-colors"
                          title="Visualizza dettagli"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {onStatusChange && registration.status !== 'confirmed' && (
                          <button
                            onClick={() => onStatusChange(registration.id!, 'confirmed')}
                            className="p-1 text-gray-500 hover:text-brand-green transition-colors"
                            title="Conferma"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Pagina {currentPage} di {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Precedente
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Successiva
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRegistration && (
        <RegistrationDetail
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  )
}