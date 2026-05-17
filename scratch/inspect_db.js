const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tekpolqdsoyqlctglaly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3BvbHFkc295cWxjdGdsYWx5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODU2OTI3NCwiZXhwIjoyMDk0MTQ1Mjc0fQ.wZ4_OYid-svMqjFSArsAQNQs_9I-DdNQBiDsSD09otY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log("Fetching unique types...");
  const { data: types, error: err1 } = await supabase.from('tp_payments_received').select('type');
  if (err1) {
    console.error(err1);
  } else {
    const uniqueTypes = [...new Set(types.map(t => t.type))];
    console.log("Unique types in tp_payments_received:", uniqueTypes);
  }

  // Check unique payment modes
  const { data: modes, error: err2 } = await supabase.from('tp_payments_received').select('payment_mode');
  if (err2) {
    console.error(err2);
  } else {
    const uniqueModes = [...new Set(modes.map(m => m.payment_mode))];
    console.log("Unique payment modes in tp_payments_received:", uniqueModes);
  }
}

inspect();
