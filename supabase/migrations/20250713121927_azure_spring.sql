/*
  # Authentifizierung und Gruppensystem

  1. Neue Tabellen
    - `users` - Erweiterte Benutzerinformationen
    - `game_sessions` - Gruppensitzungen
    - `player_sessions` - Spieler in Sitzungen
    - `feedback` - Feedback-System

  2. Sicherheit
    - RLS aktiviert für alle Tabellen
    - Policies für Benutzer und Spielleiter
*/

-- Users Tabelle (erweitert die auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('player', 'spielleiter')) DEFAULT 'player',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Game Sessions Tabelle
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  spielleiter_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type text NOT NULL CHECK (game_type IN ('solo', 'group')) DEFAULT 'group',
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
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Player Sessions Tabelle
CREATE TABLE IF NOT EXISTS player_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  game_state jsonb,
  joined_at timestamptz DEFAULT now(),
  last_played timestamptz DEFAULT now(),
  UNIQUE(user_id, session_id)
);

ALTER TABLE player_sessions ENABLE ROW LEVEL SECURITY;

-- Feedback Tabelle
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES game_sessions(id) ON DELETE SET NULL,
  page_url text NOT NULL,
  screenshot_data text NOT NULL,
  marked_area jsonb NOT NULL,
  feedback_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Benutzer können ihre eigenen Daten lesen und aktualisieren
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

-- Game Sessions: Spielleiter können ihre Sessions verwalten, Spieler können Sessions lesen
CREATE POLICY "Spielleiter can manage own sessions"
  ON game_sessions
  FOR ALL
  TO authenticated
  USING (spielleiter_id = auth.uid());

CREATE POLICY "Players can read sessions they joined"
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT session_id FROM player_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read sessions by invite code"
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Player Sessions: Benutzer können ihre eigenen Sessions verwalten
CREATE POLICY "Users can manage own player sessions"
  ON player_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Spielleiter can read player sessions in their games"
  ON player_sessions
  FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM game_sessions WHERE spielleiter_id = auth.uid()
    )
  );

-- Feedback: Benutzer können ihr eigenes Feedback erstellen
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

CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Funktion zum Erstellen eines Benutzerprofils nach Registrierung
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Unbekannt'),
    COALESCE(new.raw_user_meta_data->>'role', 'player')
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger für neue Benutzer
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();