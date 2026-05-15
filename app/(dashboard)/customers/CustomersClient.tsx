'use client'

import { useState } from 'react'
import { Plus, Search, MessageCircle, Loader2, Edit2 } from 'lucide-react'
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
    const { data, error } = await supabase
      .from('tp_customer_balances')
      .select('*')

    if (!error) {
      setCustomers(data || [])
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
    
    // Rule #8: DO NOT manually set user_id. DB DEFAULT auth.uid() handles it.
    const customerData = {
      name,
      company_name: company,
      phone,
      email,
      address,
      gst_number: gst,
      opening_balance: parseFloat(openingBalance)
    }

    let error;
    if (editingCustomer) {
      const { error: editError } = await supabase
        .from('tp_customers')
        .update(customerData)
        .eq('id', editingCustomer.id || editingCustomer.customer_id)
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
    (c.customer_name?.toLowerCase().includes(search.toLowerCase()) || 
     c.name?.toLowerCase().includes(search.toLowerCase()) || 
     c.phone?.includes(search))
  )

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Customers</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage your business connections and track balances.</p>
        </div>
        <div>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-100 hover:bg-green-600 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest">
          {['All', 'With Dues'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === f 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50/50 tracking-widest">
              <tr>
                <th className="px-6 py-4">Name / Company</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Total Billed</th>
                <th className="px-6 py-4 text-right">Outstanding Due</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((customer) => (
                <tr key={customer.customer_id || customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{customer.customer_name || customer.name}</div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{customer.company_name || 'Individual'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{customer.phone || 'N/A'}</td>
                  <td className="px-6 py-4 text-right text-slate-600 font-medium">₹{parseFloat(customer.total_billed || 0).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-black tracking-tight ${parseFloat(customer.outstanding_dues || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{parseFloat(customer.outstanding_dues || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 items-center">
                        <button 
                          onClick={() => handleWhatsAppReminder(customer)}
                          className="p-2 text-slate-400 hover:text-green-600 rounded-lg bg-slate-50 hover:bg-green-50 transition-colors" 
                          title="WhatsApp Reminder"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => startEdit(customer)}
                          className="p-2 text-slate-400 hover:text-primary rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors" 
                          title="Edit Customer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <Link href={`/customers/${customer.customer_id || customer.id}`} className="text-primary font-bold hover:underline text-xs tracking-tight">View</Link>
                      </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>
            <form onSubmit={handleSaveCustomer} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
               <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Customer Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Company Name</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Address</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" rows={2}></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">GST Number</label>
                    <input type="text" value={gst} onChange={(e) => setGst(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Opening Balance (₹)</label>
                    <input type="number" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
               </div>
               <div className="pt-6 flex gap-4">
                 <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                 <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-green-600 shadow-lg shadow-green-100 transition-all disabled:opacity-50">
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
