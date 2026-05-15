import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewInvoiceClient from './NewInvoiceClient'

export default async function CreateInvoicePage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [custRes, prodRes] = await Promise.all([
    supabase.from('tp_customers').select('id, name, company_name'),
    supabase.from('tp_products').select('id, name, selling_rate, unit')
  ])

  return (
    <NewInvoiceClient 
      initialCustomers={custRes.data || []} 
      initialProducts={prodRes.data || []} 
    />
  )
}
