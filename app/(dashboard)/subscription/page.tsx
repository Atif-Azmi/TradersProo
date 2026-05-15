import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SubscriptionClient from './SubscriptionClient'

export default async function SubscriptionPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <SubscriptionClient />
}
