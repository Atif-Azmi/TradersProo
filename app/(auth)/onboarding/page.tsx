'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { error: profileError } = await supabase
      .from('tp_profile')
      .upsert({ 
        user_id: user.id,
        business_name: businessName,
        phone,
        address,
        city,
        state,
        gst_number: gst
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Welcome to TradersPro
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Let's set up your business profile
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleSaveBusinessDetails}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-slate-900">Business Name</label>
                <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-slate-900">Phone</label>
                <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-slate-900">Address</label>
                <textarea required value={address} onChange={(e) => setAddress(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">City</label>
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">State</label>
                <input type="text" required value={state} onChange={(e) => setState(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-slate-900">GST Number (Optional)</label>
                <input type="text" value={gst} onChange={(e) => setGst(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="flex gap-4">
              <button type="button" onClick={handleSkip} className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                Skip for now
              </button>
              <button type="submit" disabled={loading} className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50">
                {loading ? 'Saving...' : 'Next Step'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="mt-8 text-center">
            <h3 className="text-lg font-medium text-slate-900">Step 2: Add your first product</h3>
            <p className="mt-2 text-sm text-slate-500">You can add your inventory now or do it later from the dashboard.</p>
            <div className="mt-6 flex justify-center gap-4">
               <button onClick={handleSkip} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                Skip to Dashboard
              </button>
               {/* Later, we can add a mini form here for adding a product */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
