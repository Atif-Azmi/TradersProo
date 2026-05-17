'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Receipt, 
  Store, 
  Banknote, 
  BarChart3, 
  BellRing, 
  Settings, 
  CreditCard,
  LogOut,
  ShieldCheck,
  FileSpreadsheet,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Superadmin Hub', href: '/superadmin', icon: ShieldCheck },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Products & Stock', href: '/products', icon: Package },
  { name: 'Sales & Billing', href: '/sales', icon: Receipt },
  { name: 'Billing', href: '/billing', icon: FileSpreadsheet },
  { name: 'Retail Sales', href: '/retail', icon: Store },
  { name: 'Advances & Payments', href: '/advances', icon: Banknote },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Reminders', href: '/reminders', icon: BellRing },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Subscription', href: '/subscription', icon: CreditCard },
]


export default function Sidebar({ isSuperAdmin, onClose }: { isSuperAdmin: boolean, onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Use a real-time subscription or a fresh fetch to ensure data is never stale
        const { data } = await supabase
          .from('tp_profile')
          .select('id, plan_type, plan_expiry')
          .eq('id', user.id)
          .single()
        
        if (data) setProfile(data)
      }
    }
    
    getProfile()

    // Listen for real-time changes to the profile
    const channel = supabase
      .channel('profile_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'tp_profile' 
      }, (payload) => {
        setProfile(payload.new)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isFreePlan = profile?.plan_type === 'Free'
  const daysLeft = profile?.plan_expiry 
    ? Math.max(0, Math.ceil((new Date(profile.plan_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-slate-200 px-6 pb-4 h-screen max-h-screen sticky top-0">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center text-white">
             <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">TradersPro</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 px-2">Menu</div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation
                .filter(item => {
                  // Non-superadmins cannot see the Superadmin Hub
                  if (!isSuperAdmin && item.name === 'Superadmin Hub') return false
                  return true
                })
                .map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => onClose?.()}
                      className={`
                        group flex gap-x-3 rounded-xl p-2.5 text-sm leading-6 font-semibold transition-all
                        ${isActive 
                          ? 'bg-[#0D9488]/5 text-[#0D9488]' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#0D9488]' : 'text-slate-400 group-hover:text-slate-600'}`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          
          {!isSuperAdmin && (
            <li className="mt-auto">
               <div className="rounded-2xl bg-slate-50 p-4 mb-4 border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ACCOUNT PLAN</div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-900">{profile?.plan_type || 'Trial'} Plan</span>
                     <span className="text-[10px] font-black text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 font-medium">
                    {isFreePlan ? (
                      <span className="text-[#0D9488] font-black uppercase tracking-widest">Lifetime Access</span>
                    ) : (
                      daysLeft > 0 ? `${daysLeft} days remaining` : 'Plan expired'
                    )}
                  </div>
               </div>
            </li>
          )}
          <li className={`${isSuperAdmin ? 'mt-auto' : ''}`}>
            <button
              onClick={handleSignOut}
              className="group -mx-2 flex w-full gap-x-3 rounded-xl p-2.5 text-sm font-semibold leading-6 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-red-500" aria-hidden="true" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
