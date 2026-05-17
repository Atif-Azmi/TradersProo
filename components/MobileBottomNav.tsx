'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Receipt, Store, BarChart3 } from 'lucide-react'

const mobileNav = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cust', href: '/customers', icon: Users },
  { name: 'Sales', href: '/sales', icon: Receipt },
  { name: 'Retail', href: '/retail', icon: Store },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-lg border-t border-slate-100 px-2 pb-safe shadow-[0_-4px_24px_-10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {mobileNav.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${
                isActive ? 'text-[#0D9488]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
