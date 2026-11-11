'use client'

import React from 'react'
import { Badge } from './Badge'

export interface MetricCardProps {
  title: string
  value: string | number
  deltaLabel?: string
  deltaType?: 'success' | 'accent' | 'warning' | 'danger' | 'neutral'
  icon?: React.ReactNode
  statusType?: 'neutral' | 'warning' | 'critical'
  onClick?: () => void
  className?: string
}

export function MetricCard({
  title,
  value,
  deltaLabel,
  deltaType = 'success',
  icon,
  statusType = 'neutral',
  onClick,
  className = '',
}: MetricCardProps) {
  // Stat icon circle styling according to user specification:
  // neutral/OK bg #B4E0CA + icon #1E3121
  // warning bg #E3D094 + icon #4A3F12
  // critical bg #F0C9C1 + icon #8A2E22
  const iconBgMap = {
    neutral: 'bg-[#B4E0CA] text-[#1E3121]',
    warning: 'bg-[#E3D094] text-[#4A3F12]',
    critical: 'bg-[#F0C9C1] text-[#8A2E22]',
  }

  // Stat numbers: neutral = ink #3E3B36, low stock = #7A5F0F, critical = #A33A2B
  const valueColorMap = {
    neutral: 'text-[#3E3B36] dark:text-[#EDE9E3]',
    warning: 'text-[#7A5F0F] dark:text-[#E3D094]',
    critical: 'text-[#A33A2B] dark:text-[#D98A7B]',
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-[#F2EEE9] dark:bg-[#2A2926] border border-[#CAC8C0] dark:border-[#45433E] rounded-[20px] p-5 shadow-warm-card select-none transition-all duration-200 ${
        onClick ? 'tap-scale active:scale-[0.98] cursor-pointer hover:border-[#88A993]' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${iconBgMap[statusType]}`}>
            {icon}
          </div>
        )}
        {deltaLabel && <Badge label={deltaLabel} variant={deltaType} />}
      </div>

      <div className="mb-1">
        <h3 className={`text-[28px] sm:text-[32px] font-bold font-mono tracking-tight tabular-nums ${valueColorMap[statusType]}`}>
          {typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}
        </h3>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A756F] dark:text-[#A8A39B]">
        {title}
      </p>
    </div>
  )
}

export default MetricCard
