'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Users, Building, Activity, Search, Edit, Trash2, Check, Loader2, IndianRupee, Package, Zap } from 'lucide-react'

interface SuperAdminClientProps {
  initialProfiles: any[]
  platformStats: {
    totalRevenue: number
    totalCustomers: number
    totalProducts: number
    activeNodes: number
  }
}

export default function SuperAdminClient({ initialProfiles, platformStats }: SuperAdminClientProps) {
  const [loading, setLoading] = useState(false)
  const [admins] = useState<any[]>(initialProfiles)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const verified = sessionStorage.getItem('sa_verified')
    if (!verified) {
      router.push('/superadmin/verify')
    }
  }, [router])

  const filteredAdmins = admins.filter(a => 
    a.business_name?.toLowerCase().includes(search.toLowerCase()) || 
    a.owner_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <div className="p-4 bg-slate-900 rounded-[1.5rem] text-primary shadow-2xl shadow-primary/20">
                <ShieldCheck className="h-8 w-8" />
             </div>
             <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Platform Intelligence</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Nexus Command & Control • Global Overview</p>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-3">System Health</span>
              <span className="inline-flex items-center gap-2 text-xs font-black text-green-600 uppercase">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                Nominal
              </span>
           </div>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-800 text-white overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                  <IndianRupee className="h-6 w-6" />
               </div>
               <Zap className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Global GMV</p>
            <h3 className="text-3xl font-black tracking-tighter italic">₹{platformStats.totalRevenue.toLocaleString()}</h3>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Building className="h-6 w-6" />
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tenant Nodes</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{platformStats.activeNodes}</h3>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <Users className="h-6 w-6" />
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Scoped Clients</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{platformStats.totalCustomers}</h3>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <Package className="h-6 w-6" />
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Global Inventory Items</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{platformStats.totalProducts}</h3>
         </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-100 overflow-hidden">
         <div className="p-12 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-10 bg-slate-50/20">
            <div>
               <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Enterprise Pulse</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Live monitor for all business instances and operational health.</p>
            </div>
            <div className="relative w-full lg:w-[500px]">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
               <input 
                  type="text" 
                  placeholder="Scan Registry (Name, ID, or Phone)..." 
                  className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none shadow-inner transition-all placeholder:text-slate-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b border-slate-50">
                  <tr>
                     <th className="px-12 py-6">Node / Identity</th>
                     <th className="px-12 py-6">Operator Metadata</th>
                     <th className="px-12 py-6">System UID</th>
                     <th className="px-12 py-6 text-center">Engagement</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredAdmins.map((admin) => (
                     <tr key={admin.id} className="hover:bg-slate-50/80 transition-all group">
                        <td className="px-12 py-10">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-center font-black text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary shadow-xl shadow-slate-100 transition-all duration-500 italic text-2xl">
                                 {admin.business_name?.[0] || 'B'}
                              </div>
                              <div>
                                 <p className="font-black text-slate-900 text-xl tracking-tighter uppercase italic">{admin.business_name || 'Business Name'}</p>
                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                   <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                                   Loc: {admin.city || 'Global Scope'}
                                 </p>
                              </div>
                           </div>
                        </td>
                        <td className="px-12 py-10">
                           <p className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{admin.owner_name || 'Admin'}</p>
                           <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{admin.phone}</p>
                        </td>
                        <td className="px-12 py-10">
                           <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl inline-block group-hover:bg-white transition-colors">
                              <code className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{admin.user_id}</code>
                           </div>
                        </td>
                        <td className="px-12 py-10 text-center">
                           <div className="flex flex-col items-center gap-4">
                              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-[0.2em] border border-green-100 shadow-inner">
                                 <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                 Pulse: Active
                              </span>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                 <button className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all shadow-sm">
                                    <Activity className="h-4 w-4" />
                                 </button>
                                 <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm">
                                    <Trash2 className="h-4 w-4" />
                                 </button>
                              </div>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredAdmins.length === 0 && (
                     <tr>
                        <td colSpan={4} className="py-40 text-center">
                           <div className="max-w-sm mx-auto space-y-6">
                              <Loader2 className="h-12 w-12 text-slate-100 mx-auto animate-spin" />
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Scanning global node registry...</p>
                           </div>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
         
         <div className="p-12 border-t border-slate-50 bg-slate-50/40 flex justify-between items-center">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.5em]">Nexus Control Plane • TradersPro v4.0 Hardened</p>
            <div className="flex gap-4">
               <div className="w-2 h-2 rounded-full bg-primary/20"></div>
               <div className="w-2 h-2 rounded-full bg-primary/40"></div>
               <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
         </div>
      </div>
    </div>
  )
}
