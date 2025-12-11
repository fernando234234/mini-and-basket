import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { mockRegistrations, MockRegistration } from '@/lib/mockData'

// Create a direct Supabase client for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const isConfigured = !!(
  supabaseUrl && 
  supabaseServiceKey && 
  !supabaseUrl.includes('your-') &&
  supabaseUrl !== 'your-supabase-url' &&
  supabaseServiceKey.length > 20
)

// Helper to calculate age from birth date
const calculateAge = (birthDate: string) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Calculate all stats from registrations
function calculateStats(registrations: MockRegistration[]) {
  const total = registrations.length
  const pending = registrations.filter(r => r.status === 'pending').length
  const confirmed = registrations.filter(r => r.status === 'confirmed').length
  const cancelled = registrations.filter(r => r.status === 'cancelled').length
  
  const revenue = registrations
    .filter(r => r.status === 'confirmed' || r.payment_status === 'paid' || r.payment_status === 'partial')
    .reduce((sum, r) => sum + (r.amount_paid || 0), 0)
  
  const pendingPayments = registrations.filter(
    r => r.payment_status === 'pending' || r.payment_status === 'partial'
  ).length

  // Size distribution
  const sizeDistribution: Record<string, number> = { XXS: 0, XS: 0, S: 0, M: 0, L: 0, XL: 0 }
  registrations
    .filter(r => r.status !== 'cancelled')
    .forEach(r => {
      if (sizeDistribution[r.camper_taglia] !== undefined) {
        sizeDistribution[r.camper_taglia]++
      }
    })

  // Age distribution
  const ageDistribution = { '6-8': 0, '9-11': 0, '12-14': 0, '15+': 0 }
  registrations
    .filter(r => r.status !== 'cancelled')
    .forEach(r => {
      const age = calculateAge(r.camper_data_nascita)
      if (age >= 6 && age <= 8) ageDistribution['6-8']++
      else if (age >= 9 && age <= 11) ageDistribution['9-11']++
      else if (age >= 12 && age <= 14) ageDistribution['12-14']++
      else if (age >= 15) ageDistribution['15+']++
    })

  // Experience distribution
  const experienceDistribution = { principiante: 0, intermedio: 0, avanzato: 0 }
  registrations
    .filter(r => r.status !== 'cancelled')
    .forEach(r => {
      experienceDistribution[r.camper_esperienza]++
    })

  // Special needs count
  const activeRegs = registrations.filter(r => r.status !== 'cancelled')
  const withAllergies = activeRegs.filter(r => r.allergie_intolleranze && r.allergie_intolleranze.trim() !== '').length
  const withMedicalNotes = activeRegs.filter(r => r.patologie_note && r.patologie_note.trim() !== '').length
  const withAnyNotes = activeRegs.filter(r => 
    (r.allergie_intolleranze && r.allergie_intolleranze.trim() !== '') || 
    (r.patologie_note && r.patologie_note.trim() !== '')
  ).length
  const specialNeeds = { withAllergies, withMedicalNotes, withAnyNotes, total: activeRegs.length }

  // Package distribution
  const packageDistribution = {
    standard: {
      total: registrations.filter(r => r.package_type === 'standard' && r.status !== 'cancelled').length,
      confirmed: registrations.filter(r => r.package_type === 'standard' && r.status === 'confirmed').length,
    },
    alta_specializzazione: {
      total: registrations.filter(r => r.package_type === 'alta_specializzazione' && r.status !== 'cancelled').length,
      confirmed: registrations.filter(r => r.package_type === 'alta_specializzazione' && r.status === 'confirmed').length,
    },
  }

  // Recent registrations (last 5)
  const recentRegistrations = [...registrations]
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    .slice(0, 5)

  return {
    stats: { total, pending, confirmed, cancelled, revenue, pendingPayments },
    sizeDistribution,
    ageDistribution,
    experienceDistribution,
    specialNeeds,
    packageDistribution,
    recentRegistrations,
  }
}

export async function GET() {
  try {
    // If Supabase is not configured, use mock data
    if (!isConfigured) {
      console.log('[API Stats] Supabase not configured, using mock data')
      const result = calculateStats(mockRegistrations)
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

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[API Stats] Error fetching registrations:', error)
      // Return mock data as fallback
      const result = calculateStats(mockRegistrations)
      return NextResponse.json({
        ...result,
        source: 'mock',
        error: error.message,
        message: 'Supabase query failed, using mock data as fallback'
      })
    }

    console.log(`[API Stats] Calculating stats for ${data?.length || 0} registrations`)
    
    const result = calculateStats((data || []) as MockRegistration[])
    return NextResponse.json({
      ...result,
      source: 'supabase',
      message: `Stats calculated from ${data?.length || 0} registrations`
    })
  } catch (error) {
    console.error('[API Stats] Unexpected error:', error)
    const result = calculateStats(mockRegistrations)
    return NextResponse.json({
      ...result,
      source: 'mock',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Unexpected error, using mock data as fallback'
    })
  }
}