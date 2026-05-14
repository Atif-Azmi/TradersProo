import Link from 'next/link'
import { CheckCircle, IndianRupee, MessageCircle, TrendingUp, Package, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white border-b sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <span className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
             <div className="bg-primary p-1 rounded-md text-white"><Package className="h-5 w-5" /></div>
             Traders<span className="text-primary">Pro</span>
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
            Login
          </Link>
          <Link className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors shadow-sm" href="/register">
            Get Started Free
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-slate-900">
                  Manage Your Trading Business <br />
                  <span className="text-primary">Simpler, Faster, Smarter</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl">
                  The all-in-one SaaS platform for hardware and metal traders. Invoicing, Inventory, 
                  and Outstanding Dues tracking—all in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-600">
                  Start 14-Day Free Trial
                </Link>
                <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-3 rounded-full">
                  <IndianRupee className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Billing</h3>
                <p className="text-slate-500">Create professional GST invoices in seconds. Auto-generate serial numbers and calculate taxes instantly.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Live Inventory</h3>
                <p className="text-slate-500">Real-time stock tracking with low-stock alerts. Know exactly what to reorder and when.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Dues Reminder</h3>
                <p className="text-slate-500">Track outstanding payments and send automated WhatsApp reminders to your customers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="w-full py-12 md:py-24 bg-slate-900 text-white">
           <div className="container px-4 md:px-6 mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                 <div>
                    <div className="text-4xl font-bold text-primary">₹50Cr+</div>
                    <div className="text-sm text-slate-400 mt-2">Sales Managed</div>
                 </div>
                 <div>
                    <div className="text-4xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-slate-400 mt-2">Active Traders</div>
                 </div>
                 <div>
                    <div className="text-4xl font-bold text-primary">99.9%</div>
                    <div className="text-sm text-slate-400 mt-2">Uptime</div>
                 </div>
                 <div>
                    <div className="text-4xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-slate-400 mt-2">Support</div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500">© 2026 TradersPro SaaS. Built for F.K.S. Traders.</p>
          <div className="flex gap-6">
            <Link className="text-sm text-slate-500 hover:text-primary" href="#">Terms</Link>
            <Link className="text-sm text-slate-500 hover:text-primary" href="#">Privacy</Link>
            <Link className="text-sm text-slate-500 hover:text-primary" href="#">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
