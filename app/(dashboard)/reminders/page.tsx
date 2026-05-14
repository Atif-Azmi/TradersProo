'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, CheckSquare, Square, Search, Loader2, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RemindersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  const [message, setMessage] = useState('Dear [Customer Name],\nThis is a reminder from [Business Name].\nYour outstanding balance is ₹[Amount].\nPlease clear the payment at your earliest convenience.\nContact: [Phone]\nThank you!')

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [custRes, profileRes] = await Promise.all([
      supabase.from('tp_customer_balances').select('*').gt('outstanding_dues', 0),
      supabase.from('tp_profile').select('*').eq('user_id', user.id).single()
    ])

    setCustomers(custRes.data || [])
    setBusinessProfile(profileRes.data)
    setLoading(false)
  }

  const toggleSelectAll = () => {
    if (selected.length === filteredCustomers.length) {
      setSelected([])
    } else {
      setSelected(filteredCustomers.map(c => c.customer_id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  const filteredCustomers = customers.filter(c => 
    c.customer_name?.toLowerCase().includes(search.toLowerCase()) || 
    c.phone?.includes(search)
  )

  const getReplacedMessage = (customer: any) => {
    if (!customer) return message
    return message
      .replaceAll('[Customer Name]', customer.customer_name || 'Customer')
      .replaceAll('[Business Name]', businessProfile?.business_name || 'F.K.S. Traders')
      .replaceAll('[Amount]', parseFloat(customer.outstanding_dues || 0).toFixed(2))
      .replaceAll('[Phone]', businessProfile?.phone || '')
  }

  const handleSendReminders = () => {
    const selectedCustomers = customers.filter(c => selected.includes(c.customer_id))
    
    selectedCustomers.forEach((c, index) => {
      setTimeout(() => {
        const finalMsg = getReplacedMessage(c)
        const phone = c.phone?.replace(/\D/g, '')
        if (phone) {
          window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(finalMsg)}`, '_blank')
        }
      }, index * 1000)
    })
  }

  const totalDues = filteredCustomers.reduce((acc, c) => acc + parseFloat(c.outstanding_dues), 0)
  const firstSelectedCustomer = customers.find(c => c.customer_id === selected[0])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bulk Reminders</h2>
          <p className="text-muted-foreground text-sm mt-1">Send payment reminders via WhatsApp to customers with pending dues.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         {/* Left Side: Customers List */}
         <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col max-h-[600px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div className="relative w-full">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <input
                   type="text"
                   placeholder="Search customers..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                 />
               </div>
            </div>
            
            <div className="p-3 border-b border-slate-100 bg-white flex items-center justify-between">
               <button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  {selected.length === filteredCustomers.length && filteredCustomers.length > 0 ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-slate-300" />}
                  Select All ({filteredCustomers.length})
               </button>
               <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">Total Pending: ₹{totalDues.toLocaleString()}</span>
            </div>

            <div className="overflow-y-auto flex-1 p-2">
               {loading ? (
                 <div className="p-8 text-center text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    Loading customers...
                 </div>
               ) : (
                 filteredCustomers.map(customer => (
                    <div key={customer.customer_id} onClick={() => toggleSelect(customer.customer_id)} className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer border transition-colors ${selected.includes(customer.customer_id) ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                       <div className="flex items-center gap-3">
                          {selected.includes(customer.customer_id) ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-slate-300" />}
                          <div>
                             <p className="font-medium text-slate-900">{customer.customer_name}</p>
                             <p className="text-xs text-slate-500">{customer.phone}</p>
                          </div>
                       </div>
                       <span className="font-bold text-red-600">₹{parseFloat(customer.outstanding_dues).toFixed(2)}</span>
                    </div>
                 ))
               )}
            </div>
         </div>

         {/* Right Side: Message Template & Preview */}
         <div className="bg-white rounded-xl border shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-semibold text-slate-900">
                  {selected.length === 1 ? `Preview for ${firstSelectedCustomer?.customer_name}` : 'Message Template'}
               </h3>
               <div className="flex gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">LIVE PREVIEW</span>
               </div>
            </div>

            <div className="mb-4 text-[10px] text-slate-400 bg-slate-50 p-2 rounded border border-slate-200">
               Variables: [Customer Name], [Business Name], [Amount], [Phone]
            </div>
            
            {/* Template Editor */}
            <label className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Edit Template</label>
            <textarea
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               className="w-full h-32 p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4 bg-slate-50/50"
               placeholder="Enter message template..."
            />

            {/* Live Preview Box */}
            <label className="text-[10px] font-bold text-slate-400 mb-1 uppercase flex items-center gap-1">
               <Eye className="h-3 w-3" /> Resulting Message
            </label>
            <div className="flex-1 min-h-[150px] p-4 bg-green-50/30 border border-green-100 rounded-lg text-sm text-slate-700 whitespace-pre-wrap italic">
               {selected.length > 0 ? getReplacedMessage(firstSelectedCustomer) : 'Select a customer to see live preview...'}
            </div>

            <div className="mt-6">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-700">{selected.length} customers selected</span>
               </div>
               <button 
                  onClick={handleSendReminders}
                  disabled={selected.length === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <MessageCircle className="h-5 w-5" />
                  Send WhatsApp to {selected.length === 1 ? firstSelectedCustomer?.customer_name : 'Selected'}
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
