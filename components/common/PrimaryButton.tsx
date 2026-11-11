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
    primary: 'bg-[#0B0B0C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
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

