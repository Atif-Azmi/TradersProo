const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runTest() {
  console.log("Checking columns of business_profile...");
  
  // Try to select authorized_signatory_name
  const { data: selectData, error: selectError } = await supabase
    .from('business_profile')
    .select('authorized_signatory_name')
    .limit(1);

  if (selectError) {
    console.log("Select error code:", selectError.code);
    console.log("Select error message:", selectError.message);
    console.log("Select error details:", selectError.details);
    console.log("Select error object:", JSON.stringify(selectError, null, 2));
  } else {
    console.log("Success selecting! Columns exist. Data:", selectData);
  }

  // Try to upsert with authorized_signatory_name
  const testPayload = {
    user_id: '00000000-0000-0000-0000-000000000000', // dummy uuid
    business_name: 'Test Business',
    authorized_signatory_name: 'Test Signatory'
  };

  console.log("\nTrying upsert with authorized_signatory_name...");
  const { data: upsertData, error: upsertError } = await supabase
    .from('business_profile')
    .upsert(testPayload, { onConflict: 'user_id' })
    .select()
    .single();

  if (upsertError) {
    console.log("Upsert error code:", upsertError.code);
    console.log("Upsert error message:", upsertError.message);
    console.log("Upsert error details:", upsertError.details);
    console.log("Upsert error object:", JSON.stringify(upsertError, null, 2));
  } else {
    console.log("Upsert success! Data:", upsertData);
  }
}

runTest();
