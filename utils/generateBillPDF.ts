import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BusinessProfile } from '@/hooks/useBusinessProfile';

export interface SaleData {
  bill_number: string;
  created_at: string;
  customer_name: string;
  customer_phone?: string;
  selling_price: number;
  down_payment: number;
  remaining_balance: number;
  items?: any[];
}

export const generateBillPDF = (profile: BusinessProfile, sale: SaleData) => {
  const doc = new jsPDF();
  const biz = profile ?? ({} as BusinessProfile);

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136); // #0D9488 - Teal
  doc.text(biz.business_name ?? 'Business', 105, 18, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  
  let currentY = 25;
  if (biz.tagline) {
    doc.text(biz.tagline, 105, currentY, { align: 'center' });
    currentY += 6;
  }
  if (biz.registered_address) {
    doc.text(biz.registered_address, 105, currentY, { align: 'center' });
    currentY += 6;
  }
  
  const cityState = [biz.city, biz.state].filter(Boolean).join(', ');
  if (cityState) {
    doc.text(cityState, 105, currentY, { align: 'center' });
    currentY += 6;
  }
  
  if (biz.support_phone) {
    doc.text(`Phone: ${biz.support_phone}`, 105, currentY, { align: 'center' });
    currentY += 6;
  }
  if (biz.gst_number) {
    doc.text(`GSTIN: ${biz.gst_number}`, 105, currentY, { align: 'center' });
    currentY += 6;
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(10, currentY, 200, currentY);

  // Bill info
  currentY += 8;
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`Bill No: #${sale.bill_number}`, 14, currentY);
  doc.text(
    `Date: ${new Date(sale.created_at).toLocaleDateString('en-IN')}`,
    140, currentY
  );
  
  currentY += 7;
  doc.text(`Customer: ${sale.customer_name}`, 14, currentY);
  
  if (sale.customer_phone) {
    currentY += 7;
    doc.text(`Phone: ${sale.customer_phone}`, 14, currentY);
  }

  // Items table — using autoTable as a direct function (Next.js compatible)
  const tableData = sale.items && sale.items.length > 0 
    ? sale.items.map(i => [
        i.detail || i.product_name || '-',
        i.qty || i.quantity || '1',
        `₹${Number(i.rate || i.debit || i.credit || 0).toLocaleString('en-IN')}`,
        `₹${Number(i.debit || i.credit || 0).toLocaleString('en-IN')}`
      ])
    : [['No items recorded', '-', '-', '-']];

  autoTable(doc, {
    startY: currentY + 8,
    head: [['Description', 'Qty', 'Rate (₹)', 'Amount (₹)']],
    body: tableData,
    foot: [
      ['', '', 'Total', `₹${Number(sale.selling_price || 0).toLocaleString('en-IN')}`],
      ['', '', 'Paid', `₹${Number(sale.down_payment || 0).toLocaleString('en-IN')}`],
      ['', '', 'Due', `₹${Number(sale.remaining_balance || 0).toLocaleString('en-IN')}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [13, 148, 136] },
    footStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    }
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  let currentFooterY = finalY;

  if (profile?.bank_name) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Payment Bank Details:', 14, currentFooterY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Bank: ${profile.bank_name}  |  A/C Number: ${profile.account_number}  |  IFSC: ${profile.ifsc_code}`, 14, currentFooterY + 5);
    if (profile.upi_id) {
      doc.text(`UPI ID: ${profile.upi_id}`, 14, currentFooterY + 10);
      currentFooterY += 16;
    } else {
      currentFooterY += 11;
    }
  }

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Thank you for choosing ${biz.business_name ?? 'us'}!`,
    105, currentFooterY, { align: 'center' }
  );

  doc.save(`Bill_${sale.bill_number}.pdf`);
};
