'use client'

import { useState } from 'react'
import { MessageCircle, CheckSquare, Square, Search, Loader2, Eye } from 'lucide-react'

interface RemindersClientProps {
  initialCustomers: any[]
  businessProfile: any
}

export default function RemindersClient({ initialCustomers, businessProfile }: RemindersClientProps) {
  const [customers] = useState<any[]>(initialCustomers)
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('Dear [Customer Name],\nThis is a reminder from [Business Name].\nYour outstanding balance is ₹[Amount].\nPlease clear the payment at your earliest convenience.\nContact: [Phone]\nThank you!')

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
      .replaceAll('[Business Name]', businessProfile?.business_name || 'Business')
      .replaceAll('[Amount]', parseFloat(customer.outstanding_dues || 0).toLocaleString('en-IN'))
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
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Recovery Hub</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Efficiently collect pending dues with automated WhatsApp reminders.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden flex flex-col max-h-[700px]">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div className="relative w-full">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <input
                   type="text"
                   placeholder="Search customers with dues..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                 />
               </div>
            </div>
            
            <div className="p-4 border-b border-slate-50 bg-white flex items-center justify-between">
               <button onClick={toggleSelectAll} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900">
                  {selected.length === filteredCustomers.length && filteredCustomers.length > 0 ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-slate-200" />}
                  Select All ({filteredCustomers.length})
               </button>
               <span className="text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100">Total: ₹{totalDues.toLocaleString('en-IN')}</span>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-3">
               {filteredCustomers.map(customer => (
                  <div key={customer.customer_id} onClick={() => toggleSelect(customer.customer_id)} className={`flex items-center justify-between p-4 rounded-[1.5rem] cursor-pointer border transition-all ${selected.includes(customer.customer_id) ? 'bg-green-50/50 border-green-200' : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm shadow-slate-50'}`}>
                     <div className="flex items-center gap-4">
                        {selected.includes(customer.customer_id) ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-slate-100" />}
                        <div>
                           <p className="font-bold text-slate-900">{customer.customer_name}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{customer.phone}</p>
                        </div>
                     </div>
                     <span className="font-black text-red-600 tracking-tight">₹{parseFloat(customer.outstanding_dues).toLocaleString('en-IN')}</span>
                  </div>
               ))}
               {filteredCustomers.length === 0 && (
                 <div className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                   No outstanding dues found
                 </div>
               )}
            </div>
         </div>

         <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100 p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-slate-900">
                  {selected.length === 1 ? 'Customer Preview' : 'Recovery Engine'}
               </h3>
               <span className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-[0.2em]">Live Template</span>
            </div>

            <div className="mb-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Dynamic Variables</p>
               <div className="flex flex-wrap gap-2 text-[8px] font-black uppercase tracking-widest">
                  {['[Customer Name]', '[Business Name]', '[Amount]', '[Phone]'].map(v => (
                    <span key={v} className="bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500">{v}</span>
                  ))}
               </div>
            </div>
            
            <label className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Draft Template</label>
            <textarea
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               className="w-full h-40 p-4 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all mb-8 bg-white"
               placeholder="Write your reminder strategy..."
            />

            <label className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1 flex items-center gap-1">
               <Eye className="h-3 w-3" /> WhatsApp Preview
            </label>
            <div className="flex-1 min-h-[150px] p-6 bg-green-50/30 border border-green-100 rounded-2xl text-sm text-slate-600 whitespace-pre-wrap italic font-medium leading-relaxed">
               {selected.length > 0 ? getReplacedMessage(firstSelectedCustomer) : 'Select target customers to initialize preview...'}
            </div>

            <div className="mt-8">
               <button 
                  onClick={handleSendReminders}
                  disabled={selected.length === 0}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-green-100 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                  <MessageCircle className="h-5 w-5" />
                  Initialize Broadcast ({selected.length})
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
