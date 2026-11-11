'use client'

import { useState } from 'react'
import { Plus, Search, AlertCircle, TrendingDown, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProductsClientProps {
  initialProducts: any[]
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [search, setSearch] = useState('')
  
  // Form states
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [unit, setUnit] = useState('pcs')
  const [sellingRate, setSellingRate] = useState('')
  const [purchaseRate, setPurchaseRate] = useState('')
  const [initialStock, setInitialStock] = useState('0')
  const [minStock, setMinStock] = useState('5')
  
  // Adjust state
  const [adjustmentValue, setAdjustmentValue] = useState('0')
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add')

  const supabase = createClient()

  const fetchProducts = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('tp_products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error) {
        setProducts(data || [])
      }
    }
    setLoading(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Not authenticated')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('tp_products')
      .insert({
        name,
        category,
        unit,
        selling_rate: parseFloat(sellingRate),
        purchase_rate: parseFloat(purchaseRate) || 0,
        current_stock: parseFloat(initialStock),
        min_stock_alert: parseFloat(minStock),
        user_id: user.id
      })

    if (error) {
      alert(error.message)
    } else {
      setShowAddModal(false)
      fetchProducts()
      resetForm()
    }
    setLoading(false)
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Not authenticated')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('tp_products')
      .update({
        name,
        category,
        unit,
        selling_rate: parseFloat(sellingRate),
        purchase_rate: parseFloat(purchaseRate) || 0,
        min_stock_alert: parseFloat(minStock)
      })
      .eq('id', selectedProduct.id)
      .eq('user_id', user.id)

    if (error) {
      alert(error.message)
    } else {
      setShowEditModal(false)
      fetchProducts()
    }
    setLoading(false)
  }

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Not authenticated')
      setLoading(false)
      return
    }

    const change = parseFloat(adjustmentValue)
    const newStock = adjustmentType === 'add' 
      ? selectedProduct.current_stock + change 
      : selectedProduct.current_stock - change

    const { error } = await supabase
      .from('tp_products')
      .update({ current_stock: newStock })
      .eq('id', selectedProduct.id)
      .eq('user_id', user.id)

    if (error) {
      alert(error.message)
    } else {
      setShowAdjustModal(false)
      fetchProducts()
      setAdjustmentValue('0')
    }
    setLoading(false)
  }

  const resetForm = () => {
    setName('')
    setCategory('')
    setSellingRate('')
    setPurchaseRate('')
    setInitialStock('0')
    setMinStock('5')
    setUnit('pcs')
  }

  const openEdit = (product: any) => {
    setSelectedProduct(product)
    setName(product.name)
    setCategory(product.category || '')
    setUnit(product.unit)
    setSellingRate(product.selling_rate.toString())
    setPurchaseRate(product.purchase_rate?.toString() || '')
    setMinStock(product.min_stock_alert.toString())
    setShowEditModal(true)
  }

  const openAdjust = (product: any) => {
    setSelectedProduct(product)
    setAdjustmentValue('0')
    setShowAdjustModal(true)
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const lowStockCount = products.filter(p => p.current_stock <= p.min_stock_alert && p.current_stock > 0).length
  const criticalStockCount = products.filter(p => p.current_stock <= 0).length

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#3E3B36] dark:text-[#EDE9E3]">Inventory</h2>
        </div>
        <div>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="tp-button-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-[#B4E0CA]/40 p-3 rounded-full text-[#1E3121]"><Plus className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">Total Items</p>
              <p className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3]">{products.length}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-[#E3D094]/30 p-3 rounded-full text-[#4A3F12] dark:text-[#E3D094]"><TrendingDown className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">Low Stock</p>
              <p className="text-xl font-black text-[#4A3F12] dark:text-[#E3D094]">{lowStockCount}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-[#D98A7B]/20 p-3 rounded-full text-[#4A1D14] dark:text-[#D98A7B]"><AlertCircle className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">Critical</p>
              <p className="text-xl font-black text-[#4A1D14] dark:text-[#D98A7B]">{criticalStockCount}</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#E9E4DE] dark:bg-[#2A2926] p-4 rounded-[20px] border border-[#CAC8C0] dark:border-[#45433E] shadow-warm-card">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A756F] dark:text-[#A8A39B] pointer-events-none" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] placeholder:opacity-100 border border-[#CAC8C0] dark:border-[#45433E] rounded-full focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] caret-[#88A993] outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="tp-card overflow-hidden">
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-bold text-[#3E3B36] dark:text-[#EDE9E3] uppercase bg-[#F2EEE9] dark:bg-[#33322E] tracking-widest border-b border-[#CAC8C0] dark:border-[#45433E]">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Selling Rate</th>
                <th className="px-6 py-4 text-right">Current Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CAC8C0]/50 dark:divide-[#45433E]/50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#F2EEE9]/50 dark:hover:bg-[#33322E]/50 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-[#F2EEE9] dark:bg-[#33322E] border border-[#CAC8C0] dark:border-[#45433E] flex items-center justify-center text-[#7A756F] dark:text-[#A8A39B] font-bold text-xs">
                          {(product.name || 'P')[0].toUpperCase()}
                       </div>
                       <div>
                          <p className="font-bold text-[#3E3B36] dark:text-[#EDE9E3]">{product.name}</p>
                          <p className="text-[10px] font-medium text-[#7A756F] dark:text-[#A8A39B] uppercase">Unit: {product.unit}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className="text-[#3E3B36] dark:text-[#EDE9E3] font-medium px-3 py-1 bg-[#F2EEE9] dark:bg-[#33322E] border border-[#CAC8C0]/50 dark:border-[#45433E]/50 rounded-full text-[10px] font-bold uppercase tracking-tight">{product.category || 'General'}</span>
                  </td>
                  <td className="px-6 py-5 text-right font-black text-[#3E3B36] dark:text-[#EDE9E3]">₹{product.selling_rate.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-5 text-right">
                    <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      product.current_stock <= 0 
                        ? 'bg-[#D98A7B]/20 text-[#4A1D14] dark:text-[#D98A7B] border-[#D98A7B]/40' 
                        : product.current_stock <= product.min_stock_alert
                        ? 'bg-[#E3D094]/30 text-[#4A3F12] dark:text-[#E3D094] border-[#E3D094]/60'
                        : 'bg-[#B4E0CA]/30 text-[#1E3121] dark:text-[#B4E0CA] border-[#88A993]/40'
                    }`}>
                      {product.current_stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                     <div className="flex justify-end gap-2">
                       <button onClick={() => openEdit(product)} className="px-3 py-1.5 text-[10px] font-bold uppercase text-[#1E3121] dark:text-[#B4E0CA] hover:bg-[#B4E0CA]/20 rounded-full transition-all">Edit</button>
                       <button onClick={() => openAdjust(product)} className="px-3 py-1.5 text-[10px] font-bold uppercase text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] rounded-full transition-all">Adjust</button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View Product Cards */}
        <div className="block md:hidden divide-y divide-[#CAC8C0]/50 dark:divide-[#45433E]/50 bg-[#E9E4DE] dark:bg-[#2A2926]">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F2EEE9] dark:bg-[#33322E] border border-[#CAC8C0] dark:border-[#45433E] flex items-center justify-center text-[#7A756F] dark:text-[#A8A39B] font-bold text-xs">
                     {(product.name || 'P')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-[#3E3B36] dark:text-[#EDE9E3] text-sm">{product.name}</p>
                    <p className="text-[10px] font-medium text-[#7A756F] dark:text-[#A8A39B] uppercase">Unit: {product.unit}</p>
                  </div>
                </div>
                <span className="text-[#3E3B36] dark:text-[#EDE9E3] font-medium px-2.5 py-1 bg-[#F2EEE9] dark:bg-[#33322E] border border-[#CAC8C0]/50 dark:border-[#45433E]/50 rounded-full text-[9px] font-bold uppercase tracking-tight">
                  {product.category || 'General'}
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-[#F2EEE9] dark:bg-[#33322E] p-2.5 rounded-[16px] border border-[#CAC8C0]/50 dark:border-[#45433E]/50">
                <div>
                  <p className="text-[9px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase">Selling Rate</p>
                  <p className="font-black text-[#3E3B36] dark:text-[#EDE9E3] text-xs mt-0.5">₹{product.selling_rate.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase mb-0.5">Current Stock</p>
                  <span className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                    product.current_stock <= 0 
                      ? 'bg-[#D98A7B]/20 text-[#4A1D14] dark:text-[#D98A7B] border-[#D98A7B]/40' 
                      : product.current_stock <= product.min_stock_alert
                      ? 'bg-[#E3D094]/30 text-[#4A3F12] dark:text-[#E3D094] border-[#E3D094]/60'
                      : 'bg-[#B4E0CA]/30 text-[#1E3121] dark:text-[#B4E0CA] border-[#88A993]/40'
                  }`}>
                    {product.current_stock} {product.unit}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => openEdit(product)} 
                  className="px-3 py-1.5 bg-[#B4E0CA] text-[9px] font-black uppercase text-[#1E3121] rounded-full hover:bg-[#9CCDB4] transition-all font-bold shadow-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => openAdjust(product)} 
                  className="px-3 py-1.5 bg-[#F2EEE9] dark:bg-[#33322E] text-[9px] font-black uppercase text-[#7A756F] dark:text-[#A8A39B] rounded-full hover:bg-[#CAC8C0]/30 transition-all border border-[#CAC8C0] dark:border-[#45433E]"
                >
                  Adjust
                </button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="p-16 text-center text-[#7A756F] dark:text-[#A8A39B] text-[10px] font-black uppercase tracking-widest">
              No products found
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1B]/70 backdrop-blur-md px-4">
          <div className="bg-[#E9E4DE] dark:bg-[#2A2926] rounded-[28px] shadow-warm-raised w-full max-w-lg overflow-hidden border border-[#CAC8C0] dark:border-[#45433E]">
            <div className="p-6 md:p-8 border-b border-[#CAC8C0] dark:border-[#45433E] flex justify-between items-center">
              <h3 className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3]">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] text-2xl font-light">&times;</button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 md:p-8 space-y-5">
               <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Product Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Category</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] transition-all">
                      <option value="pcs">pcs</option>
                      <option value="kg">kg</option>
                      <option value="ton">ton</option>
                      <option value="bundle">bundle</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Selling Rate (₹) *</label>
                    <input type="number" required value={sellingRate} onChange={(e) => setSellingRate(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Purchase Rate</label>
                    <input type="number" value={purchaseRate} onChange={(e) => setPurchaseRate(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Initial Stock</label>
                    <input type="number" value={initialStock} onChange={(e) => setInitialStock(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Min Stock Alert</label>
                    <input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all" />
                  </div>
               </div>
               <div className="pt-6 flex flex-col sm:flex-row gap-3">
                 <button type="button" onClick={() => setShowAddModal(false)} className="w-full sm:w-1/2 px-6 py-3 border border-[#CAC8C0] dark:border-[#45433E] rounded-full text-sm font-bold text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] transition-all text-center">Cancel</button>
                 <button type="submit" disabled={loading} className="w-full sm:w-1/2 tp-button-primary disabled:opacity-50 text-center">
                    {loading ? 'Processing...' : 'Save Product'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1B]/70 backdrop-blur-md px-4">
          <div className="bg-[#E9E4DE] dark:bg-[#2A2926] rounded-[28px] shadow-warm-raised w-full max-w-lg overflow-hidden border border-[#CAC8C0] dark:border-[#45433E]">
            <div className="p-6 md:p-8 border-b border-[#CAC8C0] dark:border-[#45433E] flex justify-between items-center">
              <h3 className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3]">Edit Product</h3>
              <button onClick={() => setShowEditModal(false)} className="text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] text-2xl font-light">&times;</button>
            </div>
            <form onSubmit={handleEditProduct} className="p-6 md:p-8 space-y-5">
               <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Product Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Category</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] placeholder:text-[#7A756F] dark:placeholder:text-[#A8A39B] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] transition-all">
                      <option value="pcs">pcs</option>
                      <option value="kg">kg</option>
                      <option value="ton">ton</option>
                      <option value="bundle">bundle</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Selling Rate (₹) *</label>
                    <input type="number" required value={sellingRate} onChange={(e) => setSellingRate(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Purchase Rate</label>
                    <input type="number" value={purchaseRate} onChange={(e) => setPurchaseRate(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Min Stock Alert</label>
                    <input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all" />
                  </div>
               </div>
               <div className="pt-6 flex flex-col sm:flex-row gap-3">
                 <button type="button" onClick={() => setShowEditModal(false)} className="w-full sm:w-1/2 px-6 py-3 border border-[#CAC8C0] dark:border-[#45433E] rounded-full text-sm font-bold text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] transition-all text-center">Cancel</button>
                 <button type="submit" disabled={loading} className="w-full sm:w-1/2 tp-button-primary disabled:opacity-50 text-center">
                    {loading ? 'Updating...' : 'Update Product'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1B]/70 backdrop-blur-md px-4">
          <div className="bg-[#E9E4DE] dark:bg-[#2A2926] rounded-[28px] shadow-warm-raised w-full max-w-sm overflow-hidden border border-[#CAC8C0] dark:border-[#45433E]">
            <div className="p-6 md:p-8 border-b border-[#CAC8C0] dark:border-[#45433E] flex justify-between items-center">
              <h3 className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3]">Adjust Stock</h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] text-2xl font-light">&times;</button>
            </div>
            <form onSubmit={handleAdjustStock} className="p-6 md:p-8 space-y-6">
               <div className="text-center">
                  <p className="text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1">Current Stock for {selectedProduct?.name}</p>
                  <p className="text-2xl font-black text-[#3E3B36] dark:text-[#EDE9E3] italic">{selectedProduct?.current_stock} {selectedProduct?.unit}</p>
               </div>

               <div className="flex gap-2 p-1 bg-[#F2EEE9] dark:bg-[#33322E] rounded-full border border-[#CAC8C0] dark:border-[#45433E]">
                  <button 
                    type="button"
                    onClick={() => setAdjustmentType('add')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${adjustmentType === 'add' ? 'bg-[#B4E0CA] text-[#1E3121] shadow-warm-pill font-bold' : 'text-[#7A756F] dark:text-[#A8A39B]'}`}
                  >
                    Add (+)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAdjustmentType('remove')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${adjustmentType === 'remove' ? 'bg-[#D98A7B] text-[#4A1D14] shadow-warm-pill font-bold' : 'text-[#7A756F] dark:text-[#A8A39B]'}`}
                  >
                    Remove (-)
                  </button>
               </div>

               <div>
                  <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Quantity to {adjustmentType}</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={adjustmentValue} 
                    onChange={(e) => setAdjustmentValue(e.target.value)} 
                    className="w-full bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] border border-[#CAC8C0] dark:border-[#45433E] rounded-full px-4 py-2.5 text-lg font-black text-center focus:ring-2 focus:ring-[#B4E0CA]/60 outline-none transition-all" 
                  />
               </div>

               <div className="pt-4 flex flex-col sm:flex-row gap-3">
                 <button type="button" onClick={() => setShowAdjustModal(false)} className="w-full sm:w-1/2 px-6 py-3 border border-[#CAC8C0] dark:border-[#45433E] rounded-full text-sm font-bold text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] transition-all text-center">Cancel</button>
                 <button type="submit" disabled={loading} className={`w-full sm:w-1/2 px-6 py-3 rounded-full text-sm font-bold shadow-warm-pill transition-all disabled:opacity-50 text-center ${adjustmentType === 'add' ? 'bg-[#B4E0CA] text-[#1E3121] hover:bg-[#9CCDB4]' : 'bg-[#D98A7B] text-[#4A1D14] hover:opacity-90'}`}>
                    {loading ? 'Updating...' : 'Confirm'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
