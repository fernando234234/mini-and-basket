'use client'

import { useState, useMemo } from 'react'
import { Registration, paymentStatusLabels } from '@/types/registration'
import RegistrationDetail from './RegistrationDetail'

interface RegistrationsTableProps {
  registrations: Registration[]
  onStatusChange?: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void
  onSendPaymentReminder?: (id: string, email: string) => void
  onDelete?: (id: string) => void
}

const statusLabels = {
  pending: { label: 'In attesa', class: 'bg-amber-100 text-amber-800', icon: '⏳' },
  confirmed: { label: 'Confermato', class: 'bg-green-100 text-green-800', icon: '✅' },
  cancelled: { label: 'Annullato', class: 'bg-red-100 text-red-800', icon: '❌' },
}

const packageLabels = {
  giornaliero: { label: 'Giornaliero', color: 'bg-blue-100 text-blue-800' },
  completa: { label: 'Settimana Completa', color: 'bg-purple-100 text-purple-800' },
  weekend: { label: 'Weekend', color: 'bg-teal-100 text-teal-800' },
}

const packagePrices = {
  giornaliero: 250,
  completa: 450,
  weekend: 150,
}

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'] as const
const experienceOptions = [
  { value: 'nessuna', label: 'Nessuna esperienza' },
  { value: '1-2-anni', label: '1-2 anni' },
  { value: '3+-anni', label: '3+ anni' },
] as const

const ageRanges = [
  { value: '6-8', label: '6-8 anni', min: 6, max: 8 },
  { value: '9-11', label: '9-11 anni', min: 9, max: 11 },
  { value: '12-14', label: '12-14 anni', min: 12, max: 14 },
  { value: '15+', label: '15+ anni', min: 15, max: 99 },
] as const

export default function RegistrationsTable({ 
  registrations, 
  onStatusChange, 
  onSendPaymentReminder,
  onDelete 
}: RegistrationsTableProps) {
  // Basic filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [packageFilter, setPackageFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  
  // Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sizeFilter, setSizeFilter] = useState<string>('all')
  const [experienceFilter, setExperienceFilter] = useState<string>('all')
  const [ageFilter, setAgeFilter] = useState<string>('all')
  const [dateFromFilter, setDateFromFilter] = useState<string>('')
  const [dateToFilter, setDateToFilter] = useState<string>('')
  const [hasNotesFilter, setHasNotesFilter] = useState(false)
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('all')

  // Table state
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)
  const itemsPerPage = 10

  // Calculate age from birth date
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

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (statusFilter !== 'all') count++
    if (packageFilter !== 'all') count++
    if (paymentFilter !== 'all') count++
    if (sizeFilter !== 'all') count++
    if (experienceFilter !== 'all') count++
    if (ageFilter !== 'all') count++
    if (dateFromFilter) count++
    if (dateToFilter) count++
    if (hasNotesFilter) count++
    if (paymentTypeFilter !== 'all') count++
    if (searchQuery) count++
    return count
  }, [statusFilter, packageFilter, paymentFilter, sizeFilter, experienceFilter, ageFilter, dateFromFilter, dateToFilter, hasNotesFilter, paymentTypeFilter, searchQuery])

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setPackageFilter('all')
    setPaymentFilter('all')
    setSizeFilter('all')
    setExperienceFilter('all')
    setAgeFilter('all')
    setDateFromFilter('')
    setDateToFilter('')
    setHasNotesFilter(false)
    setPaymentTypeFilter('all')
    setCurrentPage(1)
  }

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      // Search filter
      const matchesSearch =
        reg.camper_nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.camper_cognome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.genitore_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.genitore_telefono.includes(searchQuery) ||
        reg.genitore_nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.genitore_cognome.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Basic filters
      const matchesStatus = statusFilter === 'all' || reg.status === statusFilter
      const matchesPackage = packageFilter === 'all' || reg.package_type === packageFilter
      const matchesPayment = paymentFilter === 'all' || reg.payment_status === paymentFilter
      
      // Advanced filters
      const matchesSize = sizeFilter === 'all' || reg.camper_taglia === sizeFilter
      const matchesExperience = experienceFilter === 'all' || reg.camper_esperienza === experienceFilter
      
      // Age filter
      let matchesAge = true
      if (ageFilter !== 'all') {
        const age = calculateAge(reg.camper_data_nascita)
        const range = ageRanges.find(r => r.value === ageFilter)
        if (range) {
          matchesAge = age >= range.min && age <= range.max
        }
      }
      
      // Date range filter
      let matchesDateRange = true
      if (dateFromFilter) {
        matchesDateRange = new Date(reg.created_at!) >= new Date(dateFromFilter)
      }
      if (dateToFilter && matchesDateRange) {
        matchesDateRange = new Date(reg.created_at!) <= new Date(dateToFilter + 'T23:59:59')
      }
      
      // Has notes filter
      let matchesHasNotes = true
      if (hasNotesFilter) {
        const hasAllergies = Boolean(reg.camper_allergie && reg.camper_allergie.trim() !== '')
        const hasMedical = Boolean(reg.camper_note_mediche && reg.camper_note_mediche.trim() !== '')
        matchesHasNotes = hasAllergies || hasMedical
      }
      
      // Payment type filter
      const matchesPaymentType = paymentTypeFilter === 'all' || reg.payment_type === paymentTypeFilter

      return matchesSearch && matchesStatus && matchesPackage && matchesPayment && 
             matchesSize && matchesExperience && matchesAge && matchesDateRange && 
             matchesHasNotes && matchesPaymentType
    })
  }, [registrations, searchQuery, statusFilter, packageFilter, paymentFilter, sizeFilter, experienceFilter, ageFilter, dateFromFilter, dateToFilter, hasNotesFilter, paymentTypeFilter])

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
      'Data Nascita', 'Età', 'Taglia', 'Esperienza', 'Allergie', 'Note Mediche',
      'Nome Genitore', 'Cognome Genitore', 'Email', 'Telefono', 'CF', 'Indirizzo',
      'Contatto Emergenza', 'Relazione', 'Tel. Emergenza', 'Stato', 'Stato Pagamento', 'Importo Pagato'
    ]

    const rows = dataToExport.map(r => [
      r.id, formatDate(r.created_at!), r.package_type, r.camper_nome, r.camper_cognome,
      r.camper_data_nascita, calculateAge(r.camper_data_nascita), r.camper_taglia, r.camper_esperienza, 
      r.camper_allergie || '', r.camper_note_mediche || '', r.genitore_nome, r.genitore_cognome, 
      r.genitore_email, r.genitore_telefono, r.genitore_codice_fiscale, r.genitore_indirizzo,
      r.emergenza_nome, r.emergenza_relazione, r.emergenza_telefono, r.status, 
      r.payment_status || 'pending', r.amount_paid || 0
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

  const handleSendReminder = (id: string, email: string) => {
    setSendingReminder(id)
    if (onSendPaymentReminder) {
      onSendPaymentReminder(id, email)
    }
    setTimeout(() => setSendingReminder(null), 2000)
  }

  return (
    <div>
      {/* Filters and Actions */}
      <div className="mb-6 space-y-4">
        {/* Primary Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cerca per nome, email, telefono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent min-w-[150px]"
          >
            <option value="all">Tutti gli stati</option>
            <option value="pending">⏳ In attesa</option>
            <option value="confirmed">✅ Confermati</option>
            <option value="cancelled">❌ Annullati</option>
          </select>

          {/* Package Filter */}
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent min-w-[180px]"
          >
            <option value="all">Tutti i pacchetti</option>
            <option value="giornaliero">Giornaliero</option>
            <option value="completa">Settimana Completa</option>
            <option value="weekend">Weekend</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent min-w-[150px]"
          >
            <option value="all">Tutti i pagamenti</option>
            <option value="pending">⏳ Da pagare</option>
            <option value="paid">✅ Pagato</option>
            <option value="partial">💳 Acconto</option>
            <option value="failed">❌ Fallito</option>
          </select>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showAdvancedFilters || activeFilterCount > 0 
                ? 'border-brand-green bg-brand-green/10 text-brand-green' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtri Avanzati
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-brand-green rounded-full">
                {activeFilterCount}
              </span>
            )}
            <svg className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taglia</label>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                >
                  <option value="all">Tutte le taglie</option>
                  {sizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Esperienza</label>
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                >
                  <option value="all">Tutte</option>
                  {experienceOptions.map(exp => (
                    <option key={exp.value} value={exp.value}>{exp.label}</option>
                  ))}
                </select>
              </div>

              {/* Age Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fascia d&apos;età</label>
                <select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                >
                  <option value="all">Tutte le età</option>
                  {ageRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Payment Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Pagamento</label>
                <select
                  value={paymentTypeFilter}
                  onChange={(e) => setPaymentTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                >
                  <option value="all">Tutti</option>
                  <option value="full">Saldo completo</option>
                  <option value="deposit">Acconto</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data iscrizione da</label>
                <input
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => setDateFromFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data iscrizione a</label>
                <input
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => setDateToFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                />
              </div>

              {/* Has Notes Checkbox */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasNotesFilter}
                    onChange={(e) => setHasNotesFilter(e.target.checked)}
                    className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Solo con allergie/note mediche
                  </span>
                </label>
              </div>

              {/* Clear Filters */}
              <div className="flex items-center">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Pulisci filtri ({activeFilterCount})
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="font-semibold">{filteredRegistrations.length}</span> iscrizioni trovate
            {selectedIds.length > 0 && (
              <span className="ml-2 text-brand-green">
                ({selectedIds.length} selezionate)
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {selectedIds.length > 0 && onStatusChange && (
              <button
                onClick={() => {
                  selectedIds.forEach(id => onStatusChange(id, 'confirmed'))
                  setSelectedIds([])
                }}
                className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
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
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedRegistrations.length && paginatedRegistrations.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-brand-green focus:ring-brand-green"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camper</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genitore</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pacchetto</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taglia</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="font-medium">Nessuna iscrizione trovata</p>
                    <p className="text-sm mt-1">Prova a modificare i filtri di ricerca</p>
                  </td>
                </tr>
              ) : (
                paginatedRegistrations.map((registration) => {
                  const age = calculateAge(registration.camper_data_nascita)
                  const hasAllergies = registration.camper_allergie && registration.camper_allergie.trim() !== ''
                  const hasMedical = registration.camper_note_mediche && registration.camper_note_mediche.trim() !== ''
                  const hasNotes = hasAllergies || hasMedical
                  const paymentStatus = registration.payment_status || 'pending'
                  const paymentInfo = paymentStatusLabels[paymentStatus]
                  const price = packagePrices[registration.package_type]
                  const amountPaid = registration.amount_paid || 0

                  return (
                    <tr 
                      key={registration.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedRegistration(registration)}
                    >
                      <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(registration.id!)}
                          onChange={() => handleSelectOne(registration.id!)}
                          className="rounded border-gray-300 text-brand-green focus:ring-brand-green"
                        />
                      </td>
                      <td className="px-3 py-4 text-xs text-gray-500 font-mono">
                        #{registration.id?.slice(0, 6)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {formatDate(registration.created_at!)}
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-medium text-gray-900">
                          {registration.camper_nome} {registration.camper_cognome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {age} anni
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-900">
                          {registration.genitore_nome} {registration.genitore_cognome}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <a href={`tel:${registration.genitore_telefono}`} className="hover:text-brand-green">
                            {registration.genitore_telefono}
                          </a>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${packageLabels[registration.package_type].color}`}>
                          {packageLabels[registration.package_type].label}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg text-sm font-bold text-gray-700">
                          {registration.camper_taglia}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentInfo.class}`}>
                            {paymentInfo.icon} {paymentInfo.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            €{amountPaid} / €{price}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusLabels[registration.status].class}`}>
                          {statusLabels[registration.status].icon} {statusLabels[registration.status].label}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        {hasNotes ? (
                          <div className="flex items-center gap-1">
                            {hasAllergies && (
                              <span 
                                className="inline-flex items-center justify-center w-6 h-6 bg-red-100 rounded-full text-red-600"
                                title={`Allergie: ${registration.camper_allergie}`}
                              >
                                ⚠️
                              </span>
                            )}
                            {hasMedical && (
                              <span 
                                className="inline-flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full text-orange-600"
                                title={`Note: ${registration.camper_note_mediche}`}
                              >
                                📋
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {/* Email */}
                          <a
                            href={`mailto:${registration.genitore_email}`}
                            className="p-1.5 text-gray-500 hover:text-brand-green hover:bg-gray-100 rounded transition-colors"
                            title="Invia email"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                          {/* Phone */}
                          <a
                            href={`tel:${registration.genitore_telefono}`}
                            className="p-1.5 text-gray-500 hover:text-brand-green hover:bg-gray-100 rounded transition-colors"
                            title="Chiama"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </a>
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedRegistration(registration)}
                            className="p-1.5 text-gray-500 hover:text-brand-green hover:bg-gray-100 rounded transition-colors"
                            title="Visualizza dettagli"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {/* Quick Confirm */}
                          {onStatusChange && registration.status === 'pending' && (
                            <button
                              onClick={() => onStatusChange(registration.id!, 'confirmed')}
                              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Conferma"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          {/* Payment Reminder */}
                          {(paymentStatus === 'pending' || paymentStatus === 'partial') && onSendPaymentReminder && (
                            <button
                              onClick={() => handleSendReminder(registration.id!, registration.genitore_email)}
                              disabled={sendingReminder === registration.id}
                              className="p-1.5 text-gray-500 hover:text-brand-orange hover:bg-orange-50 rounded transition-colors disabled:opacity-50"
                              title="Invia promemoria pagamento"
                            >
                              {sendingReminder === registration.id ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRegistrations.length)} di {filteredRegistrations.length} • Pagina {currentPage} di {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                «
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹ Prec
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Succ ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                »
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
          onDelete={onDelete}
        />
      )}
    </div>
  )
}