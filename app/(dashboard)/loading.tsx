'use client'

import React from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function DashboardLoading() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex items-center justify-center max-w-xs w-full">
        <LoadingSpinner size="md" text="SYNCING WORKSPACE..." textColor="text-slate-400" />
      </div>
    </div>
  )
}
