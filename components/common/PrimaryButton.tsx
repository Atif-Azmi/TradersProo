'use client'

import React from 'react'

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

export function PrimaryButton({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  className = '',
  ...props
}: PrimaryButtonProps) {
  const baseStyles =
    'h-[52px] rounded-full font-semibold text-[15px] tracking-tight transition-all duration-200 select-none flex items-center justify-center gap-2 px-6 tap-scale active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const variantStyles = {
    primary: 'bg-[#B4E0CA] hover:bg-[#9CCDB4] text-[#1E3121] shadow-warm-pill font-bold',
    secondary: 'bg-[#F2EEE9] dark:bg-[#33322E] text-[#3E3B36] dark:text-[#EDE9E3] hover:bg-[#CAC8C0]/30 border border-[#CAC8C0] dark:border-[#45433E]',
    ghost: 'bg-transparent text-[#7A756F] dark:text-[#A8A39B] hover:text-[#3E3B36] dark:hover:text-[#EDE9E3] hover:bg-[#F2EEE9] dark:hover:bg-[#33322E]',
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? 'w-full' : 'w-auto'} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon}
          <span>{title}</span>
        </>
      )}
    </button>
  )
}

