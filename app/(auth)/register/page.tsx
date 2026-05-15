'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

import { ArrowLeft, ShieldCheck, Plus } from 'lucide-react'

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
        <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
           <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center text-white">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">TradersPro</span>
           </div>
           
           <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Create an account</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Start your 14-day free trial today.</p>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-xs text-slate-700 disabled:opacity-50"
              >
                 <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
              </button>
              <button 
                onClick={() => handleOAuthLogin('facebook')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-xs text-slate-700 disabled:opacity-50"
              >
                 <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center text-[10px] text-white">f</div> Facebook
              </button>
           </div>

           <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or sign up with email</span>
           </div>

           <form className="space-y-4" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="tp-input w-full py-2"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Business Name</label>
                  <input
                    type="text"
                    required
                    className="tp-input w-full py-2"
                    placeholder="ABC Ltd"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email address</label>
                <input
                  type="email"
                  required
                  className="tp-input w-full py-2"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                  <input
                    type="password"
                    required
                    className="tp-input w-full py-2"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Confirm</label>
                  <input
                    type="password"
                    required
                    className="tp-input w-full py-2"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <input type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]" />
                 <label className="text-[11px] font-medium text-slate-400">I agree to the <Link href="#" className="text-[#0D9488] font-bold">Terms & Conditions</Link></label>
              </div>

              {error && <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full tp-button-primary py-2.5 shadow-xl shadow-[#0D9488]/20 disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating account...' : 'Start 14-day Free Trial'}
              </button>
           </form>

           <div className="mt-6 text-center space-y-4">
              <p className="text-xs text-slate-400 font-medium">
                Already have an account? <Link href="/login" className="font-bold text-[#0D9488] hover:underline">Sign in</Link>
              </p>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest">
                 <Plus className="h-3 w-3 rotate-45" /> Back to home
              </Link>
           </div>
        </div>

        {/* Visual Side */}
        <div className="hidden lg:flex bg-[#EBF4F3] items-center justify-center p-20 relative overflow-hidden">
           <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E5B5A8]/20 rounded-full blur-3xl" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0D9488]/10 rounded-full blur-3xl" />
           
           <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-end gap-3 h-64">
                 <div className="w-12 bg-slate-900 rounded-t-full h-full" />
                 <div className="w-20 bg-[#0D9488] rounded-full h-[70%] mb-8" />
                 <div className="w-10 bg-[#E5B5A8] rounded-full h-[90%] mb-2" />
                 <div className="w-16 bg-slate-800 rounded-sm h-[50%] mb-10" />
              </div>
              <div className="mt-10 text-center max-w-sm">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Scale Your Operations</h3>
                 <p className="text-slate-500 font-medium mt-2 text-sm">Join thousands of businesses managing their enterprise flow with TradersPro Intelligence.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
