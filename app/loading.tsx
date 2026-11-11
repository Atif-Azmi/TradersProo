import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#E0DCD6] dark:bg-[#1F1E1B] flex flex-col items-center justify-center p-4 z-50">
      <div className="relative flex items-center justify-center w-24 h-28 animate-pulse">
        <svg
          className="w-full h-full text-[#B4E0CA]"
          viewBox="0 0 64 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 2L6 14V34C6 51.5 17.2 67.5 32 71C46.8 67.5 58 51.5 58 34V14L32 2Z"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute flex items-center justify-center text-[#1E3121]">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12L12 5L19 12" />
          </svg>
        </div>
      </div>
      <div className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1E3121]/80 dark:text-[#EDE9E3]/80">
        Loading TradersPro...
      </div>
    </div>
  )
}
