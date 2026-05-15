import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function checkProfiles() {
  const { data, error } = await supabase.from('tp_profile').select('*')
  if (error) {
    console.error('Error fetching profiles:', error)
  } else {
    console.log('Profiles found:', data.length)
    console.log(JSON.stringify(data, null, 2))
  }
}

checkProfiles()
