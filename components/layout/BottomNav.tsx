'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Receipt, Store, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { shouldShowBottomNav } from './tabBarVisibilityHelper'

const navTabs = [
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
        <div className="lg:hidden fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 pb-[env(safe-area-inset-bottom)]">
          <motion.nav
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="pointer-events-auto w-full max-w-sm h-[64px] rounded-full p-1.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.15)] flex items-center justify-between relative"
            aria-label="Floating Navigation Bar"
          >
            {navTabs.map((tab) => {
              const isActive = pathname === tab.href

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className="relative flex-1 h-full flex flex-col items-center justify-center tap-scale select-none rounded-full"
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Sliding Active Highlight Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFloatingTabPill"
                      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                      className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full z-0 shadow-sm"
                    />
                  )}

                  {/* Icon & Label */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                    <tab.icon
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isActive
                          ? 'text-[#0D9488] scale-110 stroke-[2.5]'
                          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
                      }`}
                    />
                    <span
                      className={`text-[9px] uppercase tracking-tighter leading-none ${
                        isActive ? 'font-black text-[#0D9488]' : 'font-bold text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {tab.name}
                    </span>
                  </div>
                </Link>
              )
            })}
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  )
}
