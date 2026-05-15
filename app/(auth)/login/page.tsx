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
      // Check if superadmin
      const { data: sa } = await supabase
        .from('tp_super_admin')
        .select('id')
        .eq('id', data.user.id)
        .single()

      const isHardcodedSuperAdmin = data.user.email === 'superadmin@trader.com'

      if (sa || isHardcodedSuperAdmin) {
        router.push('/superadmin/verify')
        router.refresh()
        return
      }

      // Check if user has a profile (handles manually created users in DB)
      const { data: profile } = await supabase
        .from('tp_profile')
        .select('id')
        .eq('user_id', data.user?.id)
        .single()

      if (!profile) {
        // No profile found, redirect to onboarding
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9] p-4 font-sans">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 min-h-[700px]">
        {/* Interaction Side */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
           <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center text-white">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">TradersPro</span>
           </div>
           
           <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Sign in to continue to TradersPro.</p>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-sm text-slate-700 disabled:opacity-50"
              >
                 <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
              </button>
              <button 
                onClick={() => handleOAuthLogin('facebook')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-sm text-slate-700 disabled:opacity-50"
              >
                 <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center text-[10px] text-white">f</div> Facebook
              </button>
           </div>

           <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or continue with email</span>
           </div>

           <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email address</label>
                <input
                  type="email"
                  required
                  className="tp-input w-full"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                   <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors">Forgot password?</Link>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="tp-input w-full"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                 <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]" />
                 <label className="text-xs font-medium text-slate-400">Remember me</label>
              </div>

              {error && <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full tp-button-primary py-3 shadow-xl shadow-[#0D9488]/20 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
           </form>

           <div className="mt-8 text-center space-y-4">
              <p className="text-xs text-slate-400 font-medium">
                Don't have an account? <Link href="/register" className="font-bold text-[#0D9488] hover:underline">Sign up</Link>
              </p>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest">
                 <ArrowLeft className="h-3 w-3" /> Back to home
              </Link>
           </div>
        </div>

        {/* Visual Side */}
        <div className="hidden lg:flex bg-[#D1E5E3] items-center justify-center p-20 relative overflow-hidden">
           <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E5B5A8]/30 rounded-full blur-3xl" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0D9488]/10 rounded-full blur-3xl" />
           
           <div className="relative z-10 flex flex-col items-center">
              {/* Modern Abstract Illustration (Simplified CSS Version) */}
              <div className="flex items-end gap-4 h-80">
                 <div className="w-16 bg-slate-800 rounded-t-full h-full" />
                 <div className="w-24 bg-[#E5B5A8] rounded-full h-[60%] mb-10" />
                 <div className="w-12 bg-orange-600 rounded-full h-[80%] mb-4" />
                 <div className="w-20 bg-slate-900 rounded-sm h-[40%] mb-12" />
              </div>
              <div className="mt-12 text-center">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Infrastructure</h3>
                 <p className="text-slate-600 font-medium mt-2">The next generation of business management.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
