import { BusinessProfile } from '@/hooks/useBusinessProfile';
import { numberToWords } from './generateInvoicePDF';

export const shareInvoiceWhatsApp = (profile: BusinessProfile | null, invoice: any, pdfBlobUrl?: string) => {
  const biz = profile?.business_name ?? 'Our Store';
  
  const items = invoice.items && invoice.items.length > 0 
    ? invoice.items.map((item: any, i: number) =>
        `${i + 1}. ${item.name} — Qty: ${item.quantity} × ₹${item.rate} = ₹${((item.quantity || 0) * (item.rate || 0)).toLocaleString('en-IN')}`
      ).join('\n')
    : 'No items';

  const message = `
🧾 *INVOICE FROM ${biz.toUpperCase()}*
${profile?.tagline ? `_${profile.tagline}_\n` : ''}
*Invoice No:* ${invoice.invoice_number}
*Date:* ${new Date(invoice.invoice_date || new Date()).toLocaleDateString('en-IN')}

*Customer:* ${invoice.customer_name}

*Items Purchased:*
${items}

━━━━━━━━━━━━━━━━
*TOTAL: ₹${parseFloat(invoice.total_amount || 0).toLocaleString('en-IN')}*
_(${numberToWords(parseFloat(invoice.total_amount || 0))})_

${pdfBlobUrl ? `📎 *Download Invoice PDF:*\n${pdfBlobUrl}\n` : ''}
📞 ${profile?.support_phone ?? ''}
🏢 ${profile?.registered_address ?? ''}
${profile?.gst_number ? `🏛️ GSTIN: ${profile.gst_number}` : ''}

_Thank you for shopping with ${biz}!_
  `.trim();

  const phone = invoice.customer_phone?.replace(/\D/g, '');
  const number = phone?.startsWith('91') ? phone : `91${phone}`;
  
  if (number) {
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
  } else {
    // If no phone number is provided, open WhatsApp Web to select a contact
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  }
};
