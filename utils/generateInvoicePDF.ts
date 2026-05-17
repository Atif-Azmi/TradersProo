import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BusinessProfile } from '@/hooks/useBusinessProfile';

// Convert number to words (Indian format)
export const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
    'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
    'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const convert = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };

  const [intPart, decPart] = num.toFixed(2).split('.');
  let result = convert(parseInt(intPart)) + ' Rupees';
  if (decPart && parseInt(decPart) > 0) {
    result += ' and ' + convert(parseInt(decPart)) + ' Paise';
  }
  return result + ' Only';
};

// Teal color palette matching requested design
const TEAL: [number, number, number] = [0, 150, 136];
const DARK: [number, number, number] = [0, 77, 90];

export const generateInvoicePDF = (profile: BusinessProfile | null, invoice: any) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, margin = 14;

  // ── TOP DECORATIVE BAR ──
  const blockColors: [number, number, number][] = [TEAL, DARK, [0, 188, 170], DARK, TEAL, DARK, TEAL];
  blockColors.forEach((color, i) => {
    doc.setFillColor(...color);
    doc.rect(i * 30, 0, 30, 6, 'F');
  });

  // ── COMPANY HEADER ──
  let y = 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...DARK);
  doc.text(profile?.business_name ?? 'COMPANY NAME', W / 2, y, { align: 'center' });

  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(...TEAL);
  doc.setFont('helvetica', 'normal');
  doc.text(profile?.tagline ?? 'YOUR SLOGAN', W / 2, y, { align: 'center' });

  y += 5;
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  
  if (profile?.registered_address) {
    doc.text(profile.registered_address, W / 2, y, { align: 'center' });
    y += 5;
  }
  
  const cityState = [profile?.city, profile?.state].filter(Boolean).join(', ');
  if (cityState) {
    doc.text(cityState, W / 2, y, { align: 'center' });
    y += 5;
  }

  const contactLine = [profile?.support_phone].filter(Boolean).join(', ');
  if (contactLine) {
    doc.text(contactLine, W / 2, y, { align: 'center' });
    y += 5;
  }

  if (profile?.gst_number) {
    doc.text(`GSTIN: ${profile.gst_number}`, W / 2, y, { align: 'center' });
  }

  // ── INVOICE META ROW ──
  y += 8;
  doc.setDrawColor(...TEAL);
  doc.line(margin, y, W - margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Invoice No. :  ${invoice.invoice_number}`, margin, y);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text('INVOICE', W / 2, y, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const invoiceDate = invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  doc.text(`Invoice Date :  ${invoiceDate}`, W - margin, y, { align: 'right' });
  
  y += 3;
  doc.line(margin, y, W - margin, y);

  // ── CUSTOMER SECTION ──
  y += 8;
  doc.setFontSize(10);
  doc.text('Name', margin, y);
  doc.line(margin + 14, y, W - margin, y);
  doc.text(invoice.customer_name ?? '', margin + 16, y - 1);

  y += 7;
  doc.text('Address', margin, y);
  doc.line(margin + 18, y, W - margin, y);
  doc.text(invoice.customer_address ?? '', margin + 20, y - 1);

  y += 7;
  doc.line(margin, y, 90, y);
  doc.text('Phone Number', 92, y);
  doc.line(115, y, W - margin, y);
  doc.text(invoice.customer_phone ?? '', 117, y - 1);
  
  y += 4;
  doc.line(margin, y, W - margin, y);

  // ── ITEMS TABLE ──
  y += 4;
  const items = invoice.items || [];
  
  autoTable(doc, {
    startY: y,
    head: [['Sl.No.', 'Description', 'Qty.', 'Rate', 'Amount']],
    body: items.map((item: any, i: number) => [
      i + 1,
      item.name,
      item.quantity,
      `₹${parseFloat(item.rate || 0).toLocaleString('en-IN')}`,
      `₹${((item.quantity || 0) * (item.rate || 0)).toLocaleString('en-IN')}`,
    ]),
    foot: [['', '', '', 'Total', `₹${parseFloat(invoice.total_amount || 0).toLocaleString('en-IN')}`]],
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: TEAL, textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 255, 253], textColor: DARK, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    margin: { left: margin, right: margin },
    theme: 'grid',
  });

  // ── FOOTER ──
  const finalY = (doc as any).lastAutoTable.finalY + 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text('Rupees in words :', margin, finalY);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(numberToWords(parseFloat(invoice.total_amount || 0)), margin + 38, finalY);

  // Terms
  const termsY = finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text('Terms & Conditions :', margin, termsY);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const terms = invoice.terms || [
    'Goods once sold will not be taken back.',
    'Payment due within 30 days.',
    'Subject to local jurisdiction.',
  ];
  
  terms.forEach((term: string, i: number) => {
    doc.text(`• ${term}`, margin + 4, termsY + 7 + (i * 6));
  });

  // Payment Bank details on the right
  if (profile?.bank_name) {
    const bankX = 115;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    doc.text('Payment Bank Details :', bankX, termsY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Bank Name : ${profile.bank_name}`, bankX, termsY + 6);
    doc.text(`A/C Number: ${profile.account_number}`, bankX, termsY + 11);
    doc.text(`IFSC Code : ${profile.ifsc_code}`, bankX, termsY + 16);
    if (profile.upi_id) {
      doc.text(`UPI ID    : ${profile.upi_id}`, bankX, termsY + 21);
    }
  }

  // Signature
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...DARK);
  doc.text('Signature', W - margin, termsY + 30, { align: 'right' });

  // ── BOTTOM DECORATIVE BAR ──
  const pageH = doc.internal.pageSize.height;
  blockColors.forEach((color, i) => {
    doc.setFillColor(...color);
    doc.rect(i * 30, pageH - 6, 30, 6, 'F');
  });

  // Return blob URL for WhatsApp sharing
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  
  return { doc, blobUrl: url };
};
