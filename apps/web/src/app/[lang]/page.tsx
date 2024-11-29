'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import NumberFlow from '@number-flow/react'
import { useMutation } from '@tanstack/react-query'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { type FormEvent, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { AnimatedLink } from '@/components/animated-link'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  const [showConfetti, setShowConfetti] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [showComingSoonDialog] = useState(true)

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
      setShowConfetti(true)
      setShowDialog(true)
      toast.success(dictionary.preRegisterSuccess)
      setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
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
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <Dialog
        open={showComingSoonDialog}
        onOpenChange={() => {
          toast.error(
            `We are not accepting new pre-registrations at this time.`,
          )
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Coming Soon!</DialogTitle>
            <DialogDescription className="mt-4">
              We're putting the finishing touches on our pre-registration
              system. Stay tuned at our{' '}
              <AnimatedLink href="https://twitter.com/trymigos" target="_blank">
                X/Twitter
              </AnimatedLink>{' '}
              and on{' '}
              <AnimatedLink
                href="https://www.producthunt.com/posts/migos"
                target="_blank"
              >
                Product Hunt
              </AnimatedLink>{' '}
              for updates!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="https://twitter.com/trymigos"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:scale-105"
              >
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </Link>
            <Link
              href="https://www.producthunt.com/posts/migos"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
            >
              <svg
                viewBox="0 0 960 960"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                className="transition-transform duration-300 group-hover:scale-105"
              >
                <path
                  d="M0 0 C1.38637281 0.00222245 2.7727457 0.00439896 4.15911865 0.00653076 C23.75008054 0.04827298 43.08870953 0.36286013 62.5 3.3125 C63.93665168 3.52416023 65.3733398 3.73557315 66.81005859 3.94677734 C141.97859967 15.12532494 214.51993492 41.66796847 276.5 86.3125 C277.27359863 86.86969727 278.04719727 87.42689453 278.84423828 88.00097656 C288.29204581 94.83444904 297.6147721 101.75614783 306.5 109.3125 C307.03399414 109.76302734 307.56798828 110.21355469 308.11816406 110.67773438 C309.89468487 112.17701785 311.66691777 113.68120908 313.4375 115.1875 C313.96255127 115.63303223 314.48760254 116.07856445 315.02856445 116.53759766 C324.7773145 124.89534428 334.08818327 133.71392104 343.16479492 142.79199219 C344.69237416 144.31736713 346.22783582 145.83450672 347.76367188 147.3515625 C353.38546076 152.9423406 358.61796365 158.66460046 363.54370117 164.89477539 C365.47717989 167.28429739 367.51100449 169.51988286 369.625 171.75 C376.89401041 179.74210569 383.13148229 188.60124736 389.5 197.3125 C390.04092285 198.04952148 390.5818457 198.78654297 391.13916016 199.54589844 C445.8256068 274.37266655 480.35854874 369.82670144 480.703125 463.0546875 C480.71018463 464.32886536 480.71724426 465.60304321 480.72451782 466.91583252 C480.74404696 471.00639419 480.74920984 475.09689608 480.75 479.1875 C480.75044186 480.23313236 480.75044186 480.23313236 480.75089264 481.29988861 C480.75229161 501.78288857 480.58468411 522.01249659 477.5 542.3125 C477.28833977 543.74915168 477.07692685 545.1858398 476.86572266 546.62255859 C465.70434281 621.6756576 439.23816643 694.50417451 394.5 756.3125 C393.94425293 757.08319824 393.38850586 757.85389648 392.81591797 758.64794922 C385.97939106 768.10113207 379.0388365 777.40540492 371.5 786.3125 C370.64261334 787.34323806 369.78587495 788.3745156 368.9296875 789.40625 C358.63513999 801.76379215 347.60008989 813.30435764 336.25 824.6875 C335.73039703 825.2097818 335.21079407 825.7320636 334.67544556 826.27017212 C328.79803165 832.17053879 322.85863366 837.92587528 316.5 843.3125 C315.53578125 844.158125 314.5715625 845.00375 313.578125 845.875 C303.92946281 854.19097405 293.77345829 861.78893591 283.5 869.3125 C282.7673291 869.85052246 282.0346582 870.38854492 281.27978516 870.94287109 C206.42186169 925.64874275 111.03803483 960.17085567 17.7578125 960.515625 C16.48363464 960.52268463 15.20945679 960.52974426 13.89666748 960.53701782 C9.80610581 960.55654696 5.71560392 960.56170984 1.625 960.5625 C0.57936764 960.56294186 0.57936764 960.56294186 -0.48738861 960.56339264 C-20.97038857 960.56479161 -41.19999659 960.39718411 -61.5 957.3125 C-62.93665168 957.10083977 -64.3733398 956.88942685 -65.81005859 956.67822266 C-105.98728768 950.70334192 -144.93156749 940.89516523 -182.5 925.3125 C-183.52464355 924.88888184 -184.54928711 924.46526367 -185.60498047 924.02880859 C-217.22574402 910.82742529 -247.71709611 894.42235039 -275.5 874.3125 C-276.27069824 873.75675293 -277.04139648 873.20100586 -277.83544922 872.62841797 C-287.28643341 865.79348113 -296.61213233 858.87109714 -305.5 851.3125 C-306.03399414 850.86197266 -306.56798828 850.41144531 -307.11816406 849.94726562 C-308.89468487 848.44798215 -310.66691777 846.94379092 -312.4375 845.4375 C-312.96255127 844.99196777 -313.48760254 844.54643555 -314.02856445 844.08740234 C-323.7773145 835.72965572 -333.08818327 826.91107896 -342.16479492 817.83300781 C-343.69237416 816.30763287 -345.22783582 814.79049328 -346.76367188 813.2734375 C-352.38546076 807.6826594 -357.61796365 801.96039954 -362.54370117 795.73022461 C-364.47717989 793.34070261 -366.51100449 791.10511714 -368.625 788.875 C-375.89401041 780.88289431 -382.13148229 772.02375264 -388.5 763.3125 C-389.04092285 762.57547852 -389.5818457 761.83845703 -390.13916016 761.07910156 C-444.8256068 686.25233345 -479.35854874 590.79829856 -479.703125 497.5703125 C-479.71018463 496.29613464 -479.71724426 495.02195679 -479.72451782 493.70916748 C-479.74404696 489.61860581 -479.74920984 485.52810392 -479.75 481.4375 C-479.75029457 480.74041176 -479.75058914 480.04332352 -479.75089264 479.32511139 C-479.75229161 458.84211143 -479.58468411 438.61250341 -476.5 418.3125 C-476.28833977 416.87584832 -476.07692685 415.4391602 -475.86572266 414.00244141 C-464.70434281 338.9493424 -438.23816643 266.12082549 -393.5 204.3125 C-392.94425293 203.54180176 -392.38850586 202.77110352 -391.81591797 201.97705078 C-384.98098113 192.52606659 -378.05859714 183.20036767 -370.5 174.3125 C-370.04947266 173.77850586 -369.59894531 173.24451172 -369.13476562 172.69433594 C-367.63548215 170.91781513 -366.13129092 169.14558223 -364.625 167.375 C-364.17946777 166.84994873 -363.73393555 166.32489746 -363.27490234 165.78393555 C-354.91715572 156.0351855 -346.09857896 146.72431673 -337.02050781 137.64770508 C-335.49513287 136.12012584 -333.97799328 134.58466418 -332.4609375 133.04882812 C-326.8701594 127.42703924 -321.14789954 122.19453635 -314.91772461 117.26879883 C-312.52820261 115.33532011 -310.29261714 113.30149551 -308.0625 111.1875 C-300.07039431 103.91848959 -291.21125264 97.68101771 -282.5 91.3125 C-281.76297852 90.77157715 -281.02595703 90.2306543 -280.26660156 89.67333984 C-263.81010139 77.64625994 -246.41926157 67.01144019 -228.5 57.3125 C-227.2924707 56.65048584 -227.2924707 56.65048584 -226.06054688 55.97509766 C-172.87574014 26.92264798 -113.70523473 8.96427502 -53.5 2.3125 C-52.73049011 2.22636444 -51.96098022 2.14022888 -51.16815186 2.05148315 C-34.11624473 0.19899342 -17.13972311 -0.04859384 0 0 Z "
                  fill="#FFFEFE"
                  transform="translate(479.5,-0.3125)"
                />
                <path
                  d="M0 0 C40.198125 -0.061875 80.39625 -0.12375 121.8125 -0.1875 C134.48245361 -0.21481201 147.15240723 -0.24212402 160.20629883 -0.27026367 C175.73571777 -0.28381348 175.73571777 -0.28381348 183.01689148 -0.28633118 C188.07776372 -0.28911432 193.13854056 -0.3003096 198.1993866 -0.31672668 C204.67385271 -0.33744818 211.14818197 -0.34344696 217.62267816 -0.33921683 C219.98690699 -0.34010015 222.35114108 -0.34596302 224.71534121 -0.35764539 C241.77402667 -0.43795809 258.17126522 0.72152684 274.6875 5.3125 C275.46456299 5.52414795 276.24162598 5.7357959 277.04223633 5.95385742 C321.73054525 18.47532936 357.89931293 48.34863899 380.61328125 88.51171875 C387.58946026 101.31780917 392.30664982 114.93511952 396 129 C396.33451172 130.20076172 396.33451172 130.20076172 396.67578125 131.42578125 C407.20623226 172.8241192 397.17145881 218.60314367 376.2890625 254.98046875 C352.72748042 293.3095213 315.65361129 320.36070873 272.125 331.50048828 C265.80913292 332.9851234 259.40702845 334.00080062 253 335 C252.0666577 335.17444358 251.13331539 335.34888716 250.17168999 335.52861691 C246.9110081 336.01322616 243.84128536 336.12299608 240.54592896 336.12025452 C239.26714371 336.12162918 237.98835846 336.12300385 236.67082214 336.12442017 C235.2663877 336.12088171 233.8619535 336.11724691 232.45751953 336.11352539 C230.96896873 336.11324312 229.48041779 336.11340203 227.99186707 336.1139679 C223.96134691 336.11425431 219.93085664 336.10838272 215.90034342 336.10139394 C211.68428608 336.09513451 207.46822802 336.09455455 203.25216675 336.09336853 C195.27314254 336.09026285 187.29413207 336.08205975 179.3151139 336.07201904 C168.52975086 336.05874203 157.74438405 336.05335183 146.95901489 336.04751682 C129.97266631 336.03811935 112.98634671 336.01819532 96 336 C96 383.52 96 431.04 96 480 C64.32 480 32.64 480 0 480 C0 321.6 0 163.2 0 0 Z "
                  fill="currentColor"
                  transform="translate(312,240)"
                />
                <path
                  d="M0 0 C34.9284375 -0.0928125 34.9284375 -0.0928125 70.5625 -0.1875 C81.55606812 -0.22846802 81.55606812 -0.22846802 92.77172852 -0.27026367 C101.78112793 -0.28381348 101.78112793 -0.28381348 106.01036072 -0.28633118 C108.9389388 -0.28910519 111.86735066 -0.30026292 114.79588318 -0.31672668 C118.54965232 -0.3375451 122.30318521 -0.34342969 126.05700672 -0.33921683 C128.06011604 -0.34050538 130.06320021 -0.35646943 132.06623936 -0.37328625 C152.96005028 -0.30259208 172.13281777 5.91346437 187.25 20.75 C201.34509982 35.13380542 207.88391158 52.59034293 208.25 72.5625 C207.82674122 94.34918896 199.31098838 111.60737226 183.62890625 126.71484375 C167.80106204 140.47307386 148.58074431 144.51193628 128.17016602 144.34057617 C126.73657983 144.33965398 125.30299228 144.34006305 123.8694067 144.34167194 C120.08073282 144.34234053 116.29235168 144.3251396 112.50374603 144.30384064 C108.92953212 144.28656898 105.35538418 144.28594126 101.78112793 144.28381348 C91.37488087 144.26816286 80.96868658 144.22627911 70.5625 144.1875 C47.276875 144.125625 23.99125 144.06375 0 144 C0 96.48 0 48.96 0 0 Z "
                  fill="#FFFEFE"
                  transform="translate(408,336)"
                />
              </svg>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Thank for Pre-registering!</DialogTitle>
            <DialogDescription className="pt-4">
              We appreciate your interest! You will be the first to know when
              Migos is ready to launch. Prepare yourself for an unforgettable
              Secret Santa experience!
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="w-full">
            <Button className="w-full" onClick={() => setShowDialog(false)}>
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
