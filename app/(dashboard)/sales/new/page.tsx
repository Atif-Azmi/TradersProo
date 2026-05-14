'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Search, ArrowLeft, Loader2, Check, Printer } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreateInvoicePage() {
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const router = useRouter()
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<any[]>([
    { id: Date.now(), product_id: '', name: '', qty: 1, unit: 'pcs', rate: 0, discPercent: 0, taxPercent: 18, total: 0 }
  ])
  const [notes, setNotes] = useState('')
  const [paymentMode, setPaymentMode] = useState('credit')
  const [amountPaid, setAmountPaid] = useState('0')

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setFetchingData(true)
    const [custRes, prodRes] = await Promise.all([
      supabase.from('tp_customers').select('id, name, company_name'),
      supabase.from('tp_products').select('id, name, selling_rate, unit')
    ])
    setCustomers(custRes.data || [])
    setProducts(prodRes.data || [])
    setFetchingData(false)
  }

  const calculateItemTotal = (item: any) => {
    const sub = item.qty * item.rate
    const disc = sub * (item.discPercent / 100)
    const afterDisc = sub - disc
    const tax = afterDisc * (item.taxPercent / 100)
    return afterDisc + tax
  }

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
        updated.total = calculateItemTotal(updated)
        return updated
      }
      return item
    }))
  }

  const totalAmount = items.reduce((acc, item) => acc + item.total, 0)
  const subtotal = items.reduce((acc, item) => {
     const sub = item.qty * item.rate
     return acc + (sub - (sub * (item.discPercent / 100)))
  }, 0)
  const taxAmount = totalAmount - subtotal

  const handleSaveInvoice = async (shouldPrint = false) => {
    if (!selectedCustomerId) {
      alert('Please select a customer')
      return
    }
    if (items.some(i => !i.product_id)) {
      alert('Please select products for all items')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // 1. Generate Invoice Number via RPC
      const { data: invoiceNumber, error: rpcError } = await supabase.rpc('tp_generate_invoice_number', { p_user_id: user.id })
      
      if (rpcError) throw rpcError

      // 2. Create Sale Header
      const { data: sale, error: saleError } = await supabase
        .from('tp_sales')
        .insert({
          user_id: user.id,
          customer_id: selectedCustomerId,
          invoice_number: invoiceNumber,
          invoice_date: invoiceDate,
          due_date: dueDate || null,
          subtotal: subtotal,
          gst_percent: 0, // calculated per item now
          gst_amount: taxAmount,
          total_amount: totalAmount,
          amount_paid: parseFloat(amountPaid),
          payment_mode: paymentMode,
          payment_status: parseFloat(amountPaid) >= totalAmount ? 'paid' : parseFloat(amountPaid) > 0 ? 'partial' : 'pending',
          notes: notes
        })
        .select()
        .single()

      if (saleError) throw saleError

      // 3. Create Sale Items
      const saleItems = items.map(item => ({
        user_id: user.id,
        sale_id: sale.id,
        product_id: item.product_id,
        product_name: item.name,
        unit: item.unit,
        quantity: item.qty,
        rate: item.rate,
        discount_percent: item.discPercent,
        gst_percent: item.taxPercent
      }))

      const { error: itemsError } = await supabase.from('tp_sale_items').insert(saleItems)
      if (itemsError) throw itemsError

      // 4. If payment was made, record it
      if (parseFloat(amountPaid) > 0) {
        await supabase.from('tp_payments_received').insert({
          user_id: user.id,
          customer_id: selectedCustomerId,
          sale_id: sale.id,
          type: 'payment',
          amount: parseFloat(amountPaid),
          payment_mode: paymentMode === 'credit' ? 'cash' : paymentMode,
          payment_date: invoiceDate
        })
      }

      if (shouldPrint) {
         window.print()
      }
      router.push('/sales')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 print:p-0">
      <div className="flex items-center gap-4 print:hidden">
        <Link href="/sales" className="p-2 -ml-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Create Invoice</h2>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 sm:p-8 print:shadow-none print:border-0 print:p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">Customer</label>
            <div className="flex gap-2">
              <select 
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
              >
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</option>
                ))}
              </select>
              <Link href="/customers" className="px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 whitespace-nowrap print:hidden">
                + New
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">Invoice Date</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border rounded-md text-sm" 
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">Due Date</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border rounded-md text-sm" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-8 overflow-x-auto">
           <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                 <tr>
                    <th className="px-4 py-3 font-semibold w-2/5">Product</th>
                    <th className="px-4 py-3 font-semibold w-24">Qty</th>
                    <th className="px-4 py-3 font-semibold w-24">Unit</th>
                    <th className="px-4 py-3 font-semibold w-32">Rate (₹)</th>
                    <th className="px-4 py-3 font-semibold w-32">GST %</th>
                    <th className="px-4 py-3 font-semibold text-right">Total (₹)</th>
                    <th className="px-2 py-3 w-10 print:hidden"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {items.map((item) => (
                    <tr key={item.id}>
                       <td className="px-2 py-3">
                          <select 
                            value={item.product_id}
                            onChange={(e) => updateItem(item.id, 'product_id', e.target.value)}
                            className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary outline-none bg-white"
                          >
                            <option value="">Select Product</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                       </td>
                       <td className="px-2 py-3">
                          <input 
                            type="number" 
                            min="0.001" 
                            step="any"
                            value={item.qty} 
                            onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary outline-none" 
                          />
                       </td>
                       <td className="px-2 py-3 text-slate-500">{item.unit}</td>
                       <td className="px-2 py-3">
                          <input 
                            type="number" 
                            min="0" 
                            step="any"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary outline-none" 
                          />
                       </td>
                       <td className="px-2 py-3">
                          <select 
                            value={item.taxPercent}
                            onChange={(e) => updateItem(item.id, 'taxPercent', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary outline-none bg-white"
                          >
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="7">7%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                       </td>
                       <td className="px-4 py-3 text-right font-medium text-slate-900">
                          {item.total.toFixed(2)}
                       </td>
                       <td className="px-2 py-3 text-center print:hidden">
                          <button 
                            onClick={() => setItems(items.filter(i => i.id !== item.id))}
                            disabled={items.length === 1}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 disabled:opacity-30"
                          >
                             <Trash2 className="h-4 w-4" />
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           <button 
              onClick={() => setItems([...items, { id: Date.now(), product_id: '', name: '', qty: 1, unit: 'pcs', rate: 0, discPercent: 0, taxPercent: 18, total: 0 }])}
              className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:text-green-600 print:hidden"
            >
              <Plus className="h-4 w-4" /> Add Item
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-8">
           <div>
              <div className="mb-4 print:hidden">
                 <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">Payment Details</label>
                 <select 
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm mb-3 bg-white"
                  >
                    <option value="credit">Credit Sale (Pending)</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="online">Online Transfer</option>
                 </select>
                 <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                    <input 
                      type="number" 
                      placeholder="Amount Received" 
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary outline-none" 
                    />
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">Notes</label>
                 <textarea 
                    rows={3} 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Thanks for your business..." 
                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary outline-none"
                  ></textarea>
              </div>
           </div>

           <div className="bg-slate-50 p-6 rounded-xl space-y-3 print:bg-white print:border-t-2 print:border-slate-900 print:rounded-none">
              <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Subtotal</span>
                 <span className="font-medium text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-slate-500">GST Amount</span>
                 <span className="font-medium text-slate-900">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                 <span className="font-bold text-slate-900">Total</span>
                 <span className="font-bold text-slate-900 text-lg">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600 font-medium print:hidden">
                 <span>Balance Due</span>
                 <span>₹{(totalAmount - parseFloat(amountPaid || '0')).toFixed(2)}</span>
              </div>
           </div>
        </div>

        <div className="mt-8 flex gap-4 justify-end border-t border-slate-200 pt-6 print:hidden">
           <button 
              onClick={() => router.push('/sales')}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50"
            >
             Cancel
           </button>
           <button 
              onClick={() => handleSaveInvoice(true)}
              disabled={loading}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 shadow-sm disabled:opacity-50 flex items-center gap-2"
           >
             <Printer className="h-4 w-4" /> Save & Print
           </button>
           <button 
              onClick={() => handleSaveInvoice(false)}
              disabled={loading}
              className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-green-600 shadow-sm disabled:opacity-50 flex items-center gap-2"
           >
             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
             Save Only
           </button>
        </div>
      </div>
    </div>
  )
}
