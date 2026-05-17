import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import NProgressProvider from '@/components/NProgressProvider'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const viewport = {
  themeColor: '#0D9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'TradersPro — Hardware Business Management',
  description: 'Track customers, sales, stock alerts, and bulk WhatsApp reminders.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TradersPro',
  },
  openGraph: {
    title: 'TradersPro — Hardware Business Management',
    description: 'Track customers, sales, stock alerts, and bulk WhatsApp reminders.',
    images: ['https://traders-proo.vercel.app/og-image.jpg'],
    url: 'https://traders-proo.vercel.app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradersPro — Hardware Business Management',
    description: 'Track customers, sales, stock alerts, and bulk WhatsApp reminders.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.dicebear.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <NProgressProvider>
            <NextTopLoader 
              color="#0D9488"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
            />
            <PWAInstallPrompt />
            {children}
          </NProgressProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
