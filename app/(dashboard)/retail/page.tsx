import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RetailClient from './RetailClient'

export default async function RetailSalesPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: products } = await supabase.from('tp_products').select('*').order('name')
  const { data: customers } = await supabase.from('tp_customers').select('*').order('name')
  
  // Fetch today's sales
  const today = new Date().toISOString().split('T')[0]
  const { data: todaySales } = await supabase
    .from('tp_sales')
    .select('*, tp_customers(name), tp_sale_items(product_name, quantity, rate, total_amount, gst_percent)')
    .eq('invoice_date', today)
    .order('created_at', { ascending: false })

  return <RetailClient 
    products={products || []} 
    customers={customers || []} 
    todaySales={todaySales || []} 
  />
}
