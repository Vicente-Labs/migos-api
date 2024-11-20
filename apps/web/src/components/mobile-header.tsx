'use client'

import { motion } from 'framer-motion'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from './ui/button'

type MobileHeaderProps = {
  setIsOpen: (isOpen: boolean) => void
}

export function MobileHeader({ setIsOpen }: MobileHeaderProps) {
  return (
    <motion.header
      className="m-10 flex items-center justify-between p-4 font-poppins md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Link href="/" className="text-3xl font-semibold">
        migos
      </Link>

      <div className="flex items-center">
        <Button
          variant="ghost"
          className="text-xl font-medium"
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon />
          <span className="sr-only">menu</span>
        </Button>
      </div>
    </motion.header>
  )
}
