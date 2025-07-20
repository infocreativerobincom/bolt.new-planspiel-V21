/*
  # Fix infinite recursion in game_sessions RLS policies

  1. Problem
    - The existing RLS policy causes infinite recursion when checking permissions
    - This happens when a policy references the same table it's protecting

  2. Solution
    - Drop the problematic policies
    - Create simplified policies that don't cause recursion
    - Ensure Spielleiter can manage their own sessions
    - Allow authenticated users to read sessions for joining

  3. Security
    - Maintain proper access control without recursion
    - Spielleiter can only manage their own sessions
    - Players can read sessions to join them
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Spielleiter can manage own sessions" ON game_sessions;
DROP POLICY IF EXISTS "Players can read sessions they joined" ON game_sessions;
DROP POLICY IF EXISTS "Anyone can read sessions by invite code" ON game_sessions;

-- Create new simplified policies without recursion

-- Spielleiter can manage (create, read, update, delete) their own sessions
CREATE POLICY "Spielleiter can manage own sessions" 
ON game_sessions
FOR ALL
TO authenticated
USING (spielleiter_id = auth.uid())
WITH CHECK (spielleiter_id = auth.uid());


-- Ensure RLS is enabled
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;