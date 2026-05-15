import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BillingClient from './BillingClient'

export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [customersRes, profileRes] = await Promise.all([
    supabase.from('tp_customers').select('id, name, phone').order('name', { ascending: true }),
    supabase.from('tp_profile').select('business_name, tagline, address, city, state, phone, gst_number').eq('id', user.id).single()
  ])

  return (
    <BillingClient
      userId={user.id}
      customers={customersRes.data || []}
      shopProfile={profileRes.data || {}}
    />
  )
}
