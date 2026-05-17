'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Store, Loader2, Check, X, Trash2, AlertCircle, TrendingDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface RetailClientProps {
  products: any[]
  customers: any[]
  todaySales: any[]
}

export default function RetailClient({ products, customers, todaySales }: RetailClientProps) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Find a default Walk-in / Retail customer
  const defaultCustomer = customers.find(c => 
    c.name.toLowerCase().includes('walk-in') || 
    c.name.toLowerCase().includes('retail') ||
    c.name.toLowerCase().includes('cash')
  ) || customers[0]

  // Form states
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [paymentMode, setPaymentMode] = useState('cash')
  const [gstPercent, setGstPercent] = useState(18)
  const [notes, setNotes] = useState('Quick Retail Sale')
  const [items, setItems] = useState<any[]>([
    { id: Date.now(), product_id: '', name: '', qty: 1, rate: 0, unit: 'pcs', total: 0 }
  ])

  // Initialize selectedCustomerId once defaultCustomer is found
  useEffect(() => {
    if (defaultCustomer) {
      setSelectedCustomerId(defaultCustomer.id)
    }
  }, [customers])

  // Reset modal form
  const resetForm = () => {
    setSelectedCustomerId(defaultCustomer?.id || '')
    setPaymentMode('cash')
    setGstPercent(18)
    setNotes('Quick Retail Sale')
    setItems([{ id: Date.now(), product_id: '', name: '', qty: 1, rate: 0, unit: 'pcs', total: 0 }])
  }

  // Calculate line item totals
  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === 'product_id') {
          const prod = products.find(p => p.id === value)
          if (prod) {
            updated.name = prod.name
            updated.rate = prod.selling_rate
            updated.unit = prod.unit
          }
        }
        updated.total = (updated.qty || 0) * (updated.rate || 0)
        return updated
      }
      return item
    }))
  }

  const subtotal = items.reduce((acc, item) => acc + (item.total || 0), 0)
  const gstAmount = subtotal * (gstPercent / 100)
  const grandTotal = subtotal + gstAmount

  // Handle saving the retail sale
  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomerId) {
      alert('Please select a customer')
      return
    }
    if (items.some(i => !i.product_id)) {
      alert('Please select a product for all items')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // 1. Generate Invoice Number via RPC
      const { data: invoiceNumber, error: rpcError } = await supabase.rpc('tp_generate_invoice_number', { p_user_id: user.id })
      if (rpcError) throw rpcError

      const invoiceDate = new Date().toISOString().split('T')[0]

      // 2. Create Sale Header
      const { data: sale, error: saleError } = await supabase
        .from('tp_sales')
        .insert({
          customer_id: selectedCustomerId,
          invoice_number: invoiceNumber,
          invoice_date: invoiceDate,
          due_date: null,
          subtotal: subtotal,
          gst_percent: gstPercent,
          gst_amount: gstAmount,
          total_amount: grandTotal,
          amount_paid: grandTotal, // Retail is fully paid by default
          payment_mode: paymentMode,
          payment_status: 'paid',
          notes: notes
        })
        .select()
        .single()

      if (saleError) throw saleError

      // 3. Create Sale Items
      const saleItems = items.map(item => ({
        sale_id: sale.id,
        product_id: item.product_id,
        product_name: item.name,
        unit: item.unit,
        quantity: item.qty,
        rate: item.rate,
        discount_percent: 0,
        gst_percent: gstPercent
      }))

      const { error: itemsError } = await supabase.from('tp_sale_items').insert(saleItems)
      if (itemsError) throw itemsError

      // 4. Record Payment Received (fully paid)
      const { error: paymentError } = await supabase.from('tp_payments_received').insert({
        customer_id: selectedCustomerId,
        sale_id: sale.id,
        type: 'payment',
        amount: grandTotal,
        payment_mode: paymentMode,
        payment_date: invoiceDate
      })

      if (paymentError) throw paymentError

      setShowModal(false)
      resetForm()
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Dashboard calculations
  const totalToday = todaySales.reduce((acc, s) => acc + (s.total_amount || 0), 0)
  const cashToday = todaySales.reduce((acc, s) => acc + (s.payment_mode === 'cash' ? (s.total_amount || 0) : 0), 0)
  const upiToday = todaySales.reduce((acc, s) => acc + (['upi', 'online'].includes(s.payment_mode) ? (s.total_amount || 0) : 0), 0)

  // Filter today's sales
  const filteredSales = todaySales.filter(sale => {
    const customerName = sale.tp_customers?.name || ''
    const matchSearch = customerName.toLowerCase().includes(search.toLowerCase()) || 
      sale.invoice_number.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Retail Sales</h2>
        </div>
        <div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="tp-button-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Retail Sale
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-[#0D9B8A]"><Store className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Sales</p>
              <p className="text-xl font-black text-slate-900">₹{totalToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-emerald-600"><span className="text-[#0D9B8A] font-black">₹</span></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cash Collection</p>
              <p className="text-xl font-black text-emerald-600">₹{cashToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-blue-50 p-3 rounded-full text-blue-600"><span className="text-blue-600 font-black text-[10px] tracking-widest px-1">UPI</span></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UPI / Online</p>
              <p className="text-xl font-black text-blue-600">₹{upiToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search sales..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
          />
        </div>
      </div>

      <div className="tp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50/50 tracking-widest">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {filteredSales.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="px-6 py-20 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      No transactions recorded today
                   </td>
                 </tr>
               ) : (
                 filteredSales.map((sale) => {
                   const time = new Date(sale.created_at).toLocaleTimeString('en-US', {
                     hour: '2-digit',
                     minute: '2-digit',
                     hour12: true
                   })
                   const productsList = sale.tp_sale_items
                     ?.map((item: any) => `${item.product_name} (${item.quantity} ${item.unit || 'pcs'})`)
                     .join(', ') || 'N/A'

                   return (
                     <tr key={sale.id} className="hover:bg-slate-50/50 transition-all group">
                       <td className="px-6 py-5 font-medium text-slate-600">{time}</td>
                       <td className="px-6 py-5 font-bold text-slate-900">{sale.invoice_number}</td>
                       <td className="px-6 py-5 font-medium text-slate-600">{sale.tp_customers?.name || 'Walk-in'}</td>
                       <td className="px-6 py-5 text-slate-500 max-w-xs truncate">{productsList}</td>
                       <td className="px-6 py-5 text-right font-black text-slate-900">₹{sale.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                       <td className="px-6 py-5">
                         <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                           sale.payment_mode === 'cash' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                         }`}>
                           {sale.payment_mode}
                         </span>
                       </td>
                     </tr>
                   )
                 })
               )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Retail Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">New Retail Sale</h3>
                <p className="text-xs text-slate-400 font-medium">Quick walk-in billing dashboard</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveSale} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Customer Selection *</label>
                  <select 
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none bg-white transition-all font-medium"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Payment Method</label>
                  <select 
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="cash">Cash Payment</option>
                    <option value="upi">UPI / Digital</option>
                    <option value="online">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">GST Rate (%)</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      step="any"
                      placeholder="Custom"
                      value={gstPercent}
                      onChange={(e) => setGstPercent(parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-2 border border-slate-200 rounded-xl text-sm font-bold text-center focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {[0, 5, 8, 12, 18, 28].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setGstPercent(rate)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-black tracking-tighter uppercase transition-all cursor-pointer ${
                            gstPercent === rate 
                              ? 'bg-primary text-white shadow-md shadow-green-100' 
                              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sale Items</h4>
                  <button 
                    type="button"
                    onClick={() => setItems([...items, { id: Date.now(), product_id: '', name: '', qty: 1, rate: 0, unit: 'pcs', total: 0 }])}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:text-green-600 transition-all"
                  >
                    <Plus className="h-3 w-3" /> Add Item
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-3">Product Description</th>
                        <th className="px-4 py-3 w-20 text-center">Qty</th>
                        <th className="px-4 py-3 w-28 text-right">Rate</th>
                        <th className="px-4 py-3 w-28 text-right">Total</th>
                        <th className="px-2 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="p-2">
                            <select 
                              value={item.product_id}
                              onChange={(e) => updateItem(item.id, 'product_id', e.target.value)}
                              required
                              className="w-full px-3 py-1.5 border border-slate-100 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white font-medium text-xs"
                            >
                              <option value="">Select Product</option>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (Stock: {p.current_stock})</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input 
                              type="number" 
                              min="1"
                              value={item.qty}
                              onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-1.5 border border-slate-100 rounded-lg focus:ring-2 focus:ring-primary outline-none font-bold text-center text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="number" 
                              min="0" 
                              step="any"
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-1.5 border border-slate-100 rounded-lg focus:ring-2 focus:ring-primary outline-none font-bold text-right text-xs"
                            />
                          </td>
                          <td className="px-4 py-2 text-right font-black text-slate-900 text-xs">
                            ₹{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-2 text-center">
                            <button 
                              type="button"
                              onClick={() => setItems(items.filter(i => i.id !== item.id))}
                              disabled={items.length === 1}
                              className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-0 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Remarks / Notes</label>
                <textarea 
                  rows={2} 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                ></textarea>
              </div>

              {/* Total Calculation */}
              <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>GST ({gstPercent}% STANDARD / CUSTOM)</span>
                  <span className="text-slate-900">₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Grand Total</span>
                  <span className="font-black text-slate-900 text-xl tracking-tighter">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 shadow-lg shadow-green-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Finalize counter Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
