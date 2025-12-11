import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Get environment variables - these may be set at build time (NEXT_PUBLIC) or runtime
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

// Check if admin client is properly configured (for server-side operations)
export const isSupabaseAdminConfigured = (): boolean => {
  return !!(
    supabaseUrl &&
    supabaseServiceKey &&
    !supabaseUrl.includes('your-') &&
    supabaseUrl !== 'your-supabase-url' &&
    supabaseServiceKey.length > 20 // Service keys are long JWT tokens
  )
}

// Check if we're in local development mode
export const isLocalSupabase = (): boolean => {
  return supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost')
}

// Flag to track if we're using mock clients
export let isUsingMockClient = false
export let isUsingMockAdminClient = false

// Create a mock client for demo mode that won't throw errors
const createMockClient = (isAdmin: boolean = false): SupabaseClient => {
  if (isAdmin) {
    isUsingMockAdminClient = true
  } else {
    isUsingMockClient = true
  }
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
  : createMockClient(false)

// Service role client for server-side operations (webhooks, admin operations)
// Only use this on the server side!
// IMPORTANT: This checks SUPABASE_SERVICE_ROLE_KEY directly, not via isSupabaseConfigured()
// because NEXT_PUBLIC vars may not be available at runtime in Netlify Functions
export const supabaseAdmin: SupabaseClient = isSupabaseAdminConfigured()
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : createMockClient(true)

// Helper function to get admin client with proper error handling
// Use this in webhooks and server-side code for better debugging
export function getSupabaseAdmin(): { client: SupabaseClient; isConfigured: boolean; error?: string } {
  // Re-read env vars at runtime (important for Netlify Functions)
  const runtimeUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const runtimeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!runtimeUrl) {
    return {
      client: supabaseAdmin,
      isConfigured: false,
      error: 'NEXT_PUBLIC_SUPABASE_URL is not set'
    }
  }
  
  if (!runtimeServiceKey) {
    return {
      client: supabaseAdmin,
      isConfigured: false,
      error: 'SUPABASE_SERVICE_ROLE_KEY is not set'
    }
  }
  
  if (runtimeUrl.includes('your-') || runtimeUrl === 'your-supabase-url') {
    return {
      client: supabaseAdmin,
      isConfigured: false,
      error: 'NEXT_PUBLIC_SUPABASE_URL contains placeholder value'
    }
  }
  
  // If the module-level client is a mock but we have valid env vars now,
  // create a fresh client
  if (isUsingMockAdminClient) {
    console.log('[Supabase] Creating fresh admin client at runtime...')
    const freshClient = createClient(runtimeUrl, runtimeServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    return {
      client: freshClient,
      isConfigured: true
    }
  }
  
  return {
    client: supabaseAdmin,
    isConfigured: true
  }
}

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