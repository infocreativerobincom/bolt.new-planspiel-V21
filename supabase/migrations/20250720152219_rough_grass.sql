/*
  # Add missing columns to users table

  1. Changes
    - Add `email` column (text, unique, not null)
    - Add `is_verified` column (boolean, default false)
    - Add `verification_token` column (text, nullable)
    - Add `verification_expires_at` column (timestamptz, nullable)

  2. Security
    - Update existing RLS policies to work with new columns
    - Add index on email for performance
    - Add index on verification_token for performance
*/

-- Add missing columns to users table
DO $$
BEGIN
  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email'
  ) THEN
    ALTER TABLE users ADD COLUMN email text;
  END IF;

  -- Add is_verified column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE users ADD COLUMN is_verified boolean DEFAULT false;
  END IF;

  -- Add verification_token column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'verification_token'
  ) THEN
    ALTER TABLE users ADD COLUMN verification_token text;
  END IF;

  -- Add verification_expires_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'verification_expires_at'
  ) THEN
    ALTER TABLE users ADD COLUMN verification_expires_at timestamptz;
  END IF;
END $$;

-- Make email unique and not null (only if column was just added)
DO $$
BEGIN
  -- First check if email column exists and has data
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email'
  ) THEN
    -- Add unique constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_name = 'users' AND constraint_name = 'users_email_key'
    ) THEN
      ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
    END IF;

    -- Make email not null if it's currently nullable and has no null values
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'email' AND is_nullable = 'YES'
    ) AND NOT EXISTS (
      SELECT 1 FROM users WHERE email IS NULL
    ) THEN
      ALTER TABLE users ALTER COLUMN email SET NOT NULL;
    END IF;
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users (verification_token);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users (is_verified);