'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Zap, MessageSquare, ShieldAlert } from 'lucide-react'
import { Badge } from './Badge'
import { PrimaryButton } from './PrimaryButton'

export interface PaywallSheetProps {
  isOpen: boolean
  onClose: () => void
  onSelectPlan?: (plan: 'yearly' | 'monthly') => void
}

export function PaywallSheet({ isOpen, onClose, onSelectPlan }: PaywallSheetProps) {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly')

  useEffect(() => {
    // Android back key or ESC key support
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center">
          {/* Backdrop Blur & Dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Sheet Body */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[28px] border-t border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Grabber Handle */}
            <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6 cursor-pointer" onClick={onClose} />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title & Subtitle */}
            <div className="text-center mb-6">
              <span className="text-[10px] font-black tracking-[0.25em] text-[#0D9488] uppercase">TradersPro Enterprise</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">Everything, unlocked.</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Supercharge your hardware trading operations with unlimited multi-ledger sync, WhatsApp automations, and live audit trails.
              </p>
            </div>

            {/* 3 Value Features */}
            <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Instant GST Invoicing & PDF Bills</p>
                  <p className="text-[11px] text-slate-500">Generate professional receipts with QR payment codes in one click.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Automated WhatsApp Due Alerts</p>
                  <p className="text-[11px] text-slate-500">Send personalized payment reminders directly to customer phones.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Real-Time Stock Alerts & RLS Ledger</p>
                  <p className="text-[11px] text-slate-500">Never run out of high-demand items with instant replenishment alerts.</p>
                </div>
              </div>
            </div>

            {/* Plan Selector */}
            <div className="space-y-3 mb-6">
              {/* Yearly Card */}
              <div
                onClick={() => setSelectedPlan('yearly')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between tap-scale ${
                  selectedPlan === 'yearly'
                    ? 'border-[#0B0B0C] dark:border-white bg-slate-50 dark:bg-slate-800/80 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'yearly' ? 'border-[#0D9488] bg-[#0D9488]' : 'border-slate-300'
                    }`}
                  >
                    {selectedPlan === 'yearly' && <Check className="h-3 w-3 text-white stroke-[3]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Annual Membership</span>
                      <Badge label="SAVE 37%" variant="success" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">₹416/mo, billed annually (₹4,999/yr)</p>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">₹4,999</span>
              </div>

              {/* Monthly Card */}
              <div
                onClick={() => setSelectedPlan('monthly')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between tap-scale ${
                  selectedPlan === 'monthly'
                    ? 'border-[#0B0B0C] dark:border-white bg-slate-50 dark:bg-slate-800/80 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'monthly' ? 'border-[#0D9488] bg-[#0D9488]' : 'border-slate-300'
                    }`}
                  >
                    {selectedPlan === 'monthly' && <Check className="h-3 w-3 text-white stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Monthly Flexibility</span>
                    <p className="text-xs text-slate-500 mt-0.5">Cancel or pause subscription anytime</p>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">₹649/mo</span>
              </div>
            </div>

            {/* Full-width Black Pill CTA */}
            <PrimaryButton
              title={selectedPlan === 'yearly' ? 'Continue · ₹416/mo' : 'Continue · ₹649/mo'}
              onClick={() => {
                onSelectPlan?.(selectedPlan)
                onClose()
              }}
            />

            {/* Legal & Terms */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-400">
              <button onClick={() => alert('Purchases restored')} className="hover:underline">Restore</button>
              <span>•</span>
              <a href="#" className="hover:underline">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

