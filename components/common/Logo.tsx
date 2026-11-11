'use client'

import React from 'react'

export interface LogoProps {
  variant?: 'auto' | 'light' | 'dark' | 'mono'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showWordmark?: boolean
  className?: string
}

export function Logo({
  variant = 'auto',
  size = 'md',
  showWordmark = true,
  className = '',
}: LogoProps) {
  const sizeMap = {
    sm: { height: 28, markSize: 28, textClass: 'text-base font-black', gap: 'gap-2' },
    md: { height: 36, markSize: 36, textClass: 'text-xl font-black', gap: 'gap-2.5' },
    lg: { height: 48, markSize: 48, textClass: 'text-2xl font-black', gap: 'gap-3' },
    xl: { height: 64, markSize: 64, textClass: 'text-3xl font-black', gap: 'gap-3.5' },
  }

  const { markSize, textClass, gap } = sizeMap[size] || sizeMap.md

  // Wordmark colors depending on variant
  let tradersClass = 'text-[#3E3B36] dark:text-[#EDE9E3]'
  let proClass = 'text-[#3F6B52] dark:text-[#B4E0CA]'
  let shieldFill = '#B4E0CA'
  let checkColor = '#1E3121'

  if (variant === 'light') {
    tradersClass = 'text-[#3E3B36]'
    proClass = 'text-[#3F6B52]'
    shieldFill = '#B4E0CA'
    checkColor = '#1E3121'
  } else if (variant === 'dark') {
    tradersClass = 'text-[#EDE9E3]'
    proClass = 'text-[#B4E0CA]'
    shieldFill = '#B4E0CA'
    checkColor = '#1E3121'
  } else if (variant === 'mono') {
    tradersClass = 'text-[#1E3121]'
    proClass = 'text-[#1E3121]'
    shieldFill = '#1E3121'
    checkColor = '#FFFFFF'
  }

  return (
    <div className={`inline-flex items-center ${gap} select-none ${className}`}>
      {/* SVG Shield Mark with dark-green inner check glyph */}
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 shadow-warm-pill rounded-full"
      >
        <circle cx="20" cy="20" r="20" fill={shieldFill} />
        <path
          d="M20 9C25.5 9 29.5 10.8 29.5 16C29.5 24.5 24 30.5 20 32.5C16 30.5 10.5 24.5 10.5 16C10.5 10.8 14.5 9 20 9Z"
          fill={shieldFill}
        />
        <path
          d="M15 20.5L18.5 24L25.5 16.5"
          stroke={checkColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark: "Traders" in ink #3E3B36, "Pro" in #3F6B52 */}
      {showWordmark && (
        <span className={`tracking-tight font-sans ${textClass}`}>
          <span className={tradersClass}>Traders</span>
          <span className={proClass}>Pro</span>
        </span>
      )}
    </div>
  )
}

export default Logo

