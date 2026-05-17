import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface BusinessProfile {
  id?: string;
  user_id?: string;
  business_name: string;
  tagline?: string;
  support_phone?: string;
  gst_number?: string;
  registered_address?: string;
  city?: string;
  state?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  upi_id?: string;
  bill_prefix?: string;
}

export const useBusinessProfile = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    // Load from localStorage cache first (instant UI)
    const cached = typeof window !== 'undefined' ? localStorage.getItem('bp') : null;
    if (cached) {
      try {
        setProfile(JSON.parse(cached));
        setLoading(false);
      } catch (e) {
        console.error('Failed to parse cached profile', e);
      }
    }

    // Always fetch fresh from Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [bpRes, tpRes] = await Promise.all([
        supabase.from('business_profile').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('tp_profile').select('*').maybeSingle()
      ]);

      if (bpRes.data || tpRes.data) {
        const mergedData: BusinessProfile = {
          ...bpRes.data,
          bank_name: tpRes.data?.bank_name || '',
          account_number: tpRes.data?.account_number || '',
          ifsc_code: tpRes.data?.ifsc_code || '',
          upi_id: tpRes.data?.upi_id || '',
          bill_prefix: tpRes.data?.bill_prefix || 'INV',
          business_name: bpRes.data?.business_name || 'Generic Business Node'
        };
        setProfile(mergedData);
        localStorage.setItem('bp', JSON.stringify(mergedData));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, refetch: fetchProfile };
};

// Save/Update function — call on "COMMIT CHANGES" click
export const saveBusinessProfile = async (formData: any) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const payload = {
    user_id: user.id,
    business_name: formData.businessName?.trim() || 'Generic Business Node',
    tagline: formData.tagline?.trim() || null,
    support_phone: formData.supportPhone?.trim() || null,
    gst_number: formData.gstNumber?.trim() || null,
    registered_address: formData.registeredAddress?.trim() || null,
    city: formData.city?.trim() || null,
    state: formData.state?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('business_profile')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;

  // Update localStorage cache immediately
  if (data) {
    localStorage.setItem('bp', JSON.stringify(data));
  }
  return data;
};
