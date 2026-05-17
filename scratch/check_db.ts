import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function checkProfiles() {
  console.log("--- PROFILES ---");
  const { data, error } = await supabase.from('tp_profile').select('*').limit(2)
  if (error) {
    console.error('Error fetching profiles:', error)
  } else {
    console.log(JSON.stringify(data, null, 2))
  }

  console.log("--- VIEW ---");
  const { data: viewData, error: viewError } = await supabase.from('tp_superadmin_users_view').select('*').limit(2)
  if (viewError) {
    console.error('Error fetching view:', viewError)
  } else {
    console.log(JSON.stringify(viewData, null, 2))
  }
}

checkProfiles()
