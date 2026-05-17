'use client'

import { useState, useEffect } from 'react'
import { Share, Download, X, Smartphone, ArrowUpFromLine, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // 1. Detect if the app is already running in standalone/installed mode
    const checkStandalone = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      )
    }

    if (checkStandalone()) {
      setIsStandalone(true)
      return
    }

    // 2. Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase()
    const iosDetect = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(iosDetect)

    // 3. Handle standard Chrome / Android / Desktop PWA install prompts
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // 4. For iOS / Safari, we show the custom tooltip if not installed
    if (iosDetect && !checkStandalone()) {
      // Let's delay the iOS banner slightly to feel more organic
      const timer = setTimeout(() => setShowPrompt(true), 3000)
      return () => clearTimeout(timer)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Trigger native browser install
    deferredPrompt.prompt()
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt')
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  // If already installed or shouldn't show, render nothing
  if (isStandalone || !showPrompt) return null

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-2xl overflow-hidden shadow-slate-950/60"
        >
          {/* Subtle top background gradient to match TradersPro teals */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0D9488] to-[#0D9B8A]" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Dismiss installation prompt"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex gap-4 items-start pr-6">
            {/* App Icon Preview */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#0D9B8A] p-2.5 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              <Smartphone className="h-6 w-6 text-white" />
            </div>

            <div>
              <h3 className="font-bold text-slate-100 text-[13px] uppercase tracking-wider">Install TradersPro App</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Add to your home screen for quick access, offline mode, and instant push updates.
              </p>
            </div>
          </div>

          {/* Prompt Actions */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            {isIOS ? (
              // iOS / Safari step-by-step guidance
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-[#0D9B8A] uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowUpFromLine className="h-3.5 w-3.5 animate-bounce" /> 
                  Safari Installation Instructions:
                </p>
                <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside leading-normal">
                  <li>
                    Tap the <span className="inline-flex items-center justify-center p-1 bg-slate-800 rounded mx-0.5"><Share className="h-3 w-3 text-sky-400" /></span> <strong className="text-white">Share</strong> icon at the bottom.
                  </li>
                  <li>
                    Scroll down the options list and select <strong className="text-white">Add to Home Screen</strong> <span className="inline-flex items-center justify-center p-1 bg-slate-800 rounded mx-0.5"><Plus className="h-3 w-3 text-slate-300" /></span>.
                  </li>
                </ol>
              </div>
            ) : (
              // Standard install prompt for Android/Chrome/Desktop
              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-400 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-800 transition-all cursor-pointer text-center"
                >
                  Not Now
                </button>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 py-2.5 px-4 text-xs font-bold bg-[#0D9B8A] hover:bg-teal-600 text-white rounded-lg transition-all shadow-md shadow-teal-900/30 flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <Download className="h-3.5 w-3.5" />
                  Install App
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
