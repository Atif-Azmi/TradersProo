'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Building2, ArrowRight, Loader2, MapPin, Phone } from 'lucide-react'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [gst, setGst] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const handleSaveBusinessDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Rule #8: NO manual user_id.
    const { error: profileError } = await supabase
      .from('tp_profile')
      .upsert({ 
        business_name: businessName,
        phone,
        address,
        city,
        state,
        gst_number: gst,
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setStep(2)
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F7F9] px-4 py-12 sm:px-6 lg:px-8 font-['Outfit',sans-serif]">
      <div className="w-full max-w-xl space-y-10 bg-white p-10 sm:p-20 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 bg-[#EBF4F3] rounded-2xl flex items-center justify-center mb-8">
            <Building2 className="h-7 w-7 text-[#0D9488]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#0F172A] uppercase italic leading-none">
            Initialize Business
          </h2>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">
            Configure your enterprise identity
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1 max-w-xs mx-auto">
          <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-slate-100">
            <div 
              style={{ width: `${(step / 2) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#0D9488] transition-all duration-700 rounded-full"
            ></div>
          </div>
        </div>

        {step === 1 && (
          <form className="mt-10 space-y-8" onSubmit={handleSaveBusinessDetails}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Business Legal Name *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={businessName} 
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-100 bg-[#F8FAFC] py-4 pl-12 pr-4 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all placeholder:text-slate-300" 
                    placeholder="E.g. F.K.S. Traders" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Support Phone *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-100 bg-[#F8FAFC] py-4 pl-12 pr-4 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all placeholder:text-slate-300" 
                    placeholder="+91 00000 00000" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">GST Identification</label>
                <input 
                  type="text" 
                  value={gst} 
                  onChange={(e) => setGst(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-100 bg-[#F8FAFC] py-4 px-6 text-slate-900 text-sm font-black focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all uppercase placeholder:text-slate-300" 
                  placeholder="23ABCDE1234F1Z5" 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Registered Address *</label>
                <div className="relative">
                  <div className="absolute left-4 top-5 text-slate-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <textarea 
                    required 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-100 bg-[#F8FAFC] py-4 pl-12 pr-4 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all placeholder:text-slate-300" 
                    rows={2} 
                    placeholder="Full business address..." 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">City</label>
                <input 
                  type="text" 
                  required 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-100 bg-[#F8FAFC] py-4 px-6 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">State</label>
                <input 
                  type="text" 
                  required 
                  value={state} 
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-100 bg-[#F8FAFC] py-4 px-6 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all" 
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-[10px] font-black text-center bg-red-50 p-4 rounded-xl border border-red-100 uppercase tracking-widest">{error}</div>}

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={handleSkip} 
                className="flex-1 rounded-2xl bg-white px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 hover:bg-slate-50 transition-all"
              >
                Setup Later
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 rounded-2xl bg-[#0D9488] px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-[#0D9488]/20 hover:bg-[#0B7A70] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Finalize Identity'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="mt-8 text-center py-12">
            <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8">
               <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                  <Check className="h-6 w-6 text-white" />
               </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic">Configuration Complete</h3>
            <p className="mt-4 text-sm font-bold text-slate-400 uppercase tracking-widest max-w-xs mx-auto">Your business identity has been verified. Welcome to the dashboard.</p>
            <div className="mt-10 flex justify-center gap-4">
               <button onClick={handleSkip} className="w-full max-w-xs rounded-2xl bg-slate-900 px-8 py-4 text-xs font-black text-white uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all">
                Enter Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
