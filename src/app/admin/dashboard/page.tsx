'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MockRegistration } from '@/lib/mockData'
import StatsCard from '@/components/admin/StatsCard'

// Types for API response
interface StatsApiResponse {
  stats: {
    total: number
    pending: number
    confirmed: number
    cancelled: number
    revenue: number
    pendingPayments: number
  }
  sizeDistribution: Record<string, number>
  ageDistribution: Record<string, number>
  experienceDistribution: {
    principiante: number
    intermedio: number
    avanzato: number
  }
  specialNeeds: {
    withAllergies: number
    withMedicalNotes: number
    withAnyNotes: number
    total: number
  }
  packageDistribution: {
    standard: { total: number; confirmed: number }
    alta_specializzazione: { total: number; confirmed: number }
  }
  recentRegistrations: MockRegistration[]
  source: 'supabase' | 'mock'
  message?: string
  error?: string
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<StatsApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'supabase' | 'mock'>('mock')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/stats')
      const result: StatsApiResponse = await response.json()
      
      setData(result)
      setDataSource(result.source)
      setLastUpdated(new Date())
      
      console.log(`[Dashboard] Loaded stats from ${result.source}`)
    } catch (error) {
      console.error('[Dashboard] Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const statusLabels: Record<string, { label: string; class: string }> = {
    pending: { label: 'In attesa', class: 'bg-amber-100 text-amber-800' },
    confirmed: { label: 'Confermato', class: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Annullato', class: 'bg-red-100 text-red-800' },
  }

  const packagePrices = {
    standard: 610,
    alta_specializzazione: 800,
  }

  // Helper to extract initials from full name
  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ')
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    }
    return fullName.substring(0, 2).toUpperCase()
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  const { stats, sizeDistribution, ageDistribution, experienceDistribution, specialNeeds, packageDistribution, recentRegistrations } = data

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Panoramica generale del camp</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            dataSource === 'supabase'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {dataSource === 'supabase' ? '🟢 Database Live' : '🟡 Demo Mode'}
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            🔄 Aggiorna
          </button>
          <div className="text-sm text-gray-500">
            {lastUpdated.toLocaleTimeString('it-IT')}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Iscrizioni Totali"
          value={stats.total}
          subtitle="Quest'anno"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="blue"
        />
        <StatsCard
          title="In Attesa"
          value={stats.pending}
          subtitle={`${stats.pendingPayments} pagamenti da ricevere`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="orange"
        />
        <StatsCard
          title="Confermati"
          value={stats.confirmed}
          subtitle="Pagamento ricevuto"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
        />
        <StatsCard
          title="Entrate Totali"
          value={formatCurrency(stats.revenue)}
          subtitle="Iscrizioni confermate"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
        />
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Iscrizioni Recenti</h2>
            <Link
              href="/admin/iscrizioni"
              className="text-sm text-brand-green hover:text-brand-green/80 font-medium"
            >
              Vedi tutte →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentRegistrations.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>Nessuna iscrizione ancora</p>
              </div>
            ) : (
              recentRegistrations.map((reg) => (
                <div key={reg.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center">
                        <span className="text-brand-green font-medium">
                          {getInitials(reg.camper_nome_cognome)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {reg.camper_nome_cognome}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(reg.created_at!)} • {reg.genitore_email}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusLabels[reg.status].class}`}>
                      {statusLabels[reg.status].label}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Azioni Rapide</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link
              href="/admin/iscrizioni"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-brand-green/10 hover:border-brand-green border border-transparent transition-all group"
            >
              <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Gestisci Iscrizioni</p>
                <p className="text-sm text-gray-500">{stats.pending} da confermare</p>
              </div>
            </Link>

            <Link
              href="/admin/galleria"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-brand-orange/10 hover:border-brand-orange border border-transparent transition-all group"
            >
              <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Gestisci Galleria</p>
                <p className="text-sm text-gray-500">Aggiungi o modifica foto</p>
              </div>
            </Link>

            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-500 border border-transparent transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Visualizza Sito</p>
                <p className="text-sm text-gray-500">Apri in nuova scheda</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Stats by Package */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Iscrizioni per Pacchetto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { type: 'standard' as const, label: 'Camp Standard', price: packagePrices.standard, color: 'blue' },
            { type: 'alta_specializzazione' as const, label: 'Alta Specializzazione', price: packagePrices.alta_specializzazione, color: 'purple' },
          ].map((pkg) => {
            const pkgData = packageDistribution[pkg.type]
            return (
              <div key={pkg.type} className={`p-4 bg-${pkg.color}-50 rounded-lg border border-${pkg.color}-100`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{pkg.label}</h3>
                  <span className={`text-sm font-semibold text-${pkg.color}-600`}>{formatCurrency(pkg.price)}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{pkgData.total}</p>
                    <p className="text-sm text-gray-500">iscrizioni</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-brand-green">{pkgData.confirmed}</p>
                    <p className="text-sm text-gray-500">confermate</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* T-Shirt Size Distribution & Age Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* T-Shirt Sizes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Distribuzione Taglie Magliette
          </h2>
          <div className="space-y-4">
            {Object.entries(sizeDistribution).map(([size, count]) => {
              const total = Object.values(sizeDistribution).reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? (count / total) * 100 : 0
              return (
                <div key={size} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-gray-700">{size}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{count} magliett{count === 1 ? 'a' : 'e'}</span>
                      <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-orange h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Totale: <span className="font-semibold text-gray-900">{Object.values(sizeDistribution).reduce((a, b) => a + b, 0)} magliette</span>
            </p>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v-1a6 6 0 00-9-5.197" />
            </svg>
            Distribuzione per Età
          </h2>
          <div className="space-y-4">
            {Object.entries(ageDistribution).map(([range, count]) => {
              const total = Object.values(ageDistribution).reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? (count / total) * 100 : 0
              const colors: Record<string, string> = {
                '6-8': 'bg-blue-500',
                '9-11': 'bg-green-500',
                '12-14': 'bg-purple-500',
                '15+': 'bg-orange-500',
              }
              return (
                <div key={range} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-gray-700">{range} anni</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{count} camper</span>
                      <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colors[range]} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Totale: <span className="font-semibold text-gray-900">{Object.values(ageDistribution).reduce((a, b) => a + b, 0)} camper attivi</span>
            </p>
          </div>
        </div>
      </div>

      {/* Experience & Special Needs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Livello di Esperienza
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'principiante' as const, label: 'Principianti', icon: '🌱', color: 'blue' },
              { key: 'intermedio' as const, label: 'Intermedio', icon: '🏀', color: 'green' },
              { key: 'avanzato' as const, label: 'Avanzato', icon: '⭐', color: 'purple' },
            ].map((exp) => (
              <div key={exp.key} className={`p-4 bg-${exp.color}-50 rounded-lg text-center`}>
                <span className="text-2xl">{exp.icon}</span>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {experienceDistribution[exp.key]}
                </p>
                <p className="text-xs text-gray-500 mt-1">{exp.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Special Needs / Allergies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Allergie e Note Mediche
          </h2>
          <p className="text-sm text-gray-500 mb-4">Importante per catering e sicurezza</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚠️</span>
                <span className="text-sm font-medium text-red-700">Con Allergie</span>
              </div>
              <p className="text-3xl font-bold text-red-600">{specialNeeds.withAllergies}</p>
              <p className="text-xs text-gray-500 mt-1">su {specialNeeds.total} iscritti</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📋</span>
                <span className="text-sm font-medium text-orange-700">Note Mediche</span>
              </div>
              <p className="text-3xl font-bold text-orange-600">{specialNeeds.withMedicalNotes}</p>
              <p className="text-xs text-gray-500 mt-1">su {specialNeeds.total} iscritti</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-amber-800">
                {specialNeeds.withAnyNotes} camper richiedono attenzione speciale
              </span>
            </div>
          </div>
          <Link
            href="/admin/iscrizioni?hasNotes=true"
            className="mt-4 inline-flex items-center gap-2 text-sm text-brand-green hover:underline"
          >
            Visualizza tutti →
          </Link>
        </div>
      </div>
    </div>
  )
}