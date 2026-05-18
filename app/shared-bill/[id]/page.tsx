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
      <div className="min-h-screen bg-[#F4F7F9] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex items-center justify-center max-w-xs w-full">
          <LoadingSpinner size="md" text="RETRIEVING BILL..." textColor="text-slate-400" />
        </div>
      </div>
    )
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen bg-[#F4F7F9] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-2">Access Denied</h3>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-6">
            {error || 'The requested billing statement could not be loaded.'}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
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
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        {/* TradersPro Logo/Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-[#0D9488] tracking-widest uppercase italic">TradersPro</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SECURE BILLING PORTAL</p>
        </div>

        {/* Premium Floating Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Subtle background badge */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D9488]/5 rounded-bl-[8rem] flex items-start justify-end p-6 text-[#0D9488]/20 pointer-events-none">
            <ShieldCheck className="h-10 w-10" />
          </div>

          <div className="mb-8">
            <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
              Statement Ready
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-4 leading-tight">Billing Statement</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Consolidated report generated for your account.</p>
          </div>

          {/* Statement highlights inside an elegant block */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-8 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outstanding Amount</p>
            <p className="text-3xl font-black text-[#0D9488] mt-2">₹{fmt(bill.total_amount)}</p>
            <div className="w-full border-t border-slate-200/60 my-4" />
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" /> Period:</span>
              <span className="text-slate-800 font-extrabold">{fmtDate(bill.period_start)} to {fmtDate(bill.period_end)}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4 mb-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Client Details</h4>
            
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-400"><User className="h-4 w-4" /> Client Name</span>
              <span className="text-slate-800 font-black uppercase tracking-wide">{bill.customer_name || 'Walk-in'}</span>
            </div>

            {bill.customer_phone && (
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-slate-400"><Phone className="h-4 w-4" /> Mobile</span>
                <span className="text-slate-800 font-extrabold">{bill.customer_phone}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-400"><Building2 className="h-4 w-4" /> Shared Date</span>
              <span className="text-slate-800 font-extrabold">{fmtDate(bill.created_at)}</span>
            </div>
          </div>

          {/* Primary Action Button */}
          {bill.pdf_url ? (
            <a 
              href={bill.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-[#0D9488] hover:bg-[#0B7A70] text-white py-4 sm:py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#0D9488]/20 hover:shadow-none transition-all active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Download Official PDF
            </a>
          ) : (
            <div className="text-center text-xs text-rose-500 font-extrabold bg-rose-50 border border-rose-100 p-4 rounded-2xl">
              PDF file is not available for this statement. Please contact your merchant.
            </div>
          )}

          {/* Expiration Note */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Secure Link • Valid until {fmtDate(bill.expires_at)}</span>
          </div>

        </div>

        {/* Footer Brand Info */}
        <div className="text-center mt-6 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Powered by <span className="font-black text-[#0D9488]">TradersPro</span>
        </div>

      </div>
    </div>
  )
}
