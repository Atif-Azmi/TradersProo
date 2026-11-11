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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F2EEE9]/90 dark:bg-[#2A2926]/90 backdrop-blur-lg border-t border-[#CAC8C0] dark:border-[#45433E] px-2 pb-safe shadow-warm-raised">
      <div className="flex items-center justify-around h-16">
        {mobileNav.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${
                isActive ? 'text-[#1E3121] dark:text-[#B4E0CA]' : 'text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B]'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'scale-110 font-bold' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
