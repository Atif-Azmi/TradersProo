'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

nprogress.configure({
  trickleSpeed: 200,
  showSpinner: false,
  minimum: 0.08,
  easing: 'ease',
  speed: 200
})

export default function NProgressProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Complete the loading bar when navigation completes
    nprogress.done()
  }, [pathname])

  return <>{children}</>
}
