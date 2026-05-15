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
    const { data, error } = await supabase
      .from('tp_products')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase
      .from('tp_products')
      .insert({
        name,
        category,
        unit,
        selling_rate: parseFloat(sellingRate),
        purchase_rate: parseFloat(purchaseRate) || 0,
        current_stock: parseFloat(initialStock),
        min_stock_alert: parseFloat(minStock)
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
    
    const change = parseFloat(adjustmentValue)
    const newStock = adjustmentType === 'add' 
      ? selectedProduct.current_stock + change 
      : selectedProduct.current_stock - change

    const { error } = await supabase
      .from('tp_products')
      .update({ current_stock: newStock })
      .eq('id', selectedProduct.id)

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
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Inventory</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage products, pricing, and automated stock levels.</p>
        </div>
        <div>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-100 hover:bg-green-600 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 flex items-center gap-4 shadow-sm">
           <div className="bg-slate-50 p-3 rounded-xl"><Plus className="h-5 w-5 text-slate-600" /></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Items</p>
              <p className="text-2xl font-black text-slate-900">{products.length}</p>
           </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 flex items-center gap-4 shadow-sm">
           <div className="bg-amber-50 p-3 rounded-xl"><TrendingDown className="h-5 w-5 text-amber-600" /></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Stock</p>
              <p className="text-2xl font-black text-amber-600">{lowStockCount}</p>
           </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 flex items-center gap-4 shadow-sm">
           <div className="bg-red-50 p-3 rounded-xl"><AlertCircle className="h-5 w-5 text-red-600" /></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical</p>
              <p className="text-2xl font-black text-red-600">{criticalStockCount}</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50/50 tracking-widest">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Selling Rate</th>
                <th className="px-6 py-4 text-right">Current Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{product.name}</div>
                    <div className="text-[10px] font-medium text-slate-400 tracking-tight uppercase">Unit: {product.unit}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{product.category || 'N/A'}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">₹{product.selling_rate.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      product.current_stock <= 0 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : product.current_stock <= product.min_stock_alert
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {product.current_stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-3">
                       <button onClick={() => openEdit(product)} className="text-primary font-bold hover:underline text-xs tracking-tight">Edit</button>
                       <span className="text-slate-200">|</span>
                       <button onClick={() => openAdjust(product)} className="text-slate-400 font-bold hover:text-slate-900 text-xs tracking-tight transition-colors">Adjust</button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-5">
               <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Product Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none bg-white transition-all">
                      <option value="pcs">pcs</option>
                      <option value="kg">kg</option>
                      <option value="ton">ton</option>
                      <option value="bundle">bundle</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Selling Rate (₹) *</label>
                    <input type="number" required value={sellingRate} onChange={(e) => setSellingRate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Purchase Rate</label>
                    <input type="number" value={purchaseRate} onChange={(e) => setPurchaseRate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Initial Stock</label>
                    <input type="number" value={initialStock} onChange={(e) => setInitialStock(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Min Stock Alert</label>
                    <input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
               </div>
               <div className="pt-6 flex gap-4">
                 <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                 <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-green-600 shadow-lg shadow-green-100 transition-all disabled:opacity-50">
                    {loading ? 'Processing...' : 'Save Product'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Edit Product</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>
            <form onSubmit={handleEditProduct} className="p-8 space-y-5">
               <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Product Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none bg-white transition-all">
                      <option value="pcs">pcs</option>
                      <option value="kg">kg</option>
                      <option value="ton">ton</option>
                      <option value="bundle">bundle</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Selling Rate (₹) *</label>
                    <input type="number" required value={sellingRate} onChange={(e) => setSellingRate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Purchase Rate</label>
                    <input type="number" value={purchaseRate} onChange={(e) => setPurchaseRate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Min Stock Alert</label>
                    <input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
               </div>
               <div className="pt-6 flex gap-4">
                 <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                 <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-green-600 shadow-lg shadow-green-100 transition-all disabled:opacity-50">
                    {loading ? 'Updating...' : 'Update Product'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Adjust Stock</h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>
            <form onSubmit={handleAdjustStock} className="p-8 space-y-6">
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Stock for {selectedProduct?.name}</p>
                  <p className="text-2xl font-black text-slate-900 italic">{selectedProduct?.current_stock} {selectedProduct?.unit}</p>
               </div>

               <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setAdjustmentType('add')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${adjustmentType === 'add' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
                  >
                    Add (+)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAdjustmentType('remove')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${adjustmentType === 'remove' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-400'}`}
                  >
                    Remove (-)
                  </button>
               </div>

               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Quantity to {adjustmentType}</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={adjustmentValue} 
                    onChange={(e) => setAdjustmentValue(e.target.value)} 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-lg font-black text-center focus:ring-2 focus:ring-primary outline-none transition-all" 
                  />
               </div>

               <div className="pt-4 flex gap-4">
                 <button type="button" onClick={() => setShowAdjustModal(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                 <button type="submit" disabled={loading} className={`flex-1 px-6 py-3 text-white rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50 ${adjustmentType === 'add' ? 'bg-primary hover:bg-green-600 shadow-green-100' : 'bg-red-500 hover:bg-red-600 shadow-red-100'}`}>
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
