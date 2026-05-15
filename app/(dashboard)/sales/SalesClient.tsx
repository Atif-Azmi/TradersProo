'use client'

import { useState } from 'react'
import { Plus, Search, FileText, Share2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface SalesClientProps {
  initialSales: any[]
}

export default function SalesClient({ initialSales }: SalesClientProps) {
  const [sales, setSales] = useState<any[]>(initialSales)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const supabase = createClient()

  const fetchSales = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tp_sales')
      .select('*, tp_customers(name)')
      .order('created_at', { ascending: false })

    if (!error) {
      setSales(data || [])
    }
    setLoading(false)
  }

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.invoice_number?.toLowerCase().includes(search.toLowerCase()) || 
                          s.tp_customers?.name?.toLowerCase().includes(search.toLowerCase())
    if (filter === 'All') return matchesSearch
    return matchesSearch && s.payment_status.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Sales Ledger</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Track all invoices, payments, and outstanding collections.</p>
        </div>
        <div>
          <Link href="/sales/new" className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-100 hover:bg-green-600 transition-all">
            <Plus className="h-4 w-4" /> Create Invoice
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest overflow-x-auto pb-2 sm:pb-0">
          {['All', 'Paid', 'Partial', 'Pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50/50 tracking-widest">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/sales/${sale.id}`} className="font-bold text-primary hover:underline tracking-tighter">#{sale.invoice_number}</Link>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{new Date(sale.invoice_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{sale.tp_customers?.name || 'Walk-in'}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">₹{parseFloat(sale.total_amount).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[9px] font-black border uppercase tracking-widest ${
                      sale.payment_status === 'paid' 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : sale.payment_status === 'partial'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {sale.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 items-center">
                        <button className="p-2 text-slate-400 hover:text-primary rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors" title="Print PDF">
                          <FileText className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-green-600 rounded-lg bg-slate-50 hover:bg-green-50 transition-colors" title="WhatsApp Share">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                      No invoices found
                    </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
