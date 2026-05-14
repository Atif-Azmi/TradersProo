'use client'

import { useState } from 'react'
import { Plus, Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react'

export default function AdvancesPage() {
  const [activeTab, setActiveTab] = useState<'advances' | 'payments'>('advances')

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Advances & Payments</h2>
          <p className="text-muted-foreground text-sm mt-1">Record money received from customers.</p>
        </div>
        <div>
          <button className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
            <Plus className="h-4 w-4" /> Record {activeTab === 'advances' ? 'Advance' : 'Payment'}
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('advances')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'advances'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Advance Receipts
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'payments'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Invoice Payments
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <div className="relative w-full max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <input
               type="text"
               placeholder="Search by customer..."
               className="w-full pl-9 pr-4 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
             />
           </div>
        </div>
        
        {activeTab === 'advances' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold">Mode</th>
                  <th className="px-6 py-4 font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">14 May 2026</td>
                  <td className="px-6 py-4 font-medium text-slate-900">Ramesh Hardware</td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                     <div className="flex items-center justify-end gap-1">
                        <ArrowDownLeft className="h-4 w-4" /> ₹20,000
                     </div>
                  </td>
                  <td className="px-6 py-4">Online</td>
                  <td className="px-6 py-4 text-slate-500">NEFT-123456789</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Invoice Ref</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold">Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">12 May 2026</td>
                  <td className="px-6 py-4 font-medium text-slate-900">Suresh Builders</td>
                  <td className="px-6 py-4 text-primary font-medium">INV-0041</td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                     <div className="flex items-center justify-end gap-1">
                        <ArrowDownLeft className="h-4 w-4" /> ₹12,500
                     </div>
                  </td>
                  <td className="px-6 py-4">Cash</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
