import { supabase, supabaseAdmin, isSupabaseConfigured, Database } from './supabase'
import { Registration, RegistrationInsert } from '@/types/registration'
import { GalleryPhoto, GalleryPhotoInsert } from '@/types/gallery'
import { mockRegistrations } from './mockData'

// ============================================
// TYPES
// ============================================

export interface Payment {
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

export interface PaymentInsert {
  registration_id: string
  payment_method: 'stripe' | 'bonifico'
  payment_type: 'deposit' | 'full' | 'balance'
  amount: number
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  stripe_payment_intent_id?: string
  stripe_session_id?: string
  bonifico_reference?: string
  metadata?: Record<string, unknown>
}

export interface ContactSubmission {
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

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: 'info' | 'iscrizione' | 'pagamenti' | 'programma' | 'altro'
  message: string
}

export interface PhotoMetadata {
  alt_text: string
  year: number
  category: 'allenamenti' | 'partite' | 'attivita' | 'gruppo'
  featured?: boolean
  sort_order?: number
}

// ============================================
// REGISTRATION CRUD
// ============================================

/**
 * Create a new registration
 */
export async function createRegistration(data: RegistrationInsert): Promise<Registration> {
  if (!isSupabaseConfigured()) {
    // Return mock registration for demo mode
    const mockReg: Registration = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...data,
      status: 'pending',
      payment_status: 'pending',
    }
    console.log('[Mock] Created registration:', mockReg.id)
    return mockReg
  }

  const { data: registration, error } = await supabase
    .from('registrations')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Error creating registration:', error)
    throw new Error(`Failed to create registration: ${error.message}`)
  }

  return registration
}

/**
 * Get all registrations (admin)
 */
export async function getRegistrations(): Promise<Registration[]> {
  if (!isSupabaseConfigured()) {
    console.log('[Mock] Returning mock registrations')
    return mockRegistrations
  }

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching registrations:', error)
    throw new Error(`Failed to fetch registrations: ${error.message}`)
  }

  return data || []
}

/**
 * Get a single registration by ID
 */
export async function getRegistrationById(id: string): Promise<Registration | null> {
  if (!isSupabaseConfigured()) {
    const mockReg = mockRegistrations.find(r => r.id === id)
    return mockReg || null
  }

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Error fetching registration:', error)
    throw new Error(`Failed to fetch registration: ${error.message}`)
  }

  return data
}

/**
 * Get registration by email
 */
export async function getRegistrationByEmail(email: string): Promise<Registration | null> {
  if (!isSupabaseConfigured()) {
    const mockReg = mockRegistrations.find(r => r.genitore_email === email)
    return mockReg || null
  }

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('genitore_email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching registration by email:', error)
    throw new Error(`Failed to fetch registration: ${error.message}`)
  }

  return data
}

/**
 * Update registration status
 */
export async function updateRegistrationStatus(
  id: string, 
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('[Mock] Updated registration status:', id, status)
    return
  }

  const { error } = await supabase
    .from('registrations')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating registration status:', error)
    throw new Error(`Failed to update registration status: ${error.message}`)
  }
}

/**
 * Update registration payment status (admin/webhook)
 */
export async function updateRegistrationPayment(
  id: string,
  paymentData: {
    payment_status: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded'
    payment_type?: 'full' | 'deposit'
    amount_paid?: number
    stripe_session_id?: string
    payment_date?: string
  }
): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('[Mock] Updated registration payment:', id, paymentData)
    return
  }

  const { error } = await supabaseAdmin
    .from('registrations')
    .update(paymentData)
    .eq('id', id)

  if (error) {
    console.error('Error updating registration payment:', error)
    throw new Error(`Failed to update registration payment: ${error.message}`)
  }
}

/**
 * Get registration statistics
 */
export async function getRegistrationStats(): Promise<{
  total: number
  pending: number
  confirmed: number
  cancelled: number
  paid: number
  partial: number
}> {
  if (!isSupabaseConfigured()) {
    return {
      total: mockRegistrations.length,
      pending: mockRegistrations.filter(r => r.status === 'pending').length,
      confirmed: mockRegistrations.filter(r => r.status === 'confirmed').length,
      cancelled: mockRegistrations.filter(r => r.status === 'cancelled').length,
      paid: mockRegistrations.filter(r => r.payment_status === 'paid').length,
      partial: mockRegistrations.filter(r => r.payment_status === 'partial').length,
    }
  }

  const { data, error } = await supabase
    .from('registrations')
    .select('status, payment_status')

  if (error) {
    console.error('Error fetching registration stats:', error)
    throw new Error(`Failed to fetch registration stats: ${error.message}`)
  }

  const registrations = data || []
  return {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    confirmed: registrations.filter(r => r.status === 'confirmed').length,
    cancelled: registrations.filter(r => r.status === 'cancelled').length,
    paid: registrations.filter(r => r.payment_status === 'paid').length,
    partial: registrations.filter(r => r.payment_status === 'partial').length,
  }
}

// ============================================
// PAYMENTS CRUD
// ============================================

/**
 * Create a payment record
 */
export async function createPayment(data: PaymentInsert): Promise<Payment> {
  if (!isSupabaseConfigured()) {
    const mockPayment: Payment = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      registration_id: data.registration_id,
      payment_method: data.payment_method,
      payment_type: data.payment_type,
      amount: data.amount,
      status: data.status || 'pending',
      stripe_payment_intent_id: data.stripe_payment_intent_id || null,
      stripe_session_id: data.stripe_session_id || null,
      bonifico_reference: data.bonifico_reference || null,
      metadata: data.metadata || {},
    }
    console.log('[Mock] Created payment:', mockPayment.id)
    return mockPayment
  }

  const { data: payment, error } = await supabaseAdmin
    .from('payments')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Error creating payment:', error)
    throw new Error(`Failed to create payment: ${error.message}`)
  }

  return payment
}

/**
 * Get payments for a registration
 */
export async function getPaymentsByRegistration(registrationId: string): Promise<Payment[]> {
  if (!isSupabaseConfigured()) {
    console.log('[Mock] Returning empty payments for registration:', registrationId)
    return []
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('registration_id', registrationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching payments:', error)
    throw new Error(`Failed to fetch payments: ${error.message}`)
  }

  return data || []
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  id: string, 
  status: 'pending' | 'completed' | 'failed' | 'refunded'
): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('[Mock] Updated payment status:', id, status)
    return
  }

  const { error } = await supabaseAdmin
    .from('payments')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating payment status:', error)
    throw new Error(`Failed to update payment status: ${error.message}`)
  }
}

/**
 * Get payment by Stripe session ID
 */
export async function getPaymentByStripeSession(sessionId: string): Promise<Payment | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching payment by session:', error)
    throw new Error(`Failed to fetch payment: ${error.message}`)
  }

  return data
}

// ============================================
// GALLERY CRUD
// ============================================

/**
 * Get all gallery photos
 */
export async function getPhotos(filters?: {
  year?: number
  category?: string
  featured?: boolean
}): Promise<GalleryPhoto[]> {
  if (!isSupabaseConfigured()) {
    // Return mock gallery photos
    const mockPhotos: GalleryPhoto[] = [
      {
        id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        url: '/images/gallery/placeholder-1.jpg',
        alt_text: 'Camp 2024',
        year: 2024,
        category: 'gruppo',
        featured: true,
        sort_order: 1,
      },
    ]
    return mockPhotos
  }

  let query = supabase
    .from('gallery_photos')
    .select('*')
    .order('sort_order', { ascending: true })

  if (filters?.year) {
    query = query.eq('year', filters.year)
  }
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching photos:', error)
    throw new Error(`Failed to fetch photos: ${error.message}`)
  }

  return data || []
}

/**
 * Upload a photo (creates record in database)
 * Note: Actual file upload should use Supabase Storage
 */
export async function uploadPhoto(url: string, metadata: PhotoMetadata): Promise<GalleryPhoto> {
  if (!isSupabaseConfigured()) {
    const mockPhoto: GalleryPhoto = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      url,
      alt_text: metadata.alt_text,
      year: metadata.year,
      category: metadata.category,
      featured: metadata.featured || false,
      sort_order: metadata.sort_order || 0,
    }
    console.log('[Mock] Uploaded photo:', mockPhoto.id)
    return mockPhoto
  }

  const { data, error } = await supabase
    .from('gallery_photos')
    .insert({
      url,
      alt_text: metadata.alt_text,
      year: metadata.year,
      category: metadata.category,
      featured: metadata.featured || false,
      sort_order: metadata.sort_order || 0,
    })
    .select()
    .single()

  if (error) {
    console.error('Error uploading photo:', error)
    throw new Error(`Failed to upload photo: ${error.message}`)
  }

  return data
}

/**
 * Update a photo
 */
export async function updatePhoto(id: string, data: Partial<GalleryPhotoInsert>): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('[Mock] Updated photo:', id, data)
    return
  }

  const { error } = await supabase
    .from('gallery_photos')
    .update(data)
    .eq('id', id)

  if (error) {
    console.error('Error updating photo:', error)
    throw new Error(`Failed to update photo: ${error.message}`)
  }
}

/**
 * Delete a photo
 */
export async function deletePhoto(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('[Mock] Deleted photo:', id)
    return
  }

  const { error } = await supabase
    .from('gallery_photos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting photo:', error)
    throw new Error(`Failed to delete photo: ${error.message}`)
  }
}

// ============================================
// CONTACT SUBMISSIONS CRUD
// ============================================

/**
 * Create a contact submission
 */
export async function createContactSubmission(data: ContactFormData): Promise<ContactSubmission> {
  if (!isSupabaseConfigured()) {
    const mockSubmission: ContactSubmission = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...data,
      status: 'new',
      responded_at: null,
      admin_notes: null,
    }
    console.log('[Mock] Created contact submission:', mockSubmission.id)
    return mockSubmission
  }

  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Error creating contact submission:', error)
    throw new Error(`Failed to create contact submission: ${error.message}`)
  }

  return submission
}

/**
 * Get all contact submissions (admin)
 */
export async function getContactSubmissions(filters?: {
  status?: 'new' | 'read' | 'responded' | 'archived'
}): Promise<ContactSubmission[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  let query = supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching contact submissions:', error)
    throw new Error(`Failed to fetch contact submissions: ${error.message}`)
  }

  return data || []
}

/**
 * Update contact submission status
 */
export async function updateContactSubmissionStatus(
  id: string,
  status: 'new' | 'read' | 'responded' | 'archived',
  adminNotes?: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('[Mock] Updated contact submission:', id, status)
    return
  }

  const updateData: { status: string; admin_notes?: string; responded_at?: string } = { status }
  if (adminNotes) {
    updateData.admin_notes = adminNotes
  }
  if (status === 'responded') {
    updateData.responded_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('contact_submissions')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error updating contact submission:', error)
    throw new Error(`Failed to update contact submission: ${error.message}`)
  }
}