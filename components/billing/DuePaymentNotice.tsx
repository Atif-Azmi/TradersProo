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
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-200/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-sm text-slate-900 uppercase tracking-[0.3em]">Payment Notice</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="bg-slate-50 rounded-2xl p-6 mb-8">
        <pre className="text-xs font-medium text-slate-600 whitespace-pre-wrap font-['Inter',sans-serif] leading-relaxed">
          {noticeText}
        </pre>
      </div>

      <button 
        onClick={sendWhatsApp}
        className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 transition-all"
      >
        <MessageCircle className="h-4 w-4" />
        Send via WhatsApp
      </button>
    </div>
  );
};

export default DuePaymentNotice;
