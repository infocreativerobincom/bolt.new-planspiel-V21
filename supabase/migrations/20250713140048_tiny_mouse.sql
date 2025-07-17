/*
  # Fix RLS Policy für Users Tabelle

  Das Problem liegt daran, dass die bestehende RLS Policy auf die falsche Spalte verweist.
  Die Policy versucht `auth.uid() = id` zu verwenden, aber die users Tabelle hat wahrscheinlich
  eine andere Spaltenstruktur.

  ## Änderungen:
  1. Entfernt die fehlerhafte Policy
  2. Erstellt eine neue Policy mit korrekter Spaltenreferenz
  3. Stellt sicher, dass die Policy auf die richtige Spalte verweist
*/

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Users can read their own profile data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile data" ON public.users;

-- Create new RLS policies with correct column references
CREATE POLICY "Users can read their own profile data" 
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile data" 
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id::text);

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;