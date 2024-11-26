import './globals.css'

import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import localFont from 'next/font/local'

import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import type { Language } from '@/types/languages'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const cooperBlack = localFont({
  src: './fonts/coopbl.ttf',
  variable: '--font-cooper-black',
})

export const metadata: Metadata = {
  title: 'Migos',
  description: 'Migos - The best way to manage your Secret Santa',
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const resolvedParams = await params
  const lang = resolvedParams.lang as Language

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn(poppins.variable, inter.variable, cooperBlack.variable)}
    >
      <head>
        <meta name="theme-color" content="#f8ffed" />
      </head>
      <body className="overflow-x-hidden antialiased">
        <Toaster
          richColors
          closeButton
          position="bottom-right"
          expand={false}
          theme="light"
        />
        {children}
      </body>
    </html>
  )
}
