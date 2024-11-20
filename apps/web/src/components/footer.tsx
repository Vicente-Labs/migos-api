'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Link from 'next/link'

import { AnimatedLink } from './animated-link'

export function Footer() {
  return (
    <motion.footer
      className="flex items-center justify-between gap-4 font-poppins"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col items-start gap-2 font-semibold">
        <span>migos</span>
        <span>CNPJ: 99.999.999/9999-99</span>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Link href="mailto:support@migos.vicentesan.dev">support</Link>
        <span>•</span>
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
