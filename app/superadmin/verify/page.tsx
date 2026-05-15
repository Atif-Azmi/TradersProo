'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react'

const VAULT_PASSWORD = 'atifdev7'

export default function SuperadminVerifyPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Verify user is actually a superadmin, else kick out
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      
      const { data: sa } = await supabase
        .from('tp_super_admin')
        .select('id')
        .eq('id', user.id)
        .single()
      
      const isHardcoded = user.email === 'superadmin@trader.com'
      if (!sa && !isHardcoded) router.push('/dashboard')
    }
    check()
  }, [])

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simulate delay for security
    setTimeout(() => {
      if (password === VAULT_PASSWORD) {
        // Store verified flag in sessionStorage (cleared on tab close)
        sessionStorage.setItem('sa_verified', 'true')
        router.push('/superadmin')
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        setError(
          newAttempts >= 3 
            ? 'Too many failed attempts. Access locked for this session.'
            : 'Incorrect vault password. Access denied.'
        )
        setPassword('')
        if (newAttempts >= 3) {
          setTimeout(() => router.push('/dashboard'), 2000)
        }
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Security badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl mb-4">
            <Lock className="text-red-400 h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Vault Access</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Superadmin Control Plane • Level 2 Auth</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-[2rem] p-10 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3 mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <ShieldCheck className="text-amber-400 h-5 w-5 flex-shrink-0" />
            <p className="text-amber-300 text-[10px] font-black uppercase tracking-widest leading-relaxed">
              Identity confirmed. Enter vault password to proceed.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Vault Credentials
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={attempts >= 3}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-4 text-white font-mono text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 transition-all"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
              </div>
            )}

            {attempts > 0 && attempts < 3 && (
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] text-center">
                {3 - attempts} verification attempt(s) remaining
              </p>
            )}

            <button
              type="submit"
              disabled={loading || attempts >= 3}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-red-900/20 disabled:opacity-50"
            >
              {loading ? 'Decrypting...' : 'Unlock Vault'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-700 text-[9px] font-black uppercase tracking-[0.5em] mt-10">
          Unauthorized Access is Strictly Prohibited
        </p>
      </div>
    </div>
  )
}
