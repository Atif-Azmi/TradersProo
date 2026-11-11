'use client'

import React from 'react'

export interface BadgeProps {
  label: string
  variant?: 'success' | 'accent' | 'warning' | 'danger' | 'info' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export function Badge({
  label,
  variant = 'accent',
  icon,
  className = '',
}: BadgeProps) {
  // Required token pairings passing WCAG AA:
  // danger tint bg #F0C9C1 text #8A2E22
  // warning bg #E3D094 text #4A3F12
  // success bg #B4E0CA text #1E3121
  // neutral chip bg #E9E4DE text #3E3B36
  const variantStyles = {
    success: 'bg-[#B4E0CA] text-[#1E3121] border-[#88A993]/40 shadow-sm',
    accent: 'bg-[#B4E0CA] text-[#1E3121] border-[#88A993]/40 shadow-sm',
    warning: 'bg-[#E3D094] text-[#4A3F12] border-[#E3D094]/60 shadow-sm',
    danger: 'bg-[#F0C9C1] text-[#8A2E22] dark:bg-[#D98A7B]/25 dark:text-[#D98A7B] border-[#F0C9C1]/80 shadow-sm',
    info: 'bg-[#9DB8C9] text-[#1F3441] border-[#9DB8C9]/60 shadow-sm',
    neutral: 'bg-[#E9E4DE] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] border-[#CAC8C0] dark:border-[#45433E]',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border select-none ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {label}
    </span>
  )
}

export default Badge
