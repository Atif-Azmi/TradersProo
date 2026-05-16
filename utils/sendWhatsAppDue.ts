export const sendWhatsAppDuePayment = (profile: any, customer: any, billData: any, shareLink?: string) => {
  const businessName = profile?.business_name ?? 'Our Store';
  const phone = profile?.support_phone ?? '';
  const gst = profile?.gst_number ?? '';

  const message = `
*Payment Reminder* 🔔
*${businessName}*
${profile?.tagline ? `_${profile.tagline}_\n` : ''}
Dear *${customer.name}*,

This is a friendly reminder that your payment of *₹${billData.netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}* is due.

${shareLink ? `💠 *View/Download Bill:* ${shareLink}\n` : ''}

Please make the payment at your earliest convenience to avoid any inconvenience.

📞 *Contact:* ${phone}
📍 *Address:* ${profile?.registered_address ?? ''}
${gst ? `🏛️ *GSTIN:* ${gst}` : ''}

_Thank you for your business!_
*${businessName}*
  `.trim();

  // Open WhatsApp with pre-filled message
  const normalized = customer.phone?.replace(/\D/g, '') || '';
  const whatsappNumber = normalized.startsWith('91')
    ? normalized
    : `91${normalized}`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
