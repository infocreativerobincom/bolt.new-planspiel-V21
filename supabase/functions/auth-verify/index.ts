import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// E-Mail-Normalisierung: Trimmen und Kleinbuchstaben
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase()
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { token } = await req.json()

    console.log('Email verification request for token:', token)

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Verifikations-Token erforderlich' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Finde Verifikations-Eintrag (robuste Abfrage)
    const { data: verifications, error: verificationError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('token', token)
      .is('verified_at', null)
      .limit(1)

    console.log('Verification query result:', { verifications, verificationError })

    if (verificationError) {
      console.error('Database error when querying email_verifications:', verificationError)
      return new Response(
        JSON.stringify({ error: 'Datenbankfehler bei Verifikationsabfrage' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!verifications || verifications.length === 0) {
      console.log('No verification found for token:', token)
      return new Response(
        JSON.stringify({ error: 'Ungültiger oder bereits verwendeter Token' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (verifications.length > 1) {
      console.error('Multiple verifications found for token:', token, 'Count:', verifications.length)
      return new Response(
        JSON.stringify({ error: 'Mehrere Verifikationen für Token gefunden' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const verification = verifications[0]
    console.log('Found verification:', verification.id, 'User ID:', verification.user_id)

    // Prüfe Ablaufzeit
    if (new Date(verification.expires_at) < new Date()) {
      console.log('Verification token expired:', verification.expires_at)
      return new Response(
        JSON.stringify({ error: 'Verifikations-Token abgelaufen' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Markiere Email als verifiziert
    const { error: updateVerificationError } = await supabase
      .from('email_verifications')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', verification.id)

    if (updateVerificationError) {
      console.error('Failed to update verification:', updateVerificationError)
      return new Response(
        JSON.stringify({ error: 'Verifikation fehlgeschlagen' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Aktualisiere User Profile
    const { error: profileError } = await supabase
      .from('users')
      .update({ 
        is_verified: true,
        verification_token: null,
        verification_expires_at: null
      })
      .eq('id', verification.user_id)

    if (profileError) {
      console.error('Failed to update user profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Profil-Update fehlgeschlagen' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Email verification successful for user:', verification.user_id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email erfolgreich verifiziert. Sie können sich jetzt anmelden.' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return new Response(
      JSON.stringify({ error: 'Interner Server-Fehler: ' + error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})