import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // All these queries auto-filter by user via RLS
  const [salesRes, customersRes, alertsRes] = await Promise.all([
    supabase
      .from('tp_sales')
      .select('total_amount, amount_paid, balance_due, invoice_date, payment_status, invoice_number, id, created_at, tp_customers(name)')
      .order('created_at', { ascending: false }),
    
    supabase
      .from('tp_customers')
      .select('id', { count: 'exact' }),
    
    supabase
      .from('tp_stock_alerts')
      .select('*, tp_products(name)')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  const sales = salesRes.data || []
  
  // KPI Calculations
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlySales = sales.filter(s => {
    const d = new Date(s.invoice_date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const totalSales = monthlySales.reduce((sum, s) => sum + Number(s.total_amount), 0)
  const totalCollections = monthlySales.reduce((sum, s) => sum + Number(s.amount_paid), 0)
  const pendingDues = monthlySales.reduce((sum, s) => sum + Number(s.balance_due), 0)
  
  const activeCustomers = customersRes.count || 0
  const stockAlerts = alertsRes.data || []
  const recentSales = sales.slice(0, 5)

  // Chart Data: Group sales and collections by date for the last 15 days
  const last15Days = Array.from({ length: 15 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const chartData = last15Days.map(date => {
    const daySales = sales.filter(s => s.invoice_date === date)
    return {
      date: new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      sales: daySales.reduce((sum, s) => sum + Number(s.total_amount), 0),
      collections: daySales.reduce((sum, s) => sum + Number(s.amount_paid), 0)
    }
  })

  return <DashboardClient 
    totalSales={totalSales}
    totalCollections={totalCollections}
    pendingDues={pendingDues}
    activeCustomers={activeCustomers}
    stockAlerts={stockAlerts}
    recentSales={recentSales}
    chartData={chartData}
    userName={user.email}
  />
}
