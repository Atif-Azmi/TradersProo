'use client'

import { useState } from 'react'
import { Plus, Search, Store } from 'lucide-react'

export default function RetailClient() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Retail Outlet</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Quick counter sales and walk-in transactions.</p>
        </div>
        <div>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-100 hover:bg-green-600 transition-all">
            <Plus className="h-4 w-4" /> Add Retail Sale
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
           <div className="bg-slate-50 p-3 rounded-xl"><Store className="h-5 w-5 text-slate-600" /></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today's Sales</p>
              <p className="text-2xl font-black text-slate-900">₹0.00</p>
           </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
           <div className="bg-green-50 p-3 rounded-xl"><span className="text-green-600 font-black">₹</span></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cash Collection</p>
              <p className="text-2xl font-black text-green-600">₹0.00</p>
           </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
           <div className="bg-blue-50 p-3 rounded-xl"><span className="text-blue-600 font-black text-[10px] tracking-widest px-1">UPI</span></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UPI / Online</p>
              <p className="text-2xl font-black text-blue-600">₹0.00</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
           <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Recent Transactions</h3>
           <div className="relative w-full max-w-xs">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <input
               type="text"
               placeholder="Search..."
               className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
             />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50/50 tracking-widest">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4 text-right">Qty</th>
                <th className="px-6 py-4 text-right">Rate</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               <tr>
                 <td colSpan={6} className="px-6 py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    No transactions recorded today
                 </td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
