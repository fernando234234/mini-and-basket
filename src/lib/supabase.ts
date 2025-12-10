import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey)
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