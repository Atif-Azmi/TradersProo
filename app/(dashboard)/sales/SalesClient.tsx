'use client'

import { useState } from 'react'
import { Plus, Search, FileText, MessageCircle, IndianRupee, X, CheckCircle, Loader2, AlertCircle, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface SalesClientProps {
  initialSales: any[]
  shopProfile: any
}

export default function SalesClient({ initialSales, shopProfile }: SalesClientProps) {
  const [sales, setSales] = useState<any[]>(initialSales)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [paymentModal, setPaymentModal] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const supabase = createClient()

  // balance_due is a GENERATED COLUMN — always calculate from total - paid
  const getBalance = (sale: any) => {
    const total = parseFloat(sale.total_amount || 0)
    const paid = parseFloat(sale.amount_paid || 0)
    return Math.max(0, total - paid)
  }

  const fetchSales = async () => {
    const { data } = await supabase
      .from('tp_sales')
      .select('*, tp_customers(name, phone)')
      .order('created_at', { ascending: false })
    if (data) setSales(data)
  }

  const filteredSales = sales.filter(s => {
    const matchesSearch =
      (s.invoice_number?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (s.tp_customers?.name?.toLowerCase() || '').includes(search.toLowerCase())
    if (filter === 'All') return matchesSearch
    return matchesSearch && (s.payment_status?.toLowerCase() || '') === filter.toLowerCase()
  })

  const openPaymentModal = (sale: any) => {
    setPaymentModal(sale)
    setPaymentAmount('')
    setPaymentSuccess(false)
  }

  const handleRecordPayment = async () => {
    if (!paymentModal || !paymentAmount) return
    setPaymentLoading(true)
    const amount = parseFloat(paymentAmount)
    const currentPaid = parseFloat(paymentModal.amount_paid || 0)
    const total = parseFloat(paymentModal.total_amount || 0)
    const newPaid = currentPaid + amount
    const newBalance = Math.max(0, total - newPaid)
    const newStatus = newBalance <= 0 ? 'paid' : 'partial'

    // NOTE: balance_due is a GENERATED COLUMN — do NOT include it in update
    // PostgreSQL auto-recalculates it when amount_paid changes
    const { error } = await supabase
      .from('tp_sales')
      .update({ amount_paid: newPaid, payment_status: newStatus })
      .eq('id', paymentModal.id)

    if (!error) {
      setPaymentSuccess(true)
      await fetchSales()
      setTimeout(() => { setPaymentModal(null); setPaymentSuccess(false) }, 1500)
    } else {
      alert('Error: ' + error.message)
    }
    setPaymentLoading(false)
  }

  const handlePrintBill = (sale: any) => {
    const shop = shopProfile || {}
    const date = new Date(sale.invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const now = new Date().toLocaleString('en-IN')
    const total = parseFloat(sale.total_amount || 0)
    const paid = parseFloat(sale.amount_paid || 0)
    const balance = getBalance(sale)

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Invoice #${sale.invoice_number} | ${shop.business_name || 'TradersPro'}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;color:#1e293b;padding:40px;background:#fff}
    .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1e293b;padding-bottom:24px;margin-bottom:24px}
    .brand-name{font-size:28px;font-weight:900;font-style:italic;letter-spacing:-1px;color:#1e293b}
    .brand-tag{font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px;margin-top:4px}
    .brand-addr{font-size:11px;color:#64748b;margin-top:8px;line-height:1.6}
    .invoice-meta{text-align:right}
    .invoice-meta .label{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;font-weight:700}
    .invoice-meta .period{font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#1e293b;margin-top:4px}
    .invoice-meta .generated{font-size:11px;color:#64748b;font-style:italic;margin-top:4px}
    .divider{border:none;border-top:2px solid #1e293b;margin:24px 0}
    table{width:100%;border-collapse:collapse;margin:24px 0}
    thead th{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;font-weight:700;border-bottom:1px solid #e2e8f0;padding:10px 0}
    thead th:last-child{text-align:right}
    tbody td{padding:20px 0;border-bottom:1px solid #f1f5f9;font-size:14px;font-weight:700;vertical-align:top}
    tbody td:last-child{text-align:right}
    .key-metric{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;font-weight:700;margin-bottom:4px}
    .amount-big{font-size:18px;font-weight:900}
    .amount-red{color:#dc2626}
    .amount-green{color:#16a34a}
    .bank-box{border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-top:24px;background:#f8fafc}
    .bank-box h4{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;font-weight:700;margin-bottom:10px}
    .bank-row{display:flex;justify-content:space-between;font-size:12px;padding:4px 0}
    .footer{margin-top:48px;text-align:center;border-top:1px solid #e2e8f0;padding-top:16px}
    .footer p{font-size:9px;text-transform:uppercase;letter-spacing:3px;color:#94a3b8;font-weight:700}
    .status-badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px}
    .paid{background:#dcfce7;color:#15803d}
    .pending{background:#fee2e2;color:#b91c1c}
    .partial{background:#fef3c7;color:#b45309}
    @media print{body{padding:24px}}
  </style>
</head>
<body>
  <div class="top">
    <div>
      <div class="brand-name">${shop.business_name || 'TradersPro'}</div>
      ${shop.tagline ? `<div class="brand-tag">${shop.tagline}</div>` : ''}
      <div class="brand-addr">
        ${shop.address ? shop.address + '<br>' : ''}
        ${shop.city || ''}${shop.city && shop.state ? ', ' : ''}${shop.state || ''}${(shop.city || shop.state) ? ', India' : ''}
        ${shop.phone ? '<br>Phone: ' + shop.phone : ''}
        ${shop.gst_number ? ' &bull; GST: ' + shop.gst_number : ''}
      </div>
    </div>
    <div class="invoice-meta">
      <div class="label">Business Statement</div>
      <div style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-top:12px">Invoice</div>
      <div class="period">#${sale.invoice_number || 'N/A'}</div>
      <div class="generated">Generated: ${now}</div>
      <div style="margin-top:10px"><span class="status-badge ${sale.payment_status}">${(sale.payment_status || '').toUpperCase()}</span></div>
    </div>
  </div>

  <hr class="divider">

  <table>
    <thead>
      <tr>
        <th style="width:40%">Key Metric</th>
        <th style="text-align:center">Customer</th>
        <th style="text-align:center">Date</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="key-metric">Invoice Total</div>
          <div class="amount-big">₹${total.toLocaleString('en-IN')}</div>
        </td>
        <td style="text-align:center;font-weight:700;color:#1e293b">${sale.tp_customers?.name || 'Walk-in Customer'}</td>
        <td style="text-align:center;font-weight:600;color:#64748b">${date}</td>
        <td>
          <div class="amount-big">₹${total.toLocaleString('en-IN')}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="key-metric">Amount Collected</div>
          <div class="amount-big amount-green">₹${paid.toLocaleString('en-IN')}</div>
        </td>
        <td></td>
        <td></td>
        <td><div class="amount-big amount-green">+₹${paid.toLocaleString('en-IN')}</div></td>
      </tr>
      <tr>
        <td>
          <div class="key-metric">Outstanding Balance</div>
          <div class="amount-big ${balance > 0 ? 'amount-red' : 'amount-green'}">₹${balance.toLocaleString('en-IN')}</div>
        </td>
        <td></td>
        <td></td>
        <td><div class="amount-big ${balance > 0 ? 'amount-red' : 'amount-green'}">${balance > 0 ? '-' : ''}₹${balance.toLocaleString('en-IN')}</div></td>
      </tr>
    </tbody>
  </table>

  ${(shop.bank_name || shop.account_number || shop.upi_id) ? `
  <div class="bank-box">
    <h4>Payment Details</h4>
    ${shop.bank_name ? `<div class="bank-row"><span>Bank</span><span>${shop.bank_name}</span></div>` : ''}
    ${shop.account_number ? `<div class="bank-row"><span>Account No.</span><span>${shop.account_number}</span></div>` : ''}
    ${shop.ifsc_code ? `<div class="bank-row"><span>IFSC Code</span><span>${shop.ifsc_code}</span></div>` : ''}
    ${shop.upi_id ? `<div class="bank-row"><span>UPI ID</span><span>${shop.upi_id}</span></div>` : ''}
  </div>` : ''}

  <div class="footer">
    <p>Official Statement &bull; ${shop.business_name || 'TradersPro'} Edition</p>
  </div>
</body>
</html>`

    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500) }
  }

  const handleWhatsApp = (sale: any) => {
    const phone = sale.tp_customers?.phone?.replace(/\D/g, '')
    const name = sale.tp_customers?.name || 'Customer'
    const date = new Date(sale.invoice_date).toLocaleDateString('en-IN')
    const total = parseFloat(sale.total_amount || 0).toLocaleString('en-IN')
    const paid = parseFloat(sale.amount_paid || 0).toLocaleString('en-IN')
    const balance = getBalance(sale).toLocaleString('en-IN')
    const shop = shopProfile?.business_name || 'TradersPro'

    const msg = `*🧾 Invoice from ${shop}*\n\nHello *${name}*,\n\n📋 Invoice #: ${sale.invoice_number || 'N/A'}\n📅 Date: ${date}\n💰 Total: ₹${total}\n✅ Paid: ₹${paid}\n⚠️ Balance Due: ₹${balance}\n📌 Status: ${(sale.payment_status || '').toUpperCase()}\n\n${getBalance(sale) > 0 ? `Please clear your balance of *₹${balance}* at your earliest convenience.` : `Thank you for the full payment! 🙏`}\n\n_— ${shop}_`

    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  const todaysSales = sales
    .filter(s => new Date(s.invoice_date).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0)
  
  const totalPending = sales.reduce((acc, curr) => acc + getBalance(curr), 0)
  
  const totalInvoiced = sales.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0)

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sales & Billing</h2>
        </div>
        <Link href="/sales/new" className="tp-button-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Sale
        </Link>
      </div>

      {/* Row of 3 Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-[#0D9B8A]"><Plus className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Sales</p>
              <p className="text-xl font-black text-slate-900">₹{todaysSales.toLocaleString('en-IN')}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-amber-50 p-3 rounded-full text-amber-600"><TrendingDown className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending</p>
              <p className="text-xl font-black text-amber-600">₹{totalPending.toLocaleString('en-IN')}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-[#0D9B8A]"><Plus className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Invoiced</p>
              <p className="text-xl font-black text-slate-900">₹{totalInvoiced.toLocaleString('en-IN')}</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest overflow-x-auto">
          {['All', 'Paid', 'Partial', 'Pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${filter === f ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search invoice or customer..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all" />
        </div>
      </div>

      <div className="tp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50/50 tracking-widest">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Paid</th>
                <th className="px-6 py-4 text-right">Balance Due</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSales.map(sale => {
                const balance = getBalance(sale)
                return (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <Link href={`/sales/${sale.id}`} className="font-bold text-[#0D9488] hover:underline">#{sale.invoice_number || '—'}</Link>
                    </td>
                    <td className="px-6 py-5 text-slate-500 font-medium">{new Date(sale.invoice_date).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {(sale.tp_customers?.name || 'W')[0].toUpperCase()}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900">{sale.tp_customers?.name || 'Walk-in'}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-slate-900">₹{parseFloat(sale.total_amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-5 text-right font-bold text-emerald-600">₹{parseFloat(sale.amount_paid || 0).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-5 text-right font-bold text-rose-600">₹{balance.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        sale.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : sale.payment_status === 'partial' ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-rose-50 text-red-600 border-red-100'}`}>
                        {sale.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {sale.payment_status !== 'paid' && (
                          <button onClick={() => openPaymentModal(sale)}
                            className="px-3 py-1.5 text-[10px] font-bold uppercase text-[#0D9488] hover:bg-[#0D9488]/5 rounded-lg transition-all">
                            Pay
                          </button>
                        )}
                        <button onClick={() => handlePrintBill(sale)}
                          className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                          Print
                        </button>
                        <button onClick={() => handleWhatsApp(sale)}
                          className="px-3 py-1.5 text-[10px] font-bold uppercase text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                          Share
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredSales.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No invoices found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Record Payment</p>
                  <h3 className="text-xl font-black mt-1">{paymentModal.tp_customers?.name || 'Walk-in'}</h3>
                </div>
                <button onClick={() => setPaymentModal(null)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total', val: parseFloat(paymentModal.total_amount || 0) },
                  { label: 'Paid', val: parseFloat(paymentModal.amount_paid || 0) },
                  { label: 'Due', val: getBalance(paymentModal), highlight: true },
                ].map(({ label, val, highlight }) => (
                  <div key={label} className={`rounded-xl p-3 ${highlight ? 'bg-white/20 border border-white/30' : 'bg-white/10'}`}>
                    <p className="text-[10px] text-emerald-100 font-bold uppercase">{label}</p>
                    <p className="font-black text-sm mt-1">₹{val.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6">
              {paymentSuccess ? (
                <div className="flex flex-col items-center py-6 gap-3">
                  <CheckCircle className="h-14 w-14 text-emerald-500" />
                  <p className="font-black text-slate-900 text-lg">Payment Recorded!</p>
                  <p className="text-slate-400 text-sm">Invoice updated successfully.</p>
                </div>
              ) : (
                <>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Amount Receiving Now (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">₹</span>
                    <input type="number" min={1} value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                      placeholder={`Max ₹${getBalance(paymentModal).toLocaleString('en-IN')}`}
                      className="w-full pl-10 pr-4 py-4 border-2 border-slate-200 rounded-xl text-lg font-black focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      autoFocus />
                  </div>
                  <div className="flex gap-2 mt-3">
                    {[25, 50, 100].map(pct => {
                      const amt = Math.round(getBalance(paymentModal) * pct / 100)
                      return (
                        <button key={pct} onClick={() => setPaymentAmount(amt.toString())}
                          className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:border-emerald-200 transition-all">
                          {pct}% (₹{amt.toLocaleString('en-IN')})
                        </button>
                      )
                    })}
                    <button onClick={() => setPaymentAmount(getBalance(paymentModal).toString())}
                      className="flex-1 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-200 transition-all">
                      Full
                    </button>
                  </div>
                  <button onClick={handleRecordPayment} disabled={paymentLoading || !paymentAmount}
                    className="w-full mt-5 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
                    {paymentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <IndianRupee className="h-4 w-4" />}
                    {paymentLoading ? 'Saving...' : 'Confirm Payment'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
