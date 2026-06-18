import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SalesClient from './SalesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SalesPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [salesRes, tpProfileRes, bizProfileRes] = await Promise.all([
    supabase
      .from('tp_sales')
      .select('*, tp_customers(name, phone)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('tp_profile')
      .select('business_name, tagline, phone, address, city, state, gst_number, upi_id, bank_name, account_number, ifsc_code')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('business_profile')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
  ])

  if (salesRes.error) console.error('Error fetching sales:', salesRes.error.message)

  const shopProfile = {
    ...tpProfileRes.data,
    ...bizProfileRes.data,
    business_name: bizProfileRes.data?.business_name || tpProfileRes.data?.business_name || 'Generic Business Node',
    authorized_signatory_name: bizProfileRes.data?.authorized_signatory_name || ''
  }

  return <SalesClient userId={user.id} initialSales={salesRes.data || []} shopProfile={shopProfile} />
}
