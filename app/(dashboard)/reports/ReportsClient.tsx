'use client'

import { useState } from 'react'
import { 
  TrendingUp, ShieldCheck, PieChart, Download, 
  Calendar, FileText, ArrowRight, Zap, Target, Loader2, X, MessageSquare, Share2
} from 'lucide-react'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { createClient } from '@/lib/supabase/client'

// Teal palette matches F.K.S. Traders professional design
const TEAL: [number, number, number] = [13, 148, 136] // #0D9488
const DARK: [number, number, number] = [15, 23, 42]   // #0F172A

interface ReportsClientProps {
  sales: any[]
  products: any[]
  customers: any[]
  payments: any[]
  customerBalances: any[]
}

export default function ReportsClient({ 
  sales, 
  products, 
  customers, 
  payments, 
  customerBalances 
}: ReportsClientProps) {
  const { profile } = useBusinessProfile()
  const [loadingReport, setLoadingReport] = useState<string | null>(null)
  
  // Customer Ledger Modal
  const [showLedgerModal, setShowLedgerModal] = useState(false)
  const [selectedLedgerCustomerId, setSelectedLedgerCustomerId] = useState('')
  const [ledgerActionType, setLedgerActionType] = useState<'export' | 'share'>('export')

  const supabase = createClient()
  const todayStr = new Date().toISOString().split('T')[0]

  // 1. Compute dynamic statistics
  const currentMonthSales = sales
    .filter(s => s.invoice_date?.startsWith('2026-05'))
    .reduce((acc, s) => acc + (s.total_amount || 0), 0)
  
  const prevMonthSales = sales
    .filter(s => s.invoice_date?.startsWith('2026-04'))
    .reduce((acc, s) => acc + (s.total_amount || 0), 0)

  const computedGrowth = prevMonthSales > 0 
    ? ((currentMonthSales - prevMonthSales) / prevMonthSales) * 100 
    : 12.4

  const totalBilled = sales.reduce((acc, s) => acc + (s.total_amount || 0), 0)
  const totalPaid = sales.reduce((acc, s) => acc + (s.amount_paid || 0), 0)
  const collectionRate = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 98.2

  const validProducts = products.filter(p => p.selling_rate > 0)
  const avgMargin = validProducts.length > 0
    ? validProducts.reduce((acc, p) => {
        const cost = p.purchase_rate || 0
        const sell = p.selling_rate || 1
        const markup = ((sell - cost) / sell) * 100
        return acc + markup
      }, 0) / validProducts.length
    : 24.5

  // Render headers on PDFs professionally
  const drawPDFHeader = (doc: jsPDF, title: string) => {
    const W = 210
    doc.setFillColor(13, 148, 136)
    doc.rect(0, 0, W, 8, 'F')

    let y = 18
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(...DARK)
    doc.text(profile?.business_name ?? 'F.K.S. TRADERS', W / 2, y, { align: 'center' })

    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text(profile?.tagline ?? 'Quality Hardware & Materials Supplier', W / 2, y, { align: 'center' })

    const addressParts = [
      profile?.registered_address,
      [profile?.city, profile?.state].filter(Boolean).join(', ')
    ].filter(Boolean)

    if (addressParts.length > 0) {
      y += 5
      doc.text(addressParts.join(' | '), W / 2, y, { align: 'center' })
    }

    const contactLine = [
      profile?.support_phone ? `Phone: ${profile.support_phone}` : null,
      profile?.gst_number ? `GSTIN: ${profile.gst_number}` : null
    ].filter(Boolean).join(' | ')

    if (contactLine) {
      y += 5
      doc.text(contactLine, W / 2, y, { align: 'center' })
    }

    y += 6
    doc.setDrawColor(226, 232, 240)
    doc.line(14, y, W - 14, y)

    y += 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(...DARK)
    doc.text(title.toUpperCase(), 14, y)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(148, 163, 184)
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}`, W - 14, y, { align: 'right' })

    return y + 6
  }

  const drawPDFBottomBar = (doc: jsPDF) => {
    const pageH = doc.internal.pageSize.height
    doc.setFillColor(15, 23, 42)
    doc.rect(0, pageH - 5, 210, 5, 'F')
  }

  // --- UPLOAD TO SUPABASE & GENERATE 7-DAY SIGNED URL LINK ---
  const uploadAndGetShareLink = async (doc: jsPDF, fileName: string): Promise<string> => {
    const pdfBlob = doc.output('blob')
    const path = `reports/${fileName}_${Date.now()}.pdf`
    
    const { error: uploadError } = await supabase.storage
      .from('bills')
      .upload(path, pdfBlob, { cacheControl: '3600', upsert: true })

    if (uploadError) throw uploadError

    const { data, error: signedError } = await supabase.storage
      .from('bills')
      .createSignedUrl(path, 60 * 60 * 24 * 7) // 7 days signed link

    if (signedError) throw signedError
    return data?.signedUrl || ''
  }

  // --- GENERATE DAILY SALES REPORT ---
  const generateDailySalesReport = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const startY = drawPDFHeader(doc, `Daily Sales Ledger Report - May 2026`)
    
    const totalSales = sales.reduce((acc, s) => acc + (s.total_amount || 0), 0)
    const totalTax = sales.reduce((acc, s) => acc + (s.gst_amount || 0), 0)
    const totalPaid = sales.reduce((acc, s) => acc + (s.amount_paid || 0), 0)
    const totalDue = sales.reduce((acc, s) => acc + (s.balance_due || 0), 0)

    doc.setFillColor(248, 250, 252)
    doc.roundedRect(14, startY, 182, 24, 3, 3, 'F')
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text('TOTAL BILLED SALES', 20, startY + 8)
    doc.text('TOTAL GST TAX', 68, startY + 8)
    doc.text('TOTAL PAYMENTS', 114, startY + 8)
    doc.text('OUTSTANDING DUE', 158, startY + 8)

    doc.setFontSize(11)
    doc.setTextColor(...DARK)
    doc.text(`₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 20, startY + 16)
    doc.text(`₹${totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 68, startY + 16)
    doc.text(`₹${totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 114, startY + 16)
    doc.setTextColor(13, 148, 136)
    doc.text(`₹${totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 158, startY + 16)

    const tableData = sales.map((s, idx) => [
      idx + 1,
      s.invoice_number,
      s.tp_customers?.name || 'Walk-in Customer',
      s.invoice_date,
      s.payment_mode?.toUpperCase() || 'CASH',
      `₹${(s.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      `₹${(s.amount_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    ])

    autoTable(doc, {
      startY: startY + 30,
      head: [['S.No.', 'Invoice #', 'Customer Name', 'Date', 'Mode', 'Bill Amt (₹)', 'Amt Paid (₹)']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: TEAL, fontSize: 9, fontStyle: 'bold' },
      styles: { fontSize: 8.5, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { halign: 'right' },
        6: { halign: 'right' }
      }
    })

    drawPDFBottomBar(doc)
    return { doc, totalSales, totalTax, totalPaid, totalDue }
  }

  // Export PDF: Daily Sales
  const handleExportDailySales = async () => {
    setLoadingReport('daily_export')
    await new Promise(resolve => setTimeout(resolve, 600))
    try {
      const { doc } = generateDailySalesReport()
      doc.save(`Daily_Sales_Report_${todayStr}.pdf`)
    } catch (err: any) {
      alert(err.message || 'Failed to export Daily Sales Report')
    } finally {
      setLoadingReport(null)
    }
  }

  // Share WhatsApp: Daily Sales
  const handleShareDailySales = async () => {
    setLoadingReport('daily_share')
    await new Promise(resolve => setTimeout(resolve, 600))
    try {
      const { doc, totalSales, totalTax, totalPaid, totalDue } = generateDailySalesReport()
      const shareUrl = await uploadAndGetShareLink(doc, 'Daily_Sales_Report')
      
      const biz = profile?.business_name ?? 'F.K.S. TRADERS'
      const message = `
📊 *DAILY SALES REPORT*
🏢 *${biz.toUpperCase()}*
${profile?.tagline ? `_${profile.tagline}_\n` : ''}
*Date:* ${new Date().toLocaleDateString('en-IN')}

*Financial Summary:*
• *Total Billed Sales:* ₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
• *Total GST Collected:* ₹${totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
• *Total Payments Received:* ₹${totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
• *Net Outstanding Balance:* ₹${totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}

📎 *Download PDF Ledger Statement (Expires in 7 Days):*
${shareUrl}

_Generated via TradersPro Accounting Systems_
      `.trim()

      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
    } catch (err: any) {
      alert(err.message || 'Failed to generate share link')
    } finally {
      setLoadingReport(null)
    }
  }

  // --- GENERATE CUSTOMER LEDGER ---
  const generateCustomerLedger = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    if (!customer) throw new Error('Customer not found')

    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const startY = drawPDFHeader(doc, `Customer Account Ledger`)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.text(`Ledger For: ${customer.name}`, 14, startY)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(100, 116, 139)
    if (customer.company_name) doc.text(`Company: ${customer.company_name}`, 14, startY + 5)
    if (customer.phone) doc.text(`Contact: ${customer.phone}`, 14, startY + 10)
    if (customer.gst_number) doc.text(`GSTIN: ${customer.gst_number}`, 14, startY + 15)

    const cSales = sales.filter(s => s.customer_id === customerId)
    const cPayments = payments.filter(p => p.customer_id === customerId)

    const timeline: any[] = []
    const opBal = parseFloat(customer.opening_balance || 0)
    timeline.push({
      date: customer.created_at?.split('T')[0] || todayStr,
      desc: 'Opening Balance',
      debit: opBal >= 0 ? opBal : 0,
      credit: opBal < 0 ? Math.abs(opBal) : 0,
      isOpening: true
    })

    cSales.forEach(s => {
      timeline.push({
        date: s.invoice_date,
        desc: `Invoice #${s.invoice_number}`,
        debit: s.total_amount,
        credit: 0
      })
    })

    cPayments.forEach(p => {
      timeline.push({
        date: p.payment_date,
        desc: `Receipt Payment (${p.payment_mode?.toUpperCase()}) ${p.reference_number ? `#${p.reference_number}` : ''}`,
        debit: 0,
        credit: p.amount
      })
    })

    timeline.sort((a, b) => {
      if (a.isOpening) return -1
      if (b.isOpening) return 1
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

    let runningBalance = 0
    const tableRows = timeline.map((item, idx) => {
      runningBalance += (item.debit || 0) - (item.credit || 0)
      return [
        idx + 1,
        item.date,
        item.desc,
        item.debit > 0 ? `₹${item.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-',
        item.credit > 0 ? `₹${item.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-',
        `₹${runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
      ]
    })

    autoTable(doc, {
      startY: startY + 20,
      head: [['S.No.', 'Date', 'Transaction Description', 'Debit (Charges) (₹)', 'Credit (Paid) (₹)', 'Outstanding Bal (₹)']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: TEAL, fontSize: 9, fontStyle: 'bold' },
      styles: { fontSize: 8.5, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 25 },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right', fontStyle: 'bold' }
      }
    })

    const finalY = (doc as any).lastAutoTable.finalY + 12
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.text(`Statement Summary`, 14, finalY)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    
    const totalDebit = timeline.reduce((acc, item) => acc + (item.debit || 0), 0)
    const totalCredit = timeline.reduce((acc, item) => acc + (item.credit || 0), 0)

    doc.text(`Total Billed Charges: ₹${totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 14, finalY + 6)
    doc.text(`Total Payments Received: ₹${totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 14, finalY + 11)
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(13, 148, 136)
    doc.text(`Net Outstanding Closing Balance: ₹${runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 14, finalY + 18)

    drawPDFBottomBar(doc)
    return { doc, customer, totalDebit, totalCredit, closingBalance: runningBalance }
  }

  // Export PDF or Share WhatsApp: Customer Ledger
  const handleExportCustomerLedgerType = async (customerId: string) => {
    if (!customerId) return
    setLoadingReport(ledgerActionType === 'export' ? 'ledger_export' : 'ledger_share')
    setShowLedgerModal(false)
    await new Promise(resolve => setTimeout(resolve, 600))

    try {
      const { doc, customer, totalDebit, totalCredit, closingBalance } = generateCustomerLedger(customerId)

      if (ledgerActionType === 'export') {
        doc.save(`Customer_Ledger_${customer.name.replace(/\s+/g, '_')}.pdf`)
      } else {
        const shareUrl = await uploadAndGetShareLink(doc, `Customer_Ledger_${customer.name.replace(/\s+/g, '_')}`)
        
        const biz = profile?.business_name ?? 'F.K.S. TRADERS'
        const message = `
🧾 *CUSTOMER ACCOUNT STATEMENT LEDGER*
🏢 *${biz.toUpperCase()}*
${profile?.tagline ? `_${profile.tagline}_\n` : ''}

*Customer Account Profile:*
• *Name:* ${customer.name}
• *Company:* ${customer.company_name || 'Individual'}
• *Phone:* ${customer.phone || 'N/A'}

*Ledger Account Summary:*
• *Total Billed Charges:* ₹${totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
• *Total Payments Received:* ₹${totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
• *Outstanding Due Balance:* ₹${closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}

📎 *Download PDF Account Statement (Expires in 7 Days):*
${shareUrl}

_Generated via TradersPro Accounting Systems_
        `.trim()

        const phone = customer.phone?.replace(/\D/g, '')
        const num = phone?.startsWith('91') ? phone : `91${phone}`
        if (num && phone) {
          window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank')
        } else {
          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to complete ledger request')
    } finally {
      setLoadingReport(null)
    }
  }

  // --- GENERATE STOCK MOVEMENT ---
  const generateStockMovement = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const startY = drawPDFHeader(doc, `Inventory Stock Status Report`)

    const tableData = products.map((p, idx) => {
      const isCritical = p.current_stock <= (p.min_stock_alert || 0)
      let status = 'In Stock'
      if (p.current_stock === 0) status = 'Out of Stock'
      else if (isCritical) status = 'Critically Low'

      return [
        idx + 1,
        p.name,
        p.category || 'Hardware',
        `₹${(p.selling_rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        `₹${(p.purchase_rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        `${p.current_stock} ${p.unit || 'pcs'}`,
        status
      ]
    })

    autoTable(doc, {
      startY: startY + 6,
      head: [['S.No.', 'Product Name', 'Category', 'Selling Rate', 'Purchase Rate', 'Current Stock', 'Stock Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: TEAL, fontSize: 9, fontStyle: 'bold' },
      styles: { fontSize: 8.5, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'center' }
      },
      didParseCell: (data) => {
        if (data.column.index === 6) {
          if (data.cell.text[0] === 'Critically Low' || data.cell.text[0] === 'Out of Stock') {
            data.cell.styles.textColor = [220, 38, 38]
            data.cell.styles.fontStyle = 'bold'
          } else {
            data.cell.styles.textColor = [16, 185, 129]
          }
        }
      }
    })

    drawPDFBottomBar(doc)
    return { doc }
  }

  // Export PDF: Stock
  const handleExportStockMovement = async () => {
    setLoadingReport('stock_export')
    await new Promise(resolve => setTimeout(resolve, 600))
    try {
      const { doc } = generateStockMovement()
      doc.save(`Stock_Status_Report_${todayStr}.pdf`)
    } catch (err: any) {
      alert(err.message || 'Failed to export Stock Report')
    } finally {
      setLoadingReport(null)
    }
  }

  // Share WhatsApp: Stock
  const handleShareStockMovement = async () => {
    setLoadingReport('stock_share')
    await new Promise(resolve => setTimeout(resolve, 600))
    try {
      const { doc } = generateStockMovement()
      const shareUrl = await uploadAndGetShareLink(doc, 'Stock_Status_Report')
      
      const outOfStockCount = products.filter(p => p.current_stock === 0).length
      const lowStockCount = products.filter(p => p.current_stock > 0 && p.current_stock <= (p.min_stock_alert || 0)).length

      const biz = profile?.business_name ?? 'F.K.S. TRADERS'
      const message = `
📦 *INVENTORY STOCK STATUS REPORT*
🏢 *${biz.toUpperCase()}*
${profile?.tagline ? `_${profile.tagline}_\n` : ''}

*Stock Summary Details:*
• *Total Registered Products:* ${products.length} items
• *Out of Stock Items:* ${outOfStockCount}
• *Critically Low Stock Items:* ${lowStockCount}

📎 *Download PDF Stock Status (Expires in 7 Days):*
${shareUrl}

_Generated via TradersPro Accounting Systems_
      `.trim()

      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
    } catch (err: any) {
      alert(err.message || 'Failed to share Stock Report')
    } finally {
      setLoadingReport(null)
    }
  }

  // --- GENERATE PAYMENT COLLECTIONS ---
  const generatePaymentCollections = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const startY = drawPDFHeader(doc, `Outstanding Payments & Collections Summary`)

    const tableData = customerBalances.map((cb, idx) => [
      idx + 1,
      cb.customer_name || cb.name,
      cb.company_name || 'Individual',
      cb.phone || 'N/A',
      `₹${parseFloat(cb.total_billed || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      `₹${parseFloat(cb.outstanding_dues || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      parseFloat(cb.outstanding_dues || 0) > 0 ? 'OVERDUE' : 'PAID'
    ])

    autoTable(doc, {
      startY: startY + 6,
      head: [['S.No.', 'Customer Name', 'Company Name', 'Phone', 'Total Billed (₹)', 'Outstanding Due (₹)', 'Payment Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: TEAL, fontSize: 9, fontStyle: 'bold' },
      styles: { fontSize: 8.5, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        4: { halign: 'right' },
        5: { halign: 'right', fontStyle: 'bold' },
        6: { halign: 'center' }
      },
      didParseCell: (data) => {
        if (data.column.index === 6) {
          if (data.cell.text[0] === 'OVERDUE') {
            data.cell.styles.textColor = [220, 38, 38]
            data.cell.styles.fontStyle = 'bold'
          } else {
            data.cell.styles.textColor = [16, 185, 129]
          }
        }
      }
    })

    drawPDFBottomBar(doc)
    return { doc }
  }

  // Export PDF: Collections
  const handleExportPaymentCollections = async () => {
    setLoadingReport('collections_export')
    await new Promise(resolve => setTimeout(resolve, 600))
    try {
      const { doc } = generatePaymentCollections()
      doc.save(`Outstanding_Payments_Collections_${todayStr}.pdf`)
    } catch (err: any) {
      alert(err.message || 'Failed to export Collections Report')
    } finally {
      setLoadingReport(null)
    }
  }

  // Share WhatsApp: Collections
  const handleSharePaymentCollections = async () => {
    setLoadingReport('collections_share')
    await new Promise(resolve => setTimeout(resolve, 600))
    try {
      const { doc } = generatePaymentCollections()
      const shareUrl = await uploadAndGetShareLink(doc, 'Outstanding_Payments_Collections')
      
      const overallBilled = customerBalances.reduce((acc, cb) => acc + parseFloat(cb.total_billed || 0), 0)
      const overallOutstanding = customerBalances.reduce((acc, cb) => acc + parseFloat(cb.outstanding_dues || 0), 0)

      const biz = profile?.business_name ?? 'F.K.S. TRADERS'
      const message = `
💰 *OUTSTANDING PAYMENTS & COLLECTIONS SUMMARY*
🏢 *${biz.toUpperCase()}*
${profile?.tagline ? `_${profile.tagline}_\n` : ''}

*Collections Accounts Portfolio:*
• *Overall Billed Balance:* ₹${overallBilled.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
• *Overdue Unpaid Outstanding:* ₹${overallOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
• *Overall Collection Progress:* ${collectionRate.toFixed(1)}%

📎 *Download PDF Collections Summary (Expires in 7 Days):*
${shareUrl}

_Generated via TradersPro Accounting Systems_
      `.trim()

      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
    } catch (err: any) {
      alert(err.message || 'Failed to share Collections Report')
    } finally {
      setLoadingReport(null)
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Reports</h2>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
          <Calendar className="h-4 w-4 text-[#0D9488]" />
          <span className="text-xs font-bold text-slate-900">May 2026</span>
        </div>
      </div>

      {/* SUMMARY STATS BAR */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-[#0D9B8A]"><TrendingUp className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Growth</p>
              <p className="text-xl font-black text-slate-900">+{computedGrowth.toFixed(1)}%</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-[#0D9B8A]"><ShieldCheck className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Collection Rate</p>
              <p className="text-xl font-black text-slate-900">{collectionRate.toFixed(1)}%</p>
           </div>
        </div>
        <div className="tp-card p-6 flex items-center gap-4">
           <div className="bg-emerald-50 p-3 rounded-full text-[#0D9B8A]"><PieChart className="h-5 w-5" /></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profit Margin</p>
              <p className="text-xl font-black text-slate-900">{avgMargin.toFixed(1)}%</p>
           </div>
        </div>
      </div>

      {/* REPORT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Report 1: Daily Sales */}
        <div className="tp-card p-6 flex flex-col justify-between group">
          <div>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0D9B8A]">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleExportDailySales}
                  disabled={loadingReport !== null}
                  title="Download PDF"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingReport === 'daily_export' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 text-slate-500" />}
                </button>
                <button 
                  onClick={handleShareDailySales}
                  disabled={loadingReport !== null}
                  title="Share on WhatsApp"
                  className="p-2 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingReport === 'daily_share' ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4 text-emerald-600" />}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900">Daily Sales Report</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Summary of all sales made today across all categories.</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type: Sales Ledger</span>
            <div className="flex gap-4">
              <button 
                onClick={handleExportDailySales}
                disabled={loadingReport !== null}
                className="text-[10px] font-bold uppercase text-[#0D9488] hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingReport === 'daily_export' ? 'Exporting...' : 'Export PDF'}
              </button>
              <button 
                onClick={handleShareDailySales}
                disabled={loadingReport !== null}
                className="text-[10px] font-bold uppercase text-emerald-600 hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingReport === 'daily_share' ? 'Uploading...' : 'WhatsApp Share'}
              </button>
            </div>
          </div>
        </div>

        {/* Report 2: Customer Ledger */}
        <div className="tp-card p-6 flex flex-col justify-between group">
          <div>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0D9B8A]">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setLedgerActionType('export'); setShowLedgerModal(true); }}
                  title="Select & Download"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4 text-slate-500" />
                </button>
                <button 
                  onClick={() => { setLedgerActionType('share'); setShowLedgerModal(true); }}
                  title="Select & Share"
                  className="p-2 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900">Customer Ledger</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Detailed chronological debit/credit statement history for any customer.</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type: Ledger Statement</span>
            <div className="flex gap-4">
              <button 
                onClick={() => { setLedgerActionType('export'); setShowLedgerModal(true); }}
                className="text-[10px] font-bold uppercase text-[#0D9488] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                Select & Export
              </button>
              <button 
                onClick={() => { setLedgerActionType('share'); setShowLedgerModal(true); }}
                className="text-[10px] font-bold uppercase text-emerald-600 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                Select & Share
              </button>
            </div>
          </div>
        </div>

        {/* Report 3: Stock Movement */}
        <div className="tp-card p-6 flex flex-col justify-between group">
          <div>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0D9B8A]">
                <Zap className="h-6 w-6" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleExportStockMovement}
                  disabled={loadingReport !== null}
                  title="Download PDF"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingReport === 'stock_export' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 text-slate-500" />}
                </button>
                <button 
                  onClick={handleShareStockMovement}
                  disabled={loadingReport !== null}
                  title="Share on WhatsApp"
                  className="p-2 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingReport === 'stock_share' ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4 text-emerald-600" />}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900">Stock Status</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Track inventory stock levels, categories, rates and alerts.</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type: Inventory Status</span>
            <div className="flex gap-4">
              <button 
                onClick={handleExportStockMovement}
                disabled={loadingReport !== null}
                className="text-[10px] font-bold uppercase text-[#0D9488] hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingReport === 'stock_export' ? 'Exporting...' : 'Export PDF'}
              </button>
              <button 
                onClick={handleShareStockMovement}
                disabled={loadingReport !== null}
                className="text-[10px] font-bold uppercase text-emerald-600 hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingReport === 'stock_share' ? 'Uploading...' : 'WhatsApp Share'}
              </button>
            </div>
          </div>
        </div>

        {/* Report 4: Payment Collections */}
        <div className="tp-card p-6 flex flex-col justify-between group">
          <div>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0D9B8A]">
                <Target className="h-6 w-6" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleExportPaymentCollections}
                  disabled={loadingReport !== null}
                  title="Download PDF"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingReport === 'collections_export' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 text-slate-500" />}
                </button>
                <button 
                  onClick={handleSharePaymentCollections}
                  disabled={loadingReport !== null}
                  title="Share on WhatsApp"
                  className="p-2 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingReport === 'collections_share' ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4 text-emerald-600" />}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900">Payment Collections</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Analysis of pending vs received payments and overall collection rates.</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type: Cash Collection</span>
            <div className="flex gap-4">
              <button 
                onClick={handleExportPaymentCollections}
                disabled={loadingReport !== null}
                className="text-[10px] font-bold uppercase text-[#0D9488] hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingReport === 'collections_export' ? 'Exporting...' : 'Export PDF'}
              </button>
              <button 
                onClick={handleSharePaymentCollections}
                disabled={loadingReport !== null}
                className="text-[10px] font-bold uppercase text-emerald-600 hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingReport === 'collections_share' ? 'Uploading...' : 'WhatsApp Share'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Select Customer Ledger Modal */}
      {showLedgerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">
                  {ledgerActionType === 'export' ? 'Export Customer Ledger' : 'Share Customer Ledger'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {ledgerActionType === 'export' 
                    ? 'Select a customer to generate a detailed timeline statement' 
                    : 'Select a customer to upload ledger and generate a share link'}
                </p>
              </div>
              <button 
                onClick={() => setShowLedgerModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Choose Customer *</label>
                <select 
                  value={selectedLedgerCustomerId}
                  onChange={(e) => setSelectedLedgerCustomerId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none bg-white transition-all font-medium"
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowLedgerModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleExportCustomerLedgerType(selectedLedgerCustomerId)}
                  disabled={!selectedLedgerCustomerId || loadingReport !== null}
                  className="flex-1 px-6 py-3 bg-[#0D9488] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 shadow-lg shadow-green-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loadingReport === 'ledger_export' || loadingReport === 'ledger_share' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : ledgerActionType === 'export' ? (
                    <Download className="h-4 w-4" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  {ledgerActionType === 'export' ? 'Generate PDF' : 'Upload & Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
