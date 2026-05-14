'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, Menu, User, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function TopBar({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-slate-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm"
            placeholder="Search dashboard..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

          {/* User Identification */}
          <div className="flex items-center gap-x-4 lg:gap-x-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
             <div className="bg-primary/10 p-1 rounded-full">
                <User className="h-4 w-4 text-primary" />
             </div>
             <div className="flex flex-col text-left">
                {loading ? (
                   <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                ) : (
                   <>
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                        {user?.email?.split('@')[0].toUpperCase() || 'USER'}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {user?.email || 'Not signed in'}
                      </span>
                   </>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
