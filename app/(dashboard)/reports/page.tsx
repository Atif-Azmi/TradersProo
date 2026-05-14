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

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState(reportTypes[0].id)
  const [generated, setGenerated] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleWhatsAppShare = () => {
    const reportName = reportTypes.find(r => r.id === activeReport)?.name
    const message = `Business Report: ${reportName}\nGenerated on: ${new Date().toLocaleDateString()}\nStatus: Success\nSummary: Gross Sales: ₹4,12,500 | Dues: ₹1,28,500`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground text-sm mt-1">Generate and download detailed business reports.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 print:block">
         <div className="md:col-span-1 space-y-2 print:hidden">
            {reportTypes.map((report) => (
               <button
                 key={report.id}
                 onClick={() => { setActiveReport(report.id); setGenerated(false); }}
                 className={`w-full text-left p-3 rounded-lg border transition-colors flex justify-between items-center ${
                   activeReport === report.id
                     ? 'bg-primary/10 border-primary/20 text-primary font-medium'
                     : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                 }`}
               >
                  {report.name}
                  {activeReport === report.id && <ChevronRight className="h-4 w-4" />}
               </button>
            ))}
         </div>
         
         <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-6 min-h-[600px] flex flex-col print:border-0 print:shadow-none print:p-0">
            {/* Report Header (Print Optimized) */}
            <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
               <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black text-primary tracking-tighter">F.K.S. TRADERS</h1>
                    <p className="font-bold text-slate-700">MS PIPE, GI SHEET, AND METAL HARDWARE</p>
                    <p className="text-sm text-slate-500 mt-2">Sehore, Madhya Pradesh, India</p>
                    <p className="text-sm text-slate-500">Phone: +91 94254 46526 • GST: 23ABCDE1234F1Z5</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase">Business Statement</p>
                    <h2 className="text-2xl font-bold text-slate-900 uppercase">{reportTypes.find(r => r.id === activeReport)?.name}</h2>
                    <p className="text-xs text-slate-500">Generated: {new Date().toLocaleString()}</p>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-start mb-8 print:hidden">
               <div>
                  <h3 className="text-lg font-bold text-slate-900">
                     {reportTypes.find(r => r.id === activeReport)?.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                     {reportTypes.find(r => r.id === activeReport)?.description}
                  </p>
               </div>
               <div className="flex gap-2">
                  <button onClick={handlePrint} className="flex items-center gap-2 rounded-md bg-white border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Printer className="h-4 w-4" /> Print
                  </button>
                  <button onClick={handleWhatsAppShare} className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700">
                    <MessageCircle className="h-4 w-4" /> Share
                  </button>
                  <button className="flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    <Download className="h-4 w-4" /> Export CSV
                  </button>
               </div>
            </div>

            {!generated ? (
               <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg flex-1 flex items-center justify-center print:hidden">
                  <div className="text-center">
                     <FileBarChart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                     <p className="text-slate-500 font-medium">Select parameters to generate report</p>
                     <div className="mt-4 flex justify-center gap-3">
                        <input type="date" className="px-3 py-1.5 border rounded text-sm text-slate-600" />
                        <span className="text-slate-400 self-center">to</span>
                        <input type="date" className="px-3 py-1.5 border rounded text-sm text-slate-600" />
                        <button onClick={() => setGenerated(true)} className="px-4 py-1.5 bg-primary text-white rounded text-sm font-medium hover:bg-green-500 transition-colors">Generate</button>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="flex-1 space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50 rounded-lg border flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Gross Sales Volume</span>
                        <div className="text-right">
                           <span className="text-xl font-bold block text-slate-900">₹4,12,500</span>
                           <span className="text-xs text-green-600 font-bold">+12.5%</span>
                        </div>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-lg border flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Estimated Net Revenue</span>
                        <div className="text-right">
                           <span className="text-xl font-bold block text-slate-900">₹68,400</span>
                           <span className="text-xs text-green-600 font-bold">+8.2%</span>
                        </div>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-lg border flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Outstanding Receivables</span>
                        <div className="text-right">
                           <span className="text-xl font-bold block text-red-600">₹1,28,500</span>
                           <span className="text-xs text-red-500 font-bold">-2.4%</span>
                        </div>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-lg border flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Total Active Customers</span>
                        <div className="text-right">
                           <span className="text-xl font-bold block text-slate-900">142</span>
                           <span className="text-xs text-green-600 font-bold">+12 new</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 border">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Inventory Alerts (Critical)</h4>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="flex justify-between border-b pb-2">
                           <span className="font-bold text-slate-700 text-sm">MS Pipe 2.5"</span>
                           <span className="text-red-500 text-sm font-bold">Low (12 pcs)</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                           <span className="font-bold text-slate-700 text-sm">GI Sheet 0.5mm</span>
                           <span className="text-red-600 text-sm font-bold">Critical (5 kgs)</span>
                        </div>
                     </div>
                  </div>

                  <div className="mt-12 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                     Official Statement • F.K.S. Traders Edition
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  )
}
