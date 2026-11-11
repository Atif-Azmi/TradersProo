'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="px-6 lg:px-20 h-24 flex items-center justify-between sticky top-0 bg-[#E0DCD6]/90 dark:bg-[#1F1E1B]/90 backdrop-blur-md z-50 border-b border-[#CAC8C0] dark:border-[#45433E]">
      <Link href="/" className="flex items-center gap-2 min-h-[44px]" aria-label="TradersPro Home">
        <span className="text-2xl font-black tracking-tight text-[#1E3121] dark:text-[#EDE9E3]">
          Traders<span className="text-[#88A993]">Pro</span>
        </span>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-10">
        <Link 
          href="/login" 
          className="text-sm font-bold text-[#3E3B36] dark:text-[#EDE9E3] hover:text-[#1E3121] dark:hover:text-[#B4E0CA] transition-colors min-h-[44px] flex items-center px-4"
        >
          Sign in
        </Link>
        <Link 
          href="/register" 
          className="bg-[#B4E0CA] text-[#1E3121] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#9CCDB4] transition-all shadow-warm-pill min-h-[44px] flex items-center justify-center tap-scale"
        >
          Get Started Free
        </Link>
      </nav>

      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-3 text-[#3E3B36] dark:text-[#EDE9E3] hover:text-[#1E3121] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#3E3B36]/40 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.nav 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[80vw] bg-[#E9E4DE] dark:bg-[#2A2926] p-8 shadow-warm-raised border-l border-[#CAC8C0] dark:border-[#45433E] flex flex-col gap-8 z-50 md:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-[#1E3121] dark:text-[#EDE9E3]">
                  Traders<span className="text-[#88A993]">Pro</span>
                </span>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-3 text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B] dark:hover:text-[#EDE9E3] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex flex-col gap-4 mt-8">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-[#3E3B36] dark:text-[#EDE9E3] hover:text-[#1E3121] transition-colors py-3 border-b border-[#CAC8C0]/50 dark:border-[#45433E]/50 min-h-[44px]"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-[#3E3B36] dark:text-[#EDE9E3] hover:text-[#1E3121] transition-colors py-3 border-b border-[#CAC8C0]/50 dark:border-[#45433E]/50 min-h-[44px]"
                >
                  Create Account
                </Link>
                <Link 
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-full bg-[#B4E0CA] text-[#1E3121] py-4 rounded-full text-center font-bold hover:bg-[#9CCDB4] transition-all shadow-warm-pill min-h-[44px] flex items-center justify-center tap-scale"
                >
                  Get Started Free
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
