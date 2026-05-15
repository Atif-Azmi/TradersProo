'use client'

import { useState } from 'react'
import { 
  BarChart3, TrendingUp, PieChart, Download, 
  Calendar, FileText, ArrowRight, ArrowUpRight,
  Target, Zap, ShieldCheck
} from 'lucide-react'

export default function ReportsClient() {
  const reports = [
    { name: 'Daily Sales Report', desc: 'Summary of all sales made today across all categories.', icon: TrendingUp, color: 'bg-blue-500' },
    { name: 'Customer Ledger', desc: 'Detailed transaction history for individual customers.', icon: FileText, color: 'bg-emerald-500' },
    { name: 'Stock Movement', desc: 'Track inventory inflow, outflow, and current stock status.', icon: Zap, color: 'bg-orange-500' },
    { name: 'Payment Collections', desc: 'Analysis of pending vs received payments for this month.', icon: Target, color: 'bg-rose-500' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#0f172a]">Analytics & Reports</h2>
          <p className="text-slate-500 font-medium text-lg mt-1">Deep insights into your business performance and growth.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-sm font-black text-slate-900">May 2026</span>
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Growth</p>
            <p className="text-2xl font-black text-slate-900 mt-1">+12.4%</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection Rate</p>
            <p className="text-2xl font-black text-slate-900 mt-1">98.2%</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
            <PieChart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profit Margin</p>
            <p className="text-2xl font-black text-slate-900 mt-1">24.5%</p>
          </div>
        </div>
      </div>

      {/* REPORT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reports.map((report) => (
          <div key={report.name} className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-all cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className={`w-16 h-16 rounded-[1.2rem] ${report.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
                <report.icon className="h-8 w-8" />
              </div>
              <button className="p-4 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-all">
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-black text-[#0f172a]">{report.name}</h3>
              <p className="text-slate-500 font-medium mt-3 leading-relaxed">{report.desc}</p>
            </div>
            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last generated: 2h ago</span>
              <button className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                Export PDF <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
