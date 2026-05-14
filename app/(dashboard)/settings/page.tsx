'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Profile state
  const [profile, setProfile] = useState<any>({
    business_name: '',
    tagline: '',
    phone: '',
    phone2: '',
    email: '',
    address: '',
    city: '',
    state: '',
    gst_number: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    upi_id: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('tp_profile')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setProfile(data)
      }
    }
    setLoading(false)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('tp_profile')
      .upsert({
        ...profile,
        user_id: user.id,
        updated_at: new Date().toISOString()
      })

    if (error) {
      alert(error.message)
    } else {
      alert('Profile updated successfully!')
    }
    setSaving(false)
  }

  const updateField = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your business profile, invoices, and account preferences.</p>
      </div>

      <div className="flex border-b border-slate-200 overflow-x-auto">
        {['profile', 'payment', 'invoice', 'account'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap capitalize ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab === 'profile' ? 'Business Profile' :
             tab === 'payment' ? 'Bank & UPI' :
             tab === 'invoice' ? 'Invoice Prefix' : 'Account'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        {loading ? (
          <div className="py-12 text-center text-slate-500">
             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
             Loading settings...
          </div>
        ) : (
          <>
            {activeTab === 'profile' && (
              <form className="space-y-6" onSubmit={handleSaveProfile}>
                <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Business Details</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-slate-900">Business Name</label>
                    <input type="text" value={profile.business_name} onChange={(e) => updateField('business_name', e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-slate-900">Tagline</label>
                    <input type="text" value={profile.tagline || ''} onChange={(e) => updateField('tagline', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">Primary Phone</label>
                    <input type="text" value={profile.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">Secondary Phone</label>
                    <input type="text" value={profile.phone2 || ''} onChange={(e) => updateField('phone2', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-slate-900">Address</label>
                    <textarea rows={2} value={profile.address || ''} onChange={(e) => updateField('address', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">City</label>
                    <input type="text" value={profile.city || ''} onChange={(e) => updateField('city', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">State</label>
                    <input type="text" value={profile.state || ''} onChange={(e) => updateField('state', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">GST Number</label>
                    <input type="text" value={profile.gst_number || ''} onChange={(e) => updateField('gst_number', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-200">
                   <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50">
                     {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                     Save Profile
                   </button>
                </div>
              </form>
            )}

            {activeTab === 'payment' && (
              <form className="space-y-6" onSubmit={handleSaveProfile}>
                <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Bank & UPI Details</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">Bank Name</label>
                    <input type="text" value={profile.bank_name || ''} onChange={(e) => updateField('bank_name', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">Account Number</label>
                    <input type="text" value={profile.account_number || ''} onChange={(e) => updateField('account_number', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">IFSC Code</label>
                    <input type="text" value={profile.ifsc_code || ''} onChange={(e) => updateField('ifsc_code', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">UPI ID</label>
                    <input type="text" value={profile.upi_id || ''} onChange={(e) => updateField('upi_id', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-200">
                   <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50">
                     {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                     Save Details
                   </button>
                </div>
              </form>
            )}

            {activeTab === 'invoice' && (
              <form className="space-y-6" onSubmit={handleSaveProfile}>
                <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Invoice Settings</h3>
                <div className="max-w-xs">
                  <label className="block text-sm font-medium leading-6 text-slate-900">Invoice Number Prefix</label>
                  <input type="text" value={profile.bill_prefix || 'INV'} onChange={(e) => updateField('bill_prefix', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  <p className="mt-2 text-xs text-slate-500">Example: {profile.bill_prefix || 'INV'}-0001</p>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-200">
                   <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50">
                     {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                     Save Settings
                   </button>
                </div>
              </form>
            )}

            {activeTab === 'account' && (
              <div className="py-8 text-center">
                 <p className="text-slate-600">You are logged in as <span className="font-bold">Member</span>.</p>
                 <p className="text-sm text-slate-500 mt-2">Subscription and billing are managed by the account owner.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
