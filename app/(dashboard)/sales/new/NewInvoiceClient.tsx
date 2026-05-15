'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowLeft, Loader2, Check, Printer } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NewInvoiceClientProps {
  initialCustomers: any[]
  initialProducts: any[]
}

export default function NewInvoiceClient({ initialCustomers, initialProducts }: NewInvoiceClientProps) {
  const [loading, setLoading] = useState(false)
  const [customers] = useState<any[]>(initialCustomers)
  const [products] = useState<any[]>(initialProducts)
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
      // Rule #8: DO NOT manually set user_id
      const { data: sale, error: saleError } = await supabase
        .from('tp_sales')
        .insert({
          customer_id: selectedCustomerId,
          invoice_number: invoiceNumber,
          invoice_date: invoiceDate,
          due_date: dueDate || null,
          subtotal: subtotal,
          gst_percent: 0,
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
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 print:p-0">
      <div className="flex items-center gap-4 print:hidden">
        <Link href="/sales" className="p-2 -ml-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">New Invoice</h2>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100 p-8 sm:p-12 print:shadow-none print:border-0 print:p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Customer Selection *</label>
            <div className="flex gap-2">
              <select 
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none bg-white transition-all font-medium"
              >
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</option>
                ))}
              </select>
              <Link href="/customers" className="px-4 py-3 bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 whitespace-nowrap print:hidden flex items-center">
                + New
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Invoice Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Due Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-12 overflow-x-auto">
           <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50/50 tracking-widest">
                 <tr>
                    <th className="px-4 py-4 w-2/5">Product Description</th>
                    <th className="px-4 py-4 w-24">Qty</th>
                    <th className="px-4 py-4 w-24">Unit</th>
                    <th className="px-4 py-4 w-32">Rate (₹)</th>
                    <th className="px-4 py-4 w-32">GST %</th>
                    <th className="px-4 py-4 text-right">Total (₹)</th>
                    <th className="px-2 py-4 w-10 print:hidden"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {items.map((item) => (
                    <tr key={item.id} className="group">
                       <td className="px-2 py-4">
                          <select 
                            value={item.product_id}
                            onChange={(e) => updateItem(item.id, 'product_id', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white font-medium"
                          >
                            <option value="">Select Product</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                       </td>
                       <td className="px-2 py-4">
                          <input 
                            type="number" 
                            min="0.001" 
                            step="any"
                            value={item.qty} 
                            onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:ring-2 focus:ring-primary outline-none font-bold text-center" 
                          />
                       </td>
                       <td className="px-2 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">{item.unit}</td>
                       <td className="px-2 py-4">
                          <input 
                            type="number" 
                            min="0" 
                            step="any"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:ring-2 focus:ring-primary outline-none font-bold text-right" 
                          />
                       </td>
                       <td className="px-2 py-4">
                          <select 
                            value={item.taxPercent}
                            onChange={(e) => updateItem(item.id, 'taxPercent', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white font-bold"
                          >
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                       </td>
                       <td className="px-4 py-4 text-right font-black text-slate-900">
                          {item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                       </td>
                       <td className="px-2 py-4 text-center print:hidden">
                          <button 
                            onClick={() => setItems(items.filter(i => i.id !== item.id))}
                            disabled={items.length === 1}
                            className="p-2 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-0 transition-all"
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
              className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-green-600 print:hidden transition-all"
            >
              <Plus className="h-4 w-4" /> Add Line Item
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-50 pt-12">
           <div className="space-y-6">
              <div className="print:hidden">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Payment Method</label>
                 <select 
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm mb-4 bg-white font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="credit">Credit Sale (Pending)</option>
                    <option value="cash">Cash Payment</option>
                    <option value="upi">UPI / Digital</option>
                    <option value="online">Bank Transfer</option>
                 </select>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      placeholder="Amount Received Today" 
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-black focus:ring-2 focus:ring-primary outline-none transition-all" 
                    />
                 </div>
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Remarks / Notes</label>
                 <textarea 
                    rows={3} 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. Thank you for your business!" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                  ></textarea>
              </div>
           </div>

           <div className="bg-slate-50/50 p-8 rounded-[2rem] space-y-4 print:bg-white print:border-t-2 print:border-slate-900 print:rounded-none">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                 <span className="text-slate-400">Subtotal</span>
                 <span className="text-slate-900">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                 <span className="text-slate-400">Tax Total (GST)</span>
                 <span className="text-slate-900">₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-slate-200 pt-6 flex justify-between items-center">
                 <span className="font-black text-slate-900 uppercase tracking-[0.2em] text-sm">Grand Total</span>
                 <span className="font-black text-slate-900 text-3xl tracking-tighter">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-red-500 pt-2 print:hidden">
                 <span>Remaining Balance</span>
                 <span>₹{(totalAmount - parseFloat(amountPaid || '0')).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
           </div>
        </div>

        <div className="mt-12 flex gap-4 justify-end border-t border-slate-50 pt-8 print:hidden">
           <button 
              onClick={() => router.push('/sales')}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
            >
             Discard
           </button>
           <button 
              onClick={() => handleSaveInvoice(true)}
              disabled={loading}
              className="px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all disabled:opacity-50 flex items-center gap-2"
           >
             <Printer className="h-4 w-4" /> Save & Print
           </button>
           <button 
              onClick={() => handleSaveInvoice(false)}
              disabled={loading}
              className="px-8 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-green-600 shadow-xl shadow-green-100 transition-all disabled:opacity-50 flex items-center gap-2"
           >
             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
             Finalize Invoice
           </button>
        </div>
      </div>
    </div>
  )
}
