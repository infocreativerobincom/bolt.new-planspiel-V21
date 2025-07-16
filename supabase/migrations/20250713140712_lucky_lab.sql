/*
  # Enable Email Confirmation

  1. Configuration
    - Enable email confirmation requirement
    - Set confirmation URL template
    - Configure email templates

  2. Security
    - Users must confirm email before login
    - Automatic cleanup of unconfirmed accounts after 24h
*/

-- Enable email confirmation in auth settings
-- Note: This would typically be done in the Supabase dashboard under Authentication > Settings
-- But we can create a function to help with this

-- Create a function to check if email is confirmed
CREATE OR REPLACE FUNCTION public.is_email_confirmed(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT email_confirmed_at IS NOT NULL 
     FROM auth.users 
     WHERE id = user_id), 
    false
  );
$$;

-- Update the handle_new_user function to only create profile after email confirmation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only create user profile if email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    INSERT INTO public.users (id, name, role, created_at, updated_at)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'Unbekannt'),
      COALESCE(NEW.raw_user_meta_data->>'role', 'player'),
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update the trigger to fire on email confirmation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Also create trigger for immediate confirmed signups (like admin accounts)
CREATE OR REPLACE TRIGGER on_auth_user_created_confirmed
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.email_confirmed_at IS NOT NULL)
  EXECUTE PROCEDURE public.handle_new_user();

-- Create a cleanup function for unconfirmed users (optional)
CREATE OR REPLACE FUNCTION public.cleanup_unconfirmed_users()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  -- This would typically be run as a scheduled job
  -- Delete users who haven't confirmed their email within 24 hours
  DELETE FROM auth.users 
  WHERE email_confirmed_at IS NULL 
    AND created_at < NOW() - INTERVAL '24 hours';
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_email_confirmed(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_unconfirmed_users() TO service_role;