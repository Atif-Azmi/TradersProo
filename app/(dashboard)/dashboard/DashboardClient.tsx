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
      title: 'Total Sales (JUN)', 
      value: `₹${totalSales.toLocaleString('en-IN')}`, 
      change: '+12.5%', 
      isPositive: true, 
      subText: 'Monthly goal: 85%',
      icon: TrendingUp,
      color: 'blue'
    },
    { 
      title: 'Total Collections', 
      value: `₹${totalCollections.toLocaleString('en-IN')}`, 
      change: '+8.2%', 
      isPositive: true, 
      subText: 'Higher than last month',
      icon: IndianRupee,
      color: 'emerald'
    },
    { 
      title: 'Pending Dues', 
      value: `₹${pendingDues.toLocaleString('en-IN')}`, 
      change: '-2.4%', 
      isPositive: false, 
      subText: 'Outstanding payments',
      icon: AlertTriangle,
      color: 'rose'
    },
    { 
      title: 'Active Customers', 
      value: activeCustomers.toString(), 
      change: '+12', 
      isPositive: true, 
      subText: 'New this week',
      icon: Users,
      color: 'slate'
    },
  ]

  return (
    <div className="space-y-8 font-sans max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 italic uppercase">Business Overview</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Welcome back, {userName?.split('@')[0]}. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-white shadow-xl shadow-green-100 hover:bg-green-600 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-widest">
            <MessageCircle className="h-4 w-4" /> Bulk Reminders
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-widest">
            <Printer className="h-4 w-4" /> Print Master Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
               <div className={`p-3 rounded-2xl ${
                 kpi.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                 kpi.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                 kpi.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
               }`}>
                 <kpi.icon className="h-6 w-6" />
               </div>
               <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black ${
                 kpi.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
               }`}>
                 {kpi.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                 {kpi.change}
               </span>
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{kpi.title}</p>
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{kpi.value}</h3>
               <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{kpi.subText}</p>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-10 transition-opacity">
               <kpi.icon className="h-24 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Alerts Row */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Chart */}
        <div className="lg:col-span-2 rounded-[3rem] border border-slate-100 bg-white shadow-sm p-10 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <div>
               <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] italic">Sales & Collections Growth</h3>
               <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-[0.3em]">Historical performance node analysis</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sales</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Collections</span>
               </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis 
                     dataKey="date" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                     dy={15}
                   />
                   <YAxis 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                   />
                   <Tooltip 
                     contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                     }} 
                     itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                     labelStyle={{ fontSize: '10px', fontWeight: 900, marginBottom: '4px', color: '#64748b' }}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="sales" 
                     stroke="#10b981" 
                     strokeWidth={4} 
                     fillOpacity={1} 
                     fill="url(#colorSales)" 
                     animationDuration={2000}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="collections" 
                     stroke="#3b82f6" 
                     strokeWidth={4} 
                     fillOpacity={1} 
                     fill="url(#colorCollections)" 
                     animationDuration={2000}
                   />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Alerts Card */}
        <div className="lg:col-span-1 rounded-[3rem] bg-slate-950 text-white shadow-2xl p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div>
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="font-black text-slate-500 uppercase tracking-[0.3em] text-[10px]">AI Stock Alerts</h3>
                  <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-[0.2em]">Automated product monitoring</p>
               </div>
               <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{stockAlerts.length} New</span>
            </div>
            
            <div className="space-y-5">
               {stockAlerts.map((alert) => (
                 <div key={alert.id} className="group flex justify-between items-center bg-slate-900 border border-slate-800 p-5 rounded-[1.5rem] hover:bg-slate-800/80 transition-all duration-300">
                    <div>
                       <p className="font-black text-sm tracking-tight italic uppercase">{alert.tp_products?.name}</p>
                       <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${
                         alert.alert_type === 'out_of_stock' ? 'text-red-400' : 'text-amber-400'
                       }`}>
                         {alert.alert_type.replace('_', ' ')} ({alert.current_stock} pcs)
                       </p>
                    </div>
                    <button className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      alert.alert_type === 'out_of_stock' 
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-900/40' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/40'
                    }`}>
                      {alert.alert_type === 'out_of_stock' ? 'Priority' : 'Reorder'}
                    </button>
                 </div>
               ))}
               {stockAlerts.length === 0 && (
                 <div className="py-20 text-center">
                    <AlertTriangle className="h-8 w-8 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Node Secure • No Alerts</p>
                 </div>
               )}
            </div>
          </div>

          <button className="w-full mt-10 bg-primary hover:bg-green-500 text-white text-[10px] py-5 rounded-2xl font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-primary/20 hover:-translate-y-1">
            Inventory Manager
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-3">
         <div className="lg:col-span-2 rounded-[3rem] border border-slate-100 bg-white shadow-sm p-10 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] italic">Recent Business Nodes</h3>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-[0.3em]">Latest transaction flow analysis</p>
               </div>
               <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreHorizontal className="h-5 w-5" /></button>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50/50 tracking-[0.3em]">
                     <tr>
                        <th className="px-6 py-5 rounded-l-2xl">Invoice</th>
                        <th className="px-6 py-5">Customer Entity</th>
                        <th className="px-6 py-5">Volume</th>
                        <th className="px-6 py-5 rounded-r-2xl text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {recentSales.map((sale) => (
                       <tr key={sale.id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-6 py-8 font-black text-primary tracking-tighter italic text-base">#{sale.invoice_number}</td>
                          <td className="px-6 py-8">
                             <p className="text-sm font-black text-slate-700 uppercase italic tracking-tight">{sale.tp_customers?.name || 'Walk-in Node'}</p>
                             <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                {new Date(sale.created_at).getDate()}/{new Date(sale.created_at).getMonth() + 1}/{new Date(sale.created_at).getFullYear()}
                             </p>
                          </td>
                          <td className="px-6 py-8 font-black text-slate-900 text-lg tracking-tighter italic">₹{parseFloat(sale.total_amount).toLocaleString('en-IN')}</td>
                          <td className="px-6 py-8 text-center">
                             <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black border uppercase tracking-[0.2em] shadow-inner ${
                               sale.payment_status === 'paid' 
                                 ? 'text-green-600 bg-green-50 border-green-100' 
                                 : sale.payment_status === 'partial'
                                 ? 'text-amber-600 bg-amber-50 border-amber-100'
                                 : 'text-red-600 bg-red-50 border-red-100'
                             }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                   sale.payment_status === 'paid' ? 'bg-green-500' : 
                                   sale.payment_status === 'partial' ? 'bg-amber-500' : 'bg-red-500'
                                }`}></div>
                                {sale.payment_status}
                             </span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
         
         {/* Sidebar Card */}
         <div className="lg:col-span-1 rounded-[3rem] border border-slate-100 bg-white shadow-sm p-10 flex flex-col justify-between">
            <div>
               <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] italic">Growth Analysis</h3>
               <div className="mt-10 space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                        <TrendingUp className="h-6 w-6" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Velocity</p>
                        <h4 className="text-xl font-black text-slate-900 italic">+24.8%</h4>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                        <Users className="h-6 w-6" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retention Rate</p>
                        <h4 className="text-xl font-black text-slate-900 italic">94.2%</h4>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center mt-10">
               <AlertTriangle className="h-8 w-8 text-slate-200 mx-auto mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Predictive Insights Pending...</p>
            </div>
         </div>
      </div>
    </div>
  )
}
