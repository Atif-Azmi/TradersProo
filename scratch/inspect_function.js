const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tekpolqdsoyqlctglaly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3BvbHFkc295cWxjdGdsYWx5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODU2OTI3NCwiZXhwIjoyMDk0MTQ1Mjc0fQ.wZ4_OYid-svMqjFSArsAQNQs_9I-DdNQBiDsSD09otY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const targetExpiry = new Date();
  targetExpiry.setDate(targetExpiry.getDate() + 5); // Exactly 5 days from now

  console.log("Setting plan_expiry to exactly 5 days from now:", targetExpiry.toISOString());

  const { error } = await supabase
    .from('tp_profile')
    .update({ plan_expiry: targetExpiry.toISOString() })
    .eq('id', 'd3c9e396-17dc-4cad-9f6d-eb058968b7cb');

  if (error) {
    console.error('Error updating plan_expiry:', error);
  } else {
    console.log('Update successful!');
  }

  // Also query the view to verify days_remaining is exactly 5
  const { data, error: viewError } = await supabase
    .from('tp_superadmin_users_view')
    .select('days_remaining, trial_end_date')
    .eq('id', 'd3c9e396-17dc-4cad-9f6d-eb058968b7cb')
    .single();

  if (viewError) {
    console.error('Error querying view:', viewError);
  } else {
    console.log('View values after update:', data);
  }
}

inspect();
