import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Check if Supabase is configured (not using placeholder values)
export const isSupabaseConfigured = (): boolean => {
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('your-') &&
    !supabaseAnonKey.includes('<') &&
    supabaseUrl !== 'your-supabase-url'
  )
}

// Check if we're in local development mode
export const isLocalSupabase = (): boolean => {
  return supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost')
}

// Create a mock client for demo mode that won't throw errors
const createMockClient = (): SupabaseClient => {
  // Return a proxy that handles any method calls gracefully
  return new Proxy({} as SupabaseClient, {
    get: () => {
      return new Proxy(() => {}, {
        get: () => () => Promise.resolve({ data: null, error: null }),
        apply: () => Promise.resolve({ data: null, error: null }),
      })
    },
  })
}

// Only create real client if Supabase is configured, otherwise use mock
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient()

// Service role client for server-side operations (webhooks, admin operations)
// Only use this on the server side!
export const supabaseAdmin: SupabaseClient = isSupabaseConfigured() && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : createMockClient()

// Database types for type safety
export type Database = {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          package_type: 'standard' | 'alta_specializzazione'
          bus_transfer: boolean
          genitore_nome_cognome: string
          genitore_codice_fiscale: string | null
          genitore_citta: string
          genitore_cap: string
          genitore_indirizzo: string
          genitore_telefono: string
          genitore_email: string
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
          camper_altezza: number
          camper_peso: number
          camper_numero_scarpe: string
          camper_esperienza: 'principiante' | 'intermedio' | 'avanzato'
          camper_societa: string | null
          allergie_intolleranze: string | null
          patologie_note: string | null
          terapie_in_corso: string | null
          liberatoria_foto_video: boolean
          accettazione_regolamento: boolean
          privacy_policy: boolean
          status: 'pending' | 'confirmed' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded'
          payment_type: 'full' | 'deposit' | null
          amount_paid: number
          amount_due: number | null
          stripe_session_id: string | null
          payment_date: string | null
          codice_invito: string | null
        }
        Insert: Omit<Database['public']['Tables']['registrations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['registrations']['Insert']>
      }
      payments: {
        Row: {
          id: string
          registration_id: string
          created_at: string
          payment_method: 'stripe' | 'bonifico'
          payment_type: 'deposit' | 'full' | 'balance'
          amount: number
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          bonifico_reference: string | null
          metadata: Record<string, unknown>
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      gallery_photos: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          url: string
          alt_text: string
          year: number
          category: 'allenamenti' | 'partite' | 'attivita' | 'gruppo'
          featured: boolean
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['gallery_photos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['gallery_photos']['Insert']>
      }
      contact_submissions: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          subject: 'info' | 'iscrizione' | 'pagamenti' | 'programma' | 'altro'
          message: string
          status: 'new' | 'read' | 'responded' | 'archived'
          responded_at: string | null
          admin_notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['contact_submissions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>
      }
    }
  }
}