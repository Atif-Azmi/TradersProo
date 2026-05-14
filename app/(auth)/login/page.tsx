'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck, User, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<'admin' | 'superadmin'>('admin')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // In a real app, we'd check the user's role in tp_user_profiles here
      // For now, if they selected superadmin, we redirect to /superadmin
      if (role === 'superadmin') {
        router.push('/superadmin')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200 border border-slate-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="text-primary h-8 w-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            TradersPro Management
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Please enter your credentials to continue.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
           <button 
             onClick={() => setRole('admin')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${role === 'admin' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <User className="h-4 w-4" /> Admin
           </button>
           <button 
             onClick={() => setRole('superadmin')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${role === 'superadmin' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <ShieldCheck className="h-4 w-4" /> Superadmin
           </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address *</label>
              <input
                type="email"
                required
                className="block w-full rounded-xl border-slate-200 py-3 text-slate-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm px-4 outline-none border transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full rounded-xl border-slate-200 py-3 text-slate-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm px-4 outline-none border transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
              <label className="ml-2 text-sm font-medium text-slate-500">Remember me</label>
            </div>
            <div className="text-sm">
              <Link href="#" className="font-bold text-primary hover:text-green-600 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          {error && <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center rounded-xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-green-100 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all uppercase tracking-widest"
          >
            {loading ? 'Authenticating...' : `Sign in as ${role}`}
          </button>
        </form>

        <div className="text-center space-y-4">
          <p className="text-sm text-slate-500 font-medium">
            Don't have an account? <Link href="/register" className="font-bold text-primary hover:text-green-600">Sign up</Link>
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
