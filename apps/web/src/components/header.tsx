'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// import { useState } from 'react'
import { MobileHeader } from './mobile-header'
// import { MobileHeaderDrawer } from './mobile-header-drawer'

export default function Header() {
  // const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.header
        className="text-smooth m-10 hidden items-center justify-center font-poppins md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/" className="font-cooperBlack text-3xl font-semibold">
            migos
          </Link>
        </motion.div>
      </motion.header>

      <MobileHeader />

      {/* <MobileHeaderDrawer isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </>
  )
}
