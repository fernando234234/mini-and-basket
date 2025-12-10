export interface Registration {
  id?: string
  created_at?: string
  
  // Package Selection
  package_type: 'standard' | 'alta_specializzazione'
  bus_transfer: boolean
  
  // Parent/Guardian Information (SEZIONE 1)
  genitore_nome_cognome: string
  genitore_codice_fiscale?: string // optional per originale
  genitore_citta: string
  genitore_cap: string
  genitore_indirizzo: string
  genitore_telefono: string
  genitore_email: string
  
  // Participant Information (SEZIONE 2)
  camper_nome_cognome: string
  camper_codice_fiscale: string
  camper_luogo_nascita: string
  camper_data_nascita: string
  camper_sesso: 'M' | 'F'
  camper_citta: string
  camper_cap: string
  camper_indirizzo: string
  camper_scuola: string
  camper_classe: string
  camper_taglia: 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL'
  camper_altezza: number // cm
  camper_peso: number // kg
  camper_numero_scarpe: string // EU size
  
  // Experience Level (SEZIONE 3)
  camper_esperienza: 'principiante' | 'intermedio' | 'avanzato'
  camper_societa?: string // Iscritto al centro MB/Società
  
  // Medical Information (SEZIONE 4)
  allergie_intolleranze?: string
  patologie_note?: string
  terapie_in_corso?: string
  
  // Consents (SEZIONE 8)
  liberatoria_foto_video: boolean
  accettazione_regolamento: boolean
  privacy_policy: boolean
  
  // Status
  status: 'pending' | 'confirmed' | 'cancelled'
  
  // Payment
  payment_status?: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded'
  payment_type?: 'full' | 'deposit'
  amount_paid?: number
  amount_due?: number
  stripe_session_id?: string
  payment_date?: string
  
  // Invitation code (optional)
  codice_invito?: string
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

// Experience level labels
export const experienceLevelLabels = {
  principiante: { label: 'Non ho mai giocato', description: 'Primo approccio al basket' },
  intermedio: { label: 'Gioco al campetto', description: 'Esperienza amatoriale' },
  avanzato: { label: 'Gioco in una squadra', description: 'Esperienza in società sportiva' },
}

// Package labels
export const packageLabels = {
  standard: {
    label: 'Camp Standard',
    price: '€610',
    earlyBirdPrice: '€590',
    description: '7 giorni di Camp con pensione completa'
  },
  alta_specializzazione: {
    label: 'Alta Specializzazione',
    price: '€800',
    earlyBirdPrice: '€760',
    description: '+7 ore di tecnica individuale (max 30 posti)'
  },
}

// T-shirt sizes
export const tshirtSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL'] as const