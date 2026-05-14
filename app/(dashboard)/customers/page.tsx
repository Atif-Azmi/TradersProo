'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, MessageCircle, Loader2, Edit2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tp_customer_balances')
      .select('*')

    if (error) {
      console.error('Error fetching customers:', error.message)
      const { data: basicData } = await supabase.from('tp_customers').select('*')
      setCustomers(basicData || [])
    } else {
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
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const customerData = {
      user_id: user.id,
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
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your customers and view balances.</p>
        </div>
        <div>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 text-sm">
          {['All', 'Active', 'With Dues', 'Advance Balance'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === f 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading && customers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
             Loading customers...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name / Company</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold text-right">Total Billed</th>
                  <th className="px-6 py-4 font-semibold text-right">Outstanding Due</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customer_id || customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{customer.customer_name || customer.name}</div>
                      <div className="text-xs text-slate-500">{customer.company_name ? `${customer.company_name}` : ''}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{customer.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-right text-slate-600">₹{parseFloat(customer.total_billed || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${parseFloat(customer.outstanding_dues || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{parseFloat(customer.outstanding_dues || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2 items-center">
                         <button 
                           onClick={() => handleWhatsAppReminder(customer)}
                           className="p-1.5 text-slate-400 hover:text-green-600 rounded bg-slate-50 hover:bg-green-50" 
                           title="WhatsApp Reminder"
                         >
                            <MessageCircle className="h-4 w-4" />
                         </button>
                         <button 
                           onClick={() => startEdit(customer)}
                           className="p-1.5 text-slate-400 hover:text-primary rounded bg-slate-50 hover:bg-slate-100" 
                           title="Edit Customer"
                         >
                            <Edit2 className="h-4 w-4" />
                         </button>
                         <Link href={`/customers/${customer.customer_id || customer.id}`} className="text-primary font-medium hover:underline text-xs">View</Link>
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No customers found. Add your first customer!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSaveCustomer} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
               <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Customer Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Company Name (Optional)</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" rows={2}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GST Number</label>
                    <input type="text" value={gst} onChange={(e) => setGst(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Opening Balance (₹)</label>
                    <input type="number" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                    <p className="text-[10px] text-slate-500 mt-1">Positive for Dues, Negative for Advance</p>
                  </div>
               </div>
               <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="flex-1 px-4 py-2 border rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                 <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50">
                    {loading ? 'Saving...' : editingCustomer ? 'Update Customer' : 'Save Customer'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
