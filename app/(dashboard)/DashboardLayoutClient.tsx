'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { ShieldAlert, ArrowRight, X } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'

export default function DashboardLayoutClient({
  children,
  isSuperAdmin
}: {
  children: React.ReactNode
  isSuperAdmin: boolean
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, loading } = useBusinessProfile()
  const [showBanner, setShowBanner] = useState(true)

  return (
    <div className="min-h-screen bg-[#F4F7F9]">
      <Toaster position="top-right" />
      
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
        <div className="print:hidden">
          <TopBar setSidebarOpen={setSidebarOpen} />
        </div>
        
        {/* Warning Banner */}
        {!loading && !profile && showBanner && (
          <div className="mx-4 sm:px-6 lg:px-8 mt-4 print:hidden">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-amber-900 uppercase tracking-widest italic">Business identity not configured</p>
                  <p className="text-[10px] font-bold text-amber-700/70 uppercase tracking-widest">Bills and notices will be incomplete without legal details.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link 
                  href="/onboarding" 
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-amber-200"
                >
                  Configure Now <ArrowRight className="h-3 w-3" />
                </Link>
                <button onClick={() => setShowBanner(false)} className="text-amber-400 hover:text-amber-600 transition-colors p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 py-8 sm:py-10 pb-24 lg:pb-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <div className="print:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
