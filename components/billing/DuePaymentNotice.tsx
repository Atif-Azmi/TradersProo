'use client'

import React from 'react';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';
import { MessageCircle, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface DuePaymentNoticeProps {
  customer: {
    name: string;
    phone: string;
  };
  dueAmount: number;
  dueDate: string;
}

const DuePaymentNotice: React.FC<DuePaymentNoticeProps> = ({ customer, dueAmount, dueDate }) => {
  const { profile } = useBusinessProfile();
  const [copied, setCopied] = useState(false);

  const noticeText = `
Dear ${customer.name},

This is a payment reminder from ${profile?.business_name ?? 'our company'}.

Your payment of ₹${dueAmount.toLocaleString('en-IN')} is due on ${dueDate}.

Please make the payment at your earliest convenience.

For queries, contact us at:
📞 ${profile?.support_phone ?? 'N/A'}
📍 ${profile?.registered_address ?? ''}
${profile?.gst_number ? `GSTIN: ${profile.gst_number}` : ''}

Thank you,
${profile?.business_name ?? 'Management Team'}
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(noticeText);
    setCopied(true);
    toast.success('Notice copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const sendWhatsApp = () => {
    const normalized = customer.phone.replace(/\D/g, '');
    const url = `https://wa.me/${normalized}?text=${encodeURIComponent(noticeText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-[#E9E4DE] dark:bg-[#2A2926] border border-[#CAC8C0] dark:border-[#45433E] rounded-[28px] p-8 shadow-warm-raised">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-sm text-[#3E3B36] dark:text-[#EDE9E3] uppercase tracking-[0.3em]">Payment Notice</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-2.5 rounded-full bg-[#F2EEE9] dark:bg-[#33322E] border border-[#CAC8C0] dark:border-[#45433E] text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] transition-all"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle className="h-4 w-4 text-[#1E3121] dark:text-[#B4E0CA]" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="bg-[#F2EEE9] dark:bg-[#33322E] border border-[#CAC8C0]/50 dark:border-[#45433E]/50 rounded-[20px] p-6 mb-8">
        <pre className="text-xs font-medium text-[#3E3B36] dark:text-[#EDE9E3] whitespace-pre-wrap font-sans leading-relaxed">
          {noticeText}
        </pre>
      </div>

      <button 
        onClick={sendWhatsApp}
        className="w-full flex items-center justify-center gap-3 bg-[#B4E0CA] hover:bg-[#9CCDB4] text-[#1E3121] rounded-full py-4 font-black text-xs uppercase tracking-widest shadow-warm-pill transition-all tap-scale"
      >
        <MessageCircle className="h-4 w-4" />
        Send via WhatsApp
      </button>
    </div>
  );
};

export default DuePaymentNotice;
