'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Receipt, Store, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { shouldShowBottomNav } from './tabBarVisibilityHelper'

const mobileNav = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cust', href: '/customers', icon: Users },
  { name: 'Sales', href: '/sales', icon: Receipt },
  { name: 'Retail', href: '/retail', icon: Store },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
]

export default function BottomNav() {
  const pathname = usePathname()
  const isVisible = shouldShowBottomNav(pathname)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/80 px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.06)]"
          aria-label="Bottom Navigation"
        >
          <div className="flex items-center justify-around h-16">
            {mobileNav.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 w-full h-full select-none tap-scale transition-colors ${
                    isActive ? 'text-[#0D9488]' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                  >
                    <item.icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : ''}`} />
                  </motion.div>
                  <span className={`text-[10px] uppercase tracking-tighter ${isActive ? 'font-black' : 'font-bold'}`}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
