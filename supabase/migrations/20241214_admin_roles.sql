-- ============================================
-- Admin Roles System
-- Created: 2024-12-14
-- Description: Creates admin_users table for role management
--              and seeds the initial admin user
-- ============================================

-- Create admin_users table for role management
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'subadmin' CHECK (role IN ('admin', 'subadmin')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all admin users
CREATE POLICY "Admins can view all admin users"
ON admin_users FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users WHERE role = 'admin'
  )
);

-- Policy: Subadmins can view their own record
CREATE POLICY "Users can view their own admin record"
ON admin_users FOR SELECT
USING (
  auth.uid() = user_id
);

-- Policy: Only admins can create new admin users
CREATE POLICY "Only admins can create admin users"
ON admin_users FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM admin_users WHERE role = 'admin'
  )
);

-- Policy: Only admins can update admin users
CREATE POLICY "Only admins can update admin users"
ON admin_users FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users WHERE role = 'admin'
  )
);

-- Policy: Only admins can delete admin users (except themselves)
CREATE POLICY "Only admins can delete admin users"
ON admin_users FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users WHERE role = 'admin'
  )
  AND user_id != auth.uid()
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_admin_users_updated_at ON admin_users;
CREATE TRIGGER trigger_update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Seed the initial admin (demo@demo.com becomes the main admin)
-- This uses DO block to handle the case where the user doesn't exist yet
DO $$
BEGIN
  INSERT INTO admin_users (user_id, email, role, created_by)
  SELECT id, email, 'admin', id
  FROM auth.users 
  WHERE LOWER(email) = 'demo@demo.com'
  ON CONFLICT (email) DO NOTHING;
  
  -- Also add admin@miniandbasketcamp.it if exists
  INSERT INTO admin_users (user_id, email, role, created_by)
  SELECT id, email, 'admin', id
  FROM auth.users 
  WHERE LOWER(email) = 'admin@miniandbasketcamp.it'
  ON CONFLICT (email) DO NOTHING;
END $$;

-- ============================================
-- Note: To disable public signups in Supabase:
-- 1. Go to Authentication > Providers > Email
-- 2. Disable "Enable Email Signup"
-- 3. Only existing users or invited users can sign in
-- ============================================