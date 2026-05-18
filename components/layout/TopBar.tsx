'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, Menu, User, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/components/common/LoadingSpinner'

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
  const [showNotifications, setShowNotifications] = useState(false)
  const [activities, setActivities] = useState<any[]>([])
  const [loadingActivities, setLoadingActivities] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const fetchActivities = async () => {
    if (!user) return
    setLoadingActivities(true)
    try {
      const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
      }

      // 1. Fetch live Sales
      const { data: sales } = await supabase
        .from('tp_sales')
        .select('id, invoice_number, total_amount, created_at, tp_customers(name)')
        .order('created_at', { ascending: false })
        .limit(4)

      const saleLogs = (sales || []).map((s: any) => ({
        id: `sale-${s.id}`,
        type: 'sale',
        title: 'New Retail Sale',
        desc: `Invoice #${s.invoice_number} created for ${s.tp_customers?.name || 'Customer'} (₹${s.total_amount})`,
        time: formatTimeAgo(s.created_at),
        timestamp: new Date(s.created_at).getTime()
      }))

      // 2. Fetch live Payments
      const { data: payments } = await supabase
        .from('tp_payments_received')
        .select('id, type, amount, created_at, tp_customers(name)')
        .order('created_at', { ascending: false })
        .limit(4)

      const paymentLogs = (payments || []).map((p: any) => ({
        id: `payment-${p.id}`,
        type: p.type === 'advance' ? 'advance' : 'payment',
        title: p.type === 'advance' ? 'Advance Received' : 'Collection Received',
        desc: `Received ₹${p.amount} from ${p.tp_customers?.name || 'Customer'}`,
        time: formatTimeAgo(p.created_at),
        timestamp: new Date(p.created_at).getTime()
      }))

      // 3. Fetch live low stock products
      const { data: products } = await supabase
        .from('tp_products')
        .select('id, name, current_stock, min_stock_alert, created_at')
        .order('created_at', { ascending: false })

      const lowStockLogs = (products || [])
        .filter((p: any) => p.current_stock <= (p.min_stock_alert || 5))
        .map((p: any) => ({
          id: `stock-${p.id}`,
          type: 'stock',
          title: 'Low Stock Warning',
          desc: `Product "${p.name}" has dropped to ${p.current_stock} remaining`,
          time: 'Alert',
          timestamp: new Date(p.created_at || Date.now()).getTime()
        }))

      // Merge and sort
      const merged = [...saleLogs, ...paymentLogs, ...lowStockLogs]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5)

      setActivities(merged)
    } catch (err) {
      console.error('Error fetching dynamic activities:', err)
    } finally {
      setLoadingActivities(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchActivities()
    }
  }, [user])

  useEffect(() => {
    if (user && showNotifications) {
      fetchActivities()
    }
  }, [user, showNotifications])

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
          <div className="flex items-center gap-3 relative">
             {/* Bell Icon Trigger */}
             <button 
               type="button" 
               onClick={() => setShowNotifications(!showNotifications)}
               className="p-2 text-slate-400 hover:text-[#0D9488] transition-colors relative cursor-pointer"
             >
               <Bell className="h-5 w-5" aria-hidden="true" />
               {activities.length > 0 && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
               )}
             </button>

             {/* Click-away backdrop */}
             {showNotifications && (
               <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
             )}

             {/* Notifications Popover Dropdown */}
             {showNotifications && (
               <div className="fixed md:absolute right-4 left-4 md:right-0 md:left-auto mt-2 top-16 md:top-10 w-[calc(100vw-32px)] md:w-80 rounded-2xl bg-white border border-slate-100 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                 <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recent Activity</h4>
                   <span className="text-[9px] font-bold bg-[#0D9488]/10 text-[#0D9488] px-2.5 py-0.5 rounded-full">
                     {loadingActivities ? '...' : `${activities.length} Events`}
                   </span>
                 </div>
                 
                 <div className="mt-3 space-y-3.5 max-h-64 overflow-y-auto">
                   {loadingActivities ? (
                     <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                       <LoadingSpinner size="sm" text="SYNCING OPERATIONS..." textColor="text-slate-400" />
                     </div>
                   ) : activities.length === 0 ? (
                     <div className="text-center py-8 px-4 text-slate-400">
                       <p className="text-[11px] font-bold uppercase tracking-wider">No Recent Operations</p>
                       <p className="text-[9px] text-slate-400 mt-1">Start adding products, sales, and payments to see live operations logged here!</p>
                     </div>
                   ) : (
                     activities.map((n) => (
                       <div key={n.id} className="flex items-start gap-3 text-xs leading-normal">
                         <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                           n.type === 'sale' ? 'bg-emerald-500' :
                           n.type === 'payment' ? 'bg-[#0D9488]' :
                           n.type === 'advance' ? 'bg-indigo-500' :
                           n.type === 'stock' ? 'bg-amber-500' : 'bg-slate-400'
                         }`} />
                         <div className="flex-1">
                           <div className="flex items-center justify-between">
                             <p className="font-bold text-slate-800">{n.title}</p>
                             <span className="text-[9px] font-medium text-slate-400 shrink-0">{n.time}</span>
                           </div>
                           <p className="text-[10px] text-slate-500 mt-0.5">{n.desc}</p>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               </div>
             )}

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
