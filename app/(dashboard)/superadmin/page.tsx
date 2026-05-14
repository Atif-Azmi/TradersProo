'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck, Users, Building, Activity, Search, Edit, Trash2, Check, X, Loader2 } from 'lucide-react'

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [admins, setAdmins] = useState<any[]>([])
  const [stats, setStats] = useState({ totalAdmins: 0, totalCustomers: 0, totalSales: 0 })
  const [search, setSearch] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchSuperData()
  }, [])

  const fetchSuperData = async () => {
    setLoading(true)
    
    // In a real multi-tenant app, we'd fetch from tp_profile or user_profiles
    const { data: profiles, error } = await supabase
      .from('tp_profile')
      .select('*')
    
    if (profiles) {
      setAdmins(profiles)
      setStats({
        totalAdmins: profiles.length,
        totalCustomers: 0, // In real app, aggregate these
        totalSales: 0
      })
    }
    
    setLoading(false)
  }

  const filteredAdmins = admins.filter(a => 
    a.business_name?.toLowerCase().includes(search.toLowerCase()) || 
    a.owner_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ShieldCheck className="h-6 w-6" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Superadmin Hub</h1>
          </div>
          <p className="text-slate-500 font-medium">Global management of all business instances on TradersPro SaaS.</p>
        </div>
        <button onClick={fetchSuperData} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
           {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '🔄 Sync Registry'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
               <Building className="h-7 w-7" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Businesses</p>
               <h3 className="text-2xl font-black text-slate-900">{stats.totalAdmins}</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
               <Users className="h-7 w-7" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users Scoped</p>
               <h3 className="text-2xl font-black text-slate-900">--</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
               <Activity className="h-7 w-7" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Activity</p>
               <h3 className="text-2xl font-black text-slate-900">Optimal</h3>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
            <div>
               <h3 className="text-xl font-bold text-slate-900">Admin Directory</h3>
               <p className="text-sm text-slate-500 mt-1">Manage licenses and access levels for registered traders.</p>
            </div>
            <div className="relative w-full md:w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search by business or owner name..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  <tr>
                     <th className="px-8 py-4">Business Info</th>
                     <th className="px-8 py-4">Owner / Contact</th>
                     <th className="px-8 py-4">Location</th>
                     <th className="px-8 py-4">Status</th>
                     <th className="px-8 py-4 text-center">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredAdmins.map((admin) => (
                     <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                 {admin.business_name?.[0] || 'B'}
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900">{admin.business_name || 'Business Name'}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">GST: {admin.gst_number || 'UNREGISTERED'}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-semibold text-slate-700">{admin.owner_name}</p>
                           <p className="text-xs text-slate-400">{admin.phone}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm text-slate-600">{admin.city || 'Not specified'}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">
                              <Check className="h-3 w-3" /> Active
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                 <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                 <Trash2 className="h-4 w-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredAdmins.length === 0 && !loading && (
                     <tr>
                        <td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">
                           No administrators found matching your search.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
         
         <div className="p-8 border-t border-slate-50 bg-slate-50/20 text-center">
            <p className="text-xs text-slate-400 font-medium">Global System View • TradersPro SaaS Control Panel</p>
         </div>
      </div>
    </div>
  )
}
