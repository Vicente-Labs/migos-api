'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import * as NProgress from 'nprogress'
import { ReactNode, useEffect, useState } from 'react'

type AppWrapperProps = {
  children: ReactNode
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    NProgress.done()
  }, [pathname, router])

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#ccc" showSpinner={false} />
      {children}
    </QueryClientProvider>
  )
}
