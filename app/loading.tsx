'use client'

import React from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex items-center justify-center max-w-sm w-full animate-in fade-in zoom-in-95 duration-500">
        <LoadingSpinner size="lg" text="LOADING..." textColor="text-slate-400" />
      </div>
    </div>
  )
}
