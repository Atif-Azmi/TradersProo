'use client'

import React from 'react';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';
import { shareInvoiceWhatsApp } from '@/utils/shareInvoiceWhatsApp';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';
import { FileText, MessageCircle, Printer } from 'lucide-react';

interface InvoiceActionsProps {
  invoice: any;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ invoice }) => {
  const { profile } = useBusinessProfile();

  const handleDownloadPDF = () => {
    const { doc } = generateInvoicePDF(profile, invoice);
    doc.save(`Invoice_${invoice.invoice_number}.pdf`);
  };

  const handleShareWhatsApp = () => {
    const { blobUrl } = generateInvoicePDF(profile, invoice);
    shareInvoiceWhatsApp(profile, invoice, blobUrl);
  };

  const handlePrint = () => {
    // Generate the PDF and open it in a new window for printing
    const { blobUrl } = generateInvoicePDF(profile, invoice);
    const printWindow = window.open(blobUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      // Fallback if popup blocker prevents opening
      window.print();
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button 
        onClick={handleDownloadPDF}
        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-teal-100 transition-all"
      >
        <FileText className="h-4 w-4" />
        Download PDF
      </button>
      
      <button 
        onClick={handleShareWhatsApp}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-green-100 transition-all"
      >
        <MessageCircle className="h-4 w-4" />
        Share on WhatsApp
      </button>
      
      <button 
        onClick={handlePrint}
        className="flex items-center gap-2 border-2 border-teal-600 hover:bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-sm font-bold transition-all"
      >
        <Printer className="h-4 w-4" />
        Print
      </button>
    </div>
  );
};

export default InvoiceActions;
