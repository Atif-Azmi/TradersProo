'use client'

import React from 'react'
import Link from 'next/link'
import {
  IndianRupee,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Badge } from '@/components/common/Badge'

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
  userName,
}: DashboardClientProps) {
  const kpis = [
    {
      title: 'Total Sales (Monthly)',
      value: `₹${totalSales.toLocaleString('en-IN')}`,
      change: 'Active',
      isPositive: true,
      icon: TrendingUp,
      color: 'emerald',
    },
    {
      title: 'Total Collections',
      value: `₹${totalCollections.toLocaleString('en-IN')}`,
      change: 'Synced',
      isPositive: true,
      icon: IndianRupee,
      color: 'blue',
    },
    {
      title: 'Pending Dues',
      value: `₹${pendingDues.toLocaleString('en-IN')}`,
      change: pendingDues > 0 ? 'Due' : 'Clear',
      isPositive: pendingDues === 0,
      icon: AlertTriangle,
      color: 'rose',
    },
    {
      title: 'Active Customers',
      value: activeCustomers.toString(),
      change: 'Live',
      isPositive: true,
      icon: Users,
      color: 'slate',
    },
  ]

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0D9488]">
            Operations Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Dashboard
          </h2>
        </div>

        <Link
          href="/sales/new"
          className="h-10 px-5 rounded-full bg-[#0B0B0C] dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 tap-scale select-none cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Invoice</span>
        </Link>
      </div>

      {/* Sales Overview Chart & KPIs Grid (Original 2-Column Layout) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Overview Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[20px] p-6 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Trends
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Sales Overview
              </h3>
            </div>
            <select className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none cursor-pointer">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
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
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.12)',
                    padding: '12px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
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

        {/* 4 KPIs Column (1 col, Original Structure) */}
        <div className="space-y-4 flex flex-col justify-between">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[20px] p-5 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.04)] flex items-center justify-between tap-scale select-none"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    kpi.color === 'emerald'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : kpi.color === 'blue'
                      ? 'bg-teal-50 text-[#0D9488] dark:bg-teal-950/40 dark:text-[#2DD4BF]'
                      : kpi.color === 'rose'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                    {kpi.title}
                  </p>
                  <h4 className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                    {kpi.value}
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`flex items-center gap-0.5 text-[11px] font-bold ${
                    kpi.isPositive ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {kpi.isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {kpi.change}
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Live Sync</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions & Performance Grid (Original 2-Column Bottom Layout) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Latest Transactions Table (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[20px] overflow-hidden shadow-[0_4px_20px_-6px_rgba(0,0,0,0.04)]">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Audit Trail
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Latest transactions
              </h3>
            </div>
            <Link
              href="/sales"
              className="text-xs font-bold text-[#0D9488] hover:underline tap-scale"
            >
              View all sales →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {recentSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold uppercase text-xs">
                          {sale.tp_customers?.name?.[0] || 'W'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {sale.tp_customers?.name || 'Walk-in Node'}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono tracking-tight">
                            Invoice #{sale.invoice_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Badge
                          label={sale.payment_status}
                          variant={
                            sale.payment_status === 'paid'
                              ? 'success'
                              : sale.payment_status === 'partial'
                              ? 'accent'
                              : 'danger'
                          }
                        />

                        {/* WhatsApp Due Reminder Button (Original Feature) */}
                        {sale.payment_status !== 'paid' && sale.tp_customers?.phone && (
                          <button
                            onClick={() => {
                              const msg = `Hi ${sale.tp_customers.name}, this is a reminder regarding your pending payment of ₹${parseFloat(
                                sale.total_amount
                              ).toLocaleString('en-IN')} for Invoice #${
                                sale.invoice_number
                              }. Please settle it at your earliest convenience. - TradersPro`
                              window.open(
                                `https://wa.me/${sale.tp_customers.phone.replace(
                                  /\D/g,
                                  ''
                                )}?text=${encodeURIComponent(msg)}`,
                                '_blank'
                              )
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors tap-scale"
                            title="Remind via WhatsApp"
                            aria-label="Send WhatsApp reminder"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                        ₹{parseFloat(sale.total_amount).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {new Date(sale.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collection Efficiency Radial Gauge (1 col, Original Feature) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[20px] p-6 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Recovery
            </p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Collection Efficiency
            </h3>
            <div className="mt-8 flex flex-col items-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={452.4}
                    strokeDashoffset={
                      452.4 * (1 - (totalSales > 0 ? totalCollections / totalSales : 0))
                    }
                    className="text-[#0D9488] transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                    {totalSales > 0 ? Math.round((totalCollections / totalSales) * 100) : 0}%
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                    Collected
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-5 text-center">
                Percentage of total sales collected as cash.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-[#0D9488]/5 dark:bg-[#0D9488]/10 p-3.5 rounded-xl border border-[#0D9488]/15 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-[#0D9488] uppercase tracking-widest">
                  Status Report
                </p>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {pendingDues > 0 ? `₹${pendingDues.toLocaleString('en-IN')} Pending` : 'All Clear'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
