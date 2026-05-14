'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, AlertCircle, TrendingDown, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')
  
  // New product state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [unit, setUnit] = useState('pcs')
  const [sellingRate, setSellingRate] = useState('')
  const [purchaseRate, setPurchaseRate] = useState('')
  const [initialStock, setInitialStock] = useState('0')
  const [minStock, setMinStock] = useState('5')

  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tp_products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error.message)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { error } = await supabase
      .from('tp_products')
      .insert({
        user_id: user.id,
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
      // Reset form
      setName('')
      setCategory('')
      setSellingRate('')
      setPurchaseRate('')
      setInitialStock('0')
    }
    setLoading(false)
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
          <h2 className="text-2xl font-bold tracking-tight">Products & Stock</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage inventory, prices, and stock alerts.</p>
        </div>
        <div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
           <div className="bg-slate-100 p-3 rounded-full"><Plus className="h-5 w-5 text-slate-600" /></div>
           <div>
              <p className="text-sm font-medium text-slate-500">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
           </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
           <div className="bg-amber-50 p-3 rounded-full"><TrendingDown className="h-5 w-5 text-amber-600" /></div>
           <div>
              <p className="text-sm font-medium text-slate-500">Low Stock</p>
              <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
           </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
           <div className="bg-red-50 p-3 rounded-full"><AlertCircle className="h-5 w-5 text-red-600" /></div>
           <div>
              <p className="text-sm font-medium text-slate-500">Critical / Zero</p>
              <p className="text-2xl font-bold text-red-600">{criticalStockCount}</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading && products.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
             Loading products...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold text-right">Selling Rate</th>
                  <th className="px-6 py-4 font-semibold text-right">Current Stock</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-500">Unit: {product.unit}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.category || 'N/A'}</td>
                    <td className="px-6 py-4 text-right font-medium">₹{product.selling_rate.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium ${
                        product.current_stock <= 0 
                          ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10' 
                          : product.current_stock <= product.min_stock_alert
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10'
                          : 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                      }`}>
                        {product.current_stock} {product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                         <button className="text-primary font-medium hover:underline text-xs">Edit</button>
                         <span className="text-slate-300">|</span>
                         <button className="text-slate-600 font-medium hover:text-slate-900 text-xs">Adjust Stock</button>
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No products found. Add your first product to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white">
                      <option value="pcs">pcs</option>
                      <option value="kg">kg</option>
                      <option value="ton">ton</option>
                      <option value="bundle">bundle</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Selling Rate (₹)</label>
                    <input type="number" required value={sellingRate} onChange={(e) => setSellingRate(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Rate (Optional)</label>
                    <input type="number" value={purchaseRate} onChange={(e) => setPurchaseRate(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Initial Stock</label>
                    <input type="number" value={initialStock} onChange={(e) => setInitialStock(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Stock Alert</label>
                    <input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
               </div>
               <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                 <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50">
                    {loading ? 'Adding...' : 'Save Product'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
