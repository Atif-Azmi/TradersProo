'use client'

import React from 'react'

export interface BadgeProps {
  label: string
  variant?: 'success' | 'accent' | 'danger' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export function Badge({
  label,
  variant = 'accent',
  icon,
  className = '',
}: BadgeProps) {
  const variantStyles = {
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/40',
    accent: 'bg-[#14B8A6]/10 dark:bg-[#14B8A6]/20 text-[#0D9488] dark:text-[#2DD4BF] border-[#14B8A6]/25 dark:border-[#14B8A6]/40',
    danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/40',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border select-none ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {label}
    </span>
  )
}

