import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import AnimatedSplash from '@/components/common/AnimatedSplash'
import NProgressProvider from '@/components/NProgressProvider'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const viewport = {
  themeColor: '#B4E0CA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'TradersPro — Hardware Business Management',
  description: 'Track customers, sales, stock alerts, and bulk WhatsApp reminders.',
  manifest: '/manifest.json?v=2.0.1',
  icons: {
    icon: [
      { url: '/favicon.ico?v=2.0.1' },
      { url: '/icon.png?v=2.0.1', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png?v=2.0.1', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TradersPro',
  },
  openGraph: {
    title: 'TradersPro — Hardware Business Management',
    description: 'Track customers, sales, stock alerts, and bulk WhatsApp reminders.',
    images: ['https://traders-proo.vercel.app/og-image.jpg?v=2.0.1'],
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
        <link rel="icon" href="/favicon.ico?v=2.0.1" sizes="any" />
        <link rel="icon" href="/icon.png?v=2.0.1" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=2.0.1" />
        <link rel="preconnect" href="https://api.dicebear.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="font-sans antialiased">
        <AnimatedSplash />
        <ErrorBoundary>
          <NProgressProvider>
            <NextTopLoader 
              color="#B4E0CA"
              initialPosition={0.08}
              crawlSpeed={200}
              height={2}
              crawl={true}
              showSpinner={false}
              shadow={false}
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
