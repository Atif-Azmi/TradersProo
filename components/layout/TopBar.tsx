'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, Menu, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

// Create a small internal component for the greeting that only runs on the client
const DynamicGreeting = ({ email }: { email?: string }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-4 w-32 bg-slate-50 animate-pulse rounded-md hidden md:block" />

  const hour = new Date().getHours()
  let greeting = 'Working Late?'
  if (hour >= 5 && hour < 12) greeting = 'Good Morning'
  else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon'
  else if (hour >= 17 && hour < 23) greeting = 'Good Evening'

  return (
    <h2 className="text-sm font-black text-slate-900 hidden md:block animate-in fade-in slide-in-from-top-1 duration-500">
      {greeting}, {email?.split('@')[0] || 'User'}
    </h2>
  )
}

export default function TopBar({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search
            className="pointer-events-none absolute inset-y-0 left-3 h-full w-4 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 text-sm bg-slate-50/50 rounded-lg"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </div>
        
        <div className="flex-1 flex justify-center">
           <DynamicGreeting email={user?.email} />
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-3">
             <button type="button" className="p-2 text-slate-400 hover:text-[#0D9488] transition-colors relative">
               <Bell className="h-5 w-5" aria-hidden="true" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
             </button>
             <button type="button" className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
               <User className="h-5 w-5" aria-hidden="true" />
             </button>
          </div>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

          <div className="flex items-center gap-3 pl-2">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">Administrator</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 flex items-center justify-center border border-[#0D9488]/20">
                <User className="h-4 w-4 text-[#0D9488]" />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
