import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'
import { VoiceProvider } from '@/contexts/VoiceContext'
import { AccessibilityProvider } from '@/contexts/AccessibilityContext'
import { ToastProvider } from '@/components/ui/ToastProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Blind Assistant - Luxury Assistive Technology',
  description: 'Premium assistive technology platform for visually impaired users featuring voice navigation, real-time object detection, and intelligent location services.',
  keywords: ['accessibility', 'assistive technology', 'blind assistant', 'voice navigation', 'object detection'],
  authors: [{ name: 'Blind Assistant Team' }],
  creator: 'Blind Assistant Team',
  publisher: 'Blind Assistant',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blindassistant.com',
    title: 'Blind Assistant - Luxury Assistive Technology',
    description: 'Premium assistive technology platform for visually impaired users',
    siteName: 'Blind Assistant',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blind Assistant - Luxury Assistive Technology',
    description: 'Premium assistive technology platform for visually impaired users',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#075985' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/audio/notification.mp3" as="audio" />
        <link rel="preload" href="/audio/success.mp3" as="audio" />
        <link rel="preload" href="/audio/error.mp3" as="audio" />
      </head>
      <body 
        className="font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen antialiased"
        suppressHydrationWarning={true}
      >
        <ClerkProvider 
          appearance={{
            variables: {
              colorPrimary: '#0ea5e9',
              colorBackground: '#ffffff',
              colorText: '#1e293b',
              colorInputBackground: '#f8fafc',
              colorInputText: '#1e293b',
            },
            elements: {
              card: 'bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-luxury rounded-3xl',
              headerTitle: 'text-slate-900 font-serif text-2xl font-bold',
              headerSubtitle: 'text-slate-600',
              socialButtonsBlockButton: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 transition-all duration-300 rounded-xl',
              formButtonPrimary: 'bg-gradient-to-r from-luxury-gold to-luxury-darkGold text-black font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-gold',
              formFieldInput: 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 rounded-xl py-3 px-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
              footerActionLink: 'text-primary-600 hover:text-primary-700 transition-colors duration-300 font-medium',
            },
          }}
        >
          <AccessibilityProvider>
            <VoiceProvider>
              <ToastProvider />
              
              {/* Main App Container */}
              <div className="relative min-h-screen">
                {/* Background Effects */}
                <div className="fixed inset-0 bg-gradient-to-br from-slate-900/5 via-blue-900/5 to-indigo-900/5 pointer-events-none" />
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/20 via-transparent to-transparent pointer-events-none" />
                
                {/* Content */}
                <main 
                  id="main-content"
                  className="relative z-10 focus:outline-none"
                  tabIndex={-1}
                >
                  {children}
                </main>
              </div>
            </VoiceProvider>
          </AccessibilityProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
