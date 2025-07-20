import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Resend HTTP API function
const sendEmailViaResend = async (to: string, subject: string, html: string, text: string) => {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY nicht konfiguriert')
  }

  console.log('Sending password reset email via Resend HTTP API to:', to)

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
  console.log('Password reset email sent successfully via Resend API:', result.id)
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

    const { email } = await req.json()

    console.log('Password reset request for:', email)

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'E-Mail-Adresse erforderlich' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prüfe ob User in der "users" Tabelle existiert
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      // Aus Sicherheitsgründen geben wir immer eine Erfolgsmeldung zurück
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Falls ein Account mit dieser E-Mail-Adresse existiert, wurde ein Passwort-Reset-Link gesendet.'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Found user for password reset:', user.id)

    // Verwende Supabase Auth für Password Reset
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${Deno.env.get('APP_BASE_URL') || 'http://localhost:5173'}/reset-password`
    })

    if (resetError) {
      console.error('Password reset error:', resetError)
      
      // Trotzdem Erfolgsmeldung für Sicherheit
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Falls ein Account mit dieser E-Mail-Adresse existiert, wurde ein Passwort-Reset-Link gesendet.'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Zusätzlich eine eigene E-Mail senden mit besserem Design
    try {
      const resetUrl = `${Deno.env.get('APP_BASE_URL') || 'http://localhost:5173'}/reset-password`
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Passwort zurücksetzen</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Politisches Planspiel Deutschland</h1>
              <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Passwort zurücksetzen</p>
            </div>
            
            <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333; margin-top: 0;">Hallo ${user.name}!</h2>
              
              <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
              
              <p>Um ein neues Passwort zu erstellen, klicken Sie bitte auf den folgenden Button:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Neues Passwort erstellen
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">Falls der Button nicht funktioniert, können Sie auch diesen Link in Ihren Browser kopieren:</p>
              <p style="background: #f8fafc; padding: 15px; border-radius: 8px; word-break: break-all; font-size: 12px; border: 1px solid #e2e8f0; font-family: 'Courier New', monospace;">
                ${resetUrl}
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  <strong>Wichtige Informationen:</strong>
                </p>
                <ul style="color: #666; font-size: 14px; margin: 10px 0;">
                  <li>Dieser Link ist nur begrenzte Zeit gültig</li>
                  <li>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren</li>
                  <li>Ihr aktuelles Passwort bleibt unverändert, bis Sie ein neues erstellen</li>
                </ul>
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
Hallo ${user.name}!

Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.

Um ein neues Passwort zu erstellen, öffnen Sie bitte den folgenden Link:

${resetUrl}

Wichtige Informationen:
- Dieser Link ist nur begrenzte Zeit gültig
- Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren
- Ihr aktuelles Passwort bleibt unverändert, bis Sie ein neues erstellen

Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.

© 2024 Politisches Planspiel Deutschland
      `

      await sendEmailViaResend(
        email,
        "Passwort zurücksetzen - Politisches Planspiel Deutschland",
        htmlContent,
        textContent
      )

      console.log('Custom password reset email sent successfully')

    } catch (emailError) {
      console.error('Custom email sending failed:', emailError)
      // Fehler beim eigenen E-Mail-Versand ignorieren, da Supabase bereits eine E-Mail gesendet hat
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Ein Passwort-Reset-Link wurde an Ihre E-Mail-Adresse gesendet.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Password reset error:', error)
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Falls ein Account mit dieser E-Mail-Adresse existiert, wurde ein Passwort-Reset-Link gesendet.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})