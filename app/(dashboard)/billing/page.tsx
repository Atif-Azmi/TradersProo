import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BillingClient from './BillingClient'

export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: customers } = await supabase
    .from('tp_customers')
    .select('id, name, phone')
    .order('name', { ascending: true })

  return (
    <BillingClient
      userId={user.id}
      customers={customers || []}
    />
  )
}
