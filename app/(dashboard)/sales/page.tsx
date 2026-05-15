import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SalesClient from './SalesClient'

export default async function SalesPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('tp_sales')
    .select('*, tp_customers(name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching sales:', error.message)
  }

  return <SalesClient initialSales={data || []} />
}
