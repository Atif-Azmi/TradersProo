import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SalesClient from './SalesClient'

export default async function SalesPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [salesRes, profileRes] = await Promise.all([
    supabase
      .from('tp_sales')
      .select('*, tp_customers(name, phone)')
      .order('created_at', { ascending: false }),
    supabase
      .from('tp_profile')
      .select('business_name, tagline, phone, address, city, state, gst_number, upi_id, bank_name, account_number, ifsc_code')
      .eq('id', user.id)
      .single()
  ])

  if (salesRes.error) console.error('Error fetching sales:', salesRes.error.message)

  return <SalesClient initialSales={salesRes.data || []} shopProfile={profileRes.data || {}} />
}
