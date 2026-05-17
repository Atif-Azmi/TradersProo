'use client'

import { useState } from 'react'
import { 
  Plus, Search, Download, ArrowDownCircle, ArrowUpCircle, 
  Wallet, Landmark, History, MoreVertical, X, Loader2, Check, Trash2, Printer
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdvancesClientProps {
  initialPayments: any[]
  customers: any[]
}

export default function AdvancesClient({ initialPayments, customers }: AdvancesClientProps) {
  const [payments, setPayments] = useState<any[]>(initialPayments)
  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState('All')
  const [filterType, setFilterType] = useState('All')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  // Form states
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [type, setType] = useState('payment') // payment or advance
  const [amount, setAmount] = useState('')
  const [paymentMode, setPaymentMode] = useState('cash') // cash, upi, online
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [referenceNumber, setReferenceNumber] = useState('')
  const [note, setNote] = useState('')

  const supabase = createClient()
  const router = useRouter()

  // Reset modal form
  const resetForm = () => {
    setSelectedCustomerId('')
    setType('payment')
    setAmount('')
    setPaymentMode('cash')
    setPaymentDate(new Date().toISOString().split('T')[0])
    setReferenceNumber('')
    setNote('')
  }

  // Handle saving the transaction
  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomerId) {
      alert('Please select a customer')
      return
    }
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('tp_payments_received')
        .insert({
          customer_id: selectedCustomerId,
          type: type,
          amount: parseFloat(amount),
          payment_mode: paymentMode,
          payment_date: paymentDate,
          reference_number: referenceNumber || null,
          note: note || null
        })

      if (error) throw error

      setShowAddModal(false)
      resetForm()
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Handle deleting a transaction
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction? This will automatically restore the customer\'s outstanding balance.')) return

    try {
      const { error } = await supabase
        .from('tp_payments_received')
        .delete()
        .eq('id', id)

      if (error) throw error
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to delete transaction')
    }
  }

  // Summary statistics (calculated directly from active synced data)
  const cashInHand = initialPayments
    .filter(p => p.payment_mode === 'cash' || p.payment_mode === 'Cash')
    .reduce((acc, p) => acc + (p.amount || 0), 0)

  const bankBalance = initialPayments
    .filter(p => ['upi', 'online', 'bank', 'UPI', 'Bank', 'Online'].includes(p.payment_mode))
    .reduce((acc, p) => acc + (p.amount || 0), 0)

  const advancesHeld = initialPayments
    .filter(p => p.type === 'advance' || p.type === 'Advance')
    .reduce((acc, p) => acc + (p.amount || 0), 0)

  // Filter transaction list
  const filteredPayments = initialPayments.filter(p => {
    const customerName = p.tp_customers?.name || ''
    const noteText = p.note || ''
    const refNum = p.reference_number || ''
    
    const matchesSearch = 
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      noteText.toLowerCase().includes(search.toLowerCase()) ||
      refNum.toLowerCase().includes(search.toLowerCase())

    const matchesMode = filterMode === 'All' || p.payment_mode?.toLowerCase() === filterMode.toLowerCase()
    const matchesType = filterType === 'All' || p.type?.toLowerCase() === filterType.toLowerCase()

    return matchesSearch && matchesMode && matchesType
  })

  // Open transaction receipt preview for printing
  const openReceipt = (txn: any) => {
    setSelectedReceipt(txn)
    setShowReceiptModal(true)
    setActionMenuOpen(null)
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Advances & Payments</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="tp-button-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Payment / Advance
          </button>
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-emerald-600"><Wallet className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cash in Hand</p>
              <p className="text-xl font-black text-slate-900">₹{cashInHand.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-emerald-600"><Landmark className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Balance</p>
              <p className="text-xl font-black text-slate-900">₹{bankBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-amber-50 p-3 rounded-full text-amber-600"><History className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Advances Held</p>
              <p className="text-xl font-black text-slate-900">₹{advancesHeld.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
      </div>

      {/* FILTER & ACTION CARD */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
          />
        </div>
        <div className="flex gap-4 flex-wrap text-[10px] font-black uppercase tracking-widest items-center">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Mode:</span>
            {['All', 'Cash', 'UPI', 'Online'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${filterMode === mode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Type:</span>
            {['All', 'Payment', 'Advance'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${filterType === t ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DATA LIST */}
      <div className="tp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50/50 tracking-widest">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {(txn.tp_customers?.name || 'W')[0].toUpperCase()}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900">{txn.tp_customers?.name || 'Walk-in'}</p>
                            {txn.reference_number && <p className="text-[10px] font-medium text-slate-400 uppercase">Ref: {txn.reference_number}</p>}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                         txn.type === 'advance' 
                           ? 'bg-amber-50 text-amber-600 border-amber-100' 
                           : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>{txn.type}</span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-slate-600 font-medium px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-tight">{txn.payment_mode}</span>
                    </td>
                    <td className="px-6 py-5 text-slate-600 font-medium">{txn.payment_date}</td>
                    <td className="px-6 py-5 text-right font-black text-slate-900">₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex justify-end gap-2">
                         <button onClick={() => openReceipt(txn)} className="px-3 py-1.5 text-[10px] font-bold uppercase text-[#0D9488] hover:bg-[#0D9488]/5 rounded-lg transition-all">Receipt</button>
                         <button onClick={() => handleDeleteTransaction(txn.id)} className="px-3 py-1.5 text-[10px] font-bold uppercase text-red-600 hover:bg-rose-50 rounded-lg transition-all">Delete</button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment / Advance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Add Ledger Flow</h3>
                <p className="text-xs text-slate-400 font-medium">Record a payment received or customer advance</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveTransaction} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Customer Selection *</label>
                <select 
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none bg-white transition-all font-medium"
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Transaction Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="payment">Payment Against Dues</option>
                    <option value="advance">Customer Advance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Payment Method</label>
                  <select 
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="cash">Cash Payment</option>
                    <option value="upi">UPI / Digital</option>
                    <option value="online">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Amount (₹) *</label>
                  <input 
                    type="number" 
                    required 
                    min="0.01"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Transaction Date</label>
                  <input 
                    type="date" 
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Reference Number (for Bank / UPI)</label>
                <input 
                  type="text" 
                  placeholder="E.g. Transaction ID, Check #, etc."
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Internal Note / Remarks</label>
                <textarea 
                  rows={2} 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional details..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
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
                  Record Flow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 print:hidden">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Receipt Preview</span>
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Printable Area */}
            <div id="receipt-print-area" className="p-8 space-y-6 bg-white font-sans text-slate-800">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-black tracking-tight text-slate-900">F.K.S. TRADERS</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Official Payment Receipt</p>
              </div>
              
              <div className="border-y border-dashed border-slate-200 py-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase tracking-widest font-bold text-[10px]">Receipt ID:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase tracking-widest font-bold text-[10px]">Date:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.payment_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase tracking-widest font-bold text-[10px]">Payment Mode:</span>
                  <span className="font-bold text-slate-900 uppercase">{selectedReceipt.payment_mode}</span>
                </div>
                {selectedReceipt.reference_number && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase tracking-widest font-bold text-[10px]">Reference #:</span>
                    <span className="font-bold text-slate-900">{selectedReceipt.reference_number}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Received From</span>
                  <p className="text-base font-black text-slate-900">{selectedReceipt.tp_customers?.name || 'Walk-in Customer'}</p>
                  {selectedReceipt.tp_customers?.company_name && (
                    <p className="text-xs text-slate-500 font-bold">{selectedReceipt.tp_customers.company_name}</p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Transaction Type</span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                    selectedReceipt.type === 'advance' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedReceipt.type}
                  </span>
                </div>

                {selectedReceipt.note && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Note / Remarks</span>
                    <p className="text-xs text-slate-600 font-medium italic">"{selectedReceipt.note}"</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Amount Received</span>
                <span className="text-3xl font-black text-slate-900">₹{selectedReceipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="pt-4 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Thank you for your business!</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex gap-4 print:hidden">
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
