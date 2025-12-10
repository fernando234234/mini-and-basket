'use client'

import { useState } from 'react'
import { mockRegistrations } from '@/lib/mockData'
import { Registration } from '@/types/registration'
import RegistrationsTable from '@/components/admin/RegistrationsTable'

export default function AdminIscrizioniPage() {
  // In a real app, this would be fetched from Supabase
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations)
  const [reminderSent, setReminderSent] = useState<string | null>(null)

  const handleStatusChange = (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    setRegistrations(prev =>
      prev.map(reg =>
        reg.id === id ? { ...reg, status } : reg
      )
    )
    // In a real app, this would update Supabase
    console.log(`Status changed for ${id} to ${status}`)
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

      {/* Table */}
      <RegistrationsTable
        registrations={registrations}
        onStatusChange={handleStatusChange}
        onSendPaymentReminder={handleSendPaymentReminder}
      />
    </div>
  )
}