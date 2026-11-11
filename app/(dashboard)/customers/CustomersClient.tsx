'use client'

import { useState } from 'react'
import { Plus, Search, MessageCircle, Loader2, Edit2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface CustomersClientProps {
  initialCustomers: any[]
}

export default function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const [customers, setCustomers] = useState<any[]>(initialCustomers)
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [editingCustomer, setEditingCustomer] = useState<any>(null)

  // Form state
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [gst, setGst] = useState('')
  const [openingBalance, setOpeningBalance] = useState('0')

  const supabase = createClient()

  const fetchCustomers = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('tp_customer_balances')
        .select('*')
        .eq('user_id', user.id)

      if (!error) {
        setCustomers(data || [])
      }
    }
    setLoading(false)
  }

  const resetForm = () => {
    setEditingCustomer(null)
    setName('')
    setCompany('')
    setPhone('')
    setEmail('')
    setAddress('')
    setGst('')
    setOpeningBalance('0')
  }

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Not authenticated')
      setLoading(false)
      return
    }

    const customerData = {
      name,
      company_name: company,
      phone,
      email,
      address,
      gst_number: gst,
      opening_balance: parseFloat(openingBalance),
      user_id: user.id
    }

    let error;
    if (editingCustomer) {
      const { error: editError } = await supabase
        .from('tp_customers')
        .update(customerData)
        .eq('id', editingCustomer.id || editingCustomer.customer_id)
        .eq('user_id', user.id)
      error = editError
    } else {
      const { error: addError } = await supabase
        .from('tp_customers')
        .insert(customerData)
      error = addError
    }

    if (error) {
      alert(error.message)
    } else {
      setShowAddModal(false)
      resetForm()
      fetchCustomers()
    }
    setLoading(false)
  }

  const startEdit = (customer: any) => {
    setEditingCustomer(customer)
    setName(customer.customer_name || customer.name)
    setCompany(customer.company_name || '')
    setPhone(customer.phone || '')
    setEmail(customer.email || '')
    setAddress(customer.address || '')
    setGst(customer.gst_number || '')
    setOpeningBalance(customer.opening_balance?.toString() || '0')
    setShowAddModal(true)
  }

  const handleWhatsAppReminder = (customer: any) => {
    const message = `Hello ${customer.customer_name || customer.name}, this is a reminder from F.K.S. Traders regarding your outstanding balance of ₹${parseFloat(customer.outstanding_dues || 0).toFixed(2)}. Please make the payment at your earliest convenience. Thank you!`
    const phone = customer.phone?.replace(/\D/g, '')
    if (!phone) {
      alert('Phone number missing!')
      return
    }
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const filteredCustomers = customers.filter(c => 
    (c.customer_name?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (c.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (c.phone || '').includes(search)
  )

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => parseFloat(c.total_billed || 0) > 0).length
  const overdueCustomers = customers.filter(c => parseFloat(c.outstanding_dues || 0) > 0).length

  const finalFilteredCustomers = filteredCustomers.filter(c => {
    if (filter === 'With Dues') {
      return parseFloat(c.outstanding_dues || 0) > 0
    }
    return true
  })

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#3E3B36] dark:text-[#EDE9E3]">Customers</h2>
        </div>
        <div>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="tp-button-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Row of 3 Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-[#B4E0CA] p-3 rounded-full text-[#1E3121] shadow-sm"><Plus className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">Total Customers</p>
              <p className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3]">{totalCustomers}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-[#B4E0CA] p-3 rounded-full text-[#1E3121] shadow-sm"><Plus className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">Active Customers</p>
              <p className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3]">{activeCustomers}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-[#F0C9C1] p-3 rounded-full text-[#8A2E22] shadow-sm"><AlertCircle className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">Overdue</p>
              <p className="text-xl font-black text-[#A33A2B] dark:text-[#D98A7B]">{overdueCustomers}</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#F2EEE9] dark:bg-[#2A2926] p-4 rounded-[20px] border border-[#CAC8C0] dark:border-[#45433E] shadow-warm-card">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A756F] dark:text-[#A8A39B] pointer-events-none" />
          <input
            type="text"
            placeholder="Search customers by name or phone..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] placeholder:opacity-100 border border-[#CAC8C0] dark:border-[#45433E] rounded-full focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] caret-[#88A993] outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest">
          {['All', 'With Dues'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === f 
                  ? 'bg-[#B4E0CA] text-[#1E3121] shadow-warm-pill font-black' 
                  : 'bg-[#E9E4DE] dark:bg-[#33322E] text-[#7A756F] dark:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="tp-card overflow-hidden">
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-bold text-[#3E3B36] dark:text-[#EDE9E3] uppercase bg-[#F2EEE9] dark:bg-[#33322E] tracking-widest border-b border-[#CAC8C0] dark:border-[#45433E]">
              <tr>
                <th className="px-6 py-4">Name / Company</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Total Billed</th>
                <th className="px-6 py-4 text-right">Outstanding Due</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CAC8C0] dark:divide-[#45433E]">
              {finalFilteredCustomers.map((customer) => (
                <tr key={customer.customer_id || customer.id} className="bg-[#F2EEE9] hover:bg-[#EDE8E2] dark:bg-[#2A2926] dark:hover:bg-[#33322E] transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-[#E9E4DE] dark:bg-[#33322E] border border-[#CAC8C0] dark:border-[#45433E] flex items-center justify-center text-[#7A756F] dark:text-[#A8A39B] font-bold text-xs">
                          {(customer.customer_name || customer.name || 'C')[0].toUpperCase()}
                       </div>
                       <div>
                          <p className="font-bold text-[#3E3B36] dark:text-[#EDE9E3]">{customer.customer_name || customer.name}</p>
                          <p className="text-[10px] font-medium text-[#7A756F] dark:text-[#A8A39B] uppercase">{customer.company_name || 'Individual'}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[#7A756F] dark:text-[#A8A39B] font-medium">{customer.phone || 'N/A'}</td>
                  <td className="px-6 py-5 text-right font-black text-[#3E3B36] dark:text-[#EDE9E3]">₹{parseFloat(customer.total_billed || 0).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-5 text-right">
                    <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      parseFloat(customer.outstanding_dues || 0) > 0 
                        ? 'bg-[#F0C9C1] text-[#8A2E22] border-[#F0C9C1]/80 shadow-sm' 
                        : 'bg-[#B4E0CA] text-[#1E3121] border-[#88A993]/40 shadow-sm'
                    }`}>
                      ₹{parseFloat(customer.outstanding_dues || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                     <div className="flex justify-end gap-2">
                       <button onClick={() => startEdit(customer)} className="px-3 py-1.5 text-[10px] font-bold uppercase text-[#3E3B36] dark:text-[#EDE9E3] hover:bg-[#EDE8E2] dark:hover:bg-[#33322E] rounded-full transition-all">Edit</button>
                       <button onClick={() => handleWhatsAppReminder(customer)} className="px-3 py-1.5 text-[10px] font-bold uppercase text-[#3F6B52] dark:text-[#B4E0CA] hover:bg-[#B4E0CA]/20 rounded-full transition-all">Remind</button>
                       <Link href={`/customers/${customer.customer_id || customer.id}`} className="px-3 py-1.5 text-[10px] font-bold uppercase text-[#3F6B52] dark:text-[#B4E0CA] hover:bg-[#B4E0CA]/20 rounded-full transition-all flex items-center justify-center">View</Link>
                     </div>
                  </td>
                </tr>
              ))}
              {finalFilteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-[#7A756F] dark:text-[#A8A39B] text-xs font-bold uppercase tracking-widest">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Customer Cards */}
        <div className="block md:hidden divide-y divide-[#CAC8C0] dark:divide-[#45433E] bg-[#F2EEE9] dark:bg-[#2A2926]">
          {finalFilteredCustomers.map((customer) => (
            <div key={customer.customer_id || customer.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E9E4DE] dark:bg-[#33322E] border border-[#CAC8C0] dark:border-[#45433E] flex items-center justify-center text-[#7A756F] dark:text-[#A8A39B] font-bold text-xs">
                     {(customer.customer_name || customer.name || 'C')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-[#3E3B36] dark:text-[#EDE9E3] text-sm">{customer.customer_name || customer.name}</p>
                    <p className="text-[10px] font-medium text-[#7A756F] dark:text-[#A8A39B] uppercase">{customer.company_name || 'Individual'}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  parseFloat(customer.outstanding_dues || 0) > 0 
                    ? 'bg-[#F0C9C1] text-[#8A2E22] border-[#F0C9C1]/80 shadow-sm' 
                    : 'bg-[#B4E0CA] text-[#1E3121] border-[#88A993]/40 shadow-sm'
                }`}>
                  ₹{parseFloat(customer.outstanding_dues || 0).toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-[#E9E4DE] dark:bg-[#33322E] p-2.5 rounded-[16px] border border-[#CAC8C0]/50 dark:border-[#45433E]/50">
                <div>
                  <p className="text-[9px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase">Phone</p>
                  <p className="font-semibold text-[#3E3B36] dark:text-[#EDE9E3] text-xs mt-0.5">{customer.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase">Total Billed</p>
                  <p className="font-black text-[#3E3B36] dark:text-[#EDE9E3] text-xs mt-0.5">₹{parseFloat(customer.total_billed || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => startEdit(customer)} 
                  className="px-3 py-1.5 bg-[#E9E4DE] dark:bg-[#33322E] text-[9px] font-black uppercase text-[#3E3B36] dark:text-[#EDE9E3] rounded-full hover:bg-[#CAC8C0]/40 transition-all font-bold border border-[#CAC8C0] dark:border-[#45433E]"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleWhatsAppReminder(customer)} 
                  className="px-3 py-1.5 bg-[#B4E0CA] text-[9px] font-black uppercase text-[#1E3121] rounded-full hover:bg-[#9CCDB4] transition-all font-bold shadow-sm"
                >
                  Remind
                </button>
                <Link 
                  href={`/customers/${customer.customer_id || customer.id}`} 
                  className="px-3 py-1.5 bg-[#3F6B52] text-[9px] font-black uppercase text-[#FFFFFF] rounded-full hover:bg-[#3F6B52]/90 transition-all flex items-center justify-center font-bold shadow-sm"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
          {finalFilteredCustomers.length === 0 && (
            <div className="p-16 text-center text-[#7A756F] dark:text-[#A8A39B] text-[10px] font-black uppercase tracking-widest">
              No customers found
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1B]/70 backdrop-blur-md px-4">
          <div className="bg-[#F2EEE9] dark:bg-[#2A2926] rounded-[28px] shadow-warm-raised w-full max-w-lg overflow-hidden border border-[#CAC8C0] dark:border-[#45433E]">
            <div className="p-6 md:p-8 border-b border-[#CAC8C0] dark:border-[#45433E] flex justify-between items-center">
              <h3 className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3]">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] text-2xl font-light">&times;</button>
            </div>
            <form onSubmit={handleSaveCustomer} className="p-6 md:p-8 space-y-5 max-h-[70vh] overflow-y-auto">
               <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Customer Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] caret-[#88A993] outline-none transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Company Name</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] caret-[#88A993] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] caret-[#88A993] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] caret-[#88A993] outline-none transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Address</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-[20px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] caret-[#88A993] outline-none transition-all" rows={2}></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">GST Number</label>
                    <input type="text" value={gst} onChange={(e) => setGst(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] caret-[#88A993] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Opening Balance (₹)</label>
                    <input type="number" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] caret-[#88A993] outline-none transition-all" />
                  </div>
               </div>
               <div className="pt-6 flex flex-col sm:flex-row gap-3">
                 <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="w-full sm:w-1/2 px-6 py-3 border border-[#CAC8C0] dark:border-[#45433E] rounded-full text-sm font-bold text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] transition-all text-center">Cancel</button>
                 <button type="submit" disabled={loading} className="w-full sm:w-1/2 tp-button-primary disabled:opacity-50 text-center">
                    {loading ? 'Processing...' : editingCustomer ? 'Update Profile' : 'Create Customer'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
