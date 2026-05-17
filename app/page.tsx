import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { TrendingUp, Users, ReceiptText, BarChart3, MessageSquare, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 lg:px-20 pt-16 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-[#0D9488] uppercase tracking-[0.4em] mb-6">
                ATIF AZMI
              </p>
              <h1 className="text-[clamp(2.2rem,6.5vw,4.5rem)] font-black text-slate-900 leading-[1.05] tracking-tighter mb-8">
                Fresh operations for <br />
                your <br />
                <span className="text-[#0D9488]">hardware business</span>
              </h1>
              <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl mb-12">
                Track customers, sales, stock alerts, and bulk WhatsApp reminders in one calm, premium workspace — built for clarity, not clutter.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/register" className="bg-[#0D9488] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-[#0B7A70] transition-all shadow-xl shadow-[#0D9488]/20 min-h-[44px] flex items-center justify-center w-full sm:w-auto">
                  Get Started Free
                </Link>
                <Link href="/login" className="bg-white border border-slate-100 text-slate-900 px-8 py-4 rounded-full text-sm font-bold hover:bg-slate-50 transition-all shadow-lg shadow-slate-100 min-h-[44px] flex items-center justify-center w-full sm:w-auto">
                  Sign In
                </Link>
                <a 
                  href="https://atif-dev.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto cursor-pointer"
                  aria-label="View developer profile page (opens in new tab)"
                >
                  View More Services
                </a>
              </div>

              <div className="mt-16 flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden relative">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                            alt={`Dicebear Avatar User ${i}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                       </div>
                    ))}
                 </div>
                 <p className="text-xs text-slate-400 font-bold">
                    Trusted by <span className="text-slate-900">500+</span> hardware traders in Sehore
                 </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/3] w-full bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
                  alt="TradersPro Professional Hardware Operations Workspace" 
                  className="w-full h-full object-cover absolute inset-0"
                  loading="lazy"
                />
              </div>
              
              {/* Floating Performance Card */}
              <div className="absolute -bottom-6 -left-12 bg-white p-6 rounded-2xl shadow-2xl border border-slate-50 hidden lg:block animate-bounce-subtle max-w-[240px] w-full">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                       <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Monthly Growth</p>
                       <p className="text-xl font-black text-slate-900">+₹4,12,500</p>
                    </div>
                 </div>
                 <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[80%] rounded-full"></div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Value Props */}
        <section className="px-6 lg:px-20 py-24 bg-slate-50/50">
           <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#0D9488]">
                    <Users className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Unified Ledger</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">Manage every customer balance, collection, and statement in one high-fidelity view.</p>
              </div>
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#0D9488]">
                    <ReceiptText className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Smart Billing</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">Generate professional GST-compliant receipts and share them via WhatsApp in a single click.</p>
              </div>
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#0D9488]">
                    <BarChart3 className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Stock Intelligence</h3>
                 <p className="text-slate-500 text-sm font-medium leading-relaxed">Automated low-stock alerts and movement tracking to ensure you never miss a sale.</p>
              </div>
           </div>
        </section>
      </main>

      <footer className="px-6 lg:px-20 py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-900 tracking-tight">TradersPro</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 TradersPro • Made by <a href="https://atif-dev.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-[#0D9488] transition-colors min-h-[44px] inline-flex items-center px-1">Atif Azmi</a>
          </p>
          <div className="flex gap-6">
            <a 
              href="mailto:support@traderspro.com" 
              className="text-slate-400 hover:text-slate-900 transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Send support email to TradersPro"
            >
              <MessageSquare className="h-5 w-5" />
            </a>
            <Link 
              href="/login" 
              className="text-slate-400 hover:text-slate-900 transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="View security and auth portal"
            >
              <ShieldCheck className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
