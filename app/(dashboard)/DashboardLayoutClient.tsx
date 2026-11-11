'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import { shouldShowBottomNav } from '@/components/layout/tabBarVisibilityHelper'
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
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const isTabVisible = shouldShowBottomNav(pathname)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-[#E0DCD6] dark:bg-[#1F1E1B] text-[#3E3B36] dark:text-[#EDE9E3]">
      <Toaster position={isMobile ? "top-center" : "top-right"} />
      
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="relative z-[60] lg:hidden">
          <div className="fixed inset-0 bg-[#3E3B36]/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSidebarOpen(false)} />
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
            <div className="bg-[#E3D094]/30 border border-[#E3D094] rounded-[20px] p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E3D094] rounded-full flex items-center justify-center text-[#4A3F12]">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#4A3F12] uppercase tracking-widest">Business identity not configured</p>
                  <p className="text-[10px] font-bold text-[#4A3F12]/80 uppercase tracking-widest">Bills and notices will be incomplete without legal details.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link 
                  href="/onboarding" 
                  className="bg-[#B4E0CA] hover:bg-[#9CCDB4] text-[#1E3121] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-warm-pill tap-scale"
                >
                  Configure Now <ArrowRight className="h-3 w-3" />
                </Link>
                <button onClick={() => setShowBanner(false)} className="text-[#4A3F12]/70 hover:text-[#4A3F12] transition-colors p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <main className={`flex-1 py-8 sm:py-10 transition-all duration-300 ${
          isTabVisible ? 'pb-24 lg:pb-10' : 'pb-8 lg:pb-10'
        }`}>
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
