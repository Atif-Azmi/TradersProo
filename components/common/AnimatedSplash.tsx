'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AnimatedSplash() {
  const [showSplash, setShowSplash] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if reduced motion is preferred
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    // Check if splash was already shown in this browser session
    const hasShown = sessionStorage.getItem('tp_splash_shown')
    if (!hasShown) {
      setShowSplash(true)
      // Mark as shown so sub-navigation doesn't re-trigger
      sessionStorage.setItem('tp_splash_shown', 'true')

      // Dismiss after animation sequence completes (total ~1.8s)
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, mediaQuery.matches ? 400 : 1800)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!showSplash) return null

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="animated-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#E0DCD6] dark:bg-[#1F1E1B] select-none pointer-events-none"
        >
          {/* Subtle Ambient Pulse Glow */}
          {!prefersReducedMotion && (
            <motion.div
              initial={{ opacity: 0.2, scale: 0.85 }}
              animate={{
                opacity: [0.25, 0.5, 0.25],
                scale: [0.9, 1.15, 0.9],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-72 h-72 rounded-full bg-[#B4E0CA]/30 blur-3xl pointer-events-none"
            />
          )}

          {/* Logo Container */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.3 }
                : { type: 'spring', damping: 14, stiffness: 100, duration: 0.5 }
            }
            className="relative flex items-center justify-center w-32 h-36"
          >
            {/* Mint Shield Graphic */}
            <svg
              className="w-full h-full drop-shadow-[0_4px_20px_rgba(180,224,202,0.45)]"
              viewBox="0 0 64 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B4E0CA" />
                  <stop offset="100%" stopColor="#88A993" />
                </linearGradient>
              </defs>
              <path
                d="M32 2L6 14V34C6 51.5 17.2 67.5 32 71C46.8 67.5 58 51.5 58 34V14L32 2Z"
                stroke="url(#shieldGrad)"
                strokeWidth="3.5"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>

            {/* Rising Up-Arrow Graphic */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { y: 22, opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.2 }
                  : { delay: 0.25, duration: 0.65, ease: [0.16, 1, 0.3, 1] }
              }
              className="absolute flex items-center justify-center"
            >
              <svg
                className="w-12 h-12 text-[#1E3121] dark:text-[#EDE9E3]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5M5 12L12 5L19 12" />
              </svg>
            </motion.div>
          </motion.div>

          {/* App Title */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-6 flex flex-col items-center gap-1.5"
          >
            <span className="text-2xl font-black tracking-tight text-[#3E3B36] dark:text-[#EDE9E3] font-sans">
              Traders<span className="text-[#3F6B52] dark:text-[#B4E0CA]">Pro</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#7A756F] dark:text-[#A8A39B]">
              Hardware Business Management
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
