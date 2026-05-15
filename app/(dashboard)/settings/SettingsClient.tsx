'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SettingsClientProps {
  initialProfile: any
}

export default function SettingsClient({ initialProfile }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(initialProfile || {
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
    upi_id: '',
    bill_prefix: 'INV'
  })

  const supabase = createClient()

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Rule #8: NO manual user_id.
    const { id, user_id, created_at, ...updateData } = profile
    
    const { error } = await supabase
      .from('tp_profile')
      .upsert({
        ...updateData,
        updated_at: new Date().toISOString()
      })

    if (error) {
      alert(error.message)
    } else {
      alert('Business profile updated successfully!')
    }
    setSaving(false)
  }

  const updateField = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  const tabs = [
    { id: 'profile', label: 'Business Profile' },
    { id: 'payment', label: 'Bank & UPI' },
    { id: 'invoice', label: 'Invoice Setup' },
    { id: 'account', label: 'Subscription' }
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Control Center</h2>
        <p className="text-slate-500 font-medium text-sm mt-1">Configure your business identity and financial preferences.</p>
      </div>

      <div className="flex border-b border-slate-100 overflow-x-auto font-black text-[10px] uppercase tracking-widest">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100 p-10">
          <>
            {activeTab === 'profile' && (
              <form className="space-y-8" onSubmit={handleSaveProfile}>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Identity & Contact</h3>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Business Name *</label>
                      <input type="text" value={profile.business_name} onChange={(e) => updateField('business_name', e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tagline / Specialization</label>
                      <input type="text" value={profile.tagline || ''} onChange={(e) => updateField('tagline', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Primary Support Phone</label>
                      <input type="text" value={profile.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">GST Identification Number</label>
                      <input type="text" value={profile.gst_number || ''} onChange={(e) => updateField('gst_number', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Registered Address</label>
                      <textarea rows={2} value={profile.address || ''} onChange={(e) => updateField('address', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-8 border-t border-slate-50">
                   <button type="submit" disabled={saving} className="flex items-center gap-3 rounded-xl bg-primary px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-100 hover:bg-green-600 disabled:opacity-50 transition-all">
                     {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                     Commit Changes
                   </button>
                </div>
              </form>
            )}

            {activeTab === 'payment' && (
              <form className="space-y-8" onSubmit={handleSaveProfile}>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Financial Endpoints</h3>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Bank Name</label>
                    <input type="text" value={profile.bank_name || ''} onChange={(e) => updateField('bank_name', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Number</label>
                    <input type="text" value={profile.account_number || ''} onChange={(e) => updateField('account_number', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">IFSC Code</label>
                    <input type="text" value={profile.ifsc_code || ''} onChange={(e) => updateField('ifsc_code', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">UPI ID (For QR Code)</label>
                    <input type="text" value={profile.upi_id || ''} onChange={(e) => updateField('upi_id', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                </div>
                <div className="flex justify-end pt-8 border-t border-slate-50">
                   <button type="submit" disabled={saving} className="flex items-center gap-3 rounded-xl bg-primary px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-100 hover:bg-green-600 disabled:opacity-50 transition-all">
                     {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                     Secure Save
                   </button>
                </div>
              </form>
            )}

            {activeTab === 'invoice' && (
              <form className="space-y-8" onSubmit={handleSaveProfile}>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Billing Configurations</h3>
                <div className="max-w-xs">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Invoice Number Prefix</label>
                  <input type="text" value={profile.bill_prefix || 'INV'} onChange={(e) => updateField('bill_prefix', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-primary outline-none transition-all" />
                  <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview: {profile.bill_prefix || 'INV'}-0001</p>
                </div>
                <div className="flex justify-end pt-8 border-t border-slate-50">
                   <button type="submit" disabled={saving} className="flex items-center gap-3 rounded-xl bg-primary px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-100 hover:bg-green-600 disabled:opacity-50 transition-all">
                     {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                     Apply Global Settings
                   </button>
                </div>
              </form>
            )}

            {activeTab === 'account' && (
              <div className="py-20 text-center">
                 <div className="mb-6 inline-block p-4 bg-slate-50 rounded-full">
                    <Loader2 className="h-10 w-10 text-slate-200" />
                 </div>
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">TradersPro Elite Plan</h4>
                 <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Active Subscription • Lifetime Access</p>
              </div>
            )}
          </>
      </div>
    </div>
  )
}
