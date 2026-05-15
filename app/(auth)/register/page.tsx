'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

import { ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError(null)
    
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          business_name: businessName,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // The database trigger handles creating all profile records automatically
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200 border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Start your 14-day free trial today
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name *</label>
              <input
                type="text"
                required
                className="block w-full rounded-xl border-slate-200 py-3 text-slate-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm px-4 outline-none border transition-all"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Business Name *</label>
              <input
                type="text"
                required
                className="block w-full rounded-xl border-slate-200 py-3 text-slate-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm px-4 outline-none border transition-all"
                placeholder="ABC Hardware"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email address *</label>
              <input
                type="email"
                required
                className="block w-full rounded-xl border-slate-200 py-3 text-slate-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm px-4 outline-none border transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password *</label>
              <input
                type="password"
                required
                className="block w-full rounded-xl border-slate-200 py-3 text-slate-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm px-4 outline-none border transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Confirm Password *</label>
              <input
                type="password"
                required
                className="block w-full rounded-xl border-slate-200 py-3 text-slate-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm px-4 outline-none border transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center rounded-xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-green-100 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all uppercase tracking-widest"
          >
            {loading ? 'Creating account...' : 'Start 14-day Free Trial'}
          </button>
        </form>
        <div className="text-center space-y-4">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account? <Link href="/login" className="font-bold text-primary hover:text-green-600">Sign in</Link>
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
