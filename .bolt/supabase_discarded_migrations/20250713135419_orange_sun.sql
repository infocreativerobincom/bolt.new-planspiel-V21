/*
  # Fix Auth Schema Permission Error

  1. Problem
    - Die ursprüngliche Migration versucht auf auth.users zuzugreifen
    - Das auth Schema ist für normale Queries nicht zugänglich
    
  2. Lösung
    - Verwende auth.uid() Funktion statt direkten Zugriff auf auth.users
    - Korrigiere die Foreign Key Constraints
    - Stelle sicher, dass RLS Policies korrekt funktionieren

  3. Änderungen
    - Entferne direkten auth.users Zugriff
    - Verwende UUID als Primärschlüssel für users Tabelle
    - Korrigiere alle Foreign Key Referenzen
*/

-- Erstelle users Tabelle ohne direkten auth.users Zugriff
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'player',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role = ANY (ARRAY['player'::text, 'spielleiter'::text]))
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies für users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function für automatische User-Erstellung bei Registrierung
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'player')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für automatische User-Erstellung (falls noch nicht vorhanden)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- Game Sessions Tabelle
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  spielleiter_id uuid NOT NULL,
  game_type text NOT NULL DEFAULT 'group',
  age_group text,
  target_audience text,
  spielleiter_info text,
  max_players integer DEFAULT 30,
  current_players integer DEFAULT 0,
  invite_code text UNIQUE NOT NULL,
  pause_points text[] DEFAULT '{}',
  current_pause_point text,
  is_paused boolean DEFAULT false,
  show_results_to_players boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT game_sessions_game_type_check CHECK (game_type = ANY (ARRAY['solo'::text, 'group'::text]))
);

-- Foreign Key zu users (nicht auth.users)
ALTER TABLE game_sessions 
ADD CONSTRAINT game_sessions_spielleiter_id_fkey 
FOREIGN KEY (spielleiter_id) REFERENCES users(id) ON DELETE CASCADE;

-- Enable RLS für game_sessions
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies für game_sessions
CREATE POLICY "Spielleiter can manage own sessions"
  ON game_sessions
  FOR ALL
  TO authenticated
  USING (spielleiter_id = auth.uid());

CREATE POLICY "Anyone can read sessions by invite code"
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Players can read sessions they joined"
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT session_id FROM player_sessions WHERE user_id = auth.uid()
  ));

-- Trigger für game_sessions updated_at
CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Player Sessions Tabelle
CREATE TABLE IF NOT EXISTS player_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id uuid NOT NULL,
  game_state jsonb,
  joined_at timestamptz DEFAULT now(),
  last_played timestamptz DEFAULT now(),
  UNIQUE(user_id, session_id)
);

-- Foreign Keys für player_sessions
ALTER TABLE player_sessions 
ADD CONSTRAINT player_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE player_sessions 
ADD CONSTRAINT player_sessions_session_id_fkey 
FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE;

-- Enable RLS für player_sessions
ALTER TABLE player_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies für player_sessions
CREATE POLICY "Users can manage own player sessions"
  ON player_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Spielleiter can read player sessions in their games"
  ON player_sessions
  FOR SELECT
  TO authenticated
  USING (session_id IN (
    SELECT id FROM game_sessions WHERE spielleiter_id = auth.uid()
  ));

-- Feedback Tabelle
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id uuid,
  page_url text NOT NULL,
  screenshot_data text NOT NULL,
  marked_area jsonb NOT NULL,
  feedback_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Foreign Keys für feedback
ALTER TABLE feedback 
ADD CONSTRAINT feedback_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE feedback 
ADD CONSTRAINT feedback_session_id_fkey 
FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE SET NULL;

-- Enable RLS für feedback
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies für feedback
CREATE POLICY "Users can create own feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());