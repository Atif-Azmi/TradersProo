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
      className={`bg-[#E9E4DE] dark:bg-[#2A2926] border border-[#CAC8C0] dark:border-[#45433E] rounded-[20px] p-5 shadow-warm-card select-none transition-all duration-200 ${
        onClick ? 'tap-scale active:scale-[0.98] cursor-pointer hover:border-[#88A993]' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#F2EEE9] dark:bg-[#33322E] border border-[#CAC8C0] dark:border-[#45433E] flex items-center justify-center text-[#1E3121] dark:text-[#B4E0CA]">
            {icon}
          </div>
        )}
        {deltaLabel && <Badge label={deltaLabel} variant={deltaType} />}
      </div>

      <div className="mb-1">
        <h3 className="text-[28px] sm:text-[32px] font-bold font-mono tracking-tight text-[#3E3B36] dark:text-[#EDE9E3] tabular-nums">
          {typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}
        </h3>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A756F] dark:text-[#A8A39B]">
        {title}
      </p>
    </div>
  )
}

