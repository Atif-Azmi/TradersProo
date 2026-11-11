'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AnimatedBars, { defaultRegisterBars } from '@/components/common/AnimatedBars'

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
    <div className="min-h-screen flex items-center justify-center bg-[#E0DCD6] dark:bg-[#1F1E1B] p-4 font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-[#F2EEE9] dark:bg-[#2A2926] rounded-[24px] overflow-hidden shadow-warm-raised border border-[#CAC8C0] dark:border-[#45433E] min-h-[700px]">
        {/* Interaction Side */}
        <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
           <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 bg-[#B4E0CA] text-[#1E3121] rounded-full flex items-center justify-center shadow-warm-pill">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#3E3B36] dark:text-[#EDE9E3]">
                Traders<span className="text-[#3F6B52] dark:text-[#B4E0CA]">Pro</span>
              </span>
           </div>
           
           <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#3E3B36] dark:text-[#EDE9E3]">Create an account</h2>
              <p className="text-sm text-[#7A756F] dark:text-[#A8A39B] font-medium mt-1">Start your 14-day free trial today.</p>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-[#CAC8C0] dark:border-[#45433E] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] transition-all font-bold text-xs text-[#3E3B36] dark:text-[#EDE9E3] disabled:opacity-50 min-h-[44px] cursor-pointer tap-scale"
              >
                 <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
              </button>
              <button 
                onClick={() => handleOAuthLogin('facebook')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-[#CAC8C0] dark:border-[#45433E] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] transition-all font-bold text-xs text-[#3E3B36] dark:text-[#EDE9E3] disabled:opacity-50 min-h-[44px] cursor-pointer tap-scale"
              >
                 <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white">f</div> Facebook
              </button>
           </div>

           <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#CAC8C0] dark:border-[#45433E]"></div></div>
              <span className="relative bg-[#E9E4DE] dark:bg-[#2A2926] px-4 text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">or sign up with email</span>
           </div>

           <form className="space-y-4" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
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
                  <label className="block text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Business Name</label>
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
                <label className="block text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Email address</label>
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
                  <label className="block text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Password</label>
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
                  <label className="block text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-1.5 ml-1">Confirm</label>
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
                 <input type="checkbox" required className="w-4 h-4 rounded border-[#CAC8C0] text-[#88A993] focus:ring-[#B4E0CA]" />
                 <label className="text-[11px] font-medium text-[#7A756F] dark:text-[#A8A39B]">I agree to the <Link href="#" className="text-[#1E3121] dark:text-[#B4E0CA] font-bold">Terms & Conditions</Link></label>
              </div>

              {error && <div className="text-[#4A1D14] dark:text-[#D98A7B] text-xs font-bold text-center bg-[#D98A7B]/20 p-2.5 rounded-full border border-[#D98A7B]/40">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full tp-button-primary py-2.5 disabled:opacity-50 mt-2 min-h-[44px]"
              >
                {loading ? 'Creating account...' : 'Start 14-day Free Trial'}
              </button>
           </form>

           <div className="mt-6 text-center space-y-4">
              <p className="text-xs text-[#7A756F] dark:text-[#A8A39B] font-medium">
                Already have an account? <Link href="/login" className="font-bold text-[#1E3121] dark:text-[#B4E0CA] hover:underline min-h-[44px]">Sign in</Link>
              </p>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B] dark:hover:text-[#EDE9E3] transition-all uppercase tracking-widest min-h-[44px]">
                 <Plus className="h-3 w-3 rotate-45" /> Back to home
              </Link>
           </div>
        </div>

        {/* Visual Side */}
        <div className="hidden lg:flex bg-[#E0DCD6] dark:bg-[#22211E] items-center justify-center p-20 relative overflow-hidden border-l border-[#CAC8C0]/60 dark:border-[#45433E]/60">
           <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B4E0CA]/35 rounded-full blur-3xl animated-panel-bg" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#88A993]/20 rounded-full blur-3xl animated-panel-bg" style={{ animationDelay: '-10s' }} />
           
           <div className="relative z-10 flex flex-col items-center">
              <AnimatedBars bars={defaultRegisterBars} className="!h-64" />
              <div className="mt-10 text-center max-w-sm">
                 <h3 className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3] tracking-tight">Scale Your Operations</h3>
                 <p className="text-[#7A756F] dark:text-[#A8A39B] font-medium mt-2 text-sm">Join thousands of businesses managing their enterprise flow with TradersPro Intelligence.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
