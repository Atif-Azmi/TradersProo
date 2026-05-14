'use client'

import { useState } from 'react'
import { Plus, Search, Store } from 'lucide-react'

export default function RetailSalesPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Retail Sales</h2>
          <p className="text-muted-foreground text-sm mt-1">Quick walk-in sales without customer accounts.</p>
        </div>
        <div>
          <button className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
            <Plus className="h-4 w-4" /> Add Retail Sale
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
           <div className="bg-slate-100 p-3 rounded-full"><Store className="h-5 w-5 text-slate-600" /></div>
           <div>
              <p className="text-sm font-medium text-slate-500">Today's Sales</p>
              <p className="text-2xl font-bold">₹12,450</p>
           </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
           <div className="bg-green-50 p-3 rounded-full"><span className="text-green-600 font-bold">₹</span></div>
           <div>
              <p className="text-sm font-medium text-slate-500">Cash Received</p>
              <p className="text-2xl font-bold text-green-600">₹8,000</p>
           </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
           <div className="bg-blue-50 p-3 rounded-full"><span className="text-blue-600 font-bold px-1">UPI</span></div>
           <div>
              <p className="text-sm font-medium text-slate-500">UPI / Online</p>
              <p className="text-2xl font-bold text-blue-600">₹4,450</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
           <div className="relative w-full max-w-xs">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <input
               type="text"
               placeholder="Search..."
               className="w-full pl-9 pr-4 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
             />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold text-right">Qty</th>
                <th className="px-6 py-4 font-semibold text-right">Rate</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
                <th className="px-6 py-4 font-semibold">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500">10:45 AM</td>
                <td className="px-6 py-4 font-medium text-slate-900">Angle Patti 25x25</td>
                <td className="px-6 py-4 text-right">10 kg</td>
                <td className="px-6 py-4 text-right text-slate-600">₹68.00</td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">₹680.00</td>
                <td className="px-6 py-4">
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                     Cash
                   </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500">09:15 AM</td>
                <td className="px-6 py-4 font-medium text-slate-900">Cast Iron 6"</td>
                <td className="px-6 py-4 text-right">2 pcs</td>
                <td className="px-6 py-4 text-right text-slate-600">₹1200.00</td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">₹2400.00</td>
                <td className="px-6 py-4">
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                     UPI
                   </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
