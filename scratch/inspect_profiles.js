const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tekpolqdsoyqlctglaly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3BvbHFkc295cWxjdGdsYWx5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODU2OTI3NCwiZXhwIjoyMDk0MTQ1Mjc0fQ.wZ4_OYid-svMqjFSArsAQNQs_9I-DdNQBiDsSD09otY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log("--- PROFILES RECORD ---");
  const { data: profiles, error: err1 } = await supabase.from('tp_profile').select('*').limit(1);
  if (err1) {
    console.error(err1);
  } else {
    console.log(JSON.stringify(profiles, null, 2));
  }

  console.log("--- SUPERADMIN VIEW RECORD ---");
  const { data: viewRecords, error: err2 } = await supabase.from('tp_superadmin_users_view').select('*').limit(1);
  if (err2) {
    console.error(err2);
  } else {
    console.log(JSON.stringify(viewRecords, null, 2));
  }
}

inspect();
