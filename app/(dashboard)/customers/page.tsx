import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CustomersClient from './CustomersClient'

export default async function CustomersPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('tp_customer_balances')
    .select('*')

  let initialCustomers = data || []

  if (error) {
    console.error('Error fetching customer balances view:', error.message)
    // Fallback to basic customer data if view fails
    const { data: basicData } = await supabase.from('tp_customers').select('*')
    initialCustomers = basicData || []
  }

  return <CustomersClient initialCustomers={initialCustomers} />
}
