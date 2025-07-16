import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    console.log('Feedback email function called');
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    const { user_id, session_id, page_url, screenshot_data, marked_area, feedback_text, player_email } = await req.json()

    // Feedback immer loggen
    console.log('Feedback erhalten:', {
      user_id,
      session_id,
      page_url,
      feedback_text,
      marked_area,
      screenshot_size: screenshot_data ? screenshot_data.length : 0,
      player_email
    })

    // Validierung der erforderlichen Felder
    if (!user_id || !feedback_text || !marked_area) {
      console.error('Missing required fields:', { user_id: !!user_id, feedback_text: !!feedback_text, marked_area: !!marked_area });
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Fehlende erforderliche Felder',
          details: 'user_id, feedback_text und marked_area sind erforderlich'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // E-Mail-Inhalt erstellen
    const emailContent = `
Neues Feedback vom Politischen Planspiel Deutschland erhalten!

=== FEEDBACK DETAILS ===
Benutzer-ID: ${user_id}
Session-ID: ${session_id || 'Keine Session'}
Spieler-Email: ${player_email || 'Nicht verfügbar'}
Seite: ${page_url}

Markierter Bereich:
- X-Position: ${marked_area.x}px
- Y-Position: ${marked_area.y}px  
- Breite: ${marked_area.width}px
- Höhe: ${marked_area.height}px

=== FEEDBACK-TEXT ===
${feedback_text}

=== TECHNISCHE DETAILS ===
Screenshot-Größe: ${screenshot_data ? (screenshot_data.length / 1024 / 1024).toFixed(2) : 0} MB
Zeitstempel: ${new Date().toLocaleString('de-DE')}

Der Screenshot mit dem markierten Bereich ist als Anhang beigefügt.
    `

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Neues Feedback - Politisches Planspiel</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; background: #f9f9f9; border: 1px solid #ddd; }
    .feedback-box { background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
    .detail-item { background: white; padding: 10px; border-radius: 5px; border: 1px solid #ddd; }
    .detail-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
    .detail-value { color: #333; margin-top: 5px; }
    .marked-area { background: #fef3c7; padding: 10px; border-radius: 5px; border: 1px solid #f59e0b; }
    .footer { padding: 15px; text-align: center; font-size: 12px; color: #666; background: #f3f4f6; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Neues Feedback erhalten!</h1>
      <p>Politisches Planspiel Deutschland 2025-2037</p>
    </div>
    
    <div class="content">
      <div class="details-grid">
        <div class="detail-item">
          <div class="detail-label">Benutzer-ID</div>
          <div class="detail-value">${user_id}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Session-ID</div>
          <div class="detail-value">${session_id || 'Keine Session'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Spieler-Email</div>
          <div class="detail-value">${player_email || 'Nicht verfügbar'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Seite</div>
          <div class="detail-value">${page_url}</div>
        </div>
      </div>

      <div class="marked-area">
        <h3>📍 Markierter Bereich</h3>
        <p><strong>Position:</strong> X: ${marked_area.x}px, Y: ${marked_area.y}px</p>
        <p><strong>Größe:</strong> ${marked_area.width}px × ${marked_area.height}px</p>
      </div>

      <div class="feedback-box">
        <h3>💬 Feedback-Text</h3>
        <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${feedback_text}</p>
      </div>

      <div style="background: #e5e7eb; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <h4>📸 Screenshot-Information</h4>
        <p><strong>Dateigröße:</strong> ${screenshot_data ? (screenshot_data.length / 1024 / 1024).toFixed(2) : 0} MB</p>
        <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString('de-DE')}</p>
        <p><em>Der Screenshot mit dem markierten Bereich ist als Anhang beigefügt.</em></p>
      </div>
    </div>
    
    <div class="footer">
      <p>Diese E-Mail wurde automatisch vom Feedback-System generiert.</p>
      <p>Politisches Planspiel Deutschland © 2025</p>
    </div>
  </div>
</body>
</html>
    `

    // Versuche E-Mail zu senden
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    console.log('Resend API Key available:', !!resendApiKey);
    console.log('Screenshot data available:', !!screenshot_data);
    
    let emailSent = false
    let emailError = null
    
    // E-Mail senden auch ohne Screenshot, falls verfügbar
    if (resendApiKey) {
      try {
        const emailPayload = {
          from: 'Politisches Planspiel <feedback@planspiel.de>',
          to: ['thomas.ralf.hain@gmail.com'],
          subject: `🎯 Neues Feedback - Politisches Planspiel (${user_id})`,
          html: emailHtml,
          text: emailContent
        };
        
        // Screenshot als Anhang hinzufügen, falls vorhanden
        if (screenshot_data && screenshot_data.includes('data:image')) {
          emailPayload.attachments = [{
            content: screenshot_data.split(',')[1], // Base64 ohne data:image/jpeg;base64,
            filename: `feedback-screenshot-${user_id}-${Date.now()}.jpg`,
            type: 'image/jpeg',
            disposition: 'attachment'
          }];
        }
        
        console.log('Sending email with payload:', {
          ...emailPayload,
          attachments: emailPayload.attachments ? `[${emailPayload.attachments.length} attachments]` : 'none'
        });
        
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload)
        })
        
        if (response.ok) {
          const responseData = await response.json();
          console.log('Email sent successfully via Resend')
          console.log('Resend response:', responseData);
          emailSent = true
        } else {
          const errorText = await response.text()
          console.error('Resend API error:', errorText)
          emailError = `Resend API error: ${errorText}`
        }
      } catch (error) {
        console.error('Error sending email via Resend:', error)
        emailError = `Email sending failed: ${error.message}`
      }
    } else {
      const missingItems = []
      if (!resendApiKey) missingItems.push('RESEND_API_KEY')
      
      console.warn(`Email not sent - missing: ${missingItems.join(', ')}`)
      emailError = `Missing: ${missingItems.join(', ')}`
    }

    // Erfolgreiche Antwort zurückgeben
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Feedback erfolgreich verarbeitet',
        emailSent: emailSent,
        emailError: emailError,
        feedbackId: `feedback-${Date.now()}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Critical error in feedback processing:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Fehler beim Verarbeiten des Feedbacks',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})