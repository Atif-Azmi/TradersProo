'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, ShieldAlert, Sparkles, RefreshCw, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SubscriptionClient() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const features = [
    'Unlimited customer records',
    'Infinite sales invoices & billing items',
    'Full financial analytics & dynamic report exports',
    'Branded PDF invoices & statements',
    'WhatsApp transaction sharing with secure signed links',
    'Automated stock movement & low-level alerts',
    'Advances & payments cashflow reconciliation ledger',
    'Priority 24/7 dedicated customer success support',
  ]

  // Listen for real-time changes to the profile
  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('tp_profile')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) setProfile(data)
      }
    }
    
    getProfile()

    const channel = supabase
      .channel('profile_subscription_client')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'tp_profile' 
      }, (payload) => {
        setProfile(payload.new)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const sendSubscriptionSuccessWhatsApp = (phone: string, businessName: string, planExpiry: string, paymentId: string) => {
    const message = `
*TradersPro Yearly Plan Upgraded* 🎉
*Elite Annual Pass Activated*

Dear *${businessName || 'Merchant'}*,

Thank you for choosing *TradersPro*! Your payment was successful and your account has been upgraded to the **Elite Annual Pass** plan.

💳 *Payment ID:* ${paymentId}
📅 *Validity until:* ${planExpiry}
🚀 *Benefits:* Unlimited Customers, Infinite Bills, Advanced Analytics & WhatsApp sharing!

Let's scale your business operations to new heights!

_TradersPro — Professional Billing Suite_
    `.trim()

    const normalized = phone.replace(/\D/g, '') || ''
    const whatsappNumber = normalized.startsWith('91')
      ? normalized
      : `91${normalized}`

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleUpgrade = async () => {
    setLoading(true)
    const success = await loadRazorpayScript()
    if (!success) {
      alert('Failed to load Razorpay payment gateway. Please check your internet connection.')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('User session not found. Please log in again.')
      setLoading(false)
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_tradersprokey', // Dynamic Razorpay Key ID
      amount: 495900, // INR 4,959 in paise (₹4,959.00)
      currency: 'INR',
      name: 'TradersPro',
      description: 'Elite Annual Pass Subscription',
      image: '/icons/icon-192x192.png',
      handler: async function (response: any) {
        try {
          const expiryDate = new Date()
          expiryDate.setFullYear(expiryDate.getFullYear() + 1)
          const formattedExpiry = expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

          // 1. Instantly transition client-side state so UI feels fluid, smooth and fast!
          setProfile((prev: any) => ({
            ...prev,
            plan_type: 'Elite',
            plan_expiry: expiryDate.toISOString()
          }))

          // 2. Perform background database update in Supabase
          const { error } = await supabase
            .from('tp_profile')
            .update({
              plan_type: 'Elite',
              plan_expiry: expiryDate.toISOString()
            })
            .eq('id', user.id)

          if (error) throw error

          alert(`Subscription upgraded successfully! Payment ID: ${response.razorpay_payment_id}`)

          // 3. Automatically dispatch WhatsApp receipt message to registered number
          if (profile?.phone) {
            sendSubscriptionSuccessWhatsApp(
              profile.phone,
              profile.business_name || 'Hardware Merchant',
              formattedExpiry,
              response.razorpay_payment_id
            )
          } else {
            const userPhone = prompt('Enter your WhatsApp number to receive your activation receipt:')
            if (userPhone) {
              sendSubscriptionSuccessWhatsApp(
                userPhone,
                profile?.business_name || 'Hardware Merchant',
                formattedExpiry,
                response.razorpay_payment_id
              )
            }
          }
        } catch (err: any) {
          alert('Error activating subscription: ' + err.message)
        }
      },
      prefill: {
        name: user.email?.split('@')[0] || 'Hardware Trader',
        email: user.email || ''
      },
      theme: {
        color: '#0D9B8A' // Teal theme accent
      }
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.open()
    setLoading(false)
  }

  const isElite = profile?.plan_type === 'Elite'
  const daysLeft = profile?.plan_expiry 
    ? Math.max(0, Math.ceil((new Date(profile.plan_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 14

  const expiryDateString = profile?.plan_expiry 
    ? new Date(profile.plan_expiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Subscription</h2>
      </div>

      {/* Subscription Status Snapshot */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="tp-card p-6 flex flex-col justify-between md:col-span-1">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Status</p>
            <p className="text-xl font-black text-slate-900 uppercase tracking-tight italic">
              {isElite ? 'Elite Active Pass' : 'Trial Period'}
            </p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4 mb-4 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${isElite ? 'bg-emerald-500' : 'bg-[#0D9488]'}`} 
                style={{ width: isElite ? '100%' : '15%' }}
              ></div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-50">
            {isElite ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1.5 w-full">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Active until <span className="text-slate-900">{expiryDateString}</span> ({daysLeft} days left)</span>
              </span>
            ) : (
              <span className="text-slate-400 font-bold flex items-center gap-1.5 w-full">
                <ShieldAlert className="h-4 w-4 text-[#0D9B8A] shrink-0" />
                <span>Expires in <span className="text-slate-900">{daysLeft} business days</span></span>
              </span>
            )}
          </div>
        </div>

        {/* Plan Card */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl ring-2 ring-slate-800 text-white md:col-span-2 relative overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800/60">
          {/* Subtle accent light effect */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className={`absolute top-6 right-6 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg ${isElite ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-teal-500 shadow-teal-500/20'}`}>
            {isElite ? 'Elite Member' : 'Best Value'}
          </div>

          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isElite ? 'text-emerald-400' : 'text-teal-400'}`}>
              Elite Annual Pass
            </span>

            <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white mt-1">
              ALL-IN-ONE BUSINESS SUITE
            </h3>

            {/* HIGHLY VISIBLE & ATTRACTIVE PRICING SECTION */}
            <div className="mt-6 mb-4 flex items-center gap-x-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 w-fit">
              <div className="flex items-baseline gap-x-2">
                <span className="text-5xl font-extrabold tracking-tight text-emerald-400 drop-shadow-[0_4px_12px_rgba(52,211,153,0.3)]">
                  ₹4,959
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  / Year
                </span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                Full Access
              </span>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 bg-slate-800/50 px-3.5 py-2 rounded-xl border border-slate-700/30 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
              <RefreshCw className="h-3 w-3 text-teal-400 animate-spin duration-[4000ms]" /> 
              <span>Renewal Price Lock: Renew at ₹4,959/year (Same Cost Guaranteed)</span>
            </div>

            <div className="mt-8 border-t border-slate-800/80 pt-6">
              <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isElite ? 'text-emerald-400' : 'text-teal-400'}`}>
                Enterprise Features Included:
              </h4>
              <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs font-medium text-slate-300">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-x-2.5 items-start">
                    <CheckCircle2 className={`h-4 w-4 flex-none mt-0.5 ${isElite ? 'text-emerald-400' : 'text-teal-400'}`} aria-hidden="true" />
                    <span className="text-slate-200">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {isElite ? (
            <button
              disabled
              className="mt-8 block w-full rounded-xl bg-emerald-500 text-white py-4 text-center text-xs font-bold uppercase tracking-widest cursor-default shadow-lg shadow-emerald-500/20 font-bold border border-emerald-400/20"
            >
              Elite Premium Active ✓
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-teal-500 hover:bg-teal-600 text-white py-4 text-center text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 font-bold hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading Gateway...</span>
                </>
              ) : (
                <span>Upgrade & Activate Access</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
