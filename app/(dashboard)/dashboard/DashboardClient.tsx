'use client'

import { IndianRupee, Users, TrendingUp, AlertTriangle, MessageCircle, Printer, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface DashboardClientProps {
  totalSales: number
  totalCollections: number
  pendingDues: number
  activeCustomers: number
  stockAlerts: any[]
  recentSales: any[]
  chartData: any[]
  userName: string | undefined
}

export default function DashboardClient({
  totalSales,
  totalCollections,
  pendingDues,
  activeCustomers,
  stockAlerts,
  recentSales,
  chartData,
  userName
}: DashboardClientProps) {
  
  const kpis = [
    { 
      title: 'Total Sales (Monthly)', 
      value: `₹${totalSales.toLocaleString('en-IN')}`, 
      change: 'Active', 
      isPositive: true, 
      icon: TrendingUp,
      color: 'emerald'
    },
    { 
      title: 'Total Collections', 
      value: `₹${totalCollections.toLocaleString('en-IN')}`, 
      change: 'Synced', 
      isPositive: true, 
      icon: IndianRupee,
      color: 'blue'
    },
    { 
      title: 'Pending Dues', 
      value: `₹${pendingDues.toLocaleString('en-IN')}`, 
      change: 'Target', 
      isPositive: false, 
      icon: AlertTriangle,
      color: 'rose'
    },
    { 
      title: 'Active Customers', 
      value: activeCustomers.toString(), 
      change: 'Live', 
      isPositive: true, 
      icon: Users,
      color: 'slate'
    },
  ]

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
        </div>
      </div>

      {/* Sales Overview & KPIs Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Overview Chart */}
        <div className="lg:col-span-2 tp-card p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Sales Overview</h3>
              <select className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none">
                 <option>This Month</option>
                 <option>Last Month</option>
              </select>
           </div>
           
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                       <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0D9488" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                         borderRadius: '12px', 
                         border: 'none', 
                         boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                         padding: '12px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#0D9488" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* KPIs Column */}
        <div className="space-y-6">
           {kpis.map((kpi, index) => (
             <div key={index} className="tp-card p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                     kpi.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                     kpi.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                     kpi.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                   }`}>
                      <kpi.icon className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-500 mb-1">{kpi.title}</p>
                      <h4 className="text-xl font-bold text-slate-900">{kpi.value}</h4>
                   </div>
                </div>
                <div className="text-right">
                   <div className={`flex items-center gap-1 text-[11px] font-bold ${kpi.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {kpi.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {kpi.change}
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium">Last 7 days</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Transactions & Stats Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
         {/* Latest Transactions */}
         <div className="lg:col-span-2 tp-card overflow-hidden">
            <div className="p-6 border-b border-slate-50">
               <h3 className="font-bold text-slate-900">Latest transactions</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                     {recentSales.map((sale) => (
                       <tr key={sale.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="px-6 py-5">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase text-xs">
                                   {sale.tp_customers?.name?.[0] || 'W'}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-900">{sale.tp_customers?.name || 'Walk-in Node'}</p>
                                   <p className="text-[11px] text-slate-400 font-medium tracking-tight">Invoice #{sale.invoice_number}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  sale.payment_status === 'paid' 
                                    ? 'bg-emerald-50 text-emerald-600' 
                                    : sale.payment_status === 'partial'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'bg-rose-50 text-rose-600'
                                }`}>
                                   {sale.payment_status}
                                </span>
                                {sale.payment_status !== 'paid' && sale.tp_customers?.phone && (
                                  <button 
                                    onClick={() => {
                                      const msg = `Hi ${sale.tp_customers.name}, this is a reminder regarding your pending payment of ₹${parseFloat(sale.total_amount).toLocaleString('en-IN')} for Invoice #${sale.invoice_number}. Please settle it at your earliest convenience. - TradersPro`;
                                      window.open(`https://wa.me/${sale.tp_customers.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                    }}
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all group"
                                    title="Remind via WhatsApp"
                                  >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                  </button>
                                )}
                              </div>
                           </td>
                          <td className="px-6 py-5 text-right">
                             <p className="text-sm font-bold text-slate-900">₹{parseFloat(sale.total_amount).toLocaleString('en-IN')}</p>
                             <p className="text-[11px] text-slate-400 font-medium">
                                {new Date(sale.created_at).getDate()} {new Date(sale.created_at).toLocaleString('default', { month: 'short' })}, {new Date(sale.created_at).getFullYear()}
                             </p>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Performance Card */}
         <div className="tp-card p-6 flex flex-col justify-between">
            <div>
               <h3 className="font-bold text-slate-900">Collection Efficiency</h3>
               <div className="mt-10 flex flex-col items-center">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                        <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="502.6" strokeDashoffset={502.6 * (1 - (totalSales > 0 ? totalCollections / totalSales : 0))} className="text-[#0D9488]" />
                     </svg>
                     <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-black text-slate-900">{totalSales > 0 ? Math.round((totalCollections / totalSales) * 100) : 0}%</span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Collected</span>
                     </div>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-6 text-center">Percentage of total sales collected as cash.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-8">
               <div className="bg-[#0D9488]/5 p-4 rounded-xl border border-[#0D9488]/10">
                  <p className="text-[10px] font-bold text-[#0D9488] uppercase tracking-widest mb-1">Status Report</p>
                  <p className="text-sm font-black text-slate-900">{pendingDues > 0 ? `₹${pendingDues.toLocaleString()} Pending` : 'All Clear'}</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
