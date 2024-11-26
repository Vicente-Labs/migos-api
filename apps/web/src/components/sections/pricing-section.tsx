import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

export function PricingSection() {
  return (
    <motion.section
      id="plans"
      className="flex flex-col items-center gap-8 px-4 py-12 md:flex-row md:px-8 lg:flex-row lg:items-center lg:justify-center lg:px-20 lg:py-24"
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
          <Button
            onClick={() => {
              toast.error(`We're not launched yet.`)
            }}
            className="w-full border border-primary bg-background text-lg font-normal text-primary md:text-xl"
          >
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
                <CheckCircle2 className="size-4" /> unlimited members per group
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
          <Button
            onClick={() => {
              toast.error(`We're not launched yet.`)
            }}
            className="w-full cursor-pointer border border-primary bg-background text-lg font-normal text-primary md:text-xl"
          >
            get PRO
          </Button>
        </div>
      </div>
    </motion.section>
  )
}
