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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Subscription</h2>
      </div>

      {/* Trial Status Snapshot */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="tp-card p-6 flex flex-col justify-between md:col-span-1">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Status</p>
            <p className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Trial Period</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4 mb-4 overflow-hidden">
              <div className="bg-[#0D9488] h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-50">
            <ShieldAlert className="h-4 w-4 text-[#0D9B8A]" /> 
            <span>Expires in <span className="text-slate-900 font-bold">14 business days</span></span>
          </div>
        </div>

        {/* Plan Card */}
        <div className="tp-card p-6 md:p-8 bg-slate-900 ring-2 ring-slate-900 text-white md:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-6 right-6 bg-[#0D9488] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
            Best Value
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0D9B8A]">
              Elite Annual Pass
            </span>

            <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mt-1">
              ALL-IN-ONE BUSINESS SUITE
            </h3>

            <p className="mt-6 flex items-baseline gap-x-2">
              <span className="text-4xl font-black tracking-tighter text-white">₹4,959</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">/year</span>
            </p>

            <div className="mt-3 inline-flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
              <RefreshCw className="h-3 w-3 text-[#0D9488] animate-spin duration-1000" /> 
              <span>Renewal Price Lock: Renew at ₹4,959/year (Same Cost Guaranteed)</span>
            </div>

            <div className="mt-8 border-t border-slate-800 pt-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#0D9488] mb-4">
                Enterprise Features Included:
              </h4>
              <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-300">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-x-2 items-start">
                    <CheckCircle2 className="h-4 w-4 flex-none text-[#0D9488] mt-0.5" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            className="mt-8 block w-full rounded-lg bg-[#0D9488] hover:bg-teal-600 text-white py-3.5 text-center text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-teal-900/30"
          >
            Upgrade & Activate Access
          </button>
        </div>
      </div>
    </div>
  )
}
