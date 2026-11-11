import SuperAdminClient from './SuperAdminClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SuperAdmin Command Center | TradersPro',
  description: 'Platform-wide authority and node management.',
}

export default function SuperAdminPage() {
  return (
    <div className="p-8 bg-[#E0DCD6] dark:bg-[#1F1E1B] min-h-screen">
      <SuperAdminClient />
    </div>
  )
}
