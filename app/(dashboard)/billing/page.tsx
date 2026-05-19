import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BillingClient from './BillingClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: customers } = await supabase
    .from('tp_customers')
    .select('id, name, phone')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  return (
    <BillingClient
      userId={user.id}
      customers={customers || []}
    />
  )
}
