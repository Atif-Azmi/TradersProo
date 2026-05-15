'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, TrendingUp, Shield, Clock, Search, 
  Edit2, Lock, Unlock, Check, X, AlertTriangle, ShieldCheck
} from 'lucide-react'

interface UserRecord {
  id: string
  name: string
  email: string
  phone: string
  business_name: string
  subscription_plan: string
  subscription_status: string
  display_status: 'TRIAL' | 'PAID' | 'EXPIRED' | 'LOCKED'
  days_remaining: number
  total_trial_days: number
  trial_start_date: string
  trial_end_date: string
  plan_updated_at: string
  is_locked: boolean
  created_at: string
}

export default function SuperAdminClient() {
  const router = useRouter()
  const [users, setUsers] = useState<UserRecord[]>([])
  const [filtered, setFiltered] = useState<UserRecord[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newDays, setNewDays] = useState<number>(14)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null)

  // Verify session
  useEffect(() => {
    const verified = sessionStorage.getItem('sa_verified')
    if (!verified) { 
      router.push('/superadmin/verify')
      return 
    }
    fetchUsers()
  }, [router])

  // Search filter
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(users.filter(u => 
      (u.email || '').toLowerCase().includes(q) ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.business_name || '').toLowerCase().includes(q) ||
      (u.id || '').toLowerCase().includes(q)
    ))
  }, [search, users])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/superadmin/users')
      const data = await res.json()
      setUsers(data.users || [])
      setFiltered(data.users || [])
    } catch (error) {
      showToast('Connection to identity registry failed', 'error')
    }
    setLoading(false)
  }

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpdateDays = async (userId: string) => {
    setSaving(true)
    const res = await fetch('/api/superadmin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, new_trial_days: newDays })
    })
    const data = await res.json()
    setSaving(false)
    
    if (data.result?.success) {
      showToast(`Trial updated to ${newDays} days successfully`, 'success')
      setEditingId(null)
      fetchUsers() // Refresh list
    } else {
      showToast(data.error || 'Failed to update', 'error')
    }
  }

  const handleToggleLock = async (userId: string, currentlyLocked: boolean) => {
    const action = currentlyLocked ? 'unlock' : 'lock'
    const res = await fetch('/api/superadmin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action })
    })
    if (res.ok) {
      showToast(`User ${action}ed successfully`, 'success')
      fetchUsers()
    }
  }

  // KPI stats
  const totalUsers = users.length
  const trialUsers = users.filter(u => u.display_status === 'TRIAL').length
  const expiredUsers = users.filter(u => u.display_status === 'EXPIRED').length
  const paidUsers = users.filter(u => u.display_status === 'PAID').length
  const avgDaysLeft = users.length 
    ? Math.round(users.filter(u => u.days_remaining > 0 && u.days_remaining < 999)
        .reduce((sum, u) => sum + u.days_remaining, 0) / 
        Math.max(users.filter(u => u.days_remaining > 0 && u.days_remaining < 999).length, 1))
    : 0

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'TRIAL': return 'bg-amber-100 text-amber-700 border border-amber-200'
      case 'PAID': return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
      case 'EXPIRED': return 'bg-red-100 text-red-700 border border-red-200'
      case 'LOCKED': return 'bg-slate-900 text-white border border-slate-800'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  const getDaysColor = (days: number) => {
    if (days >= 999) return 'text-emerald-600 font-black italic'
    if (days <= 0) return 'text-red-600 font-black'
    if (days <= 3) return 'text-red-500 font-bold'
    if (days <= 7) return 'text-amber-500 font-semibold'
    return 'text-slate-900 font-bold'
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl animate-in slide-in-from-right-10
          ${toast.type === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Command Center</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Platform-wide node management & authority.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchUsers} 
            className="text-[10px] font-black text-slate-500 hover:text-slate-900 flex items-center gap-2 border border-slate-200 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 transition-all uppercase tracking-widest"
          >
            ↻ Sync Identity Registry
          </button>
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20">
             <ShieldCheck className="h-4 w-4 text-emerald-400" />
             SuperAdmin Active
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { label: 'Total Nodes', value: totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Active Trial', value: trialUsers, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Premium Nodes', value: paidUsers, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Expired/Dead', value: expiredUsers, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { label: 'Avg Longevity', value: `${avgDaysLeft}d`, icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-white rounded-2xl p-6 border ${kpi.border} shadow-sm group hover:scale-[1.02] transition-all`}>
            <div className={`w-12 h-12 ${kpi.bg} rounded-xl flex items-center justify-center mb-4 transition-all group-hover:rotate-6`}>
              <kpi.icon className={`${kpi.color} h-6 w-6`} />
            </div>
            <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{kpi.value}</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-black text-slate-900 uppercase italic tracking-tight">Active Nodes Registry</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{totalUsers} Identities Synchronized</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-xs font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              <tr>
                <th className="px-8 py-5">System Identity</th>
                <th className="px-8 py-5">Operator Info</th>
                <th className="px-8 py-5">Access Status</th>
                <th className="px-8 py-5">Authority Sync</th>
                <th className="px-8 py-5 text-right">Node Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-32 text-slate-300 font-black uppercase tracking-widest animate-pulse">Scanning Registry...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-32 text-slate-300 font-black uppercase tracking-widest">No Identities Found</td></tr>
              ) : filtered.map(user => (
                <tr key={user.id} className={`hover:bg-slate-50/50 transition-all group ${user.is_locked ? 'bg-slate-50/80 grayscale' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${user.is_locked ? 'bg-slate-200' : 'bg-white shadow-sm border border-slate-100'} rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:border-emerald-500/20 font-black text-sm transition-all`}>
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 uppercase italic tracking-tighter">{user.email || 'System Node'}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[8px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded uppercase tracking-widest">ID</span>
                           <code className="text-[9px] text-slate-500 font-bold font-mono tracking-tight">{user.id.slice(0, 18)}...</code>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{user.business_name || 'Generic Node'}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[8px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase tracking-widest italic">TEL</span>
                       <p className="text-[10px] font-bold text-slate-400">{user.phone || 'No Phone Sync'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(user.display_status)}`}>
                      {user.display_status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {editingId === user.id ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                        <input
                          type="number"
                          min={0}
                          max={365}
                          value={newDays}
                          onChange={e => setNewDays(Number(e.target.value))}
                          placeholder="+ Days"
                          className="w-24 bg-slate-900 text-emerald-400 border-none rounded-xl px-3 py-2 text-[10px] font-black outline-none focus:ring-2 focus:ring-emerald-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateDays(user.id)}
                          disabled={saving}
                          className="bg-emerald-500 text-white rounded-xl p-2 hover:scale-110 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                          {saving ? <X className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-slate-200 text-slate-500 rounded-xl p-2 hover:bg-slate-300 transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className={`text-xl font-black italic tracking-tighter ${getDaysColor(user.days_remaining)}`}>
                          {user.days_remaining >= 999 ? 'LIFETIME' : user.days_remaining <= 0 ? 'EXPIRED' : `${user.days_remaining}D`}
                        </span>
                        <button
                          onClick={() => { setEditingId(user.id); setNewDays(user.days_remaining || 14) }}
                          className="text-slate-300 hover:text-emerald-500 p-2 rounded-xl transition-all hover:bg-emerald-50"
                          title="Override Node Plan"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleToggleLock(user.id, user.is_locked)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${user.is_locked 
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'}`}
                    >
                      {user.is_locked 
                        ? <><Unlock className="h-3.5 w-3.5" /> Authorize Node</>
                        : <><Lock className="h-3.5 w-3.5" /> Suspend Node</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
