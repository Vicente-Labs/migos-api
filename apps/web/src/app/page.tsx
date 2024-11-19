'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="font-cooperBlack mt-8">
      <motion.section
        id="home"
        className="inline-flex items-start justify-between gap-[420px] px-20 py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className="flex flex-col gap-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl">
              Ho Ho Ho, <br />
              Santa is Back
            </h1>
            <span className="text-2xl text-[#848780]">
              Migos is ready to help your <br /> group of friends to do your{' '}
              <br /> Secret Santa!
            </span>
            <span className="text-2xl text-[#848780]">
              What &apos;bout you?
            </span>
          </div>

          <Button className="flex w-full flex-row items-center justify-center px-6 py-6 text-xl font-normal">
            start my secret santa
          </Button>
        </motion.div>

        <motion.div
          className="origin-top-left rotate-[4.53deg]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Image src="/snow-man.svg" alt="Snow Man" width={500} height={500} />
        </motion.div>
      </motion.section>
    </main>
  )
}
