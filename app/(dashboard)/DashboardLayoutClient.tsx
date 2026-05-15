'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'

export default function DashboardLayoutClient({
  children,
  isSuperAdmin
}: {
  children: React.ReactNode
  isSuperAdmin: boolean
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F4F7F9]">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="relative z-[60] lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs animate-in slide-in-from-left duration-300">
            <div className="relative flex-1">
              <Sidebar isSuperAdmin={isSuperAdmin} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar isSuperAdmin={isSuperAdmin} />
      </div>

      <div className="lg:pl-72 flex flex-col min-h-screen">
        <TopBar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 py-8 sm:py-10 pb-24 lg:pb-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
