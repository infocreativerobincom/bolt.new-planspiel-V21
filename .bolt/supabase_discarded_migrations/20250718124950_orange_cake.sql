/*
  # Email Trigger für Feedback

  1. Trigger Function
    - Erstellt eine Funktion die bei neuen Feedback-Einträgen ausgelöst wird
    - Sendet E-Mail über Edge Function

  2. Trigger
    - Wird bei INSERT auf feedback Tabelle ausgelöst
    - Ruft die Edge Function für E-Mail-Versand auf
*/

-- Trigger-Funktion für Feedback-E-Mail
CREATE OR REPLACE FUNCTION trigger_send_feedback_email()
RETURNS TRIGGER AS $$
DECLARE
  user_profile RECORD;
  session_info RECORD;
BEGIN
  -- Hole User-Profil
  SELECT up.first_name, up.last_name, up.email
  INTO user_profile
  FROM user_profiles up
  WHERE up.user_id = NEW.user_id;

  -- Hole Session-Info falls vorhanden
  IF NEW.session_id IS NOT NULL THEN
    SELECT gs.name
    INTO session_info
    FROM game_sessions gs
    WHERE gs.id = NEW.session_id;
  END IF;

  -- Rufe Edge Function für E-Mail-Versand auf
  PERFORM
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/send-feedback-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object(
        'feedbackId', NEW.id,
        'userEmail', COALESCE(NEW.player_email, user_profile.email),
        'userName', user_profile.first_name || ' ' || user_profile.last_name,
        'feedbackText', NEW.feedback_text,
        'pageUrl', NEW.page_url,
        'sessionId', NEW.session_id,
        'markedArea', NEW.marked_area
      )
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger erstellen (falls noch nicht vorhanden)
DROP TRIGGER IF EXISTS on_feedback_insert ON feedback;
CREATE TRIGGER on_feedback_insert
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION trigger_send_feedback_email();