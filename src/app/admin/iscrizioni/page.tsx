'use client'

import { useState, useEffect } from 'react'
import { MockRegistration } from '@/lib/mockData'
import RegistrationsTable from '@/components/admin/RegistrationsTable'

// Types for API response
interface RegistrationsApiResponse {
  data: MockRegistration[]
  source: 'supabase' | 'mock'
  message?: string
  error?: string
}

export default function AdminIscrizioniPage() {
  const [registrations, setRegistrations] = useState<MockRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [reminderSent, setReminderSent] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'supabase' | 'mock'>('mock')
  const [apiError, setApiError] = useState<string | null>(null)

  // Fetch registrations from API route
  const fetchRegistrations = async () => {
    setLoading(true)
    setApiError(null)
    try {
      const response = await fetch('/api/admin/registrations')
      const result: RegistrationsApiResponse = await response.json()
      
      setRegistrations(result.data)
      setDataSource(result.source)
      
      if (result.error) {
        setApiError(result.error)
        console.warn('[Admin] API returned with error:', result.error)
      }
      
      console.log(`[Admin] Loaded ${result.data.length} registrations from ${result.source}`)
    } catch (error) {
      console.error('[Admin] Error fetching registrations:', error)
      setApiError(error instanceof Error ? error.message : 'Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount
  useEffect(() => {
    fetchRegistrations()
  }, [])

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    // Optimistically update UI
    setRegistrations(prev =>
      prev.map(reg =>
        reg.id === id ? { ...reg, status } : reg
      )
    )

    try {
      const response = await fetch('/api/admin/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      
      const result = await response.json()
      
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to update status')
      }
      
      console.log(`[Admin] Status changed for ${id} to ${status}`)
    } catch (error) {
      console.error('[Admin] Error updating status:', error)
      // Revert on error - refetch data
      await fetchRegistrations()
    }
  }

  const handleSendPaymentReminder = (id: string, email: string) => {
    // In a real app, this would send an email via API
    console.log(`Sending payment reminder to ${email} for registration ${id}`)
    setReminderSent(id)
    setTimeout(() => setReminderSent(null), 3000)
    
    // Show success notification (in a real app, use a toast library)
    alert(`Promemoria di pagamento inviato a ${email}`)
  }

  // Calculate payment stats
  const paymentStats = {
    paid: registrations.filter(r => r.payment_status === 'paid').length,
    partial: registrations.filter(r => r.payment_status === 'partial').length,
    pending: registrations.filter(r => r.payment_status === 'pending' || !r.payment_status).length,
    failed: registrations.filter(r => r.payment_status === 'failed').length,
    totalRevenue: registrations
      .filter(r => r.payment_status === 'paid' || r.payment_status === 'partial')
      .reduce((sum, r) => sum + (r.amount_paid || 0), 0),
    pendingRevenue: registrations
      .filter(r => r.payment_status !== 'paid' && r.payment_status !== 'refunded')
      .reduce((sum, r) => sum + (r.amount_due || 0), 0),
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestione Iscrizioni</h1>
          <p className="text-gray-500">Visualizza e gestisci tutte le iscrizioni al camp</p>
        </div>
        {/* Data Source Indicator */}
        <div className="flex items-center gap-2">
          {apiError && (
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              ⚠️ {apiError}
            </div>
          )}
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            dataSource === 'supabase'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {dataSource === 'supabase' ? '🟢 Database Live' : '🟡 Demo Mode (Mock Data)'}
          </div>
          <button
            onClick={fetchRegistrations}
            disabled={loading}
            className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            🔄 Aggiorna
          </button>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-500">✅</span>
            <span className="text-sm text-gray-500">Pagati</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{paymentStats.paid}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-500">💳</span>
            <span className="text-sm text-gray-500">Acconti</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{paymentStats.partial}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500">⏳</span>
            <span className="text-sm text-gray-500">In Attesa</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{paymentStats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500">❌</span>
            <span className="text-sm text-gray-500">Falliti</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{paymentStats.failed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-500">💰</span>
            <span className="text-sm text-gray-500">Incassato</span>
          </div>
          <p className="text-2xl font-bold text-brand-green">€{paymentStats.totalRevenue}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-500">📊</span>
            <span className="text-sm text-gray-500">Da Incassare</span>
          </div>
          <p className="text-2xl font-bold text-brand-orange">€{paymentStats.pendingRevenue}</p>
        </div>
      </div>

      {/* Reminder Sent Notification */}
      {reminderSent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <span className="text-green-500">✉️</span>
          <span className="text-green-700">Promemoria di pagamento inviato con successo!</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        /* Table */
        <RegistrationsTable
          registrations={registrations}
          onStatusChange={handleStatusChange}
          onSendPaymentReminder={handleSendPaymentReminder}
        />
      )}
    </div>
  )
}