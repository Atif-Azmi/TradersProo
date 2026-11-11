'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft, Loader2, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Recovery instructions have been sent to your email address.')
        setEmail('')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0DCD6] dark:bg-[#1F1E1B] p-4 font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-[#F2EEE9] dark:bg-[#2A2926] rounded-[24px] p-8 md:p-12 shadow-warm-raised border border-[#CAC8C0] dark:border-[#45433E]">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-[#B4E0CA] text-[#1E3121] rounded-full flex items-center justify-center mb-6 shadow-warm-pill">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-[#3E3B36] dark:text-[#EDE9E3] text-center uppercase tracking-tight">Password Recovery</h2>
          <p className="text-xs text-[#7A756F] dark:text-[#A8A39B] font-bold uppercase tracking-widest text-center mt-2">Enter your email below to reset credentials</p>
        </div>

        {message ? (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-[#B4E0CA]/40 border border-[#88A993]/40 rounded-2xl text-[#1E3121] text-sm font-bold">
              {message}
            </div>
            <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black text-[#1E3121] dark:text-[#B4E0CA] hover:underline uppercase tracking-widest min-h-[44px]">
              <ArrowLeft className="h-4 w-4" /> Return to Login
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleReset}>
            <div>
              <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-2 ml-1">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="tp-input w-full pl-11 min-h-[44px]"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-[#7A756F] dark:text-[#A8A39B] pointer-events-none" />
              </div>
            </div>

            {error && (
              <div className="text-[#4A1D14] dark:text-[#D98A7B] text-xs font-bold text-center bg-[#D98A7B]/20 p-3 rounded-full border border-[#D98A7B]/40">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full tp-button-primary py-3 disabled:opacity-50 min-h-[48px] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#1E3121]" />
                  <span>Sending instructions...</span>
                </>
              ) : (
                <span>Request Recovery Link</span>
              )}
            </button>

            <div className="text-center pt-4 border-t border-[#CAC8C0] dark:border-[#45433E]">
              <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B] dark:hover:text-[#EDE9E3] transition-colors uppercase tracking-widest min-h-[44px]">
                <ArrowLeft className="h-3 w-3" /> Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
