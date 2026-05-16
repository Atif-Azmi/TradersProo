-- Business profile table (one row per business/tenant)
CREATE TABLE IF NOT EXISTS business_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE, -- Link to auth user
  business_legal_name TEXT NOT NULL,
  support_phone TEXT NOT NULL,
  gst_identification TEXT,
  registered_address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refresh schema cache (critical for Supabase to recognize new columns)
NOTIFY pgrst, 'reload schema';

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
DROP TRIGGER IF EXISTS set_updated_at ON business_profile;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON business_profile
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE business_profile ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for clean setup
DROP POLICY IF EXISTS "Allow authenticated read access" ON business_profile;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON business_profile;
DROP POLICY IF EXISTS "Allow authenticated update access" ON business_profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON business_profile;
DROP POLICY IF EXISTS "Users can view own profile" ON business_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON business_profile;
DROP POLICY IF EXISTS "insert_own_profile" ON business_profile;
DROP POLICY IF EXISTS "select_own_profile" ON business_profile;
DROP POLICY IF EXISTS "update_own_profile" ON business_profile;
DROP POLICY IF EXISTS "Allow all" ON business_profile;

-- Create correct per-user policies
CREATE POLICY "insert_own_profile"
ON business_profile FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "select_own_profile"  
ON business_profile FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "update_own_profile"
ON business_profile FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Verify columns exist (check results in SQL editor output)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_profile';
