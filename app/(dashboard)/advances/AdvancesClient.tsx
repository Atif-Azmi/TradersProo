'use client'

import { useState } from 'react'
import { 
  Banknote, Plus, Search, Filter, Download,
  ArrowDownCircle, ArrowUpCircle, History,
  Wallet, Landmark, CreditCard, MoreVertical
} from 'lucide-react'

export default function AdvancesClient() {
  const [search, setSearch] = useState('')

  const dummyData = [
    { id: 1, name: 'Atif', type: 'Received', amount: 5000, date: '2026-05-15', mode: 'Cash' },
    { id: 2, name: 'Rashid Ali', type: 'Payment', amount: 12000, date: '2026-05-14', mode: 'Bank' },
    { id: 3, name: 'Azmi', type: 'Advance', amount: 3000, date: '2026-05-13', mode: 'UPI' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Advances & Payments</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage all cash flows, advances, and bank transactions.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all">
            <Plus className="h-4 w-4" /> Add Payment
          </button>
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cash in Hand</p>
            <p className="text-2xl font-black text-slate-900 mt-1">₹45,200.00</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank Balance</p>
            <p className="text-2xl font-black text-slate-900 mt-1">₹2,84,500.00</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
            <History className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Advances Held</p>
            <p className="text-2xl font-black text-slate-900 mt-1">₹12,400.00</p>
          </div>
        </div>
      </div>

      {/* ACTION CARD */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by customer name, reference or mode..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl pl-16 pr-8 py-5 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>
      </div>

      {/* DATA LIST */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest">Transaction History</h3>
          <div className="flex items-center gap-2">
             <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><Download className="h-4 w-4" /></button>
          </div>
        </div>
        
        <div className="divide-y divide-slate-50">
          {dummyData.map((txn) => (
            <div key={txn.id} className="p-8 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${txn.type === 'Received' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {txn.type === 'Received' ? <ArrowDownCircle className="h-6 w-6" /> : <ArrowUpCircle className="h-6 w-6" />}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">{txn.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {txn.type} • {txn.mode} • {txn.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className={`font-black text-xl ${txn.type === 'Received' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {txn.type === 'Received' ? '+' : '-'} ₹{txn.amount.toLocaleString()}
                  </p>
                </div>
                <button className="p-3 hover:bg-white hover:shadow-md rounded-xl text-slate-300 hover:text-slate-900 transition-all">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
