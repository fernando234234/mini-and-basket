import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured. Registration data:', data);
      // Return a fake ID for development/demo mode
      return NextResponse.json({ 
        success: true, 
        registrationId: `DEV-${Date.now().toString(36).toUpperCase()}` 
      });
    }
    
    // Use supabaseAdmin (service role) to bypass RLS
    const { data: registration, error } = await supabaseAdmin
      .from('registrations')
      .insert({
        package_type: data.package_type,
        bus_transfer: data.bus_transfer,
        genitore_nome_cognome: data.genitore_nome_cognome,
        genitore_codice_fiscale: data.genitore_codice_fiscale || null,
        genitore_citta: data.genitore_citta,
        genitore_cap: data.genitore_cap,
        genitore_indirizzo: data.genitore_indirizzo,
        genitore_telefono: data.genitore_telefono,
        genitore_email: data.genitore_email,
        camper_nome_cognome: data.camper_nome_cognome,
        camper_codice_fiscale: data.camper_codice_fiscale,
        camper_luogo_nascita: data.camper_luogo_nascita,
        camper_data_nascita: data.camper_data_nascita,
        camper_sesso: data.camper_sesso,
        camper_citta: data.camper_citta,
        camper_cap: data.camper_cap,
        camper_indirizzo: data.camper_indirizzo,
        camper_scuola: data.camper_scuola,
        camper_classe: data.camper_classe,
        camper_taglia: data.camper_taglia,
        camper_altezza: data.camper_altezza,
        camper_peso: data.camper_peso,
        camper_numero_scarpe: data.camper_numero_scarpe,
        camper_esperienza: data.camper_esperienza,
        camper_societa: data.camper_societa || null,
        allergie_intolleranze: data.allergie_intolleranze || null,
        patologie_note: data.patologie_note || null,
        terapie_in_corso: data.terapie_in_corso || null,
        liberatoria_foto_video: data.liberatoria_foto_video,
        accettazione_regolamento: data.accettazione_regolamento,
        privacy_policy: data.privacy_policy,
        status: 'pending',
        payment_status: 'pending',
        codice_invito: data.codice_invito || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Registration error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      registrationId: registration.id 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}