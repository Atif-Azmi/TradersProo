'use client'

import { CheckCircle2 } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '₹299',
    period: 'month',
    features: [
      'Up to 200 customers',
      'Billing & PDF generation',
      'WhatsApp sharing',
      'Basic stock tracking',
      'Basic reports',
    ],
    highlight: false,
    buttonText: 'Choose Starter',
  },
  {
    name: 'Professional',
    price: '₹599',
    period: 'month',
    features: [
      'Unlimited customers',
      'All Starter features',
      'Advanced analytics',
      'Priority support',
      'Custom branding on PDFs',
    ],
    highlight: true,
    buttonText: 'Choose Pro',
  },
]

export default function SubscriptionPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Pricing Plans</h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Simple pricing for businesses of all sizes. No hidden fees.
        </p>
      </div>

      <div className="mx-auto max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
         <h3 className="text-lg font-semibold text-slate-900 mb-2">Current Plan: Trial</h3>
         <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
           <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
         </div>
         <p className="text-sm text-slate-500">Your free trial ends in <span className="font-bold text-slate-900">14 days</span>.</p>
      </div>

      <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-4xl md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl p-8 ring-1 xl:p-10 ${
              plan.highlight
                ? 'bg-slate-900 ring-slate-900 text-white'
                : 'bg-white ring-slate-200 text-slate-900'
            }`}
          >
            <h3 id={plan.name} className={`text-lg font-semibold leading-8 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
              {plan.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-1">
              <span className={`text-4xl font-bold tracking-tight ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
              <span className={`text-sm font-semibold leading-6 ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>/{plan.period}</span>
            </p>
            <ul role="list" className={`mt-8 space-y-3 text-sm leading-6 ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckCircle2 className={`h-6 w-5 flex-none ${plan.highlight ? 'text-primary' : 'text-primary'}`} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              aria-describedby={plan.name}
              className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                plan.highlight
                  ? 'bg-primary text-white hover:bg-green-500 focus-visible:outline-primary'
                  : 'text-primary ring-1 ring-inset ring-primary hover:ring-green-500 hover:text-green-600'
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
