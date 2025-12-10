import { supabase, isSupabaseConfigured } from './supabase'

// Demo credentials for mock mode
export const DEMO_CREDENTIALS = {
  email: 'admin@miniandbasketcamp.it',
  password: 'demo123',
}

export interface AuthUser {
  id: string
  email: string
  name?: string
}

// Check if user is authenticated
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  // If Supabase is not configured, check localStorage for demo mode
  if (!isSupabaseConfigured()) {
    if (typeof window !== 'undefined') {
      const demoUser = localStorage.getItem('demo_user')
      if (demoUser) {
        return JSON.parse(demoUser)
      }
    }
    return null
  }

  // Use Supabase auth
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
      }
    }
  } catch (error) {
    console.error('Error getting current user:', error)
  }
  return null
}

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> => {
  // If Supabase is not configured, use demo mode
  if (!isSupabaseConfigured()) {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const demoUser: AuthUser = {
        id: 'demo-user-1',
        email: DEMO_CREDENTIALS.email,
        name: 'Admin Demo',
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_user', JSON.stringify(demoUser))
      }
      return { user: demoUser, error: null }
    }
    return { user: null, error: 'Credenziali non valide. Usa admin@miniandbasketcamp.it / demo123' }
  }

  // Use Supabase auth
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return { user: null, error: error.message }
    }
    
    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
        },
        error: null,
      }
    }
    
    return { user: null, error: 'Errore durante il login' }
  } catch (error) {
    console.error('Sign in error:', error)
    return { user: null, error: 'Errore di connessione' }
  }
}

// Sign out
export const signOut = async (): Promise<void> => {
  // If Supabase is not configured, clear demo mode
  if (!isSupabaseConfigured()) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user')
    }
    return
  }

  // Use Supabase auth
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

// Check if running in demo mode
export const isDemoMode = (): boolean => {
  return !isSupabaseConfigured()
}

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  if (!isSupabaseConfigured()) {
    // For demo mode, just call with current state
    if (typeof window !== 'undefined') {
      const demoUser = localStorage.getItem('demo_user')
      callback(demoUser ? JSON.parse(demoUser) : null)
    }
    return { unsubscribe: () => {} }
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name,
      })
    } else {
      callback(null)
    }
  })

  return { unsubscribe: () => subscription.unsubscribe() }
}