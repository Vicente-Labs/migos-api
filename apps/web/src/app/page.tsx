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
        className="inline-flex items-start justify-between gap-[420px] px-20 py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="flex flex-col gap-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
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
          viewport={{ once: true }}
        >
          <Image src="/snow-man.svg" alt="Snow Man" width={500} height={500} />
        </motion.div>
      </motion.section>

      <motion.section
        id="paperwork"
        className="inline-flex items-start justify-between gap-[380px] px-20 py-24"
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
        >
          <Image src="/gifts.svg" alt="Gifts" width={500} height={500} />
        </motion.div>

        <motion.div
          className="flex flex-col gap-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl">
              Put the <br />
              papework aside
            </h1>
            <span className="text-2xl text-[#848780]">
              Let us with the boring part <br />
              and make your <br />
              xmas better
            </span>
          </div>

          <Button className="flex w-full flex-row items-center justify-center px-6 py-6 text-xl font-normal">
            let&apos;s do it
          </Button>
        </motion.div>
      </motion.section>

      <motion.section
        id="about-us"
        className="inline-flex items-start justify-between gap-[380px] px-20 py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="flex flex-col gap-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl">Our mission</h1>
            <span className="text-2xl text-[#848780]">
              We were created to add <br />
              practicity to yours xmas with:
            </span>

            <ul className="flex flex-col gap-2">
              <li className="flex flex-row items-center gap-2 text-[#848780]">
                <span className="text-4xl">•</span>
                <span className="text-xl">Effortless Gift Matching</span>
              </li>
              <li className="flex flex-row items-center gap-2 text-[#848780]">
                <span className="text-4xl">•</span>
                <span className="text-xl">Organized Group Management</span>
              </li>
              <li className="flex flex-row items-center gap-2 text-[#848780]">
                <span className="text-4xl">•</span>
                <span className="text-xl">Fun and Engaging Features</span>
              </li>
            </ul>
          </div>

          <Button className="flex w-full flex-row items-center justify-center px-6 py-6 text-xl font-normal">
            simplify my xmas
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Image src="/bell.svg" alt="Bell" width={500} height={500} />
        </motion.div>
      </motion.section>

      <motion.section
        id="plans"
        className="flex items-center justify-center gap-8 px-20 py-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex h-[520px] w-[476px] flex-col gap-24 rounded-lg bg-primary p-14">
          <div>
            <div>
              <h1 className="text-5xl text-background">Basic</h1>

              <span className="text-8xl text-background">
                $0 <span className="-ml-6 text-lg">/ forever</span>
              </span>
            </div>

            <div className="flex flex-col text-background">
              <ul>
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

          <Button className="w-full border border-primary bg-background text-xl font-normal text-primary">
            get started
          </Button>
        </div>

        <div className="flex h-[520px] w-[476px] flex-col gap-24 rounded-lg bg-primary p-14">
          <div>
            <div>
              <h1 className="text-5xl text-background">Pro</h1>

              <span className="text-8xl text-background">
                $6 <span className="-ml-6 text-lg">/ month</span>
              </span>
            </div>

            <div className="flex flex-col text-background">
              <ul>
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

          <Button className="w-full border border-primary bg-background text-xl font-normal text-primary">
            get PRO
          </Button>
        </div>
      </motion.section>
    </main>
  )
}
