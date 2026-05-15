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
      .select('id, invoice_date, total_amount, invoice_number, payment_status')
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

  const saleRows = sales.map((sale: any) => ({
    date: sale.invoice_date,
    type: 'Sale',
    detail: `Invoice #${sale.invoice_number || 'N/A'}`,
    debit: Number(sale.total_amount),
    credit: null,
  }))

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

export async function saveBillShare({ userId, customer_id, storagePath, periodStart, periodEnd }: any) {
  // Triple-check: Verify session before database insert
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Authentication failed: User not logged in.")

  console.log('DEBUG: Saving to database with user_id:', user.id);
  
  const { data, error } = await supabase
    .from('tp_bill_shares')
    .insert({ 
      user_id: user.id, // Always use the verified session ID
      customer_id: customer_id, 
      storage_path: storagePath, 
      period_start: periodStart, 
      period_end: periodEnd 
    })
    .select()

  if (error) {
    console.error('DEBUG: Database Error details:', error);
    throw new Error(`[Database RLS Violation] ${error.message}. Ensure your tp_bill_shares table has a policy for user_id = auth.uid()`);
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
