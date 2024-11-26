'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { toast } from 'sonner'

import { useLanguage } from '@/context/language'

import { Button } from '../ui/button'

export function PaperworkSection() {
  const { dictionary } = useLanguage()

  return (
    <motion.section
      id="paperwork"
      className="flex flex-col items-center justify-center gap-8 px-4 py-12 md:gap-16 lg:flex-row lg:gap-[420px] lg:px-20 lg:py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        viewport={{ once: true }}
        className="order-2 lg:order-1"
      >
        <Image
          src="/gifts.svg"
          alt="Gifts"
          width={500}
          height={500}
          className="w-[280px] md:w-[400px] lg:w-[500px]"
        />
      </motion.div>

      <motion.div
        className="order-1 flex w-full flex-col items-center gap-6 text-center md:gap-10 lg:order-2 lg:w-auto lg:items-start lg:text-left"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="max-w-sm break-words text-4xl md:text-5xl">
            {dictionary.putThePaperworkAside}
          </h1>
          <span className="max-w-md break-words text-xl text-[#848780] md:text-2xl">
            {dictionary.letUsWithTheBoringPart}
          </span>
        </div>

        <div className="w-1/2 lg:w-full">
          <Button
            onClick={() => {
              toast.error(`We're not launched yet.`)
            }}
            className="md:text-x2 flex w-full flex-row items-center justify-center px-4 py-4 text-sm md:px-6 md:py-6"
          >
            {dictionary.letsDoIt}
          </Button>
        </div>
      </motion.div>
    </motion.section>
  )
}
