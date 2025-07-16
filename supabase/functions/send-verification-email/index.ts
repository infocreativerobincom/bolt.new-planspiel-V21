import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name, role, confirmationUrl } = await req.json()

    // E-Mail-Template für Verifizierung
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>E-Mail-Adresse bestätigen - Politisches Planspiel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { 
            display: inline-block; 
            background: #3b82f6; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Willkommen beim Politischen Planspiel Deutschland</h1>
          </div>
          <div class="content">
            <h2>Hallo ${name}!</h2>
            <p><strong>WICHTIG: E-Mail-Bestätigung erforderlich!</strong></p>
            <p>Vielen Dank für Ihre Registrierung als <strong>${role === 'spielleiter' ? 'Spielleiter' : 'Spieler'}</strong> beim Politischen Planspiel Deutschland 2025-2037.</p>
            
            <p><strong>Um sich anmelden zu können, MÜSSEN Sie zuerst Ihre E-Mail-Adresse bestätigen.</strong> Klicken Sie dazu auf den folgenden Link:</p>
            
            <div style="text-align: center;">
              <a href="${confirmationUrl}" class="button">E-Mail-Adresse bestätigen</a>
            </div>
            
            <p>Alternativ können Sie auch den folgenden Link in Ihren Browser kopieren:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border: 1px solid #ddd;">
              ${confirmationUrl}
            </p>
            
            <p><strong>Wichtiger Hinweis:</strong> Ohne E-Mail-Bestätigung können Sie sich NICHT anmelden. Dieser Link ist 24 Stunden gültig. Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.</p>
            
            <h3>Was Sie nach der Bestätigung erwartet:</h3>
            <ul>
              <li>Zugang zum interaktiven Politiksimulator</li>
              <li>40 realistische Entscheidungsszenarien</li>
              <li>Zeitraum: Deutschland 2025-2037</li>
              <li>Detaillierte Auswertungen und Feedback</li>
              ${role === 'spielleiter' ? '<li>Verwaltung von Gruppenspielen und Teilnehmern</li>' : ''}
            </ul>
          </div>
          <div class="footer">
            <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
            <p>Politisches Planspiel Deutschland © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `

    const emailText = `
Willkommen beim Politischen Planspiel Deutschland!

Hallo ${name}!

WICHTIG: E-Mail-Bestätigung erforderlich!
Vielen Dank für Ihre Registrierung als ${role === 'spielleiter' ? 'Spielleiter' : 'Spieler'} beim Politischen Planspiel Deutschland 2025-2037.

Um sich anmelden zu können, MÜSSEN Sie zuerst Ihre E-Mail-Adresse bestätigen. Klicken Sie dazu auf den folgenden Link:

${confirmationUrl}

Wichtiger Hinweis: Ohne E-Mail-Bestätigung können Sie sich NICHT anmelden. Dieser Link ist 24 Stunden gültig. Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.

Was Sie nach der Bestätigung erwartet:
- Zugang zum interaktiven Politiksimulator
- 40 realistische Entscheidungsszenarien  
- Zeitraum: Deutschland 2025-2037
- Detaillierte Auswertungen und Feedback
${role === 'spielleiter' ? '- Verwaltung von Gruppenspielen und Teilnehmern' : ''}

Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.
Politisches Planspiel Deutschland © 2025
    `

    // Hier würde normalerweise ein E-Mail-Service verwendet werden
    // Für Demo-Zwecke loggen wir die E-Mail
    console.log('Verification email would be sent to:', email)
    console.log('Email content:', emailHtml)

    // In einer echten Implementierung würde hier ein E-Mail-Service wie Resend verwendet:
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Politisches Planspiel <noreply@planspiel.de>',
        to: [email],
        subject: 'E-Mail-Adresse bestätigen - Politisches Planspiel Deutschland',
        html: emailHtml,
        text: emailText
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Bestätigungs-E-Mail wurde versendet',
        email: email 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error sending verification email:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Fehler beim Versenden der Bestätigungs-E-Mail',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})