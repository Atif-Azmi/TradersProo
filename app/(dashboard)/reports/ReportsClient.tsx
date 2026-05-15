'use client'

import { useState } from 'react'
import { FileBarChart, Download, Printer, ChevronRight, MessageCircle } from 'lucide-react'

const reportTypes = [
  { id: 'sales', name: 'Sales Report', description: 'Total sales, collections, dues, and GST collected' },
  { id: 'ledger', name: 'Customer Ledger', description: 'Full transaction history with running balances' },
  { id: 'stock', name: 'Stock Report', description: 'Current stock and value at purchase/selling price' },
  { id: 'pnl', name: 'Profit & Loss', description: 'Revenue vs cost and gross margin' },
  { id: 'aging', name: 'Outstanding Dues (Aging)', description: '0-30, 30-60, 60-90+ days pending balances' },
  { id: 'collection', name: 'Payment Collection', description: 'Day/week/month breakdown of received payments' },
  { id: 'gst', name: 'GST Report', description: 'Taxable sales and GST collected month-wise' },
]

export default function ReportsClient() {
  const [activeReport, setActiveReport] = useState(reportTypes[0].id)
  const [generated, setGenerated] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleWhatsAppShare = () => {
    const reportName = reportTypes.find(r => r.id === activeReport)?.name
    const message = `Business Report: ${reportName}\nGenerated on: ${new Date().toLocaleDateString()}\nStatus: Success\nSummary: Gross Sales: ₹0 | Dues: ₹0`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Intelligence</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Generate deep business insights and financial audits.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 print:block">
         <div className="md:col-span-1 space-y-2 print:hidden">
            {reportTypes.map((report) => (
               <button
                 key={report.id}
                 onClick={() => { setActiveReport(report.id); setGenerated(false); }}
                 className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${
                   activeReport === report.id
                     ? 'bg-primary/10 border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]'
                     : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 font-bold text-xs'
                 }`}
               >
                  {report.name}
                  {activeReport === report.id && <ChevronRight className="h-4 w-4" />}
               </button>
            ))}
         </div>
         
         <div className="md:col-span-3 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-100 p-8 min-h-[600px] flex flex-col print:border-0 print:shadow-none print:p-0">
            {/* Report Header (Print Optimized) */}
            <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
               <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black text-primary tracking-tighter uppercase">TRADERSPRO</h1>
                    <p className="font-bold text-slate-700">BUSINESS MANAGEMENT SYSTEM</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Statement</p>
                    <h2 className="text-2xl font-black text-slate-900 uppercase">{reportTypes.find(r => r.id === activeReport)?.name}</h2>
                    <p className="text-xs text-slate-500 font-medium">Generated: {new Date().toLocaleString()}</p>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-start mb-12 print:hidden">
               <div>
                  <h3 className="text-xl font-black text-slate-900">
                     {reportTypes.find(r => r.id === activeReport)?.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                     {reportTypes.find(r => r.id === activeReport)?.description}
                  </p>
               </div>
               <div className="flex gap-2">
                  <button onClick={handlePrint} className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                    <Printer className="h-4 w-4" /> Print
                  </button>
                  <button onClick={handleWhatsAppShare} className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-green-600 transition-all shadow-lg shadow-green-100">
                    <MessageCircle className="h-4 w-4" /> Share
                  </button>
                  <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all">
                    <Download className="h-4 w-4" /> Export
                  </button>
               </div>
            </div>

            {!generated ? (
               <div className="bg-slate-50/50 border border-slate-100 border-dashed rounded-[2rem] flex-1 flex items-center justify-center print:hidden">
                  <div className="text-center p-8">
                     <div className="p-6 bg-white rounded-full shadow-sm inline-block mb-6">
                        <FileBarChart className="h-10 w-10 text-slate-200" />
                     </div>
                     <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-8">Define reporting parameters</p>
                     <div className="flex justify-center gap-4 flex-wrap">
                        <input type="date" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-primary outline-none transition-all" />
                        <span className="text-slate-300 self-center font-black uppercase text-[10px] tracking-widest">to</span>
                        <input type="date" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-primary outline-none transition-all" />
                        <button onClick={() => setGenerated(true)} className="px-8 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-100">Generate Intelligence</button>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="flex-1 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-50 flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Sales</span>
                        <div className="text-right">
                           <span className="text-2xl font-black block text-slate-900">₹0.00</span>
                           <span className="text-[10px] text-green-600 font-black uppercase tracking-widest">Stationary</span>
                        </div>
                     </div>
                     <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-50 flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Profit</span>
                        <div className="text-right">
                           <span className="text-2xl font-black block text-slate-900">₹0.00</span>
                           <span className="text-[10px] text-green-600 font-black uppercase tracking-widest">Calculated</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Market Analytics</h4>
                     <div className="py-20 text-center">
                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Insufficient data for visualization</p>
                     </div>
                  </div>

                  <div className="mt-auto text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] py-8">
                     Verified Business Intelligence • TradersPro SaaS
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  )
}
