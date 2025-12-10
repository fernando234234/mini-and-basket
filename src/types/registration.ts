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
}

// Type for insertion (without id and created_at)
export type RegistrationInsert = Omit<Registration, 'id' | 'created_at'>