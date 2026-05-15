import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProductsClient from './ProductsClient'

export default async function ProductsPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('tp_products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error.message)
  }

  return <ProductsClient initialProducts={data || []} />
}
