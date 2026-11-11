import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { TrendingUp, Users, ReceiptText, BarChart3, MessageSquare, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#E0DCD6] dark:bg-[#1F1E1B] text-[#3E3B36] dark:text-[#EDE9E3] font-sans">
      {/* Header */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 lg:px-20 pt-16 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-[#1E3121] dark:text-[#B4E0CA] uppercase tracking-[0.4em] mb-6">
                ATIF AZMI
              </p>
              <h1 className="text-[clamp(2.2rem,6.5vw,4.5rem)] font-black text-[#3E3B36] dark:text-[#EDE9E3] leading-[1.05] tracking-tighter mb-8">
                Fresh operations for <br />
                your <br />
                <span className="text-[#1E3121] dark:text-[#B4E0CA] underline decoration-[#88A993]">hardware business</span>
              </h1>
              <p className="text-lg text-[#7A756F] dark:text-[#A8A39B] font-medium leading-relaxed max-w-xl mb-12">
                Track customers, sales, stock alerts, and bulk WhatsApp reminders in one calm, premium workspace — built for clarity, not clutter.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/register" className="bg-[#B4E0CA] hover:bg-[#9CCDB4] text-[#1E3121] px-8 py-4 rounded-full text-sm font-bold transition-all shadow-warm-pill min-h-[44px] flex items-center justify-center w-full sm:w-auto tap-scale">
                  Get Started Free
                </Link>
                <Link href="/login" className="bg-[#F2EEE9] dark:bg-[#2A2926] border border-[#CAC8C0] dark:border-[#45433E] text-[#3E3B36] dark:text-[#EDE9E3] px-8 py-4 rounded-full text-sm font-bold hover:bg-[#E9E4DE] dark:hover:bg-[#33322E] transition-all shadow-warm-pill min-h-[44px] flex items-center justify-center w-full sm:w-auto tap-scale">
                  Sign In
                </Link>
                <a 
                  href="https://atif-dev.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#3E3B36] text-[#EDE9E3] hover:bg-[#2A2926] px-8 py-4 rounded-full text-sm font-bold transition-all shadow-warm-pill flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto cursor-pointer tap-scale"
                  aria-label="View developer profile page (opens in new tab)"
                >
                  View More Services
                </a>
              </div>

              <div className="mt-16 flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-2 border-[#E0DCD6] dark:border-[#1F1E1B] bg-[#E9E4DE] overflow-hidden relative shadow-sm">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                            alt={`Dicebear Avatar User ${i}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                       </div>
                    ))}
                 </div>
                 <p className="text-xs text-[#7A756F] dark:text-[#A8A39B] font-bold">
                    Trusted by <span className="text-[#3E3B36] dark:text-[#EDE9E3]">500+</span> hardware traders in Sehore
                 </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-warm-raised aspect-[4/3] w-full bg-[#F2EEE9] dark:bg-[#2A2926] border border-[#CAC8C0] dark:border-[#45433E]">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
                  alt="TradersPro Professional Hardware Operations Workspace" 
                  className="w-full h-full object-cover absolute inset-0 opacity-90"
                  loading="lazy"
                />
              </div>
              
              {/* Floating Performance Card */}
              <div className="absolute -bottom-6 -left-12 bg-[#F2EEE9] dark:bg-[#2A2926] p-6 rounded-[24px] shadow-warm-raised border border-[#CAC8C0] dark:border-[#45433E] hidden lg:block animate-bounce-subtle max-w-[240px] w-full">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-[#B4E0CA] rounded-full flex items-center justify-center text-[#1E3121] shadow-warm-pill">
                       <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">Monthly Growth</p>
                       <p className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3]">+₹4,12,500</p>
                    </div>
                 </div>
                 <div className="h-2 w-full bg-[#CAC8C0] dark:bg-[#45433E] rounded-full overflow-hidden">
                    <div className="h-full bg-[#B4E0CA] w-[80%] rounded-full"></div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Value Props */}
        <section className="px-6 lg:px-20 py-24 bg-[#E9E4DE]/60 dark:bg-[#242320]/60 border-y border-[#CAC8C0]/50 dark:border-[#45433E]/50">
           <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-[#B4E0CA] text-[#1E3121] rounded-2xl shadow-warm-pill flex items-center justify-center">
                    <Users className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold text-[#3E3B36] dark:text-[#EDE9E3]">Unified Ledger</h3>
                 <p className="text-[#7A756F] dark:text-[#A8A39B] text-sm font-medium leading-relaxed">Manage every customer balance, collection, and statement in one high-fidelity view.</p>
              </div>
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-[#B4E0CA] text-[#1E3121] rounded-2xl shadow-warm-pill flex items-center justify-center">
                    <ReceiptText className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold text-[#3E3B36] dark:text-[#EDE9E3]">Smart Billing</h3>
                 <p className="text-[#7A756F] dark:text-[#A8A39B] text-sm font-medium leading-relaxed">Generate professional GST-compliant receipts and share them via WhatsApp in a single click.</p>
              </div>
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-[#B4E0CA] text-[#1E3121] rounded-2xl shadow-warm-pill flex items-center justify-center">
                    <BarChart3 className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold text-[#3E3B36] dark:text-[#EDE9E3]">Stock Intelligence</h3>
                 <p className="text-[#7A756F] dark:text-[#A8A39B] text-sm font-medium leading-relaxed">Automated low-stock alerts and movement tracking to ensure you never miss a sale.</p>
              </div>
           </div>
        </section>
      </main>

      <footer className="px-6 lg:px-20 py-12 border-t border-[#CAC8C0] dark:border-[#45433E] bg-[#E0DCD6] dark:bg-[#1F1E1B]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3] tracking-tight">Traders<span className="text-[#3F6B52] dark:text-[#B4E0CA]">Pro</span></span>
          </div>
          <p className="text-[#7A756F] dark:text-[#A8A39B] text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 TradersPro • Made by <a href="https://atif-dev.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#1E3121] dark:text-[#B4E0CA] hover:underline transition-colors min-h-[44px] inline-flex items-center px-1 font-bold">Atif Azmi</a>
          </p>
          <div className="flex gap-6">
            <a 
              href="mailto:support@traderspro.com" 
              className="text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B] dark:hover:text-[#EDE9E3] transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Send support email to TradersPro"
            >
              <MessageSquare className="h-5 w-5" />
            </a>
            <Link 
              href="/login" 
              className="text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B] dark:hover:text-[#EDE9E3] transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
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
