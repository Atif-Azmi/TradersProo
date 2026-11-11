'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { FileText, Download, ShieldCheck, AlertCircle, Building2, Calendar, User, Phone } from 'lucide-react'

interface SharedBill {
  id: string
  customer_name: string
  customer_phone: string
  total_amount: number
  period_start: string
  period_end: string
  pdf_url: string
  created_at: string
  expires_at: string
}

export default function SharedBillPage({ params }: { params: { id: string } }) {
  const [bill, setBill] = useState<SharedBill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchBill() {
      try {
        const { data, error } = await supabase
          .from('tp_bill_shares')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) {
          console.error('Fetch error:', error)
          setError('Bill statement not found or has expired.')
          return
        }

        // Check expiration
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setError('This share link has expired (links are valid for 7 days).')
          return
        }

        setBill(data)
      } catch (err: any) {
        setError('An unexpected error occurred.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBill()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0DCD6] dark:bg-[#1F1E1B] flex flex-col items-center justify-center p-4">
        <div className="bg-[#F2EEE9] dark:bg-[#2A2926] p-12 rounded-[28px] shadow-warm-raised border border-[#CAC8C0] dark:border-[#45433E] flex items-center justify-center max-w-xs w-full">
          <LoadingSpinner size="md" text="RETRIEVING BILL..." textColor="text-[#7A756F]" />
        </div>
      </div>
    )
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen bg-[#E0DCD6] dark:bg-[#1F1E1B] flex flex-col items-center justify-center p-4">
        <div className="bg-[#F2EEE9] dark:bg-[#2A2926] p-10 rounded-[28px] shadow-warm-raised border border-[#CAC8C0] dark:border-[#45433E] max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#D98A7B]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#4A1D14] dark:text-[#D98A7B]">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black text-[#3E3B36] dark:text-[#EDE9E3] uppercase tracking-widest mb-2">Access Denied</h3>
          <p className="text-[#7A756F] dark:text-[#A8A39B] text-xs font-semibold leading-relaxed mb-6">
            {error || 'The requested billing statement could not be loaded.'}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-[#B4E0CA] hover:bg-[#9CCDB4] text-[#1E3121] py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-warm-pill tap-scale"
          >
            Go to TradersPro
          </button>
        </div>
      </div>
    )
  }

  const fmt = (n: number) => parseFloat(n as any || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="min-h-screen bg-[#E0DCD6] dark:bg-[#1F1E1B] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        {/* TradersPro Logo/Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-[#3E3B36] dark:text-[#EDE9E3] tracking-widest uppercase">
            Traders<span className="text-[#3F6B52] dark:text-[#B4E0CA]">Pro</span>
          </h1>
          <p className="text-[10px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest mt-1">SECURE BILLING PORTAL</p>
        </div>

        {/* Premium Floating Card */}
        <div className="bg-[#F2EEE9] dark:bg-[#2A2926] rounded-[28px] shadow-warm-raised border border-[#CAC8C0] dark:border-[#45433E] p-8 sm:p-10 relative overflow-hidden">
          
          {/* Subtle background badge */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B4E0CA]/10 rounded-bl-[8rem] flex items-start justify-end p-6 text-[#88A993]/30 pointer-events-none">
            <ShieldCheck className="h-10 w-10" />
          </div>

          <div className="mb-8">
            <span className="text-[9px] font-black bg-[#B4E0CA] text-[#1E3121] border border-[#88A993]/40 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
              Statement Ready
            </span>
            <h2 className="text-xl font-black text-[#3E3B36] dark:text-[#EDE9E3] mt-4 leading-tight">Billing Statement</h2>
            <p className="text-xs text-[#7A756F] dark:text-[#A8A39B] font-semibold mt-1">Consolidated report generated for your account.</p>
          </div>

          {/* Statement highlights inside an elegant block */}
          <div className="bg-[#F2EEE9] dark:bg-[#33322E] border border-[#CAC8C0] dark:border-[#45433E] rounded-2xl p-6 mb-8 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">Outstanding Amount</p>
            <p className="text-3xl font-black text-[#1E3121] dark:text-[#B4E0CA] mt-2">₹{fmt(bill.total_amount)}</p>
            <div className="w-full border-t border-[#CAC8C0]/60 dark:border-[#45433E]/60 my-4" />
            <div className="flex items-center justify-between w-full text-xs font-bold text-[#7A756F] dark:text-[#A8A39B]">
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#7A756F] dark:text-[#A8A39B]" /> Period:</span>
              <span className="text-[#3E3B36] dark:text-[#EDE9E3] font-extrabold">{fmtDate(bill.period_start)} to {fmtDate(bill.period_end)}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4 mb-8">
            <h4 className="text-[10px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest border-b border-[#CAC8C0]/50 dark:border-[#45433E]/50 pb-2">Client Details</h4>
            
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-[#7A756F] dark:text-[#A8A39B]"><User className="h-4 w-4" /> Client Name</span>
              <span className="text-[#3E3B36] dark:text-[#EDE9E3] font-black uppercase tracking-wide">{bill.customer_name || 'Walk-in'}</span>
            </div>

            {bill.customer_phone && (
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-[#7A756F] dark:text-[#A8A39B]"><Phone className="h-4 w-4" /> Mobile</span>
                <span className="text-[#3E3B36] dark:text-[#EDE9E3] font-extrabold">{bill.customer_phone}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-[#7A756F] dark:text-[#A8A39B]"><Building2 className="h-4 w-4" /> Shared Date</span>
              <span className="text-[#3E3B36] dark:text-[#EDE9E3] font-extrabold">{fmtDate(bill.created_at)}</span>
            </div>
          </div>

          {/* Primary Action Button */}
          {bill.pdf_url ? (
            <a 
              href={bill.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-[#B4E0CA] hover:bg-[#9CCDB4] text-[#1E3121] py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-warm-pill transition-all tap-scale"
            >
              <Download className="h-4 w-4" />
              Download Official PDF
            </a>
          ) : (
            <div className="text-center text-xs text-[#4A1D14] dark:text-[#D98A7B] font-extrabold bg-[#D98A7B]/20 border border-[#D98A7B]/40 p-4 rounded-2xl">
              PDF file is not available for this statement. Please contact your merchant.
            </div>
          )}

          {/* Expiration Note */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[9px] font-black text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5 text-[#1E3121] dark:text-[#B4E0CA]" />
            <span>Secure Link • Valid until {fmtDate(bill.expires_at)}</span>
          </div>

        </div>

        {/* Footer Brand Info */}
        <div className="text-center mt-6 text-[9px] font-bold text-[#7A756F] dark:text-[#A8A39B] uppercase tracking-[0.2em]">
          Powered by <span className="font-black text-[#1E3121] dark:text-[#EDE9E3]">Traders<span className="text-[#88A993]">Pro</span></span>
        </div>

      </div>
    </div>
  )
}
