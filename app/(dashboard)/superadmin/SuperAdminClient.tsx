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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-2xl animate-in slide-in-from-right-10
          ${toast.type === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Superadmin Hub</h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchUsers} 
            className="text-[10px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 transition-all uppercase tracking-widest cursor-pointer"
          >
            ↻ Sync Identity Registry
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">
             <ShieldCheck className="h-4 w-4 text-emerald-400" />
             SuperAdmin Active
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[
          { label: 'Total Nodes', value: totalUsers, icon: Users, bg: 'bg-emerald-50 text-emerald-600' },
          { label: 'Active Trial', value: trialUsers, icon: Clock, bg: 'bg-amber-50 text-amber-600' },
          { label: 'Premium Nodes', value: paidUsers, icon: TrendingUp, bg: 'bg-emerald-50 text-[#0D9B8A]' },
          { label: 'Expired/Dead', value: expiredUsers, icon: AlertTriangle, bg: 'bg-rose-50 text-red-600' },
          { label: 'Avg Longevity', value: `${avgDaysLeft}d`, icon: Shield, bg: 'bg-emerald-50 text-[#0D9B8A]' },
        ].map((kpi, i) => (
          <div key={i} className="tp-card p-6 flex items-center gap-4">
            <div className={`p-3 rounded-full ${kpi.bg}`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="tp-card overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Registry Records</h3>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search registry..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">System Identity</th>
                <th className="px-6 py-4">Operator Info</th>
                <th className="px-6 py-4">Access Status</th>
                <th className="px-6 py-4">Authority Sync</th>
                <th className="px-6 py-4 text-right">Node Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-16 text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Scanning Registry...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-slate-400 text-xs font-bold uppercase tracking-widest">No Identities Found</td></tr>
              ) : filtered.map(user => (
                <tr key={user.id} className={`hover:bg-slate-50/50 transition-all group ${user.is_locked ? 'bg-slate-50/80 grayscale' : ''}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.email || 'System Node'}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <span className="text-[8px] font-bold bg-slate-955 text-slate-400 uppercase tracking-widest">ID</span>
                           <code className="text-[9px] text-slate-400 font-mono tracking-tight">{user.id.slice(0, 12)}...</code>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-700">{user.business_name || 'Generic Node'}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{user.phone || 'No Phone Sync'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${getStatusColor(user.display_status)}`}>
                      {user.display_status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {editingId === user.id ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                        <input
                          type="number"
                          min={0}
                          max={365}
                          value={newDays}
                          onChange={e => setNewDays(Number(e.target.value))}
                          placeholder="+ Days"
                          className="w-20 bg-slate-900 text-emerald-400 border-none rounded-lg px-2.5 py-1.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateDays(user.id)}
                          disabled={saving}
                          className="bg-emerald-500 text-white rounded-lg p-1.5 hover:scale-105 transition-all disabled:opacity-50"
                        >
                          {saving ? <X className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-slate-200 text-slate-500 rounded-lg p-1.5 hover:bg-slate-300 transition-all"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${getDaysColor(user.days_remaining)}`}>
                          {user.days_remaining >= 999 ? 'LIFETIME' : user.days_remaining <= 0 ? 'EXPIRED' : `${user.days_remaining}D`}
                        </span>
                        <button
                          onClick={() => { setEditingId(user.id); setNewDays(user.days_remaining || 14) }}
                          className="text-slate-300 hover:text-[#0D9B8A] p-1 rounded transition-all"
                          title="Override Node Plan"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => handleToggleLock(user.id, user.is_locked)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer
                        ${user.is_locked 
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'}`}
                    >
                      {user.is_locked ? 'Authorize' : 'Suspend'}
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
