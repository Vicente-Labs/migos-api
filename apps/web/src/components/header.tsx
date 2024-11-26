'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

import { MobileHeader } from './mobile-header'
import { MobileHeaderDrawer } from './mobile-header-drawer'
import { Button } from './ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.header
        className="m-10 hidden items-center justify-between font-poppins md:flex"
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
              <Button
                variant="outline"
                className="transition-all duration-300 hover:bg-primary/10"
                onClick={() => {
                  document
                    .getElementById('about-us')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                about us
              </Button>
            </li>
            <li>
              <Button
                variant="outline"
                className="transition-all duration-300 hover:bg-primary/10"
                onClick={() => {
                  document
                    .getElementById('plans')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                plans
              </Button>
            </li>
          </ul>

          <span className="size-[6px] rounded-full bg-[#4E4F4C]" />

          <div className="flex items-center gap-4">
            <Link
              href="/sign-up"
              className="transition-all duration-300 hover:text-primary"
            >
              sign up
            </Link>
            <Button className="px-6 py-0.5 text-xl font-medium transition-all duration-300 hover:bg-primary/80">
              sign in
            </Button>
          </div>
        </motion.div>
      </motion.header>

      <MobileHeader setIsOpen={setIsOpen} />

      <MobileHeaderDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
