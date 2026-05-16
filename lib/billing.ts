import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function generateBillData({ customerId, startDate, endDate }: {
  customerId: string
  startDate: string
  endDate: string
}) {
  const [customerRes, profileRes, salesRes, paymentsRes, prevSalesRes, prevPayRes] = await Promise.all([
    supabase.from('tp_customers').select('id, name, phone, address').eq('id', customerId).single(),
    supabase.from('tp_profile').select('business_name, tagline, address, city, state, phone, gst_number').single(),
    supabase.from('tp_sales')
      .select('id, invoice_date, total_amount, invoice_number, payment_status, tp_sale_items(product_name, quantity, rate, discount_percent, gst_percent)')
      .eq('customer_id', customerId)
      .gte('invoice_date', startDate)
      .lte('invoice_date', endDate)
      .order('invoice_date', { ascending: true }),
    supabase.from('tp_advances')
      .select('id, date, amount, type, payment_mode, notes')
      .eq('customer_id', customerId)
      .in('type', ['received', 'payment', 'advance'])
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true }),
    supabase.from('tp_sales')
      .select('total_amount')
      .eq('customer_id', customerId)
      .lt('invoice_date', startDate),
    supabase.from('tp_advances')
      .select('amount')
      .eq('customer_id', customerId)
      .in('type', ['received', 'payment', 'advance'])
      .lt('date', startDate),
  ])

  const customer = customerRes.data
  const profile = profileRes.data
  const sales = salesRes.data || []
  const payments = paymentsRes.data || []
  const prevSales = prevSalesRes.data || []
  const prevPayments = prevPayRes.data || []

  const previousBalance =
    prevSales.reduce((s: number, r: any) => s + Number(r.total_amount), 0) -
    prevPayments.reduce((s: number, r: any) => s + Number(r.amount), 0)

  const totalSales = sales.reduce((s: number, r: any) => s + Number(r.total_amount), 0)
  const totalPaid = payments.reduce((s: number, r: any) => s + Number(r.amount), 0)
  const netPayable = previousBalance + totalSales - totalPaid

  const saleRows = sales.flatMap((sale: any) => {
    if (sale.tp_sale_items && sale.tp_sale_items.length > 0) {
      return sale.tp_sale_items.map((item: any) => {
        const sub = item.quantity * item.rate
        const afterDisc = sub - (sub * (item.discount_percent || 0) / 100)
        const total = afterDisc + (afterDisc * (item.gst_percent || 0) / 100)
        return {
          date: sale.invoice_date,
          type: 'Sale Item',
          detail: item.product_name,
          qty: item.quantity,
          rate: item.rate,
          debit: total,
          credit: null,
          invoice_number: sale.invoice_number
        }
      })
    } else {
      return [{
        date: sale.invoice_date,
        type: 'Sale',
        detail: `Invoice #${sale.invoice_number || 'N/A'}`,
        qty: 1,
        rate: Number(sale.total_amount),
        debit: Number(sale.total_amount),
        credit: null,
      }]
    }
  })

  const paymentRows = payments.map((txn: any) => ({
    date: txn.date,
    type: txn.type === 'advance' ? 'Advance' : 'Payment',
    detail: txn.payment_mode ? `${txn.payment_mode} Received` : (txn.notes || 'Payment'),
    debit: null,
    credit: Number(txn.amount),
  }))

  const ledgerRows = [...saleRows, ...paymentRows].sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return { customer, profile, period: { start: startDate, end: endDate }, ledgerRows, previousBalance, totalSales, totalPaid, netPayable }
}

export async function uploadBillPDF({ userId, customerId, pdfBlob, startDate, endDate }: any) {
  // Triple-check: Verify session before storage upload
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Authentication failed: User not logged in.")
  
  const fileName = `${customerId}_${startDate}_${endDate}.pdf`
  const filePath = `${user.id}/${fileName}` // Use the ID from the session directly

  console.log('DEBUG: Uploading to storage...', filePath);
  
  const { error: uploadError } = await supabase.storage
    .from('bills')
    .upload(filePath, pdfBlob, { contentType: 'application/pdf', upsert: true })

  if (uploadError) {
    console.error('DEBUG: Storage Error:', uploadError);
    throw new Error(`[Storage Error] ${uploadError.message}`);
  }

  const { data: urlData, error: urlError } = await supabase.storage
    .from('bills')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7)

  if (urlError) throw urlError
  return { path: filePath, signedUrl: urlData.signedUrl }
}

export async function saveBillShare({ 
  userId, 
  customer_id, 
  storagePath, 
  periodStart, 
  periodEnd,
  customerName,
  customerPhone,
  totalAmount,
}: any) {
  // Verify session before database insert
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Authentication failed: User not logged in.")

  const { data, error } = await supabase
    .from('tp_bill_shares')
    .insert({ 
      user_id: user.id,
      customer_id: customer_id ?? null,
      storage_path: storagePath,
      period_start: periodStart ?? null,
      period_end: periodEnd ?? null,
      customer_name: customerName ?? null,
      customer_phone: customerPhone ?? null,
      total_amount: totalAmount ?? null,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })
    .select()

  if (error) {
    console.error('DEBUG: tp_bill_shares insert error:', error);
    throw new Error(`Upload failed: ${error.message}`)
  }
  
  return data?.[0]
}

export async function shortenUrl(longUrl: string): Promise<string> {
  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`)
    return await res.text()
  } catch {
    return longUrl
  }
}
