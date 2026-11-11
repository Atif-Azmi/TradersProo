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
            className="pointer-events-auto w-full max-w-sm h-[64px] rounded-full p-1.5 bg-[#E9E4DE]/90 dark:bg-[#2A2926]/90 backdrop-blur-2xl border border-[#CAC8C0]/80 dark:border-[#45433E]/80 shadow-warm-raised flex items-center justify-between relative"
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
                      className="absolute inset-0 bg-[#B4E0CA] rounded-full z-0 shadow-warm-pill"
                    />
                  )}

                  {/* Icon & Label */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                    <tab.icon
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isActive
                          ? 'text-[#1E3121] scale-110 stroke-[2.5]'
                          : 'text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B] dark:hover:text-[#EDE9E3]'
                      }`}
                    />
                    <span
                      className={`text-[9px] uppercase tracking-tighter leading-none ${
                        isActive ? 'font-black text-[#1E3121]' : 'font-bold text-[#7A756F] dark:text-[#A8A39B]'
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
