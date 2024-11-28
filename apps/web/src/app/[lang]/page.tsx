'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import NumberFlow from '@number-flow/react'
import { useMutation } from '@tanstack/react-query'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

// import { CTASection } from '@/components/sections/cta-section'
// import { OurMissionSection } from '@/components/sections/our-mission-section'
// import { PaperworkSection } from '@/components/sections/paperwork-section'
// import { PricingSection } from '@/components/sections/pricing-section'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLanguage } from '@/context/language'
import { preRegister } from '@/http/auth/pre-register'
import type { Dictionary } from '@/utils/dictionaries'

const preRegisterFormSchema = (dictionary: Dictionary) =>
  z.object({
    email: z
      .string()
      .min(1, dictionary.emailRequired)
      .email(dictionary.emailInvalid),
  })

type PreRegisterFormValues = z.infer<ReturnType<typeof preRegisterFormSchema>>

export default function Home() {
  const [days, setDays] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)

  useEffect(() => {
    const targetDate = new Date('2024-12-07T12:00:00-03:00') // 12h Brasília time

    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(timer)
        setDays(0)
        setHours(0)
        setMinutes(0)
        setSeconds(0)
        return
      }

      const newDays = Math.floor(difference / (1000 * 60 * 60 * 24))
      const newHours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const newMinutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60),
      )
      const newSeconds = Math.floor((difference % (1000 * 60)) / 1000)

      if (newDays !== days) setDays(newDays)
      if (newHours !== hours) setHours(newHours)
      if (newMinutes !== minutes) setMinutes(newMinutes)
      if (newSeconds !== seconds) setSeconds(newSeconds)
    }, 1000)

    return () => clearInterval(timer)
  }, [days, hours, minutes, seconds])

  const { dictionary } = useLanguage()

  const form = useForm<PreRegisterFormValues>({
    resolver: zodResolver(preRegisterFormSchema(dictionary)),
    defaultValues: {
      email: '',
    },
  })

  const { mutate: preRegisterMutation, isPending } = useMutation({
    mutationFn: async (data: PreRegisterFormValues) => {
      const { success, data: parsedData } =
        preRegisterFormSchema(dictionary).safeParse(data)

      if (!success) throw new Error('Invalid data')

      return await preRegister({ dictionary, ...parsedData })
    },
    onSuccess: () => {
      form.reset()
      toast.success(dictionary.preRegisterSuccess)
    },
    onError: () => toast.error(dictionary.preRegisterError),
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.currentTarget
    const { success, data } = preRegisterFormSchema(dictionary).safeParse(
      Object.fromEntries(new FormData(form)),
    )

    if (!success) return

    preRegisterMutation(data)
  }

  return (
    <motion.main
      className="mt-8 flex min-h-[calc(100vh-15rem)] flex-col items-center justify-center gap-8 font-cooperBlack"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex w-full max-w-7xl flex-col gap-8 px-4 lg:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-8">
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <NumberFlow
                value={days}
                className="text-4xl sm:text-6xl"
                continuous
              />
              <div className="text-base sm:text-xl">{dictionary.days}</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <NumberFlow
                value={hours}
                className="text-4xl sm:text-6xl"
                continuous
                digits={{ 1: { max: 9 }, 0: { max: 9 } }}
              />
              <div className="text-base sm:text-xl">{dictionary.hours}</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <NumberFlow
                value={minutes}
                className="text-4xl sm:text-6xl"
                continuous
                digits={{ 1: { max: 10 }, 0: { max: 10 } }}
              />
              <div className="text-base sm:text-xl">{dictionary.minutes}</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <NumberFlow
                value={seconds}
                className="text-4xl sm:text-6xl"
                continuous
                digits={{ 1: { max: 10 }, 0: { max: 10 } }}
              />
              <div className="text-base sm:text-xl">{dictionary.seconds}</div>
            </motion.div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full max-w-md flex-col gap-4 px-4 sm:px-0"
          >
            <Input
              type="email"
              {...form.register('email')}
              placeholder={dictionary.email}
            />
            <TooltipProvider>
              <Tooltip delayDuration={30}>
                <TooltipTrigger asChild>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      dictionary.preRegister
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="hidden max-w-md text-center font-poppins text-sm sm:text-base md:block"
                >
                  {dictionary.preRegisterCTA}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="block max-w-md text-center font-poppins text-sm sm:text-base md:hidden">
              {dictionary.mobilePreRegisterCTA}
            </span>
          </form>
        </div>

        <div className="hidden lg:block lg:flex-1">
          <Carousel
            className="w-full"
            opts={{ loop: true, dragFree: true }}
            plugins={[
              Autoplay({
                delay: 3400,
                stopOnFocusIn: true,
                stopOnInteraction: false,
              }),
            ]}
          >
            <CarouselContent>
              <CarouselItem className="flex aspect-square items-center justify-center rounded-lg bg-primary/5 p-4 sm:p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold sm:text-2xl">
                    Beta Access & Progress Updates
                  </h3>
                  <p className="mt-2 font-poppins text-sm sm:text-base">
                    Get early access to new features before anyone else and stay
                    updated on development progress through our exclusive beta
                    program.
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem className="flex aspect-square items-center justify-center rounded-lg bg-primary/5 p-4 sm:p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold sm:text-2xl">
                    Special Pioneer Discounts
                  </h3>
                  <p className="mt-2 font-poppins text-sm sm:text-base">
                    Enjoy 30% off in your first month and a lifetime 10%
                    discount afterwards.
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem className="flex aspect-square items-center justify-center rounded-lg bg-primary/5 p-4 sm:p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold sm:text-2xl">
                    Exclusive Pioneer Benefits
                  </h3>
                  <p className="mt-2 font-poppins text-sm sm:text-base">
                    Receive a unique Pioneer Badge, exclusive Discord role, and
                    easy access to our founding team.
                  </p>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </motion.main>
  )

  // return (
  //   <main className="mt-8 font-cooperBlack">
  //     <CTASection />

  //     <PaperworkSection />

  //     <OurMissionSection />

  //     <PricingSection />
  //   </main>
  // )
}
