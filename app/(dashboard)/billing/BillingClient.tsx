'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  FileText, Upload, Copy, MessageCircle, Printer, Plus, 
  CheckCircle, Loader2, ChevronDown, Calendar, User, 
  ArrowRight, Search, X, ShieldCheck, Download, Building2, AlertCircle, TrendingDown
} from 'lucide-react'
import { generateBillData, uploadBillPDF, saveBillShare, shortenUrl } from '@/lib/billing'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { generateBillPDF } from '@/utils/generateBillPDF'
import { sendWhatsAppDuePayment } from '@/utils/sendWhatsAppDue'
import { toast } from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface Props { userId: string; customers: any[] }

const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

export default function BillingClient({ userId, customers }: Props) {
  const { profile, loading: profileLoading } = useBusinessProfile()
  const today = new Date().toISOString().split('T')[0]
  const [selectedCust, setSelectedCust] = useState('')
  const [custSearch, setCustSearch] = useState('')
  const [showCustDropdown, setShowCustDropdown] = useState(false)
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [billData, setBillData] = useState<any>(null)
  const [shareLink, setShareLink] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState(false)
  const billRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [libReady, setLibReady] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    script.async = true
    script.onload = () => setLibReady(true)
    document.body.appendChild(script)

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowCustDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (document.body.contains(script)) document.body.removeChild(script)
    }
  }, [])

  const filteredCustomers = customers.filter(c => 
    (c.name?.toLowerCase() || '').includes(custSearch.toLowerCase()) || 
    (c.phone && c.phone.includes(custSearch))
  )
  const selectedCustomer = customers.find(c => c.id === selectedCust)

  async function handleGenerate() {
    if (!selectedCust) return toast.error('Please select a customer.')
    setLoading(true)
    setStatus('')
    setShareLink('')
    try {
      const data = await generateBillData({ customerId: selectedCust, startDate, endDate })
      setBillData(data)
      setStatus('generated')
    } catch (e: any) { toast.error('Error: ' + e.message) }
    setLoading(false)
  }

  async function handleDownloadPDF() {
    if (!profile || !billData) return toast.error('Business profile or bill data missing')
    
    const saleData = {
      bill_number: `INV-${Date.now().toString().slice(-5)}`,
      created_at: new Date().toISOString(),
      customer_name: billData.customer.name,
      customer_phone: billData.customer.phone,
      selling_price: billData.totalSales,
      down_payment: billData.totalPaid,
      remaining_balance: billData.netPayable,
      items: billData.ledgerRows,
    }
    
    generateBillPDF(profile, saleData)
    toast.success('PDF Generated successfully')
  }

  async function handleUpload() {
    if (!billData || !profile) return
    setUploading(true)
    try {
      const saleData = {
        bill_number: `INV-${Date.now().toString().slice(-5)}`,
        created_at: new Date().toISOString(),
        customer_name: billData.customer.name,
        customer_phone: billData.customer.phone,
        selling_price: billData.totalSales,
        down_payment: billData.totalPaid,
        remaining_balance: billData.netPayable,
        items: billData.ledgerRows,
      }

      // Generate perfect, high-fidelity vector PDF programmatically using jsPDF
      const { doc } = generateBillPDF(profile, saleData, false)
      const blob: Blob = doc.output('blob')

      const { signedUrl, path } = await uploadBillPDF({ userId, customerId: selectedCust, pdfBlob: blob, startDate, endDate })
      
      const shareData = await saveBillShare({ 
        userId, 
        customer_id: selectedCust, 
        storagePath: path, 
        periodStart: startDate, 
        periodEnd: endDate,
        customerName: billData.customer?.name,
        customerPhone: billData.customer?.phone,
        totalAmount: billData.netPayable,
        pdfUrl: signedUrl,
      })
      
      const origin = window.location.origin
      const publicBillPageUrl = `${origin}/shared-bill/${shareData.id}`
      const short = await shortenUrl(publicBillPageUrl)
      
      setShareLink(short)
      setStatus('uploaded')
      toast.success('Bill uploaded successfully')
    } catch (e: any) { toast.error('Upload failed: ' + e.message) }
    setUploading(false)
  }

  const [shares, setShares] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchShares() {
      const { data } = await supabase
        .from('tp_bill_shares')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setShares(data)
    }
    fetchShares()
  }, [supabase])

  const totalBills = shares.length
  const totalOutstanding = shares.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0)

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body * { visibility: hidden !important; }
          #print-invoice, #print-invoice * { visibility: visible !important; }
          #print-invoice {
            position: fixed !important;
            top: 0; left: 0;
            width: 100% !important;
            transform-origin: top left;
          }
        }
      `}</style>
      {!profile && !profileLoading && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-4 text-amber-800 print:hidden">
          <ShieldCheck className="h-5 w-5" />
          <p className="text-xs font-bold uppercase tracking-widest">Business identity not configured. Bills may be incomplete.</p>
          <button onClick={() => window.location.href='/onboarding'} className="ml-auto bg-amber-200 hover:bg-amber-300 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Setup Now</button>
        </div>
      )}

      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Billing</h2>
        </div>
        <button 
          onClick={handleGenerate}
          className="tp-button-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> New Bill
        </button>
      </div>

      {/* Row of 3 Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3 print:hidden">
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-[#0D9B8A]"><FileText className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Bills</p>
              <p className="text-xl font-black text-slate-900">{totalBills}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-[#0D9B8A]"><Plus className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Clients</p>
              <p className="text-xl font-black text-slate-900">{customers.length}</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-rose-50 p-3 rounded-full text-red-600"><AlertCircle className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Outstanding Bills</p>
              <p className="text-xl font-black text-red-600">₹{totalOutstanding.toLocaleString('en-IN')}</p>
           </div>
        </div>
      </div>

      {/* SELECT CRITERIA */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm relative z-40 print:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
          <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bill To</label>
            <div onClick={() => setShowCustDropdown(!showCustDropdown)} className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-4 py-2.5 text-sm font-black text-slate-900 cursor-pointer flex items-center justify-between transition-all">
              <span className={selectedCust ? 'text-slate-900' : 'text-slate-400'}>{selectedCustomer ? selectedCustomer.name : 'Select customer...'}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
            {showCustDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-3 border-b border-slate-50"><input autoFocus type="text" placeholder="Search..." value={custSearch} onChange={e=>setCustSearch(e.target.value)} onClick={e=>e.stopPropagation()} className="w-full bg-slate-50 border-none rounded-lg px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" /></div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredCustomers.map(c => (
                    <div key={c.id} onClick={() => { setSelectedCust(c.id); setShowCustDropdown(false) }} className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group">
                      <div><p className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{c.name}</p><p className="text-[10px] font-bold text-slate-400">{c.phone}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
            <input type="date" value={startDate} onClick={(e) => { try { e.currentTarget.showPicker() } catch(err) {} }} onChange={e=>setStartDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all cursor-pointer" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Date</label>
            <input type="date" value={endDate} onClick={(e) => { try { e.currentTarget.showPicker() } catch(err) {} }} onChange={e=>setEndDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all cursor-pointer" />
          </div>

          <button onClick={handleGenerate} disabled={loading} className="w-full tp-button-primary py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Generate Invoice
          </button>
        </div>
      </div>

      {/* ACTIONS */}
      {billData && (
        <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 print:hidden">
          <button onClick={() => window.print()} className="px-4 py-2 text-[10px] font-bold uppercase text-slate-900 hover:bg-slate-100 rounded-lg transition-all border border-slate-200">Print</button>
          <button onClick={handleDownloadPDF} className="px-4 py-2 text-[10px] font-bold uppercase bg-slate-900 text-white hover:bg-black rounded-lg transition-all">Download PDF</button>
          <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 text-[10px] font-bold uppercase text-[#0D9488] hover:bg-[#0D9488]/5 rounded-lg transition-all">
            {uploading ? 'Uploading...' : 'Upload & Get Link'}
          </button>
          {shareLink && (
            <div className="flex gap-4">
              <button onClick={() => { navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(()=>setCopied(false), 2000) }} className="px-4 py-2 text-[10px] font-bold uppercase text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                {copied ? 'Copied' : 'Copy Link'}
              </button>
              <button onClick={() => {
                sendWhatsAppDuePayment(profile, selectedCustomer, billData, shareLink)
              }} className="px-4 py-2 text-[10px] font-bold uppercase text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">WhatsApp</button>
            </div>
          )}
        </div>
      )}

      {/* BILL PREVIEW - MATCHING THE BLUE & WHITE INVOICE */}
      {billData && (
        <div className="p-4 sm:p-10 bg-slate-100 rounded-3xl sm:rounded-[3rem] overflow-x-auto flex justify-start sm:justify-center print:p-0 print:bg-transparent print:rounded-none">
          <div
            id="print-invoice"
            ref={billRef}
            className="bg-white shadow-2xl w-[800px] sm:w-full max-w-[210mm] p-8 sm:p-12 relative print:shadow-none print:w-full print:max-w-full print:p-4 shrink-0"
            style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b' }}
          >
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '4px' }}>INVOICE</h1>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div style={{ maxWidth: '400px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0D9488', marginBottom: '8px' }}>{profile?.business_name || 'F.K.S. Traders'}</h3>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                  {profile?.registered_address}<br/>
                  {profile?.city}, {profile?.state}<br/>
                  Mobile: {profile?.support_phone}<br/>
                  {profile?.gst_number && <>GSTIN: {profile.gst_number}</>}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ width: '120px', height: '120px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyItems: 'center', fontSize: '12px', fontWeight: 900, color: '#94a3b8' }}>
                  <Building2 className="h-12 w-12 text-slate-200 mx-auto" />
                </div>
              </div>
            </div>

            <div style={{ height: '2px', background: '#0D9488', opacity: 0.2, marginBottom: '40px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 900, color: '#0D9488', marginBottom: '12px' }}>Bill To</p>
                <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>{billData.customer.name}</h4>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                  {billData.customer.address || 'No address provided'}<br/>
                  {billData.customer.phone}
                </p>
              </div>
              <div style={{ textAlign: 'right', minWidth: '240px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>Invoice No :</div>
                  <div style={{ fontWeight: 900, color: '#0f172a' }}>INV-{Date.now().toString().slice(-5)}</div>
                  
                  <div style={{ fontWeight: 800, color: '#64748b' }}>Invoice Date :</div>
                  <div style={{ fontWeight: 800, color: '#475569' }}>{fmtDate(startDate)}</div>
                  
                  <div style={{ fontWeight: 800, color: '#64748b' }}>Due Date :</div>
                  <div style={{ fontWeight: 800, color: '#475569' }}>{fmtDate(endDate)}</div>
                </div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
              <thead>
                <tr style={{ background: '#0D9488', color: 'white' }}>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 900, textAlign: 'left', border: '1px solid #0D9488' }}>Sl.</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 900, textAlign: 'left', border: '1px solid #0D9488' }}>Description</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 900, textAlign: 'right', border: '1px solid #0D9488' }}>Qty</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 900, textAlign: 'right', border: '1px solid #0D9488' }}>Rate</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 900, textAlign: 'right', border: '1px solid #0D9488' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {billData.ledgerRows.length > 0 ? billData.ledgerRows.map((r:any, i:number) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : 'white' }}>
                    <td style={{ padding: '12px', fontSize: '13px', border: '1px solid #e2e8f0' }}>{i+1}</td>
                    <td style={{ padding: '12px', fontSize: '13px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{r.detail}</td>
                    <td style={{ padding: '12px', fontSize: '13px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{r.qty || '-'}</td>
                    <td style={{ padding: '12px', fontSize: '13px', border: '1px solid #e2e8f0', textAlign: 'right' }}>{r.rate ? `₹${fmt(r.rate)}` : '-'}</td>
                    <td style={{ padding: '12px', fontSize: '13px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 800 }}>
                      {r.debit ? `₹${fmt(r.debit)}` : r.credit ? `-₹${fmt(r.credit)}` : '-'}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', border: '1px solid #e2e8f0' }}>No items recorded for this period.</td></tr>
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ maxWidth: '300px' }}>
                <p style={{ fontSize: '12px', fontWeight: 900, color: '#0D9488', marginBottom: '8px' }}>Payment Instructions</p>
                {profile?.bank_name ? (
                  <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>
                    Please pay via NetBanking/UPI to:<br/>
                    <b>{profile?.business_name}</b><br/>
                    Bank: {profile.bank_name}<br/>
                    A/C No: {profile.account_number}<br/>
                    IFSC: {profile.ifsc_code}
                    {profile.upi_id && <><br/>UPI ID: {profile.upi_id}</>}
                  </p>
                ) : (
                  <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>
                    Please pay via Cash/UPI to:<br/>
                    <b>{profile?.business_name}</b><br/>
                    For banking details, please contact us at:<br/>
                    Phone: {profile?.support_phone || 'Support'}
                  </p>
                )}
              </div>
              <div style={{ minWidth: '300px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px', textAlign: 'right', marginBottom: '40px' }}>
                  <div style={{ fontWeight: 800, color: '#475569' }}>Subtotal</div>
                  <div style={{ fontWeight: 900, color: '#0f172a' }}>₹{fmt(billData.totalSales)}</div>
                  
                  <div style={{ borderTop: '2px solid #0D9488', gridColumn: 'span 2', margin: '4px 0' }} />
                  
                  <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '16px' }}>Total</div>
                  <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '16px' }}>₹{fmt(billData.totalSales)}</div>
                  
                  <div style={{ fontWeight: 800, color: '#16a34a' }}>Paid</div>
                  <div style={{ fontWeight: 800, color: '#16a34a' }}>₹{fmt(billData.totalPaid)}</div>
                  
                  <div style={{ fontWeight: 900, color: '#e11d48' }}>Balance Due</div>
                  <div style={{ fontWeight: 900, color: '#e11d48' }}>₹{fmt(billData.netPayable)}</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ height: '60px', width: '200px', margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', width: '100%', fontStyle: 'italic', fontSize: '18px' }}>{profile?.business_name?.split(' ')[0]}</div>
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', marginTop: '10px' }}>Authorized Signatory</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
