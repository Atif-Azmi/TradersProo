'use client'

import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9] p-4 font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100 text-center space-y-6">
        <div className="w-16 h-16 bg-[#0D9488]/10 rounded-2xl flex items-center justify-center text-[#0D9488] mx-auto animate-bounce-subtle">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-800 tracking-tighter">404</h1>
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight italic">Page Not Found</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            The workspace page you are searching for does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-50">
          <Link 
            href="/dashboard" 
            className="w-full tp-button-primary py-3 shadow-xl shadow-[#0D9488]/20 min-h-[44px] flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
