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

  const isHardcoded = user.email === 'atifazmi0710@gmail.com' || user.email === 'superadmin@trader.in'
  
  let isSuperAdmin = isHardcoded
  if (!isSuperAdmin) {
    const { data: superAdmin } = await supabase
      .from('tp_super_admin')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()
    isSuperAdmin = !!superAdmin
  }

  return (
    <DashboardLayoutClient isSuperAdmin={isSuperAdmin}>
      {children}
    </DashboardLayoutClient>
  )
}
