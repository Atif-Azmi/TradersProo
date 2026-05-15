'use client'

import { CheckCircle2 } from 'lucide-react'

const plans = [
  {
    name: 'Starter Tier',
    price: '₹299',
    period: 'month',
    features: [
      'Up to 200 customers',
      'Smart Billing engine',
      'Direct WhatsApp sharing',
      'Automated stock alerts',
      'Basic business reports',
    ],
    highlight: false,
    buttonText: 'Initialize Starter',
  },
  {
    name: 'Enterprise Pro',
    price: '₹599',
    period: 'month',
    features: [
      'Infinite customer records',
      'Advanced recovery tools',
      'Full financial intelligence',
      'Priority dedicated support',
      'Custom invoice architecture',
    ],
    highlight: true,
    buttonText: 'Upgrade to Elite',
  },
]

export default function SubscriptionClient() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-12">
      <div className="text-center">
        <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-5xl uppercase italic">Global Access</h2>
        <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest max-w-2xl mx-auto">
          Transparent, high-performance pricing for growing enterprises.
        </p>
      </div>

      <div className="mx-auto max-w-md bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 p-8 text-center">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Current Status</h3>
         <div className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">Trial Period</div>
         <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
           <div className="bg-primary h-3 rounded-full shadow-lg shadow-green-100" style={{ width: '15%' }}></div>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expires in <span className="text-slate-900 font-black">14 business days</span></p>
      </div>

      <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-12 md:max-w-4xl md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-[3rem] p-10 ring-1 transition-all hover:scale-[1.02] duration-500 ${
              plan.highlight
                ? 'bg-slate-900 ring-slate-900 text-white shadow-2xl shadow-slate-300'
                : 'bg-white ring-slate-100 text-slate-900 shadow-xl shadow-slate-100'
            }`}
          >
            <h3 id={plan.name} className={`text-xs font-black uppercase tracking-[0.3em] ${plan.highlight ? 'text-slate-400' : 'text-slate-400'}`}>
              {plan.name}
            </h3>
            <p className="mt-8 flex items-baseline gap-x-2">
              <span className={`text-5xl font-black tracking-tighter ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>/{plan.period}</span>
            </p>
            <ul role="list" className={`mt-10 space-y-4 text-sm font-medium ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-x-3 items-center">
                  <CheckCircle2 className={`h-5 w-5 flex-none ${plan.highlight ? 'text-primary' : 'text-primary'}`} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              aria-describedby={plan.name}
              className={`mt-10 block w-full rounded-2xl px-6 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                plan.highlight
                  ? 'bg-primary text-white hover:bg-green-600 shadow-xl shadow-green-900/20'
                  : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-100'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
