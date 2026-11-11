'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Security measures
  const [websiteHoneypot, setWebsiteHoneypot] = useState('') // Honeypot field
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  const router = useRouter()
  const supabase = createClient()

  // Track lockout countdown
  useEffect(() => {
    if (lockoutTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000))
        setTimeLeft(remaining)
        if (remaining <= 0) {
          setLockoutTime(null)
          setFailedAttempts(0)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [lockoutTime])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Honeypot check: If bot filled this hidden field, discard submission quietly
    if (websiteHoneypot) {
      console.log('Bot detected via honeypot!')
      setError('Invalid request submission')
      return
    }

    // 2. Lockout check
    if (lockoutTime && Date.now() < lockoutTime) {
      setError(`Too many failed attempts. Locked out. Please try again in ${timeLeft} seconds.`)
      return
    }

    setLoading(true)
    setError(null)
    
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      const nextFailures = failedAttempts + 1
      setFailedAttempts(nextFailures)
      
      // Limit to 5 attempts before a 60-second progressive block
      if (nextFailures >= 5) {
        const blockPeriod = Date.now() + 60 * 1000 // 1 minute progressive lockout
        setLockoutTime(blockPeriod)
        setTimeLeft(60)
        setError('Too many failed attempts. Try again in 60 seconds.')
      } else {
        // Broad/generic security error message
        setError('Invalid login credentials')
      }
      setLoading(false)
    } else {
      setFailedAttempts(0)
      setLockoutTime(null)

      // Check if superadmin
      const { data: sa } = await supabase
        .from('tp_super_admin')
        .select('id')
        .eq('id', data.user.id)
        .single()

      const isHardcodedSuperAdmin = data.user.email === 'atifazmi0710@gmail.com' || data.user.email === 'superadmin@trader.in'

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
    <div className="flex flex-col justify-center">
       <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-[#B4E0CA] text-[#1E3121] rounded-full flex items-center justify-center shadow-warm-pill">
             <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#3E3B36] dark:text-[#EDE9E3]">Traders<span className="text-[#88A993]">Pro</span></span>
       </div>
       
       <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#3E3B36] dark:text-[#EDE9E3]">Welcome back</h2>
          <p className="text-sm text-[#7A756F] dark:text-[#A8A39B] font-medium mt-1">Sign in to continue to TradersPro.</p>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => handleOAuthLogin('google')}
            disabled={loading || !!lockoutTime}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-[#CAC8C0] dark:border-[#45433E] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] transition-all font-bold text-sm text-[#3E3B36] dark:text-[#EDE9E3] disabled:opacity-50 min-h-[44px] cursor-pointer tap-scale"
            aria-label="Sign in with Google"
          >
             <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
          </button>
          <button 
            onClick={() => handleOAuthLogin('facebook')}
            disabled={loading || !!lockoutTime}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-[#CAC8C0] dark:border-[#45433E] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] transition-all font-bold text-sm text-[#3E3B36] dark:text-[#EDE9E3] disabled:opacity-50 min-h-[44px] cursor-pointer tap-scale"
            aria-label="Sign in with Facebook"
          >
             <svg className="h-4 w-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
               <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
             </svg>
             Facebook
          </button>
       </div>

       <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#CAC8C0] dark:border-[#45433E]"></div></div>
          <span className="relative bg-[#E9E4DE] dark:bg-[#2A2926] px-4 text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">or continue with email</span>
       </div>

       <form className="space-y-6" onSubmit={handleLogin}>
          {/* Honeypot field (hidden from view) */}
          <div className="hidden" aria-hidden="true">
            <input 
              type="text" 
              name="website" 
              value={websiteHoneypot} 
              onChange={(e) => setWebsiteHoneypot(e.target.value)} 
              tabIndex={-1} 
              autoComplete="off" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-2 ml-1">Email address</label>
            <input
              type="email"
              required
              className="tp-input w-full min-h-[44px]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || !!lockoutTime}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
               <label className="block text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest ml-1">Password</label>
               <Link href="/forgot-password" className="text-[10px] font-bold text-[#1E3121] dark:text-[#B4E0CA] hover:underline transition-colors min-h-[44px] flex items-center">Forgot password?</Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="tp-input w-full min-h-[44px] pr-12"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || !!lockoutTime}
                autoComplete="current-password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B] dark:hover:text-[#EDE9E3] transition-colors p-2 cursor-pointer flex items-center justify-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading || !!lockoutTime}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <input type="checkbox" id="remember-me" className="w-4 h-4 rounded border-[#CAC8C0] text-[#88A993] focus:ring-[#B4E0CA] cursor-pointer" />
             <label htmlFor="remember-me" className="text-xs font-medium text-[#7A756F] dark:text-[#A8A39B] cursor-pointer select-none">Remember me</label>
          </div>

          {error && <div className="text-[#4A1D14] dark:text-[#D98A7B] text-xs font-bold text-center bg-[#D98A7B]/20 p-3 rounded-full border border-[#D98A7B]/40">{error}</div>}

          <button
            type="submit"
            disabled={loading || !!lockoutTime}
            className="w-full tp-button-primary py-3 disabled:opacity-50 min-h-[48px] cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#1E3121]" />
                <span>Processing Login...</span>
              </>
            ) : lockoutTime ? (
              <span>Locked Out ({timeLeft}s)</span>
            ) : (
              <span>Log In</span>
            )}
          </button>
       </form>

       <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-[#7A756F] dark:text-[#A8A39B] font-medium">
            Don't have an account? <Link href="/register" className="font-bold text-[#1E3121] dark:text-[#B4E0CA] hover:underline min-h-[44px]">Sign up</Link>
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B] dark:hover:text-[#EDE9E3] transition-all uppercase tracking-widest min-h-[44px]">
             <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
       </div>
    </div>
  )
}
