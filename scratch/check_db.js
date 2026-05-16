const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkColumn() {
  const { data, error } = await supabase
    .from('business_profile')
    .select('user_id')
    .limit(1);
    
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success! user_id column exists. Data:', data);
  }
}

checkColumn();
