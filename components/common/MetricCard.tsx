'use client'

import React from 'react'
import { Badge } from './Badge'

export interface MetricCardProps {
  title: string
  value: string | number
  deltaLabel?: string
  deltaType?: 'success' | 'accent' | 'danger' | 'neutral'
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function MetricCard({
  title,
  value,
  deltaLabel,
  deltaType = 'success',
  icon,
  onClick,
  className = '',
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[20px] p-5 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.04)] select-none transition-all duration-200 ${
        onClick ? 'tap-scale active:scale-[0.98] cursor-pointer hover:border-slate-200 dark:hover:border-slate-700' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
            {icon}
          </div>
        )}
        {deltaLabel && <Badge label={deltaLabel} variant={deltaType} />}
      </div>

      <div className="mb-1">
        <h3 className="text-[28px] sm:text-[32px] font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
          {typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}
        </h3>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {title}
      </p>
    </div>
  )
}

