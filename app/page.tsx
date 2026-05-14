import Link from 'next/link'
import { CheckCircle, TrendingUp, Users, ShieldCheck, ArrowRight, MessageSquare, BarChart3, ReceiptText } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-primary">TradersPro</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Sign in</Link>
          <Link href="/register" className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-100 flex items-center gap-2">
            Get Started Free
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 lg:px-12 pt-24 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <a 
                href="https://atif-dev.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 hover:text-green-600 transition-colors"
              >
                ATIF AZMI
              </a>
              <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
                Fresh operations for your <br />
                <span className="text-primary">hardware business</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-10">
                Track customers, sales, stock alerts, and bulk WhatsApp reminders in one calm, premium workspace — built for clarity, not clutter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-green-600 transition-all shadow-xl shadow-green-100 text-center">
                  Get Started Free
                </Link>
                <Link href="/login" className="bg-white border-2 border-slate-100 text-slate-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-all text-center">
                  Sign In
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-6">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                       <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-${i*200} flex items-center justify-center overflow-hidden`}>
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                       </div>
                    ))}
                 </div>
                 <p className="text-sm text-slate-500 font-medium">
                    Trusted by <span className="text-slate-900 font-bold">500+</span> hardware traders in Sehore
                 </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070" 
                  alt="Dashboard Preview" 
                  className="w-full object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent"></div>
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 hidden lg:block animate-bounce-subtle">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                       <TrendingUp className="text-primary h-6 w-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Growth</p>
                       <p className="text-xl font-black text-slate-900">+₹4,12,500</p>
                    </div>
                 </div>
                 <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[75%]"></div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 lg:px-12 py-32 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">Everything your trading desk needs</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">One system to rule all your operations. No more paper ledgers or confusing spreadsheets.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="text-primary h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Customers & Ledger</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Per-customer balances, payments, and full history in one premium ledger view. Clean and fast.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="text-primary h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Live Analytics</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Sales volume, collections, and outstanding balances by any period. Visual data at your fingertips.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ReceiptText className="text-primary h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Billing & Sharing</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Beautiful GST-compliant statements, PDF export, and one-click WhatsApp sharing for your customers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-12 py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px]"></div>
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-8">Ready to modernize your trade?</h2>
                  <div className="space-y-4 mb-10">
                    {['1-minute setup', 'Automatic GST reports', 'Bulk WhatsApp reminders', 'Multi-user superadmin support'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="text-primary h-5 w-5" />
                        <span className="text-slate-300 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/register" className="inline-flex bg-primary text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-green-600 transition-all shadow-2xl shadow-green-900/40">
                    Create Your Account Now
                  </Link>
                </div>
                <div className="relative">
                   <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                      <div className="flex justify-between items-center mb-6">
                         <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                         </div>
                         <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Preview Mode</div>
                      </div>
                      <div className="space-y-4">
                         <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                         <div className="h-4 bg-slate-700/30 rounded w-1/2"></div>
                         <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="h-20 bg-primary/20 rounded-2xl border border-primary/20"></div>
                            <div className="h-20 bg-slate-700/20 rounded-2xl border border-slate-700"></div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-black text-slate-900">TradersPro</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © 2026 TradersPro SaaS by <a href="https://atif-dev.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold hover:text-primary transition-colors">Atif Azmi</a>. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-slate-900"><MessageSquare className="h-5 w-5" /></Link>
            <Link href="#" className="text-slate-400 hover:text-slate-900"><ShieldCheck className="h-5 w-5" /></Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
