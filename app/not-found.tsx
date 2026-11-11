'use client'

import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0DCD6] dark:bg-[#1F1E1B] p-4 font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-[#F2EEE9] dark:bg-[#2A2926] rounded-[24px] p-8 md:p-12 shadow-warm-raised border border-[#CAC8C0] dark:border-[#45433E] text-center space-y-6">
        <div className="w-16 h-16 bg-[#B4E0CA] text-[#1E3121] rounded-full flex items-center justify-center mx-auto shadow-warm-pill animate-bounce-subtle">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-[#3E3B36] dark:text-[#EDE9E3] tracking-tighter">404</h1>
          <h2 className="text-xl font-bold text-[#3E3B36] dark:text-[#EDE9E3] uppercase tracking-tight">Page Not Found</h2>
          <p className="text-xs text-[#7A756F] dark:text-[#A8A39B] font-bold uppercase tracking-widest leading-relaxed">
            The workspace page you are searching for does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-4 border-t border-[#CAC8C0] dark:border-[#45433E]">
          <Link 
            href="/dashboard" 
            className="w-full tp-button-primary py-3 min-h-[48px] flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
