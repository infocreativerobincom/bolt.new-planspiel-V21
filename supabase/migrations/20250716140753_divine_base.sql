/*
  # Database Schema Setup for Political Strategy Game

  1. New Tables
    - `users` - User profiles extending auth.users
    - `game_sessions` - Game session management
    - `player_sessions` - Player participation in sessions
    - `feedback` - User feedback system
    - `user_game_saves` - Saved game states

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
    - User profile creation trigger

  3. Functions
    - Auto-create user profiles on registration
    - Update timestamp triggers
    - Feedback email trigger
*/

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
    -- Drop policies for users table
    DROP POLICY IF EXISTS "Users can read own data" ON users;
    DROP POLICY IF EXISTS "Users can update own data" ON users;
    DROP POLICY IF EXISTS "Users can read their own profile data" ON users;
    DROP POLICY IF EXISTS "Users can update their own profile data" ON users;
    
    -- Drop policies for game_sessions table
    DROP POLICY IF EXISTS "Spielleiter can manage own sessions" ON game_sessions;
    DROP POLICY IF EXISTS "Players can read sessions they joined" ON game_sessions;
    DROP POLICY IF EXISTS "Anyone can read sessions by invite code" ON game_sessions;
    DROP POLICY IF EXISTS "Authenticated users can read sessions" ON game_sessions;
    
    -- Drop policies for player_sessions table
    DROP POLICY IF EXISTS "Users can manage own player sessions" ON player_sessions;
    DROP POLICY IF EXISTS "Spielleiter can read player sessions in their games" ON player_sessions;
    
    -- Drop policies for feedback table
    DROP POLICY IF EXISTS "Users can create own feedback" ON feedback;
    DROP POLICY IF EXISTS "Users can read own feedback" ON feedback;
    
    -- Drop policies for user_game_saves table
    DROP POLICY IF EXISTS "Users can view their own game saves" ON user_game_saves;
    DROP POLICY IF EXISTS "Users can create their own game saves" ON user_game_saves;
    DROP POLICY IF EXISTS "Users can update their own game saves" ON user_game_saves;
    DROP POLICY IF EXISTS "Users can delete their own game saves" ON user_game_saves;
EXCEPTION
    WHEN undefined_object THEN
        NULL; -- Ignore if policies don't exist
END $$;

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_game_sessions_updated_at ON game_sessions;
DROP TRIGGER IF EXISTS update_user_game_saves_updated_at ON user_game_saves;
DROP TRIGGER IF EXISTS on_feedback_insert ON feedback;

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS update_user_game_saves_updated_at();
DROP FUNCTION IF EXISTS trigger_send_feedback_email();

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
  created_at timestamptz DEFAULT now(),
  Zeitpunkt timestamptz,
  player_email text
);

COMMENT ON COLUMN feedback.Zeitpunkt IS 'Wann wurde das Feedback gesendet';

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- User Game Saves Tabelle
CREATE TABLE IF NOT EXISTS user_game_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  game_state jsonb NOT NULL,
  game_mode text NOT NULL CHECK (game_mode IN ('solo', 'group', 'spielleiter')),
  session_id uuid REFERENCES game_sessions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_game_saves ENABLE ROW LEVEL SECURITY;

-- Trigger-Funktionen erstellen
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_user_game_saves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION trigger_send_feedback_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Hier könnte eine Edge Function aufgerufen werden
  -- Für jetzt nur ein Log-Eintrag
  RAISE LOG 'New feedback received from user %', NEW.user_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Trigger erstellen
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_game_saves_updated_at
  BEFORE UPDATE ON user_game_saves
  FOR EACH ROW
  EXECUTE FUNCTION update_user_game_saves_updated_at();

CREATE TRIGGER on_feedback_insert
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION trigger_send_feedback_email();

-- RLS Policies erstellen

-- Users Policies
CREATE POLICY "Users can read their own profile data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Game Sessions Policies
CREATE POLICY "Spielleiter can manage own sessions"
  ON game_sessions
  FOR ALL
  TO authenticated
  USING (spielleiter_id = auth.uid())
  WITH CHECK (spielleiter_id = auth.uid());

CREATE POLICY "Authenticated users can read sessions"
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Player Sessions Policies
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

-- Feedback Policies
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

-- User Game Saves Policies
CREATE POLICY "Users can view their own game saves"
  ON user_game_saves
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game saves"
  ON user_game_saves
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game saves"
  ON user_game_saves
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game saves"
  ON user_game_saves
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
