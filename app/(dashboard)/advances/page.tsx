import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdvancesClient from './AdvancesClient'

export default async function AdvancesPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <AdvancesClient />
}
