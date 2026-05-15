'use client'

import { useState } from 'react'
import { Plus, Search, ArrowDownLeft } from 'lucide-react'

export default function AdvancesClient() {
  const [activeTab, setActiveTab] = useState<'advances' | 'payments'>('advances')

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Capital Flow</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage customer advances and historical payment receipts.</p>
        </div>
        <div>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-100 hover:bg-green-600 transition-all">
            <Plus className="h-4 w-4" /> Record {activeTab === 'advances' ? 'Advance' : 'Payment'}
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-100 font-black text-[10px] uppercase tracking-widest">
        <button
          onClick={() => setActiveTab('advances')}
          className={`px-6 py-4 transition-all border-b-2 ${
            activeTab === 'advances'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
          }`}
        >
          Advance Deposits
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-6 py-4 transition-all border-b-2 ${
            activeTab === 'payments'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
          }`}
        >
          Invoice Settlements
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
           <div className="relative w-full max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <input
               type="text"
               placeholder="Search by customer name..."
               className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
             />
           </div>
        </div>
        
        {activeTab === 'advances' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50/50 tracking-widest">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Payment Mode</th>
                  <th className="px-6 py-4 text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 <tr>
                   <td colSpan={5} className="px-6 py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      No advance receipts found
                   </td>
                 </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50/50 tracking-widest">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Invoice Ref</th>
                  <th className="px-6 py-4 text-right">Settled Amount</th>
                  <th className="px-6 py-4 text-center">Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                       No invoice settlements found
                    </td>
                 </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
