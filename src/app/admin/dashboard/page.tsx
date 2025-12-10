'use client'

import Link from 'next/link'
import { mockRegistrations, getRegistrationStats, getRecentRegistrations } from '@/lib/mockData'
import StatsCard from '@/components/admin/StatsCard'

export default function AdminDashboardPage() {
  const stats = getRegistrationStats()
  const recentRegistrations = getRecentRegistrations(5)

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Panoramica generale del camp</p>
        </div>
        <div className="text-sm text-gray-500">
          Ultimo aggiornamento: {new Date().toLocaleTimeString('it-IT')}
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
          subtitle="Da confermare"
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
                          {reg.camper_nome.charAt(0)}{reg.camper_cognome.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {reg.camper_nome} {reg.camper_cognome}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { type: 'giornaliero', label: 'Giornaliero', price: 50 },
            { type: 'completa', label: 'Settimana Completa', price: 350 },
            { type: 'weekend', label: 'Weekend', price: 150 },
          ].map((pkg) => {
            const count = mockRegistrations.filter(r => r.package_type === pkg.type).length
            const confirmed = mockRegistrations.filter(r => r.package_type === pkg.type && r.status === 'confirmed').length
            return (
              <div key={pkg.type} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{pkg.label}</h3>
                  <span className="text-sm text-gray-500">{formatCurrency(pkg.price)}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-500">iscrizioni</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-brand-green">{confirmed}</p>
                    <p className="text-sm text-gray-500">confermate</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}