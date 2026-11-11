'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Building2, ArrowRight, Loader2, MapPin, Phone, Check } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [businessName, setBusinessName] = useState('')
  const [supportPhone, setSupportPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [gst, setGst] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const supabase = createClient()

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!businessName.trim())
      newErrors.businessName = 'Business name is required'

    if (!supportPhone.trim())
      newErrors.supportPhone = 'Support phone is required'
    else if (!/^\+91\s?\d{5}\s?\d{5}$/.test(supportPhone.trim()))
      newErrors.supportPhone = 'Format must be +91 XXXXX XXXXX'

    if (gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst.trim()))
      newErrors.gst = 'Invalid GST format'

    if (!address.trim())
      newErrors.address = 'Registered address is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveBusinessDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Session expired. Please login again.')
      router.push('/login')
      return
    }

    const formData = { 
      user_id: user.id,
      business_name: businessName.trim(),
      support_phone: supportPhone.trim(),
      registered_address: address.trim(),
      city: city.trim() || null,
      state: state.trim() || null,
      gst_number: gst.trim() || null,
      updated_at: new Date().toISOString()
    }

    const { error: profileError } = await supabase
      .from('business_profile')
      .upsert(formData, { onConflict: 'user_id' })

    if (profileError) {
      console.error('Save error:', profileError)
      toast.error(profileError.message)
      setLoading(false)
      return
    }

    // Save to localStorage as cache
    localStorage.setItem('business_profile', JSON.stringify(formData))
    
    toast.success('Business identity saved successfully')
    setLoading(false)
    setStep(2)
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E0DCD6] dark:bg-[#1F1E1B] px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-right" />
      <div className="w-full max-w-xl space-y-10 bg-[#F2EEE9] dark:bg-[#2A2926] p-8 sm:p-14 rounded-[28px] shadow-warm-raised border border-[#CAC8C0] dark:border-[#45433E]">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 bg-[#B4E0CA] text-[#1E3121] rounded-full flex items-center justify-center mb-6 shadow-warm-pill">
            <Building2 className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#3E3B36] dark:text-[#EDE9E3] uppercase leading-none">
            Initialize Business
          </h2>
          <p className="mt-3 text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-[0.25em]">
            Configure your enterprise identity
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1 max-w-xs mx-auto">
          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-[#CAC8C0] dark:bg-[#45433E]">
            <div 
              style={{ width: `${(step / 2) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#B4E0CA] transition-all duration-700 rounded-full"
            ></div>
          </div>
        </div>

        {step === 1 && (
          <form className="mt-10 space-y-6" onSubmit={handleSaveBusinessDetails}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-2 ml-1">Business Legal Name *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A756F] dark:text-[#A8A39B]">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    value={businessName} 
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={`block w-full rounded-full border ${errors.businessName ? 'border-[#D98A7B]' : 'border-[#CAC8C0] dark:border-[#45433E]'} bg-[#F2EEE9] dark:bg-[#33322E] py-3 pl-12 pr-4 text-[#3E3B36] dark:text-[#EDE9E3] text-sm font-bold focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] outline-none transition-all placeholder:text-[#7A756F]/60`} 
                    placeholder="E.g. F.K.S. Traders" 
                  />
                </div>
                {errors.businessName && <p className="mt-1 text-[10px] text-[#4A1D14] dark:text-[#D98A7B] font-bold uppercase ml-1">{errors.businessName}</p>}
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-2 ml-1">Support Phone *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A756F] dark:text-[#A8A39B]">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    value={supportPhone} 
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className={`block w-full rounded-full border ${errors.supportPhone ? 'border-[#D98A7B]' : 'border-[#CAC8C0] dark:border-[#45433E]'} bg-[#F2EEE9] dark:bg-[#33322E] py-3 pl-12 pr-4 text-[#3E3B36] dark:text-[#EDE9E3] text-sm font-bold focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] outline-none transition-all placeholder:text-[#7A756F]/60`} 
                    placeholder="+91 00000 00000" 
                  />
                </div>
                {errors.supportPhone && <p className="mt-1 text-[10px] text-[#4A1D14] dark:text-[#D98A7B] font-bold uppercase ml-1">{errors.supportPhone}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-2 ml-1">GST Identification</label>
                <input 
                  type="text" 
                  value={gst} 
                  onChange={(e) => setGst(e.target.value)}
                  className={`block w-full rounded-full border ${errors.gst ? 'border-[#D98A7B]' : 'border-[#CAC8C0] dark:border-[#45433E]'} bg-[#F2EEE9] dark:bg-[#33322E] py-3 px-5 text-[#3E3B36] dark:text-[#EDE9E3] text-sm font-black focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] outline-none transition-all uppercase placeholder:text-[#7A756F]/60`} 
                  placeholder="23ABCDE1234F1Z5" 
                />
                {errors.gst && <p className="mt-1 text-[10px] text-[#4A1D14] dark:text-[#D98A7B] font-bold uppercase ml-1">{errors.gst}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-2 ml-1">Registered Address *</label>
                <div className="relative">
                  <div className="absolute left-4 top-4 text-[#7A756F] dark:text-[#A8A39B]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className={`block w-full rounded-2xl border ${errors.address ? 'border-[#D98A7B]' : 'border-[#CAC8C0] dark:border-[#45433E]'} bg-[#F2EEE9] dark:bg-[#33322E] py-3 pl-12 pr-4 text-[#3E3B36] dark:text-[#EDE9E3] text-sm font-medium focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] outline-none transition-all placeholder:text-[#7A756F]/60`} 
                    rows={2} 
                    placeholder="Full business address..." 
                  />
                </div>
                {errors.address && <p className="mt-1 text-[10px] text-[#4A1D14] dark:text-[#D98A7B] font-bold uppercase ml-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-2 ml-1">City</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full rounded-full border border-[#CAC8C0] dark:border-[#45433E] bg-[#F2EEE9] dark:bg-[#33322E] py-3 px-5 text-[#3E3B36] dark:text-[#EDE9E3] text-sm font-bold focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mb-2 ml-1">State</label>
                <input 
                  type="text" 
                  value={state} 
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full rounded-full border border-[#CAC8C0] dark:border-[#45433E] bg-[#F2EEE9] dark:bg-[#33322E] py-3 px-5 text-[#3E3B36] dark:text-[#EDE9E3] text-sm font-bold focus:ring-2 focus:ring-[#B4E0CA]/60 focus:border-[#88A993] outline-none transition-all" 
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={handleSkip} 
                className="flex-1 rounded-full bg-[#E9E4DE] dark:bg-[#2A2926] px-6 py-3.5 text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest border border-[#CAC8C0] dark:border-[#45433E] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] transition-all tap-scale"
              >
                Setup Later
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 rounded-full bg-[#B4E0CA] hover:bg-[#9CCDB4] px-6 py-3.5 text-[10px] font-black text-[#1E3121] uppercase tracking-widest shadow-warm-pill transition-all disabled:opacity-50 flex items-center justify-center gap-2 tap-scale"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin text-[#1E3121]" /> : 'Finalize Identity'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="mt-8 text-center py-10">
            <div className="mx-auto w-20 h-20 bg-[#B4E0CA]/20 rounded-full flex items-center justify-center mb-8">
               <div className="w-12 h-12 bg-[#B4E0CA] rounded-full flex items-center justify-center shadow-warm-pill text-[#1E3121]">
                  <Check className="h-6 w-6 stroke-[3]" />
               </div>
            </div>
            <h3 className="text-2xl font-black text-[#3E3B36] dark:text-[#EDE9E3] uppercase">Configuration Complete</h3>
            <p className="mt-3 text-sm font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-wider max-w-xs mx-auto">Your business identity has been verified. Welcome to the dashboard.</p>
            <div className="mt-8 flex justify-center">
               <button onClick={handleSkip} className="w-full max-w-xs rounded-full bg-[#B4E0CA] hover:bg-[#9CCDB4] px-8 py-3.5 text-xs font-black text-[#1E3121] uppercase tracking-[0.2em] shadow-warm-pill transition-all tap-scale">
                Enter Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
