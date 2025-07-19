// import { ClerkProvider } from '@clerk/nextjs'
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#075985' },
  ],
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
        {/* <ClerkProvider 
          appearance={{
            baseTheme: 'dark',
            variables: {
              colorPrimary: '#0ea5e9',
              colorBackground: '#0f172a',
              colorText: '#f1f5f9',
            },
            elements: {
              card: 'bg-slate-900/95 backdrop-blur-sm border-slate-700/50 shadow-luxury',
              headerTitle: 'text-white font-serif text-2xl',
              headerSubtitle: 'text-slate-300',
              socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300',
              formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105',
              formFieldInput: 'bg-white/5 border-white/10 text-white placeholder-slate-400 rounded-xl py-3 px-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
              footerActionLink: 'text-primary-400 hover:text-primary-300 transition-colors duration-300',
            },
          }}
        > */}
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
        {/* </ClerkProvider> */}
      </body>
    </html>
  )
}
