import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { mockRegistrations } from '@/lib/mockData'

// Create a direct Supabase client for admin operations
// This runs server-side where env vars are always available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const isConfigured = !!(
  supabaseUrl && 
  supabaseServiceKey && 
  !supabaseUrl.includes('your-') &&
  supabaseUrl !== 'your-supabase-url' &&
  supabaseServiceKey.length > 20
)

export async function GET() {
  try {
    // If Supabase is not configured, return mock data with a flag
    if (!isConfigured) {
      console.log('[API] Supabase not configured, returning mock data')
      return NextResponse.json({
        data: mockRegistrations,
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
      console.error('[API] Error fetching registrations:', error)
      // Return mock data as fallback with error info
      return NextResponse.json({
        data: mockRegistrations,
        source: 'mock',
        error: error.message,
        message: 'Supabase query failed, using mock data as fallback'
      })
    }

    console.log(`[API] Fetched ${data?.length || 0} registrations from Supabase`)
    
    return NextResponse.json({
      data: data || [],
      source: 'supabase',
      message: `Successfully fetched ${data?.length || 0} registrations`
    })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({
      data: mockRegistrations,
      source: 'mock',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Unexpected error, using mock data as fallback'
    }, { status: 200 }) // Return 200 with mock data instead of 500
  }
}

// Update registration status
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing id or status' },
        { status: 400 }
      )
    }

    if (!isConfigured) {
      console.log('[API] Supabase not configured, simulating status update')
      return NextResponse.json({
        success: true,
        source: 'mock',
        message: 'Status update simulated (mock mode)'
      })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { error } = await supabaseAdmin
      .from('registrations')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('[API] Error updating registration status:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      source: 'supabase',
      message: `Registration ${id} status updated to ${status}`
    })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}