# Politisches Planspiel Deutschland 2025-2037

Das Projekt nutzt SMTP mit Resend API für den E-Mail-Versand über Supabase Edge Functions.
## E-Mail-Konfiguration mit SMTP und Resend API
### Erforderliche Umgebungsvariablen
Folgende Umgebungsvariablen müssen in Supabase konfiguriert werden:
```bash
# Supabase Projekt-Konfiguration (erforderlich für Edge Functions)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend API Key für SMTP-Authentifizierung (erforderlich)
RESEND_API_KEY=re_xxxxxxxxxx
# App Base URL für Verifikationslinks
APP_BASE_URL=https://yourdomain.com
# Admin E-Mail für Feedback-Benachrichtigungen
ADMIN_EMAIL=admin@yourdomain.com
```
### SMTP-Konfiguration
Die Edge Functions verwenden folgende SMTP-Einstellungen für Resend:
- **Host:** smtp.resend.com
- **Port:** 587 (STARTTLS)
- **Username:** resend
- **Password:** Ihr Resend API Key
- **Verschlüsselung:** TLS

### E-Mail-Features
1. **Registrierungs-Verifikation**
   - Automatische E-Mail via SMTP bei Benutzerregistrierung
   - 24h gültiger Verifikationslink
   - Responsive HTML-Template
   - Fallback auf manuellen Token
2. **Erneute Verifikation**
   - Möglichkeit zur erneuten E-Mail-Anforderung via SMTP
   - Neuer Token bei jeder Anfrage
   - Gleiche Sicherheitsstandards
3. **Feedback-Benachrichtigungen**
   - Automatische Admin-Benachrichtigung via SMTP bei neuem Feedback
   - Vollständige Feedback-Details in der E-Mail
   - Screenshot-Informationen und markierte Bereiche
### Konfiguration in Supabase
1. **Edge Functions deployen:**
   ```bash
   supabase functions deploy auth-register
   supabase functions deploy auth-resend-verification
   supabase functions deploy send-feedback-email
   ```
2. **Umgebungsvariablen setzen:**
   ```bash
   supabase secrets set SUPABASE_URL=https://your-project-id.supabase.co
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   supabase secrets set RESEND_API_KEY=your_resend_api_key
   supabase secrets set APP_BASE_URL=https://yourdomain.com
   supabase secrets set ADMIN_EMAIL=admin@yourdomain.com
   ```
3. **SMTP-Setup und Domain-Verifikation bei Resend:**
   - Domain in Resend-Dashboard hinzufügen
   - DNS-Records konfigurieren
   - SMTP-Zugang aktivieren (automatisch mit API Key)
   - From-Adresse entsprechend der verifizierten Domain anpassen
### E-Mail-Templates
Die SMTP-E-Mail-Templates sind responsive und verwenden moderne HTML/CSS:
- Mobile-optimiert
- Professionelles Design
- Klare Call-to-Action Buttons
- Fallback für Text-only Clients
### Fehlerbehandlung
- Automatische Bereinigung bei SMTP-Fehlern
- Detaillierte Logging für Debugging
- Benutzerfreundliche Fehlermeldungen
- Verbindungsmanagement für SMTP-Client
- Automatisches Schließen der SMTP-Verbindung
### Sicherheit
- Sichere Token-Generierung mit crypto.randomUUID()
- 24h Ablaufzeit für Verifikationslinks
- Schutz vor Token-Wiederverwendung
- TLS-verschlüsselte SMTP-Verbindung
- Sichere Authentifizierung mit API Key
- Validierung aller E-Mail-Parameter

### Vorteile der SMTP-Lösung
- **Zuverlässigkeit:** Direkte SMTP-Verbindung zu Resend
- **Kompatibilität:** Standard SMTP-Protokoll
- **Flexibilität:** Einfache Konfiguration und Anpassung
- **Monitoring:** Bessere Kontrolle über E-Mail-Versand
- **Skalierbarkeit:** Optimiert für hohe E-Mail-Volumina