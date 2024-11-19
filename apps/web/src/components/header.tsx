'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { Button } from './ui/button'

export default function Header() {
  return (
    <motion.header
      className="flex items-center justify-between font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link href="/" className="text-3xl font-semibold">
          migos
        </Link>
      </motion.div>

      <motion.div
        className="flex items-center gap-4 text-xl font-medium"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ul className="flex items-center gap-4">
          <li>
            <Link href="#about-us">about us</Link>
          </li>
          <li>
            <Link href="#about-us">plans</Link>
          </li>
        </ul>

        <span className="size-[6px] rounded-full bg-[#4E4F4C]" />

        <div className="flex items-center gap-2">
          <Link href="/sign-up">sign up</Link>
          <Button className="px-6 py-0.5 text-xl font-medium">sign in</Button>
        </div>
      </motion.div>
    </motion.header>
  )
}
