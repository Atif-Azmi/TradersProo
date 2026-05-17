'use client'

import { CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react'

export default function SubscriptionClient() {
  const features = [
    'Unlimited customer records',
    'Infinite sales invoices & billing items',
    'Full financial analytics & dynamic report exports',
    'Branded PDF invoices & statements',
    'WhatsApp transaction sharing with secure signed links',
    'Automated stock movement & low-level alerts',
    'Advances & payments cashflow reconciliation ledger',
    'Priority 24/7 dedicated customer success support',
  ]

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-5xl uppercase italic">TradersPro Premium</h2>
        <p className="text-xs font-black text-[#0D9488] uppercase tracking-[0.3em] max-w-2xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" /> Infinite Business Scalability in One Single Tier <Sparkles className="h-4 w-4" />
        </p>
      </div>

      {/* Trial Status Snapshot */}
      <div className="mx-auto max-w-md bg-white rounded-[2rem] shadow-xl shadow-slate-100/50 border border-slate-50 p-8 text-center">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Current Account Status</h3>
         <div className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">Trial Period</div>
         <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
           <div className="bg-[#0D9488] h-3 rounded-full shadow-lg shadow-teal-100" style={{ width: '15%' }}></div>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
           <ShieldAlert className="h-4 w-4 text-[#0D9488]" /> Expires in <span className="text-slate-900 font-black">14 business days</span>
         </p>
      </div>

      {/* Centered Premium Single Tier Plan Card */}
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[3rem] p-12 bg-slate-900 ring-4 ring-slate-900 text-white shadow-2xl shadow-slate-400/50 hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
          
          {/* Branded Premium Badge */}
          <div className="absolute top-8 right-8 bg-[#0D9488] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            Best Value
          </div>

          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#0D9488]">
            Elite Annual Pass
          </span>

          <h3 className="text-3xl font-black uppercase italic tracking-tight text-white mt-2">
            ALL-IN-ONE BUSINESS SUITE
          </h3>

          <p className="mt-8 flex items-baseline gap-x-2">
            <span className="text-6xl font-black tracking-tighter text-white">₹4,959</span>
            <span className="text-sm font-bold uppercase tracking-widest text-slate-400">/year</span>
          </p>

          {/* Renewal Cost details as requested */}
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/50 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <RefreshCw className="h-4 w-4 text-[#0D9488] animate-spin duration-1000" /> 
            Renewal Price Lock: Renew at ₹4,959/year (Same Cost Guaranteed)
          </div>

          <div className="mt-10 border-t border-slate-800 pt-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0D9488] mb-6">
              Included Enterprise Features:
            </h4>
            <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold text-slate-300">
              {features.map((feature) => (
                <li key={feature} className="flex gap-x-3 items-start">
                  <CheckCircle2 className="h-5 w-5 flex-none text-[#0D9488] mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="mt-12 block w-full rounded-2xl bg-[#0D9488] hover:bg-teal-600 text-white py-4.5 text-center text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-teal-900/30 cursor-pointer hover:shadow-2xl hover:scale-[1.005]"
          >
            Upgrade & Activate Access
          </button>
        </div>
      </div>
    </div>
  )
}
