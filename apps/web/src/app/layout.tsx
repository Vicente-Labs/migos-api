import './globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TurboRepo Template',
  description: 'NextJs RC + Fastify',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
