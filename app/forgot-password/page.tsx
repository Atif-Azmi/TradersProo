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
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9] p-4 font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-[#0D9488]/10 rounded-2xl flex items-center justify-center text-[#0D9488] mb-6">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 text-center uppercase tracking-tight italic">Password Recovery</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center mt-2">Enter your email below to reset credentials</p>
        </div>

        {message ? (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-sm font-bold">
              {message}
            </div>
            <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black text-[#0D9488] hover:underline uppercase tracking-widest min-h-[44px]">
              <ArrowLeft className="h-4 w-4" /> Return to Login
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleReset}>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email address</label>
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
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full tp-button-primary py-3 shadow-xl shadow-[#0D9488]/20 disabled:opacity-50 min-h-[44px] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending instructions...</span>
                </>
              ) : (
                <span>Request Recovery Link</span>
              )}
            </button>

            <div className="text-center pt-4 border-t border-slate-50">
              <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest min-h-[44px]">
                <ArrowLeft className="h-3 w-3" /> Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
