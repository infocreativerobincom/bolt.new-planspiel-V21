/*
  # Benutzer- und Gruppenverwaltungssystem für Politisches Planspiel

  1. Neue Tabellen
    - `game_groups` - Spielgruppen für Spielleiter
    - `group_memberships` - Zuordnung Spieler zu Gruppen
    - `user_game_states` - Gespeicherte Spielstände der Benutzer
    - `email_verifications` - Email-Verifikations-Tokens

  2. Sicherheit
    - Enable RLS auf allen Tabellen
    - Policies für Benutzer- und Rollenverwaltung
    - Sichere Zugriffe auf Gruppendaten
*/

-- Erweiterte Benutzerprofile
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('player', 'instructor')) DEFAULT 'player',
  is_verified boolean DEFAULT false,
  verification_token text,
  verification_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Spielgruppen für Spielleiter
CREATE TABLE IF NOT EXISTS game_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  instructor_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  age_group text NOT NULL,
  target_audience text NOT NULL,
  instructor_info text NOT NULL,
  max_players integer DEFAULT 30,
  invite_code text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'base64'),
  pause_points jsonb DEFAULT '[]'::jsonb,
  current_pause_point text,
  is_paused boolean DEFAULT false,
  show_results_to_players boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gruppenmitgliedschaften
CREATE TABLE IF NOT EXISTS group_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES game_groups(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(group_id, player_id)
);

-- Gespeicherte Spielstände
CREATE TABLE IF NOT EXISTS user_game_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  group_id uuid REFERENCES game_groups(id) ON DELETE SET NULL,
  game_state jsonb NOT NULL,
  save_name text NOT NULL,
  is_auto_save boolean DEFAULT false,
  game_mode text NOT NULL CHECK (game_mode IN ('solo', 'group')) DEFAULT 'solo',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email-Verifikationen
CREATE TABLE IF NOT EXISTS email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_game_groups_instructor_id ON game_groups(instructor_id);
CREATE INDEX IF NOT EXISTS idx_game_groups_invite_code ON game_groups(invite_code);
CREATE INDEX IF NOT EXISTS idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_group_memberships_player_id ON group_memberships(player_id);
CREATE INDEX IF NOT EXISTS idx_user_game_states_user_id ON user_game_states(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_states_group_id ON user_game_states(group_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);

-- RLS aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Policies für users
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies für game_groups
CREATE POLICY "Instructors can manage own groups"
  ON game_groups
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE user_id = auth.uid() 
      AND id = game_groups.instructor_id
      AND role = 'instructor'
    )
  );

CREATE POLICY "Players can read groups they belong to"
  ON game_groups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_memberships gm
      JOIN users up ON up.id = gm.player_id
      WHERE up.user_id = auth.uid()
      AND gm.group_id = game_groups.id
      AND gm.is_active = true
    )
  );

-- Policies für group_memberships
CREATE POLICY "Instructors can manage memberships in own groups"
  ON group_memberships
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_groups gg
      JOIN users up ON up.id = gg.instructor_id
      WHERE up.user_id = auth.uid()
      AND gg.id = group_memberships.group_id
      AND up.role = 'instructor'
    )
  );

CREATE POLICY "Players can read own memberships"
  ON group_memberships
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users up
      WHERE up.user_id = auth.uid()
      AND up.id = group_memberships.player_id
    )
  );

-- Policies für user_game_states
CREATE POLICY "Users can manage own game states"
  ON user_game_states
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users up
      WHERE up.user_id = auth.uid()
      AND up.id = user_game_states.user_id
    )
  );

CREATE POLICY "Instructors can read game states in own groups"
  ON user_game_states
  FOR SELECT
  TO authenticated
  USING (
    user_game_states.group_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM game_groups gg
      JOIN users up ON up.id = gg.instructor_id
      WHERE up.user_id = auth.uid()
      AND gg.id = user_game_states.group_id
      AND up.role = 'instructor'
    )
  );

-- Policies für email_verifications
CREATE POLICY "Users can read own verifications"
  ON email_verifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

CREATE TRIGGER update_game_groups_updated_at
  BEFORE UPDATE ON game_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_game_states_updated_at
  BEFORE UPDATE ON user_game_states
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();