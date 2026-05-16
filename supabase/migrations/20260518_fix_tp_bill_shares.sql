-- Drop and recreate tp_bill_shares cleanly
DROP TABLE IF EXISTS tp_bill_shares CASCADE;

CREATE TABLE tp_bill_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Bill reference
  invoice_id UUID,
  invoice_number TEXT,
  
  -- Share details  
  share_token TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  share_url TEXT,
  pdf_url TEXT,
  
  -- Storage path (used by existing code)
  storage_path TEXT,

  -- Period
  period_start DATE,
  period_end DATE,
  
  -- Customer snapshot
  customer_id UUID,
  customer_name TEXT,
  customer_phone TEXT,
  total_amount NUMERIC(12,2),
  
  -- Meta
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tp_bill_shares ENABLE ROW LEVEL SECURITY;

-- Drop any old broken policies
DROP POLICY IF EXISTS "allow_all_tp_bill_shares" ON tp_bill_shares;
DROP POLICY IF EXISTS "insert_own_shares" ON tp_bill_shares;
DROP POLICY IF EXISTS "select_own_shares" ON tp_bill_shares;
DROP POLICY IF EXISTS "update_own_shares" ON tp_bill_shares;
DROP POLICY IF EXISTS "delete_own_shares" ON tp_bill_shares;
DROP POLICY IF EXISTS "public_view_by_token" ON tp_bill_shares;

-- Create correct policies
CREATE POLICY "insert_own_shares"
ON tp_bill_shares FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "select_own_shares"
ON tp_bill_shares FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "update_own_shares"
ON tp_bill_shares FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_shares"
ON tp_bill_shares FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Allow public to view shared bills via token (for share link)
CREATE POLICY "public_view_by_token"
ON tp_bill_shares FOR SELECT TO anon
USING (is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW()));

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_tp_bill_shares_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON tp_bill_shares;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON tp_bill_shares
FOR EACH ROW EXECUTE FUNCTION update_tp_bill_shares_updated_at();

-- Supabase Storage bucket for PDF uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('bills', 'bills', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "auth_upload_bills" ON storage.objects;
DROP POLICY IF EXISTS "auth_update_bills" ON storage.objects;
DROP POLICY IF EXISTS "auth_read_bills" ON storage.objects;

CREATE POLICY "auth_upload_bills"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'bills');

CREATE POLICY "auth_update_bills"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'bills');

CREATE POLICY "auth_read_bills"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'bills');

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
