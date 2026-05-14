'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IndianRupee, Users, TrendingUp, AlertTriangle, Loader2, MessageCircle, Printer } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [kpiData, setKpiData] = useState<any>(null)
  const [recentSales, setRecentSales] = useState<any[]>([])
  const [stockAlerts, setStockAlerts] = useState<any[]>([])
  const [customerCount, setCustomerCount] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    
    const [kpiRes, salesRes, alertRes, custRes] = await Promise.all([
      supabase.from('tp_dashboard_kpis').select('*').single(),
      supabase.from('tp_sales').select('*, tp_customers(name)').order('created_at', { ascending: false }).limit(5),
      supabase.from('tp_stock_alerts').select('*, tp_products(name)').filter('is_resolved', 'eq', false).limit(5),
      supabase.from('tp_customers').select('id', { count: 'exact' })
    ])

    setKpiData(kpiRes.data)
    setRecentSales(salesRes.data || [])
    setStockAlerts(alertRes.data || [])
    setCustomerCount(custRes.count || 0)
    setLoading(false)
  }

  const kpis = [
    { 
      title: 'Sales (This Month)', 
      value: `₹${parseFloat(kpiData?.month_sales || 0).toLocaleString('en-IN')}`, 
      change: `+${kpiData?.month_invoices || 0} bills`, 
      isPositive: true, 
      icon: IndianRupee 
    },
    { 
      title: 'Total Collections', 
      value: `₹${parseFloat(kpiData?.month_collections || 0).toLocaleString('en-IN')}`, 
      change: 'This month', 
      isPositive: true, 
      icon: TrendingUp 
    },
    { 
      title: 'Pending Dues', 
      value: `₹${parseFloat(kpiData?.month_pending || 0).toLocaleString('en-IN')}`, 
      change: 'To collect', 
      isPositive: false, 
      icon: AlertTriangle 
    },
    { 
      title: 'Active Customers', 
      value: customerCount.toString(), 
      change: 'Total records', 
      isPositive: true, 
      icon: Users 
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Business Overview</h2>
          <p className="text-muted-foreground">Welcome back. Here is what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/reminders" 
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            <MessageCircle className="h-4 w-4" /> Bulk Reminders
          </Link>
          <Link 
            href="/reports" 
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" /> Print Master Report
          </Link>
          <button onClick={fetchDashboardData} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '🔄'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <kpi.icon className="h-5 w-5 text-slate-400" />
               <span className={`text-sm font-medium ${kpi.isPositive ? 'text-green-600' : 'text-amber-600'}`}>
                 {kpi.change}
               </span>
            </div>
            <div className="mt-4">
               <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
               <h3 className="text-2xl font-bold mt-1">{loading ? '...' : kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="col-span-2 rounded-xl border bg-card shadow-sm p-6">
          <h3 className="font-semibold mb-4 text-slate-900 uppercase tracking-wider text-xs">SALES & COLLECTIONS GROWTH</h3>
          {/* Chart placeholder */}
          <div className="h-[300px] flex flex-col items-center justify-center bg-slate-50 rounded border border-dashed border-slate-200">
             <TrendingUp className="h-10 w-10 text-slate-300 mb-2" />
             <p className="text-slate-400 text-sm">Visual Analytics Loading...</p>
          </div>
        </div>
        <div className="col-span-1 rounded-xl bg-slate-900 text-white shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-semibold text-slate-100 uppercase tracking-wider text-xs">AI STOCK ALERTS</h3>
             <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{stockAlerts.length}</span>
          </div>
          <div className="space-y-4">
             {stockAlerts.map((alert) => (
               <div key={alert.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div>
                     <p className="font-medium text-sm">{alert.tp_products?.name}</p>
                     <p className="text-[10px] text-slate-400">Stock: {alert.current_stock} / Min: {alert.min_stock}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded font-bold border ${
                    alert.alert_type === 'out_of_stock' 
                      ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {alert.alert_type.toUpperCase().replace('_', ' ')}
                  </span>
               </div>
             ))}
             {stockAlerts.length === 0 && (
               <div className="py-10 text-center text-slate-500 text-sm">
                  No critical stock alerts. Good job!
               </div>
             )}
             <button className="w-full mt-4 bg-primary hover:bg-green-500 text-white text-sm py-2 rounded-md font-semibold transition-colors shadow-lg shadow-green-900/20">
               Reorder Priority Items
             </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <div className="col-span-2 rounded-xl border bg-card shadow-sm p-6 overflow-hidden">
            <h3 className="font-semibold mb-4 text-slate-900 uppercase tracking-wider text-xs">RECENT INVOICES</h3>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                     <tr>
                        <th className="px-4 py-3">Invoice #</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {recentSales.map((sale) => (
                       <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-primary">{sale.invoice_number}</td>
                          <td className="px-4 py-3">{sale.tp_customers?.name || 'Walk-in'}</td>
                          <td className="px-4 py-3">₹{parseFloat(sale.total_amount).toFixed(2)}</td>
                          <td className="px-4 py-3">
                             <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                               sale.payment_status === 'paid' 
                                 ? 'text-green-600 bg-green-50 border-green-200' 
                                 : sale.payment_status === 'partial'
                                 ? 'text-amber-600 bg-amber-50 border-amber-200'
                                 : 'text-red-600 bg-red-50 border-red-200'
                             }`}>
                                {sale.payment_status.toUpperCase()}
                             </span>
                          </td>
                       </tr>
                     ))}
                     {recentSales.length === 0 && !loading && (
                        <tr><td colSpan={4} className="py-10 text-center text-slate-400">No sales recorded yet.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
         <div className="col-span-1 rounded-xl border bg-card shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-slate-900 uppercase tracking-wider text-xs">TOP CUSTOMERS</h3>
            <div className="space-y-4">
               <div className="py-10 text-center text-slate-400 text-sm">
                  Connect your first sale to see top customer insights.
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
