import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayoutClient from './DashboardLayoutClient'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: superAdmin } = await supabase
    .from('tp_super_admin')
    .select('id')
    .eq('id', user.id)
    .single()
  
  const isSuperAdmin = !!superAdmin || user.email === 'superadmin@trader.com'

  return (
    <DashboardLayoutClient isSuperAdmin={isSuperAdmin}>
      {children}
    </DashboardLayoutClient>
  )
}
