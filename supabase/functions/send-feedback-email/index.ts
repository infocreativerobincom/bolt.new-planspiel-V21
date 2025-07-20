import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface FeedbackEmailRequest {
  feedbackId: string
  userEmail: string
  userName: string
  feedbackText: string
  pageUrl: string
  sessionId?: string
  markedArea?: any
}

// SMTP-Konfiguration für Resend
const createSMTPClient = () => {
  const smtpHost = 'smtp.resend.com'
  const smtpPort = 587
  const smtpUsername = 'resend'
  const smtpPassword = Deno.env.get('RESEND_API_KEY')

  if (!smtpPassword) {
    throw new Error('RESEND_API_KEY nicht konfiguriert')
  }

  return new SMTPClient({
    connection: {
      hostname: smtpHost,
      port: smtpPort,
      tls: true,
      auth: {
        username: smtpUsername,
        password: smtpPassword,
      },
    },
  })
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

    const { 
      feedbackId, 
      userEmail, 
      userName, 
      feedbackText, 
      pageUrl, 
      sessionId,
      markedArea 
    }: FeedbackEmailRequest = await req.json()

    console.log('Sending feedback email via SMTP for:', feedbackId)

    // Validierung
    if (!feedbackId || !userEmail || !userName || !feedbackText || !pageUrl) {
      return new Response(
        JSON.stringify({ error: 'Fehlende erforderliche Felder' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Admin E-Mail-Adresse
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@yourdomain.com'
    
    const currentDate = new Date().toLocaleString('de-DE', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    try {
      // SMTP Client erstellen
      const client = createSMTPClient()

      // E-Mail-Inhalt
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Neues Feedback</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; padding: 10px !important; }
              .content { padding: 20px !important; }
            }
          </style>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
          <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Neues Feedback erhalten</h1>
              <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 14px;">Politisches Planspiel Deutschland</p>
            </div>
            
            <div class="content" style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Feedback-Details</h2>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Feedback-ID:</td>
                    <td style="padding: 8px 0; color: #6b7280; font-family: 'Courier New', monospace;">${feedbackId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Zeitpunkt:</td>
                    <td style="padding: 8px 0; color: #6b7280;">${currentDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Benutzer:</td>
                    <td style="padding: 8px 0; color: #6b7280;">${userName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">E-Mail:</td>
                    <td style="padding: 8px 0; color: #6b7280;">${userEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Seite:</td>
                    <td style="padding: 8px 0; color: #6b7280; word-break: break-all;">${pageUrl}</td>
                  </tr>
                  ${sessionId ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Session-ID:</td>
                    <td style="padding: 8px 0; color: #6b7280; font-family: 'Courier New', monospace;">${sessionId}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="margin-bottom: 20px;">
                <h3 style="color: #374151; margin-bottom: 10px; font-size: 16px;">Feedback-Text:</h3>
                <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px;">
                  <p style="margin: 0; color: #92400e; white-space: pre-wrap;">${feedbackText}</p>
                </div>
              </div>
              
              ${markedArea ? `
              <div style="margin-bottom: 20px;">
                <h3 style="color: #374151; margin-bottom: 10px; font-size: 16px;">Markierter Bereich:</h3>
                <div style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 15px;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    Position: x=${markedArea.x || 'N/A'}, y=${markedArea.y || 'N/A'}<br>
                    Größe: ${markedArea.width || 'N/A'} × ${markedArea.height || 'N/A'} px
                  </p>
                </div>
              </div>
              ` : ''}
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  <strong>Nächste Schritte:</strong>
                </p>
                <ul style="color: #6b7280; font-size: 14px; margin: 10px 0;">
                  <li>Feedback in der Admin-Konsole überprüfen</li>
                  <li>Bei Bedarf Benutzer kontaktieren: ${userEmail}</li>
                  <li>Verbesserungen implementieren</li>
                  <li>Feedback als bearbeitet markieren</li>
                </ul>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
              <p>Diese E-Mail wurde automatisch vom Feedback-System generiert.</p>
              <p>© 2024 Politisches Planspiel Deutschland</p>
            </div>
          </div>
        </body>
        </html>
      `

      const textContent = `
Neues Feedback erhalten - Politisches Planspiel Deutschland

Feedback-Details:
- ID: ${feedbackId}
- Zeitpunkt: ${currentDate}
- Benutzer: ${userName}
- E-Mail: ${userEmail}
- Seite: ${pageUrl}
${sessionId ? `- Session-ID: ${sessionId}` : ''}

Feedback-Text:
${feedbackText}

${markedArea ? `
Markierter Bereich:
Position: x=${markedArea.x || 'N/A'}, y=${markedArea.y || 'N/A'}
Größe: ${markedArea.width || 'N/A'} × ${markedArea.height || 'N/A'} px
` : ''}

Nächste Schritte:
- Feedback in der Admin-Konsole überprüfen
- Bei Bedarf Benutzer kontaktieren: ${userEmail}
- Verbesserungen implementieren
- Feedback als bearbeitet markieren

Diese E-Mail wurde automatisch vom Feedback-System generiert.
© 2024 Politisches Planspiel Deutschland
      `

      // E-Mail senden via SMTP
      await client.send({
        from: "info@startbiz.de",
        to: adminEmail,
        subject: `Neues Feedback - Politisches Planspiel (${feedbackId.substring(0, 8)})`,
        text: textContent,
        html: htmlContent,
      })

      await client.close()
      console.log('Feedback-E-Mail erfolgreich via SMTP gesendet')

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Feedback-E-Mail erfolgreich gesendet'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } catch (emailError) {
      console.error('SMTP E-Mail-Versand fehlgeschlagen:', emailError)
      
      return new Response(
        JSON.stringify({ 
          error: 'Feedback-E-Mail konnte nicht gesendet werden',
          details: 'SMTP-Verbindung fehlgeschlagen oder E-Mail-Service nicht erreichbar'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Feedback-E-Mail Fehler:', error)
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