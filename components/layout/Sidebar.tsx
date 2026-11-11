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
        const { data } = await supabase
          .from('tp_profile')
          .select('id, plan_type, plan_expiry')
          .eq('id', user.id)
          .single()
        
        if (data) setProfile(data)
      }
    }
    
    getProfile()

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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bp')
    }
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isFreePlan = profile?.plan_type === 'Free'
  const daysLeft = profile?.plan_expiry 
    ? Math.max(0, Math.ceil((new Date(profile.plan_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#E0DCD6] dark:bg-[#1F1E1B] border-r border-[#CAC8C0] dark:border-[#45433E] px-6 pb-4 h-screen max-h-screen sticky top-0">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#B4E0CA] text-[#1E3121] rounded-full flex items-center justify-center shadow-warm-pill">
             <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#3E3B36] dark:text-[#EDE9E3]">
            Traders<span className="text-[#88A993]">Pro</span>
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B]">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mt-4 px-2">Menu</div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation
                .filter(item => {
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
                        group flex gap-x-3 rounded-full p-2.5 text-sm leading-6 font-semibold transition-all tap-scale
                        ${isActive 
                          ? 'bg-[#B4E0CA] text-[#1E3121] shadow-warm-pill font-bold' 
                          : 'text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E]'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#1E3121]' : 'text-[#7A756F] dark:text-[#A8A39B] group-hover:text-[#3E3B36] dark:group-hover:text-[#EDE9E3]'}`}
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
               <div className="rounded-[20px] bg-[#E9E4DE] dark:bg-[#2A2926] p-4 mb-4 border border-[#CAC8C0] dark:border-[#45433E] shadow-sm">
                  <div className="text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1">ACCOUNT PLAN</div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-[#3E3B36] dark:text-[#EDE9E3]">{profile?.plan_type || 'Trial'} Plan</span>
                     <span className="text-[10px] font-black text-[#1E3121] bg-[#B4E0CA] px-2.5 py-0.5 rounded-full shadow-sm">Active</span>
                  </div>
                  <div className="text-[10px] text-[#7A756F] dark:text-[#A8A39B] mt-2 font-medium">
                    {isFreePlan ? (
                      <span className="text-[#1E3121] dark:text-[#B4E0CA] font-black uppercase tracking-widest">Lifetime Access</span>
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
              className="group -mx-2 flex w-full gap-x-3 rounded-full p-2.5 text-sm font-semibold leading-6 text-[#7A756F] dark:text-[#A8A39B] hover:bg-[#D98A7B]/15 hover:text-[#4A1D14] dark:hover:text-[#D98A7B] transition-all tap-scale"
            >
              <LogOut className="h-5 w-5 shrink-0 text-[#7A756F] dark:text-[#A8A39B] group-hover:text-[#4A1D14] dark:group-hover:text-[#D98A7B]" aria-hidden="true" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
