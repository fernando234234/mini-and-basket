import { supabase, isSupabaseConfigured } from './supabase'

// Demo credentials for mock mode
export const DEMO_CREDENTIALS = {
  email: 'admin@miniandbasketcamp.it',
  password: 'demo123',
}

export type AdminRole = 'admin' | 'subadmin'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role?: AdminRole | null
}

export interface AdminUser {
  id: string
  user_id: string
  email: string
  role: AdminRole
  created_by: string | null
  created_at: string
  updated_at: string
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
  // Normalize email: lowercase and trim whitespace
  const normalizedEmail = email.toLowerCase().trim()
  
  // If Supabase is not configured, use demo mode
  if (!isSupabaseConfigured()) {
    if (normalizedEmail === DEMO_CREDENTIALS.email.toLowerCase() && password === DEMO_CREDENTIALS.password) {
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
      email: normalizedEmail,
      password,
    })
    
    if (error) {
      // Provide more helpful error messages
      let errorMessage = error.message
      
      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Credenziali non valide. Verifica email e password.'
      } else if (error.message === 'Email not confirmed') {
        errorMessage = 'Email non confermata. Controlla la tua casella email per il link di conferma.'
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Troppi tentativi. Riprova tra qualche minuto.'
      }
      
      console.error('Supabase auth error:', error.message)
      return { user: null, error: errorMessage }
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
    return { user: null, error: 'Errore di connessione al server' }
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

// ============================================
// Admin Role Management Functions
// ============================================

// Get user's admin role from admin_users table
export const getUserRole = async (userId: string): Promise<AdminRole | null> => {
  // In demo mode, return admin role for demo user
  if (!isSupabaseConfigured()) {
    return 'admin'
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user role:', error)
      return null
    }

    return data?.role as AdminRole || null
  } catch (error) {
    console.error('Error in getUserRole:', error)
    return null
  }
}

// Check if user is an admin (not subadmin)
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const role = await getUserRole(userId)
  return role === 'admin'
}

// Check if user has any admin access (admin or subadmin)
export const hasAdminAccess = async (userId: string): Promise<boolean> => {
  const role = await getUserRole(userId)
  return role === 'admin' || role === 'subadmin'
}

// Get all admin users (admin only)
export const getAdminUsers = async (currentUserId: string): Promise<{ users: AdminUser[] | null; error: string | null }> => {
  // In demo mode, return mock data
  if (!isSupabaseConfigured()) {
    const mockUsers: AdminUser[] = [
      {
        id: 'demo-1',
        user_id: 'demo-user-1',
        email: DEMO_CREDENTIALS.email,
        role: 'admin',
        created_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
    return { users: mockUsers, error: null }
  }

  try {
    // First check if current user is admin
    const isAdmin = await isUserAdmin(currentUserId)
    if (!isAdmin) {
      return { users: null, error: 'Solo gli admin possono visualizzare gli utenti admin' }
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin users:', error)
      return { users: null, error: error.message }
    }

    return { users: data as AdminUser[], error: null }
  } catch (error) {
    console.error('Error in getAdminUsers:', error)
    return { users: null, error: 'Errore durante il recupero degli utenti admin' }
  }
}

// Invite a new admin user (admin only)
// Note: This requires the Supabase service role key for production use
// For now, this creates an entry in admin_users - the user must be created separately
export const inviteAdmin = async (
  email: string,
  role: AdminRole,
  currentUserId: string
): Promise<{ success: boolean; error: string | null }> => {
  // In demo mode, just return success
  if (!isSupabaseConfigured()) {
    return { success: true, error: null }
  }

  try {
    // Check if current user is admin
    const isAdmin = await isUserAdmin(currentUserId)
    if (!isAdmin) {
      return { success: false, error: 'Solo gli admin possono invitare nuovi utenti' }
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Check if admin_users entry already exists
    const { data: existing } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', normalizedEmail)
      .single()

    if (existing) {
      return { success: false, error: 'Questo utente è già un admin' }
    }

    // For now, we'll create a placeholder entry
    // The user_id will be null until the user is actually created
    // In production, you would use supabase.auth.admin.inviteUserByEmail()
    // which requires SUPABASE_SERVICE_ROLE_KEY
    
    // Note: This approach requires manual user creation in Supabase dashboard
    // or implementing a server-side API route with service role key
    
    const { error } = await supabase
      .from('admin_users')
      .insert({
        email: normalizedEmail,
        role,
        created_by: currentUserId,
        user_id: null, // Will be updated when user accepts invite
      })

    if (error) {
      console.error('Error inviting admin:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error in inviteAdmin:', error)
    return { success: false, error: 'Errore durante l\'invito dell\'admin' }
  }
}

// Update admin user role (admin only)
export const updateAdminRole = async (
  adminUserId: string,
  newRole: AdminRole,
  currentUserId: string
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: true, error: null }
  }

  try {
    // Check if current user is admin
    const isAdmin = await isUserAdmin(currentUserId)
    if (!isAdmin) {
      return { success: false, error: 'Solo gli admin possono modificare i ruoli' }
    }

    const { error } = await supabase
      .from('admin_users')
      .update({ role: newRole })
      .eq('id', adminUserId)

    if (error) {
      console.error('Error updating admin role:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error in updateAdminRole:', error)
    return { success: false, error: 'Errore durante l\'aggiornamento del ruolo' }
  }
}

// Remove admin user (admin only, cannot remove self)
export const removeAdminUser = async (
  adminUserId: string,
  currentUserId: string
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: true, error: null }
  }

  try {
    // Check if current user is admin
    const isAdmin = await isUserAdmin(currentUserId)
    if (!isAdmin) {
      return { success: false, error: 'Solo gli admin possono rimuovere utenti admin' }
    }

    // Get the admin user to check if trying to remove self
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('id', adminUserId)
      .single()

    if (adminUser?.user_id === currentUserId) {
      return { success: false, error: 'Non puoi rimuovere te stesso come admin' }
    }

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminUserId)

    if (error) {
      console.error('Error removing admin user:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error in removeAdminUser:', error)
    return { success: false, error: 'Errore durante la rimozione dell\'admin' }
  }
}