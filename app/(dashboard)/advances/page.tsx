import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdvancesClient from './AdvancesClient'

export default async function AdvancesPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all transactions/payments received
  const { data: payments } = await supabase
    .from('tp_payments_received')
    .select('*, tp_customers(name, company_name)')
    .order('created_at', { ascending: false })

  // Fetch all customers for selection in the modal
  const { data: customers } = await supabase
    .from('tp_customers')
    .select('id, name, company_name')
    .order('name')

  return (
    <AdvancesClient 
      initialPayments={payments || []} 
      customers={customers || []} 
    />
  )
}
