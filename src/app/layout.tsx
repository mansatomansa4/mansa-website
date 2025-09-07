import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Mansa-to-Mansa | Building the Future Together',
    template: '%s | Mansa-to-Mansa'
  },
  description: 'Uniting African students, students of African origin, and professionals to learn, network, and work on projects that open doors and create opportunities for all.',
  keywords: ['African professionals', 'global community', 'networking', 'mentorship', 'knowledge sharing', 'impact projects', 'professional development', 'students', 'career growth'],
  authors: [{ name: 'Mansa-to-Mansa Team' }],
  creator: 'Mansa-to-Mansa',
  publisher: 'Mansa-to-Mansa',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mansa-to-mansa.com',
    title: 'Mansa-to-Mansa | Building the Future Together',
    description: 'Uniting African students, students of African origin, and professionals to learn, network, and work on projects that open doors and create opportunities for all.',
    siteName: 'Mansa-to-Mansa',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mansa-to-Mansa - Building the Future Together',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mansa-to-Mansa | Building the Future Together',
    description: 'Uniting African students, students of African origin, and professionals to learn, network, and work on projects that open doors and create opportunities for all.',
    images: ['/og-image.png'],
    creator: '@mansatomansa',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div id="__next">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}