'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { toast } from 'sonner'

import { useLanguage } from '@/context/language'

import { Button } from '../ui/button'

export function CTASection() {
  const { dictionary } = useLanguage()

  return (
    <motion.section
      id="home"
      className="flex flex-col items-center justify-center gap-8 px-4 py-12 md:gap-16 lg:flex-row lg:gap-[420px] lg:px-20 lg:py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="flex w-full flex-col items-center gap-6 text-center md:gap-10 lg:w-auto lg:items-start lg:text-left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="max-w-sm break-words text-4xl md:text-5xl">
            {dictionary.hohoho}, <br />
            {dictionary.santaIsBack}
          </h1>
          <span className="max-w-lg break-words text-xl text-[#848780] md:text-2xl">
            {dictionary.migosIsReadyToHelp}
          </span>
          <span className="max-w-lg break-words text-xl text-[#848780] md:text-2xl">
            {dictionary.whatAboutYou}
          </span>
        </div>

        <div className="w-1/2 lg:w-full">
          <Button
            onClick={() => {
              toast.error(`We're not launched yet.`)
            }}
            className="flex w-full flex-row items-center justify-center px-4 py-4 text-sm md:px-6 md:py-6 md:text-xl"
          >
            {dictionary.startMySecretSanta}
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="origin-top-left rotate-[4.53deg]"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Image
          src="/snow-man.svg"
          alt="Snow Man"
          width={500}
          height={500}
          className="w-[280px] md:w-[400px] lg:w-[500px]"
        />
      </motion.div>
    </motion.section>
  )
}
