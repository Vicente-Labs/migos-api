'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    // eslint-disable-next-line prettier/prettier
    <main className="mt-8 font-cooperBlack">
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
            <h1 className="text-4xl md:text-5xl">
              Ho Ho Ho, <br />
              Santa is Back
            </h1>
            <span className="text-xl text-[#848780] md:text-2xl">
              Migos is ready to help your <br /> group of friends to do your{' '}
              <br /> Secret Santa!
            </span>
            <span className="text-xl text-[#848780] md:text-2xl">
              What &apos;bout you?
            </span>
          </div>

          <div className="w-1/2 lg:w-full">
            <Button className="md:text-x2 flex w-full flex-row items-center justify-center px-4 py-4 text-sm md:px-6 md:py-6">
              start my secret santa
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

      <motion.section
        id="paperwork"
        className="flex flex-col items-center gap-8 px-4 py-12 md:gap-16 lg:flex-row lg:gap-[380px] lg:px-20 lg:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
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
            <h1 className="text-4xl md:text-5xl">
              Put the <br />
              papework aside
            </h1>
            <span className="text-xl text-[#848780] md:text-2xl">
              Let us with the boring part <br />
              and make your <br />
              xmas better
            </span>
          </div>

          <div className="w-1/2 lg:w-full">
            <Button className="md:text-x2 flex w-full flex-row items-center justify-center px-4 py-4 text-sm md:px-6 md:py-6">
              let&apos;s do it
            </Button>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        id="about-us"
        className="flex flex-col items-center gap-8 px-4 py-12 md:gap-16 lg:flex-row lg:gap-[380px] lg:px-20 lg:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="flex w-full flex-col items-center gap-6 text-center md:gap-10 lg:w-auto lg:items-start lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl">Our mission</h1>
            <span className="text-xl text-[#848780] md:text-2xl">
              We were created to add <br />
              practicity to yours xmas with:
            </span>

            <ul className="flex flex-col gap-2">
              <li className="flex flex-row items-center gap-2 text-[#848780]">
                <span className="text-4xl">•</span>
                <span className="text-lg md:text-xl">
                  Effortless Gift Matching
                </span>
              </li>
              <li className="flex flex-row items-center gap-2 text-[#848780]">
                <span className="text-4xl">•</span>
                <span className="text-lg md:text-xl">
                  Organized Group Management
                </span>
              </li>
              <li className="flex flex-row items-center gap-2 text-[#848780]">
                <span className="text-4xl">•</span>
                <span className="text-lg md:text-xl">
                  Fun and Engaging Features
                </span>
              </li>
            </ul>
          </div>

          <div className="w-1/2 lg:w-full">
            <Button className="md:text-x2 flex w-full flex-row items-center justify-center px-4 py-4 text-sm md:px-6 md:py-6">
              simplify my xmas
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Image
            src="/bell.svg"
            alt="Bell"
            width={500}
            height={500}
            className="w-[280px] md:w-[400px] lg:w-[500px]"
          />
        </motion.div>
      </motion.section>

      <motion.section
        id="plans"
        className="flex flex-col items-center gap-8 px-4 py-12 md:flex-row md:px-8 lg:px-20 lg:py-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex w-full flex-col gap-12 rounded-lg bg-primary p-8 md:h-[520px] md:w-[476px] md:gap-20 md:p-14">
          <div>
            <div>
              <h1 className="text-4xl text-background md:text-5xl">Basic</h1>

              <span className="text-6xl text-background md:text-8xl">
                $0{' '}
                <span className="-ml-4 text-base md:-ml-6 md:text-lg">
                  / forever
                </span>
              </span>
            </div>

            <div className="flex flex-col text-background">
              <ul className="space-y-2">
                <li className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="size-4" /> up to 2 groups
                </li>

                <li className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="size-4" /> up to 5 members per group
                </li>

                <li className="flex flex-row items-center gap-2 text-[#B8BBB3] line-through">
                  <XCircle className="size-4" /> personalized announcements
                </li>

                <li className="flex flex-row items-center gap-2 text-[#B8BBB3] line-through">
                  <XCircle className="size-4" /> calendar sync
                </li>

                <li className="flex flex-row items-center gap-2 text-[#B8BBB3] line-through">
                  <XCircle className="size-4" /> gift suggestions
                </li>

                <li className="flex flex-row items-center gap-2 text-[#B8BBB3] line-through">
                  <XCircle className="size-4" /> reroll
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full">
            <Button className="w-full border border-primary bg-background text-lg font-normal text-primary md:text-xl">
              get started
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-12 rounded-lg bg-primary p-8 md:h-[520px] md:w-[476px] md:gap-20 md:p-14">
          <div>
            <div>
              <h1 className="text-4xl text-background md:text-5xl">Pro</h1>

              <span className="text-6xl text-background md:text-8xl">
                $6{' '}
                <span className="-ml-4 text-base md:-ml-6 md:text-lg">
                  / month
                </span>
              </span>
            </div>

            <div className="flex flex-col text-background">
              <ul className="space-y-2">
                <li className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  up to 7 groups
                </li>

                <li className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="size-4" /> unlimited members per
                  group
                </li>

                <li className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="size-4" /> personalized announcements
                </li>

                <li className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="size-4" /> calendar sync
                </li>

                <li className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="size-4" /> gift suggestions
                </li>

                <li className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="size-4" /> reroll
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full">
            <Button className="w-full border border-primary bg-background text-lg font-normal text-primary md:text-xl">
              get PRO
            </Button>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
