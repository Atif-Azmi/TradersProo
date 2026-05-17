import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReportsClient from './ReportsClient'

export default async function ReportsPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all parallel datasets for reporting
  const [
    { data: sales },
    { data: products },
    { data: customers },
    { data: payments },
    { data: customerBalances }
  ] = await Promise.all([
    supabase.from('tp_sales').select('*, tp_customers(name, company_name)').order('created_at', { ascending: false }),
    supabase.from('tp_products').select('*').order('name'),
    supabase.from('tp_customers').select('*').order('name'),
    supabase.from('tp_payments_received').select('*, tp_customers(name)').order('created_at', { ascending: false }),
    supabase.from('tp_customer_balances').select('*')
  ])

  return (
    <ReportsClient 
      sales={sales || []}
      products={products || []}
      customers={customers || []}
      payments={payments || []}
      customerBalances={customerBalances || []}
    />
  )
}
