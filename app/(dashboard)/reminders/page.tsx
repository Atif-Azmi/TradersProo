import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RemindersClient from './RemindersClient'

export default async function RemindersPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [custRes, profileRes] = await Promise.all([
    supabase.from('tp_customer_balances').select('*').gt('outstanding_dues', 0),
    supabase.from('tp_profile').select('*').single() // RLS handles user_id filter
  ])

  return (
    <RemindersClient 
      initialCustomers={custRes.data || []} 
      businessProfile={profileRes.data} 
    />
  )
}
