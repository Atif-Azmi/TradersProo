-- Clean create with all needed fields
DROP TABLE IF EXISTS business_profile CASCADE;

CREATE TABLE business_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name TEXT NOT NULL DEFAULT 'Generic Business Node',
  tagline TEXT,
  support_phone TEXT,
  gst_number TEXT,
  registered_address TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON business_profile;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON business_profile
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE business_profile ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "insert_own_profile" ON business_profile;
DROP POLICY IF EXISTS "select_own_profile" ON business_profile;
DROP POLICY IF EXISTS "update_own_profile" ON business_profile;

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

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'business_profile'
ORDER BY ordinal_position;
