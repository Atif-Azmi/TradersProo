'use client'

import React, { useState } from 'react';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';
import { shareInvoiceWhatsApp } from '@/utils/shareInvoiceWhatsApp';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';
import { FileText, MessageCircle, Printer } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { uploadBillPDF, saveBillShare, shortenUrl } from '@/lib/billing';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

interface InvoiceActionsProps {
  invoice: any;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ invoice }) => {
  const { profile } = useBusinessProfile();
  const [sharing, setSharing] = useState(false);
  const supabase = createClient();

  const handleDownloadPDF = () => {
    const { doc } = generateInvoicePDF(profile, invoice);
    doc.save(`Invoice_${invoice.invoice_number}.pdf`);
  };

  const handleShareWhatsApp = async () => {
    setSharing(true);
    try {
      const { doc } = generateInvoicePDF(profile, invoice);
      const pdfBlob = doc.output('blob');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Authentication required to share');
        setSharing(false);
        return;
      }

      // Generate invoice date safely
      const invoiceDate = invoice.invoice_date || new Date().toISOString().split('T')[0];

      // Upload statement PDF
      const { signedUrl, path } = await uploadBillPDF({
        userId: user.id,
        customerId: invoice.customer_id || user.id,
        pdfBlob,
        startDate: invoiceDate,
        endDate: invoiceDate
      });

      // Save shared link record
      const shareData = await saveBillShare({
        userId: user.id,
        customer_id: invoice.customer_id || null,
        storagePath: path,
        periodStart: invoiceDate,
        periodEnd: invoiceDate,
        customerName: invoice.customer_name,
        customerPhone: invoice.customer_phone,
        totalAmount: invoice.total_amount,
        pdfUrl: signedUrl
      });

      // Generate short link to public billing landing page
      const origin = window.location.origin;
      const publicBillPageUrl = `${origin}/shared-bill/${shareData.id}`;
      const short = await shortenUrl(publicBillPageUrl);

      // Trigger WhatsApp Web
      shareInvoiceWhatsApp(profile, invoice, short);
      toast.success('Ready to share on WhatsApp!');
    } catch (e: any) {
      console.error('WhatsApp share upload failed:', e);
      toast.error('Failed to prepare sharing link');
    } finally {
      setSharing(false);
    }
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
        className="flex items-center gap-2 bg-[#B4E0CA] hover:bg-[#9CCDB4] text-[#1E3121] px-5 py-2.5 rounded-full text-sm font-bold shadow-warm-pill transition-all tap-scale"
      >
        <FileText className="h-4 w-4" />
        Download PDF
      </button>
      
      <button 
        onClick={handleShareWhatsApp}
        disabled={sharing}
        className="flex items-center gap-2 bg-[#B4E0CA] hover:bg-[#9CCDB4] disabled:opacity-50 text-[#1E3121] px-5 py-2.5 rounded-full text-sm font-bold shadow-warm-pill transition-all min-w-[160px] justify-center tap-scale"
      >
        {sharing ? (
          <span className="flex items-center gap-2 justify-center">
            <LoadingSpinner size="sm" text="" spinnerColor="fill-[#1E3121]" />
            Uploading...
          </span>
        ) : (
          <>
            <MessageCircle className="h-4 w-4" />
            Share on WhatsApp
          </>
        )}
      </button>
      
      <button 
        onClick={handlePrint}
        className="flex items-center gap-2 border-2 border-[#88A993] hover:bg-[#B4E0CA]/20 text-[#1E3121] dark:text-[#B4E0CA] px-5 py-2.5 rounded-full text-sm font-bold transition-all tap-scale"
      >
        <Printer className="h-4 w-4" />
        Print
      </button>
    </div>
  );
};

export default InvoiceActions;
