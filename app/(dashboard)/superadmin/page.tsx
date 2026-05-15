import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SuperAdminClient from './SuperAdminClient'

export default async function SuperAdminPage() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Double check superadmin status server-side
  const { data: sa } = await supabase
    .from('tp_super_admin')
    .select('id')
    .eq('id', user.id)
    .single()
  
  const isHardcoded = user.email === 'superadmin@trader.com'
  if (!sa && !isHardcoded) redirect('/dashboard')

  // Use the adminSupabase (Service Role) to fetch ALL profiles bypassing RLS
  const { data: profiles } = await adminSupabase
    .from('tp_profile')
    .select('*')
    .order('created_at', { ascending: false })

  // Aggregate Platform Intelligence
  const { data: allSales } = await adminSupabase.from('tp_invoices').select('total_amount')
  const { data: allCustomers } = await adminSupabase.from('tp_customers').select('id')
  const { data: allProducts } = await adminSupabase.from('tp_inventory').select('id')

  const platformStats = {
    totalRevenue: allSales?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0,
    totalCustomers: allCustomers?.length || 0,
    totalProducts: allProducts?.length || 0,
    activeNodes: profiles?.length || 0
  }

  return <SuperAdminClient initialProfiles={profiles || []} platformStats={platformStats} />
}
