'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, FileText, Share2, MoreVertical, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tp_sales')
      .select('*, tp_customers(name)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error.message)
    } else {
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
          <h2 className="text-2xl font-bold tracking-tight">Sales & Invoices</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage all your billing and view payment statuses.</p>
        </div>
        <div>
          <Link href="/sales/new" className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
            <Plus className="h-4 w-4" /> Create Invoice
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex gap-2 text-sm overflow-x-auto pb-2 sm:pb-0">
          {['All', 'Paid', 'Partial', 'Pending', 'Overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                filter === f 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            className="w-full pl-9 pr-4 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading && sales.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
             Loading invoices...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Invoice #</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Customer Name</th>
                  <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/sales/${sale.id}`} className="font-medium text-primary hover:underline">{sale.invoice_number}</Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{new Date(sale.invoice_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{sale.tp_customers?.name || 'Walk-in'}</td>
                    <td className="px-6 py-4 text-right font-medium">₹{parseFloat(sale.total_amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        sale.payment_status === 'paid' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : sale.payment_status === 'partial'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {sale.payment_status.charAt(0).toUpperCase() + sale.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2 items-center">
                         <button className="p-1.5 text-slate-400 hover:text-primary rounded bg-slate-50 hover:bg-slate-100" title="Print PDF">
                            <FileText className="h-4 w-4" />
                         </button>
                         <button className="p-1.5 text-slate-400 hover:text-green-600 rounded bg-slate-50 hover:bg-green-50" title="WhatsApp Share">
                            <Share2 className="h-4 w-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredSales.length === 0 && !loading && (
                   <tr>
                     <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                       No invoices found. Create your first sale to see it here!
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
