'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="px-6 lg:px-20 h-24 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
      <Link href="/" className="flex items-center gap-2 min-h-[44px]" aria-label="TradersPro Home">
        <span className="text-2xl font-black tracking-tight text-[#0D9488]">TradersPro</span>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-10">
        <Link href="/login" className="text-sm font-bold text-slate-900 hover:text-[#0D9488] transition-colors min-h-[44px] flex items-center px-4">
          Sign in
        </Link>
        <Link 
          href="/register" 
          className="bg-[#0D9488] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-[#0B7A70] transition-all shadow-lg shadow-[#0D9488]/20 min-h-[44px] flex items-center justify-center"
        >
          Get Started Free
        </Link>
      </nav>

      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-3 text-slate-700 hover:text-[#0D9488] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors cursor-pointer"
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.nav 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[80vw] bg-white p-8 shadow-2xl border-l border-slate-100 flex flex-col gap-8 z-50 md:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-[#0D9488]">TradersPro</span>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-3 text-slate-400 hover:text-slate-900 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex flex-col gap-4 mt-8">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-slate-800 hover:text-[#0D9488] transition-colors py-3 border-b border-slate-50 min-h-[44px]"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-slate-800 hover:text-[#0D9488] transition-colors py-3 border-b border-slate-50 min-h-[44px]"
                >
                  Create Account
                </Link>
                <Link 
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-full bg-[#0D9488] text-white py-4 rounded-xl text-center font-bold hover:bg-[#0B7A70] transition-all shadow-xl shadow-[#0D9488]/20 min-h-[44px] flex items-center justify-center"
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
