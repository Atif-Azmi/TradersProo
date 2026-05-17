'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useBusinessProfile, saveBusinessProfile } from '@/hooks/useBusinessProfile'
import toast from 'react-hot-toast'

interface SettingsClientProps {
  initialProfile: any
}

export default function SettingsClient({ initialProfile }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  // ---- NEW BUSINESS PROFILE TAB LOGIC ----
  const { profile: bizProfile, loading: bizLoading, refetch: refetchBiz } = useBusinessProfile()
  const [bizForm, setBizForm] = useState({
    businessName: '',
    tagline: '',
    supportPhone: '',
    gstNumber: '',
    registeredAddress: '',
    city: '',
    state: '',
  })

  useEffect(() => {
    if (bizProfile) {
      setBizForm({
        businessName: bizProfile.business_name || '',
        tagline: bizProfile.tagline || '',
        supportPhone: bizProfile.support_phone || '',
        gstNumber: bizProfile.gst_number || '',
        registeredAddress: bizProfile.registered_address || '',
        city: bizProfile.city || '',
        state: bizProfile.state || '',
      })
    }
  }, [bizProfile])

  const handleBizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBizForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleBizSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bizForm.businessName.trim()) {
      toast.error('Business name is required')
      return
    }
    setSaving(true)
    try {
      await saveBusinessProfile(bizForm)
      toast.success('Business profile saved!')
      refetchBiz()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  // ---- OLD PROFILE (TP_PROFILE) LOGIC FOR OTHER TABS ----
  const [profile, setProfile] = useState<any>(initialProfile || {
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    upi_id: '',
    bill_prefix: 'INV'
  })

  const handleSaveOtherProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Ensure we don't accidentally update old business profile fields if they existed
    const { id, user_id, created_at, business_name, tagline, phone, phone2, address, city, state, gst_number, ...updateData } = profile
    
    const { error } = await supabase
      .from('tp_profile')
      .upsert({
        ...updateData,
        updated_at: new Date().toISOString()
      })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Settings updated successfully!')
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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
      </div>

      <div className="flex border-b border-slate-100 overflow-x-auto font-bold text-[10px] uppercase tracking-widest bg-white rounded-t-xl border border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#0D9B8A] text-[#0D9B8A]'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tp-card p-6 md:p-8 rounded-t-none">
        {activeTab === 'profile' && (
          <form className="space-y-6" onSubmit={handleBizSubmit}>
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Identity & Contact</h3>
              
              {bizLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#0D9B8A] w-8 h-8" /></div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Business Name *</label>
                    <input type="text" name="businessName" value={bizForm.businessName} onChange={handleBizChange} required className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-bold" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tagline / Specialization</label>
                    <input type="text" name="tagline" value={bizForm.tagline} onChange={handleBizChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Primary Support Phone</label>
                    <input type="text" name="supportPhone" value={bizForm.supportPhone} onChange={handleBizChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">GST Identification Number</label>
                    <input type="text" name="gstNumber" value={bizForm.gstNumber} onChange={handleBizChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-black uppercase" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Registered Address</label>
                    <textarea rows={2} name="registeredAddress" value={bizForm.registeredAddress} onChange={handleBizChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">City</label>
                    <input type="text" name="city" value={bizForm.city} onChange={handleBizChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">State</label>
                    <input type="text" name="state" value={bizForm.state} onChange={handleBizChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-medium" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-6 border-t border-slate-50">
               <button type="submit" disabled={saving || bizLoading} className="tp-button-primary flex items-center gap-2">
                 {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                 Commit Changes
               </button>
            </div>
          </form>
        )}

        {activeTab === 'payment' && (
          <form className="space-y-6" onSubmit={handleSaveOtherProfile}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Financial Endpoints</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Bank Name</label>
                <input type="text" value={profile.bank_name || ''} onChange={(e) => updateField('bank_name', e.target.value)} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Number</label>
                <input type="text" value={profile.account_number || ''} onChange={(e) => updateField('account_number', e.target.value)} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-black" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">IFSC Code</label>
                <input type="text" value={profile.ifsc_code || ''} onChange={(e) => updateField('ifsc_code', e.target.value)} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-black" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">UPI ID (For QR Code)</label>
                <input type="text" value={profile.upi_id || ''} onChange={(e) => updateField('upi_id', e.target.value)} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-black" />
              </div>
            </div>
            <div className="flex justify-end pt-6 border-t border-slate-50">
               <button type="submit" disabled={saving} className="tp-button-primary flex items-center gap-2">
                 {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                 Secure Save
               </button>
            </div>
          </form>
        )}

        {activeTab === 'invoice' && (
          <form className="space-y-6" onSubmit={handleSaveOtherProfile}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Billing Configurations</h3>
            <div className="max-w-xs">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Invoice Number Prefix</label>
              <input type="text" value={profile.bill_prefix || 'INV'} onChange={(e) => updateField('bill_prefix', e.target.value)} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-black" />
              <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview: {profile.bill_prefix || 'INV'}-0001</p>
            </div>
            <div className="flex justify-end pt-6 border-t border-slate-50">
               <button type="submit" disabled={saving} className="tp-button-primary flex items-center gap-2">
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
      </div>
    </div>
  )
}
