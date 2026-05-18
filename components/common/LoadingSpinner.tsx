import React from 'react'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
  textColor?: string
  spinnerColor?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = '',
  size = 'md',
  text = 'LOADING...',
  textColor = 'text-slate-500',
  spinnerColor = 'fill-[#0D9488]'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const textClasses = {
    sm: 'text-[9px] tracking-[0.15em]',
    md: 'text-[11px] tracking-[0.2em]',
    lg: 'text-xs tracking-[0.25em]',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <svg
          className="animate-spin w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 12 dots with sequentially decreasing opacities */}
          <circle cx="85" cy="50" r="6" className={spinnerColor} opacity="1.0" />
          <circle cx="80.3" cy="67.5" r="6" className={spinnerColor} opacity="0.92" />
          <circle cx="67.5" cy="80.3" r="6" className={spinnerColor} opacity="0.83" />
          <circle cx="50" cy="85" r="6" className={spinnerColor} opacity="0.75" />
          <circle cx="32.5" cy="80.3" r="6" className={spinnerColor} opacity="0.67" />
          <circle cx="19.7" cy="67.5" r="6" className={spinnerColor} opacity="0.58" />
          <circle cx="15" cy="50" r="6" className={spinnerColor} opacity="0.50" />
          <circle cx="19.7" cy="32.5" r="6" className={spinnerColor} opacity="0.42" />
          <circle cx="32.5" cy="19.7" r="6" className={spinnerColor} opacity="0.33" />
          <circle cx="50" cy="15" r="6" className={spinnerColor} opacity="0.25" />
          <circle cx="67.5" cy="19.7" r="6" className={spinnerColor} opacity="0.17" />
          <circle cx="80.3" cy="32.5" r="6" className={spinnerColor} opacity="0.08" />
        </svg>
      </div>
      {text && (
        <span className={`font-black uppercase ${textColor} ${textClasses[size]} mt-1`}>
          {text}
        </span>
      )}
    </div>
  )
}

export default LoadingSpinner
