'use client'

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
  ShieldCheck
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Superadmin Hub', href: '/superadmin', icon: ShieldCheck },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Products & Stock', href: '/products', icon: Package },
  { name: 'Sales & Billing', href: '/sales', icon: Receipt },
  { name: 'Retail Sales', href: '/retail', icon: Store },
  { name: 'Advances & Payments', href: '/advances', icon: Banknote },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Reminders', href: '/reminders', icon: BellRing },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Subscription', href: '/subscription', icon: CreditCard },
]

export default function Sidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <span className="text-xl font-bold tracking-tight text-white">TradersPro</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation
                .filter(item => item.name !== 'Superadmin Hub' || isSuperAdmin)
                .map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${isActive 
                          ? 'bg-slate-800 text-white' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-white'}`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          
          <li className="mt-auto">
             <div className="rounded-md bg-slate-800 p-4 mb-4">
                <div className="text-sm font-medium text-white mb-1">ACCOUNT PLAN</div>
                <div className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                  Trial
                </div>
                <div className="text-xs text-slate-400 mt-1">14 days left</div>
             </div>
            <button
              onClick={handleSignOut}
              className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
