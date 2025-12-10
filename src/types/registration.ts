export interface Registration {
  id?: string
  created_at?: string
  // Package
  package_type: 'giornaliero' | 'completa' | 'weekend'
  // Camper
  camper_nome: string
  camper_cognome: string
  camper_data_nascita: string
  camper_taglia: 'XS' | 'S' | 'M' | 'L' | 'XL'
  camper_esperienza: 'nessuna' | '1-2-anni' | '3+-anni'
  camper_allergie?: string
  camper_note_mediche?: string
  // Parent
  genitore_nome: string
  genitore_cognome: string
  genitore_email: string
  genitore_telefono: string
  genitore_codice_fiscale: string
  genitore_indirizzo: string
  // Emergency
  emergenza_nome: string
  emergenza_relazione: string
  emergenza_telefono: string
  // Status
  status: 'pending' | 'confirmed' | 'cancelled'
  terms_accepted: boolean
  privacy_accepted: boolean
  // Payment
  payment_status?: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded'
  payment_type?: 'full' | 'deposit'
  amount_paid?: number
  amount_due?: number
  stripe_session_id?: string
  payment_date?: string
}

// Type for insertion (without id and created_at)
export type RegistrationInsert = Omit<Registration, 'id' | 'created_at'>

// Payment status labels
export const paymentStatusLabels = {
  pending: { label: 'Da pagare', class: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  paid: { label: 'Pagato', class: 'bg-green-100 text-green-800', icon: '✅' },
  partial: { label: 'Acconto', class: 'bg-blue-100 text-blue-800', icon: '💳' },
  failed: { label: 'Fallito', class: 'bg-red-100 text-red-800', icon: '❌' },
  refunded: { label: 'Rimborsato', class: 'bg-gray-100 text-gray-800', icon: '↩️' },
}