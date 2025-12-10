'use client'

import { useState } from 'react'
import { mockRegistrations } from '@/lib/mockData'
import { Registration } from '@/types/registration'
import RegistrationsTable from '@/components/admin/RegistrationsTable'

export default function AdminIscrizioniPage() {
  // In a real app, this would be fetched from Supabase
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations)

  const handleStatusChange = (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === id ? { ...reg, status } : reg
      )
    )
    // In a real app, this would update Supabase
    console.log(`Status changed for ${id} to ${status}`)
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

      {/* Table */}
      <RegistrationsTable 
        registrations={registrations}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}