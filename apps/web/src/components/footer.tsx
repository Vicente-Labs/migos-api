'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Link from 'next/link'

import { AnimatedLink } from './animated-link'

export function Footer() {
  return (
    <motion.footer
      className="m-4 flex flex-col items-center justify-between gap-6 font-poppins md:m-10 md:flex-row md:gap-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col items-center gap-2 font-cooperBlack font-semibold md:items-start">
        <span>migos</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 text-center md:flex-row md:text-left">
        <Link href="mailto:support@migos.vicentesan.dev">support</Link>
        <span className="hidden md:inline">•</span>
        <span className="md:hidden">•</span>
        <span className="flex flex-row items-center justify-center gap-2 text-primary">
          with <Heart className="size-4 text-primary" /> by{' '}
          <AnimatedLink href="https://vicentesan.dev">
            Vicente Sanchez
          </AnimatedLink>
        </span>
      </div>
    </motion.footer>
  )
}
