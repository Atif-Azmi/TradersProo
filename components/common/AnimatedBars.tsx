'use client'

import React from 'react'
import './AnimatedBars.css'

export interface BarConfig {
  id: string
  color: string
  width: number | string
  height: number | string
  borderRadius: string
  marginBottom?: number | string
  duration: number
  delay: number
  floatOffset?: number
  shadowColor?: string
}

export interface AnimatedBarsProps {
  bars?: BarConfig[]
  speed?: number
  paused?: boolean
  className?: string
}

export const defaultLoginBars: BarConfig[] = [
  {
    id: 'bar-1-ink-tall',
    color: '#3E3B36', // Warm Dark Ink: tall bar
    width: 64, // w-16
    height: 320, // Full height of h-80 (320px)
    borderRadius: '32px 32px 0 0', // rounded-t-full (flat bottom)
    marginBottom: 0,
    duration: 3.2,
    delay: 0,
    shadowColor: 'rgba(62, 59, 54, 0.25)',
  },
  {
    id: 'bar-2-mint-medium',
    color: '#B4E0CA', // Mint Primary pill
    width: 96, // w-24
    height: 192, // 60% of 320px
    borderRadius: '9999px', // rounded-full
    marginBottom: 40, // mb-10 (40px bottom offset)
    duration: 4.1,
    delay: 0.4,
    floatOffset: 6,
    shadowColor: 'rgba(180, 224, 202, 0.50)',
  },
  {
    id: 'bar-3-sage-pill',
    color: '#88A993', // Primary Strong / Sage pill
    width: 48, // w-12
    height: 256, // 80% of 320px
    borderRadius: '9999px', // rounded-full
    marginBottom: 16, // mb-4 (16px bottom offset)
    duration: 3.6,
    delay: 0.9,
    floatOffset: 8,
    shadowColor: 'rgba(136, 169, 147, 0.40)',
  },
  {
    id: 'bar-4-gold-short',
    color: '#E3D094', // Warm Gold rounded rectangle
    width: 80, // w-20
    height: 128, // 40% of 320px
    borderRadius: '12px', // rounded-token-sm
    marginBottom: 48, // mb-12 (48px bottom offset)
    duration: 4.8,
    delay: 0.2,
    shadowColor: 'rgba(227, 208, 148, 0.35)',
  },
]

export const defaultRegisterBars: BarConfig[] = [
  {
    id: 'reg-bar-1',
    color: '#3E3B36', // Warm Ink
    width: 48, // w-12
    height: 256, // Full height of h-64
    borderRadius: '24px 24px 0 0',
    marginBottom: 0,
    duration: 3.4,
    delay: 0,
    shadowColor: 'rgba(62, 59, 54, 0.25)',
  },
  {
    id: 'reg-bar-2',
    color: '#B4E0CA', // Mint Primary
    width: 80, // w-20
    height: 180, // ~70%
    borderRadius: '9999px',
    marginBottom: 32, // mb-8
    duration: 4.2,
    delay: 0.3,
    floatOffset: 6,
    shadowColor: 'rgba(180, 224, 202, 0.45)',
  },
  {
    id: 'reg-bar-3',
    color: '#88A993', // Sage
    width: 40, // w-10
    height: 230, // ~90%
    borderRadius: '9999px',
    marginBottom: 8, // mb-2
    duration: 3.7,
    delay: 0.7,
    floatOffset: 7,
    shadowColor: 'rgba(136, 169, 147, 0.40)',
  },
  {
    id: 'reg-bar-4',
    color: '#E3D094', // Warm Gold
    width: 64, // w-16
    height: 128, // ~50%
    borderRadius: '12px',
    marginBottom: 40, // mb-10
    duration: 4.5,
    delay: 0.2,
    shadowColor: 'rgba(227, 208, 148, 0.30)',
  },
]

export default function AnimatedBars({
  bars = defaultLoginBars,
  speed = 1,
  paused = false,
  className = '',
}: AnimatedBarsProps) {
  return (
    <div
      className={`animated-bars-container ${className}`}
      aria-hidden="true"
      style={{
        animationPlayState: paused ? 'paused' : 'running',
      }}
    >
      {bars.map((bar, index) => {
        const adjustedDuration = Math.max(0.5, bar.duration / speed)
        const entryDelay = index * 0.12 // 120ms staggered entry

        return (
          <div
            key={bar.id}
            className="animated-bar-wrapper"
            style={{
              marginBottom:
                typeof bar.marginBottom === 'number'
                  ? `${bar.marginBottom}px`
                  : bar.marginBottom || '0',
            }}
          >
            <div
              className="animated-bar cursor-pointer"
              style={
                {
                  width: typeof bar.width === 'number' ? `${bar.width}px` : bar.width,
                  height: typeof bar.height === 'number' ? `${bar.height}px` : bar.height,
                  backgroundColor: bar.color,
                  borderRadius: bar.borderRadius,
                  '--dur': `${adjustedDuration}s`,
                  '--delay': `${bar.delay}s`,
                  '--enter-delay': `${entryDelay}s`,
                  '--float': `${bar.floatOffset || 0}px`,
                  '--shadow-col': bar.shadowColor || 'rgba(0,0,0,0.2)',
                  animationPlayState: paused ? 'paused' : 'running',
                } as React.CSSProperties
              }
            />
          </div>
        )
      })}
    </div>
  )
}
