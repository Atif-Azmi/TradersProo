'use client'

import { useState, useEffect } from 'react'
import { Share, Download, X, Smartphone, ArrowUpFromLine, Plus, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showDesktopGuide, setShowDesktopGuide] = useState(false)

  useEffect(() => {
    // 1. Detect if the app is already running in standalone/installed mode
    const checkStandalone = () => {
      if (typeof window === 'undefined') return false
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      )
    }

    if (checkStandalone()) {
      setIsStandalone(true)
      return
    }

    // 2. Check if user already dismissed this session
    const isDismissed = sessionStorage.getItem('tp_pwa_dismissed') === 'true'
    if (isDismissed) return

    // 3. Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase()
    const iosDetect = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(iosDetect)

    // 4. Capture native Chrome / Android / Edge install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // 5. Fallback timer: If native beforeinstallprompt didn't fire
    const fallbackTimer = setTimeout(() => {
      if (!checkStandalone() && sessionStorage.getItem('tp_pwa_dismissed') !== 'true') {
        setShowPrompt(true)
      }
    }, 2800)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowPrompt(false)
      }
      setDeferredPrompt(null)
    } else {
      setShowDesktopGuide(true)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    sessionStorage.setItem('tp_pwa_dismissed', 'true')
  }

  if (isStandalone || !showPrompt) return null

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-[#E9E4DE] dark:bg-[#2A2926] border border-[#CAC8C0] dark:border-[#45433E] text-[#3E3B36] dark:text-[#EDE9E3] rounded-[24px] p-5 shadow-warm-raised overflow-hidden"
        >
          {/* Top Mint Accent */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#B4E0CA] via-[#9CCDB4] to-[#88A993]" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3.5 right-3.5 p-1 rounded-full text-[#7A756F] hover:text-[#3E3B36] dark:text-[#A8A39B] dark:hover:text-[#EDE9E3] hover:bg-[#CAC8C0]/30 transition-all cursor-pointer"
            aria-label="Dismiss installation prompt"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex gap-4 items-start pr-6">
            {/* App Icon Preview */}
            <div className="w-12 h-12 rounded-2xl bg-[#B4E0CA] p-2.5 flex items-center justify-center shadow-warm-pill shrink-0 text-[#1E3121]">
              <Smartphone className="h-6 w-6 text-[#1E3121]" />
            </div>

            <div>
              <h3 className="font-bold text-[#3E3B36] dark:text-[#EDE9E3] text-[13px] uppercase tracking-wider">
                Install TradersPro App
              </h3>
              <p className="text-xs text-[#7A756F] dark:text-[#A8A39B] mt-1 leading-relaxed">
                Add to your home screen or desktop for quick access, offline mode, and instant sync.
              </p>
            </div>
          </div>

          {/* Desktop Address Bar Guide */}
          {showDesktopGuide && (
            <div className="mt-3 p-3 bg-[#F2EEE9] dark:bg-[#33322E] rounded-2xl border border-[#CAC8C0] dark:border-[#45433E] text-xs space-y-1.5 animate-in fade-in duration-200">
              <p className="font-bold text-[#1E3121] dark:text-[#B4E0CA] flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5" /> Desktop Installation:
              </p>
              <p className="text-[11px] leading-relaxed text-[#7A756F] dark:text-[#A8A39B]">
                Click the <strong>Install icon</strong> in your browser&apos;s address bar (top right corner) or select <strong>Menu (⋮) &gt; Install TradersPro</strong>.
              </p>
            </div>
          )}

          {/* Prompt Actions */}
          <div className="mt-5 pt-4 border-t border-[#CAC8C0] dark:border-[#45433E]">
            {isIOS ? (
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-[#1E3121] dark:text-[#B4E0CA] uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowUpFromLine className="h-3.5 w-3.5 animate-bounce" /> 
                  Safari Installation Instructions:
                </p>
                <ol className="text-[11px] text-[#7A756F] dark:text-[#A8A39B] space-y-1.5 list-decimal list-inside leading-normal">
                  <li>
                    Tap the <span className="inline-flex items-center justify-center p-1 bg-[#F2EEE9] dark:bg-[#33322E] rounded mx-0.5"><Share className="h-3 w-3 text-[#1E3121] dark:text-[#B4E0CA]" /></span> <strong>Share</strong> icon at the bottom.
                  </li>
                  <li>
                    Scroll down and select <strong>Add to Home Screen</strong> <span className="inline-flex items-center justify-center p-1 bg-[#F2EEE9] dark:bg-[#33322E] rounded mx-0.5"><Plus className="h-3 w-3 text-[#3E3B36] dark:text-[#EDE9E3]" /></span>.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] border border-[#CAC8C0] dark:border-[#45433E] rounded-full hover:bg-[#F2EEE9] dark:hover:bg-[#33322E] transition-all cursor-pointer text-center tap-scale"
                >
                  Not Now
                </button>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 py-2.5 px-4 text-xs font-bold bg-[#B4E0CA] hover:bg-[#9CCDB4] text-[#1E3121] rounded-full transition-all shadow-warm-pill flex items-center justify-center gap-1.5 cursor-pointer text-center tap-scale"
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
