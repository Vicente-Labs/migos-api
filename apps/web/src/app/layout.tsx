import './globals.css'

import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import localFont from 'next/font/local'

import Header from '@/components/header'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${cooperBlack.variable} m-10 antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  )
}
