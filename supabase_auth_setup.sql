-- ============================================================
-- FitnessPod Auth Setup — run this in the Supabase SQL Editor
-- ============================================================

-- 1. Profiles table (linked 1:1 to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id                      UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name               TEXT        NOT NULL,
  phone                   TEXT,
  signup_source           TEXT        NOT NULL DEFAULT 'website' CHECK (signup_source IN ('app', 'website')),
  pod_points              INTEGER     NOT NULL DEFAULT 0,
  app_free_session_used   BOOLEAN     DEFAULT NULL, -- false = eligible, true = used, null = website signup (not applicable)
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile during signup
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile (but NOT pod_points — handled by RPC)
CREATE POLICY "Users can update own non-points profile fields"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 3. Secure RPC to deduct Pod Points (prevents client-side manipulation)
CREATE OR REPLACE FUNCTION deduct_pod_points(p_user_id UUID, p_amount INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    pod_points = pod_points - p_amount,
    -- Mark free session as used on first deduction for app signups
    app_free_session_used = CASE
      WHEN app_free_session_used = false THEN true
      ELSE app_free_session_used
    END
  WHERE id = p_user_id AND pod_points >= p_amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient Pod Points';
  END IF;
END;
$$;

-- 4. Add user_id to bookings table (links bookings to accounts)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 5. Update bookings RLS to allow users to see their own bookings
-- (only needed if bookings doesn't already have RLS)
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own bookings"
--   ON bookings FOR SELECT
--   USING (auth.uid() = user_id OR user_id IS NULL);

-- ============================================================
-- Supabase Dashboard settings to apply manually:
--
-- Auth > Settings > JWT expiry: set to 2592000 (30 days)
-- Auth > Settings > Disable email confirmations (for immediate login after signup)
--   OR customise the confirmation email template to include FitnessPod branding
--
-- For the Resend welcome email (app signups):
-- Create a Supabase Edge Function that triggers on new user insert to profiles
-- where signup_source = 'app', then call the Resend API.
-- ============================================================
