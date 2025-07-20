/*
  # Create user_game_saves table for user-specific game state storage

  1. New Tables
    - `user_game_saves`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, name of the saved game)
      - `game_state` (jsonb, stores the entire gameState object)
      - `game_mode` (text, stores the game mode: 'solo', 'group', 'spielleiter')
      - `session_id` (uuid, nullable, foreign key to game_sessions)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_game_saves` table
    - Add policies for users to manage their own game saves
    - Add trigger for updating updated_at timestamp
*/

-- Create the user_game_saves table
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

-- Enable Row Level Security
ALTER TABLE user_game_saves ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_game_saves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_game_saves_updated_at
  BEFORE UPDATE ON user_game_saves
  FOR EACH ROW
  EXECUTE FUNCTION update_user_game_saves_updated_at();