'use client'

import React from 'react'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#CAC8C0]/60 dark:bg-[#45433E]/60 rounded-xl ${className || ''}`}
    />
  )
}

export default function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#E9E4DE] dark:bg-[#2A2926] p-6 rounded-[20px] border border-[#CAC8C0] dark:border-[#45433E] shadow-warm-card space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Chart & Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#E9E4DE] dark:bg-[#2A2926] p-6 rounded-[20px] border border-[#CAC8C0] dark:border-[#45433E] shadow-warm-card space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        <div className="bg-[#E9E4DE] dark:bg-[#2A2926] p-6 rounded-[20px] border border-[#CAC8C0] dark:border-[#45433E] shadow-warm-card space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table Skeleton */}
      <div className="bg-[#E9E4DE] dark:bg-[#2A2926] p-6 rounded-[20px] border border-[#CAC8C0] dark:border-[#45433E] shadow-warm-card space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((k) => (
            <div key={k} className="flex justify-between items-center py-2 border-b border-[#CAC8C0]/30 dark:border-[#45433E]/30">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

