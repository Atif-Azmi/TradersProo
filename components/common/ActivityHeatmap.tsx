'use client'

import React from 'react'

export interface HeatmapDay {
  dayNumber: number
  active: boolean
  isToday: boolean
}

export interface ActivityHeatmapProps {
  days?: HeatmapDay[]
  className?: string
}

export function ActivityHeatmap({ days, className = '' }: ActivityHeatmapProps) {
  // Default 30-day sample data if none passed
  const sampleDays: HeatmapDay[] =
    days ||
    Array.from({ length: 30 }, (_, i) => ({
      dayNumber: i + 1,
      active: [1, 2, 4, 5, 8, 9, 11, 12, 15, 16, 18, 19, 22, 23, 25, 26, 28, 29].includes(i + 1),
      isToday: i === 29,
    }))

  const weeklyData = [
    { day: 'M', pct: 45, isToday: false },
    { day: 'T', pct: 75, isToday: false },
    { day: 'W', pct: 60, isToday: false },
    { day: 'T', pct: 90, isToday: false },
    { day: 'F', pct: 80, isToday: false },
    { day: 'S', pct: 35, isToday: false },
    { day: 'S', pct: 70, isToday: true },
  ]

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* 30-Day Heatmap Card */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[20px] p-6 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0D9488]">Consistency</p>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">30-Day Trading Activity</h4>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0D9488]" /> Active
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800" /> Rest
            </span>
          </div>
        </div>

        {/* 30-day pills grid */}
        <div className="grid grid-cols-10 gap-2 sm:gap-2.5 py-2">
          {sampleDays.map((d) => (
            <div
              key={d.dayNumber}
              title={`Day ${d.dayNumber}: ${d.active ? 'Active' : 'Rest'}`}
              className={`h-8 sm:h-9 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                d.active
                  ? 'bg-[#0D9488] text-white shadow-sm shadow-[#0D9488]/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              } ${d.isToday ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 dark:ring-offset-slate-900 font-black' : ''}`}
            >
              {d.dayNumber}
            </div>
          ))}
        </div>
      </div>

      {/* Mini Weekly Volume Scrubber */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[20px] p-6 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.04)] flex flex-col justify-between">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Weekly Rhythm</p>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Volume Pace</h4>
        </div>

        <div className="flex items-end justify-between gap-2 h-32 pt-4">
          {weeklyData.map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-full max-w-[16px] h-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
                <div
                  style={{ height: `${bar.pct}%` }}
                  className={`w-full rounded-full transition-all duration-500 ${
                    bar.isToday ? 'bg-[#0D9488]' : 'bg-slate-400 dark:bg-slate-600'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] font-bold ${
                  bar.isToday ? 'text-[#0D9488] font-black' : 'text-slate-400'
                }`}
              >
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

