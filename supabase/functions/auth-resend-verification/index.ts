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

// Resend HTTP API function
const sendEmailViaResend = async (to: string, subject: string, html: string, text: string) => {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY nicht konfiguriert')
  }

  console.log('Sending email via Resend HTTP API to:', to)

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Politisches Planspiel <info@startbiz.de>',
      to: [to],
      subject: subject,
      html: html,
      text: text,
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error('Resend API Error:', response.status, errorData)
    throw new Error(`Resend API Error: ${response.status} - ${errorData}`)
  }

  const result = await response.json()
  console.log('Email sent successfully via Resend API:', result.id)
  return result
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

    const { email: rawEmail } = await req.json()

    console.log('Resend verification request for raw email:', rawEmail)

    if (!rawEmail) {
      return new Response(
        JSON.stringify({ error: 'E-Mail-Adresse erforderlich' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // E-Mail normalisieren
    const email = normalizeEmail(rawEmail)
    console.log('Normalized email:', email)

    // Finde User Profile (robuste Abfrage)
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_verified', false)
      .limit(1)

    console.log('Database query result:', { users, userError })

    if (userError) {
      console.error('Database error when querying users table:', userError)
      return new Response(
        JSON.stringify({ error: 'Datenbankfehler bei Benutzerabfrage' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!users || users.length === 0) {
      console.log('No unverified user found for email:', email)
      return new Response(
        JSON.stringify({ error: 'Benutzer nicht gefunden oder bereits verifiziert' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (users.length > 1) {
      console.error('Multiple unverified users found for email:', email, 'Count:', users.length)
      return new Response(
        JSON.stringify({ error: 'Mehrere unverifizierte Benutzer gefunden' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const profile = users[0]
    console.log('Found unverified profile:', profile.id)

    // Generiere neuen Verifikations-Token
    const verificationToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 Stunden gültig

    // Aktualisiere User Profile
    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_token: verificationToken,
        verification_expires_at: expiresAt.toISOString()
      })
      .eq('id', profile.id)

    if (updateError) {
      console.error('Token-Update fehlgeschlagen:', updateError)
      return new Response(
        JSON.stringify({ error: 'Token-Update fehlgeschlagen' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Erstelle neuen Email-Verifikations-Eintrag
    const { error: verificationError } = await supabase
      .from('email_verifications')
      .insert({
        user_id: profile.id,
        email: email,
        token: verificationToken,
        expires_at: expiresAt.toISOString()
      })

    if (verificationError) {
      console.error('Email Verification Entry Error:', verificationError)
    }

    // Bestimme die App-URL für den Verifikationslink
    let appBaseUrl = Deno.env.get('APP_BASE_URL')
    
    if (!appBaseUrl) {
      // Fallback: Verwende die Request-URL als Basis
      const requestUrl = new URL(req.url)
      appBaseUrl = `${requestUrl.protocol}//${requestUrl.host}`
    }
    
    const verificationUrl = `${appBaseUrl}/verify-email?token=${verificationToken}`
    
    console.log('Verification URL:', verificationUrl)
    
    try {
      // E-Mail-Inhalt
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>E-Mail bestätigen</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; padding: 10px !important; }
              .content { padding: 20px !important; }
              .button { padding: 12px 20px !important; font-size: 14px !important; }
            }
          </style>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
          <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Politisches Planspiel Deutschland</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">2025-2037</p>
          </div>
          
          <div class="content" style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-top: 0;">Hallo ${profile.name}!</h2>
            
            <p>Sie haben eine erneute Bestätigung Ihrer E-Mail-Adresse angefordert.</p>
            
            <p>Um Ihren Account zu aktivieren und mit dem Spiel beginnen zu können, bestätigen Sie bitte Ihre E-Mail-Adresse durch einen Klick auf den folgenden Button:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 class="button"
                 style="background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px; transition: background-color 0.3s ease;">
                E-Mail-Adresse bestätigen
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Falls der Button nicht funktioniert, können Sie auch diesen Link in Ihren Browser kopieren:</p>
            <p style="background: #f8fafc; padding: 15px; border-radius: 8px; word-break: break-all; font-size: 12px; border: 1px solid #e2e8f0; font-family: 'Courier New', monospace;">
              ${verificationUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                <strong>Wichtige Informationen:</strong>
              </p>
              <ul style="color: #666; font-size: 14px; margin: 10px 0;">
                <li>Dieser Link ist 24 Stunden gültig</li>
                <li>Ihre Rolle: <strong>${profile.role === 'instructor' ? 'Spielleiter' : 'Spieler'}</strong></li>
                <li>Nach der Bestätigung können Sie sich anmelden und das Spiel starten</li>
                <li>Falls Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren</li>
              </ul>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Verifikations-Token:</strong><br>
                <code style="background: #f8fafc; padding: 4px 8px; border-radius: 4px; font-family: 'Courier New', monospace; border: 1px solid #e2e8f0;">${verificationToken}</code>
              </p>
              <p style="margin: 5px 0 0 0; color: #856404; font-size: 12px;">
                Falls der Link nicht funktioniert, können Sie diesen Token manuell eingeben.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
            <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
            <p>© 2024 Politisches Planspiel Deutschland</p>
          </div>
          </div>
        </body>
        </html>
      `

      const textContent = `
Hallo ${profile.name}!

Sie haben eine erneute Bestätigung Ihrer E-Mail-Adresse angefordert.

Um Ihren Account zu aktivieren, bestätigen Sie bitte Ihre E-Mail-Adresse durch einen Klick auf den folgenden Link:

${verificationUrl}

Verifikations-Token: ${verificationToken}

Wichtige Informationen:
- Dieser Link ist 24 Stunden gültig
- Ihre Rolle: ${profile.role === 'instructor' ? 'Spielleiter' : 'Spieler'}
- Nach der Bestätigung können Sie sich anmelden und das Spiel starten
- Falls Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren

Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.

© 2024 Politisches Planspiel Deutschland
      `

      // E-Mail senden via Resend HTTP API
      await sendEmailViaResend(
        rawEmail, // Verwende die ursprüngliche E-Mail für den Versand
        "Erneute Bestätigung - E-Mail-Adresse verifizieren",
        htmlContent,
        textContent
      )

      console.log('E-Mail erfolgreich via Resend HTTP API erneut gesendet')

    } catch (emailError) {
      console.error('Resend HTTP API E-Mail-Versand fehlgeschlagen:', emailError)
      
      return new Response(
        JSON.stringify({ 
          error: 'E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.',
          details: `Resend API Fehler: ${emailError.message}`
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verifikations-E-Mail wurde erneut gesendet. Bitte prüfen Sie Ihr Postfach.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Fehler beim erneuten Senden:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Interner Server-Fehler',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})