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
    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing environment variables:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceRoleKey
      })
      return new Response(
        JSON.stringify({ error: 'Supabase-Umgebungsvariablen nicht konfiguriert' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    )

    const { email: rawEmail, password } = await req.json()

    console.log('Login attempt for raw email:', rawEmail)

    if (!rawEmail || !password) {
      return new Response(
        JSON.stringify({ error: 'Email und Passwort erforderlich' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // E-Mail normalisieren
    const email = normalizeEmail(rawEmail)
    console.log('Normalized email:', email)

    // Versuche Authentifizierung mit Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: rawEmail, // Verwende die ursprüngliche E-Mail für Supabase Auth
      password
    })

    if (authError) {
      console.log('Auth error:', authError.message)
      
      // Spezifische Fehlermeldung für falsches Passwort
      if (authError.message.includes('Invalid login credentials') || 
          authError.message.includes('invalid_credentials') ||
          authError.message.includes('password')) {
        return new Response(
          JSON.stringify({ error: 'Passwort falsch' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      return new Response(
        JSON.stringify({ error: 'Anmeldung fehlgeschlagen: ' + authError.message }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: 'Anmeldung fehlgeschlagen - Kein Auth User zurückgegeben' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Auth successful for user:', authData.user.id)

    // Hole User Profile aus der users Tabelle für die Rolle
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('Profile query error:', profileError)
      return new Response(
        JSON.stringify({ error: 'Benutzerprofil nicht gefunden' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!userProfile) {
      console.log('No profile found for user:', authData.user.id)
      return new Response(
        JSON.stringify({ error: 'Benutzerprofil nicht gefunden' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Profile found:', userProfile.id, 'Role:', userProfile.role)

    // Prüfe ob Email verifiziert ist
    if (!authData.user.email_confirmed_at) {
      return new Response(
        JSON.stringify({ 
          error: 'E-Mail-Adresse nicht verifiziert',
          needsVerification: true
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extrahiere Namen aus dem Profil
    const nameParts = userProfile.name ? userProfile.name.split(' ') : ['', '']
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: authData.user.id,
          userId: authData.user.id,
          email: authData.user.email,
          firstName: firstName,
          lastName: lastName,
          role: userProfile.role, // Rolle aus der users Tabelle
          isVerified: !!authData.user.email_confirmed_at,
          createdAt: authData.user.created_at
        },
        session: authData.session
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ error: 'Interner Server-Fehler: ' + error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})