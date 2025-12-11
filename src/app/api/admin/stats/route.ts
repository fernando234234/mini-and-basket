import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { mockRegistrations, MockRegistration } from '@/lib/mockData'

// Helper to calculate age from birth date
const calculateAge = (birthDate: string | Date | null | undefined): number => {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  if (isNaN(birth.getTime())) return 0
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Define a flexible registration type that can handle Supabase data
interface RegistrationData {
  id?: string
  created_at?: string | null
  package_type?: string | null
  bus_transfer?: boolean | null
  genitore_nome_cognome?: string | null
  genitore_email?: string | null
  camper_nome_cognome?: string | null
  camper_data_nascita?: string | Date | null
  camper_taglia?: string | null
  camper_esperienza?: string | null
  allergie_intolleranze?: string | null
  patologie_note?: string | null
  status?: string | null
  payment_status?: string | null
  amount_paid?: number | null
  [key: string]: unknown
}

// Calculate all stats from registrations
function calculateStats(registrations: RegistrationData[]) {
  // Ensure registrations is an array
  if (!Array.isArray(registrations)) {
    console.error('[API Stats] registrations is not an array:', typeof registrations)
    registrations = []
  }

  console.log(`[API Stats] calculateStats called with ${registrations.length} registrations`)
  
  const total = registrations.length
  const pending = registrations.filter(r => r?.status === 'pending').length
  const confirmed = registrations.filter(r => r?.status === 'confirmed').length
  const cancelled = registrations.filter(r => r?.status === 'cancelled').length
  
  console.log(`[API Stats] Counts - total: ${total}, pending: ${pending}, confirmed: ${confirmed}, cancelled: ${cancelled}`)
  
  const revenue = registrations
    .filter(r => r?.status === 'confirmed' || r?.payment_status === 'paid' || r?.payment_status === 'partial')
    .reduce((sum, r) => sum + (Number(r?.amount_paid) || 0), 0)
  
  const pendingPayments = registrations.filter(
    r => r?.payment_status === 'pending' || r?.payment_status === 'partial'
  ).length

  // Size distribution
  const sizeDistribution: Record<string, number> = { XXS: 0, XS: 0, S: 0, M: 0, L: 0, XL: 0 }
  registrations
    .filter(r => r?.status !== 'cancelled')
    .forEach(r => {
      const taglia = r?.camper_taglia
      if (taglia && sizeDistribution[taglia] !== undefined) {
        sizeDistribution[taglia]++
      }
    })

  // Age distribution
  const ageDistribution: Record<string, number> = { '6-8': 0, '9-11': 0, '12-14': 0, '15+': 0 }
  registrations
    .filter(r => r?.status !== 'cancelled')
    .forEach(r => {
      if (r?.camper_data_nascita) {
        const age = calculateAge(r.camper_data_nascita)
        if (age >= 6 && age <= 8) ageDistribution['6-8']++
        else if (age >= 9 && age <= 11) ageDistribution['9-11']++
        else if (age >= 12 && age <= 14) ageDistribution['12-14']++
        else if (age >= 15) ageDistribution['15+']++
      }
    })

  // Experience distribution
  const experienceDistribution: Record<string, number> = { principiante: 0, intermedio: 0, avanzato: 0 }
  registrations
    .filter(r => r?.status !== 'cancelled')
    .forEach(r => {
      const esperienza = r?.camper_esperienza
      if (esperienza && experienceDistribution[esperienza] !== undefined) {
        experienceDistribution[esperienza]++
      }
    })

  // Special needs count
  const activeRegs = registrations.filter(r => r?.status !== 'cancelled')
  const withAllergies = activeRegs.filter(r => r?.allergie_intolleranze && String(r.allergie_intolleranze).trim() !== '').length
  const withMedicalNotes = activeRegs.filter(r => r?.patologie_note && String(r.patologie_note).trim() !== '').length
  const withAnyNotes = activeRegs.filter(r =>
    (r?.allergie_intolleranze && String(r.allergie_intolleranze).trim() !== '') ||
    (r?.patologie_note && String(r.patologie_note).trim() !== '')
  ).length
  const specialNeeds = { withAllergies, withMedicalNotes, withAnyNotes, total: activeRegs.length }

  // Package distribution
  const packageDistribution = {
    standard: {
      total: registrations.filter(r => r?.package_type === 'standard' && r?.status !== 'cancelled').length,
      confirmed: registrations.filter(r => r?.package_type === 'standard' && r?.status === 'confirmed').length,
    },
    alta_specializzazione: {
      total: registrations.filter(r => r?.package_type === 'alta_specializzazione' && r?.status !== 'cancelled').length,
      confirmed: registrations.filter(r => r?.package_type === 'alta_specializzazione' && r?.status === 'confirmed').length,
    },
  }

  // Recent registrations (last 5) - handle null created_at
  const recentRegistrations = [...registrations]
    .filter(r => r?.created_at)
    .sort((a, b) => {
      const dateA = new Date(a.created_at!).getTime()
      const dateB = new Date(b.created_at!).getTime()
      if (isNaN(dateA) && isNaN(dateB)) return 0
      if (isNaN(dateA)) return 1
      if (isNaN(dateB)) return -1
      return dateB - dateA
    })
    .slice(0, 5)

  return {
    stats: { total, pending, confirmed, cancelled, revenue, pendingPayments },
    sizeDistribution,
    ageDistribution,
    experienceDistribution: experienceDistribution as { principiante: number; intermedio: number; avanzato: number },
    specialNeeds,
    packageDistribution,
    recentRegistrations,
  }
}

export async function GET() {
  // Get environment variables fresh on each request
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  const isConfigured = !!(
    supabaseUrl &&
    supabaseServiceKey &&
    !supabaseUrl.includes('your-') &&
    supabaseUrl !== 'your-supabase-url' &&
    supabaseServiceKey.length > 20
  )

  console.log(`[API Stats] isConfigured: ${isConfigured}, URL exists: ${!!supabaseUrl}, Key length: ${supabaseServiceKey.length}`)

  try {
    // If Supabase is not configured, use mock data
    if (!isConfigured) {
      console.log('[API Stats] Supabase not configured, using mock data')
      const result = calculateStats(mockRegistrations as unknown as RegistrationData[])
      return NextResponse.json({
        ...result,
        source: 'mock',
        message: 'Using mock data - Supabase not configured'
      })
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('[API Stats] Fetching registrations from Supabase...')
    
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[API Stats] Error fetching registrations:', error)
      // Return mock data as fallback
      const result = calculateStats(mockRegistrations as unknown as RegistrationData[])
      return NextResponse.json({
        ...result,
        source: 'mock',
        error: error.message,
        message: 'Supabase query failed, using mock data as fallback'
      })
    }

    console.log(`[API Stats] Fetched ${data?.length || 0} registrations from Supabase`)
    if (data && data.length > 0) {
      console.log('[API Stats] First registration:', JSON.stringify(data[0], null, 2))
    }
    
    const registrations = data || []
    const result = calculateStats(registrations)
    
    console.log(`[API Stats] Final stats: total=${result.stats.total}, pending=${result.stats.pending}, confirmed=${result.stats.confirmed}`)
    
    return NextResponse.json({
      ...result,
      source: 'supabase',
      message: `Stats calculated from ${registrations.length} registrations`
    })
  } catch (error) {
    console.error('[API Stats] Unexpected error:', error)
    const result = calculateStats(mockRegistrations as unknown as RegistrationData[])
    return NextResponse.json({
      ...result,
      source: 'mock',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Unexpected error, using mock data as fallback'
    })
  }
}