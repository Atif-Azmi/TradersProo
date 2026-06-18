-- Add authorized_signatory_name column to business_profile table
ALTER TABLE business_profile ADD COLUMN IF NOT EXISTS authorized_signatory_name TEXT;

-- Reload schema cache to make column visible to PostgREST/Supabase client
NOTIFY pgrst, 'reload schema';
