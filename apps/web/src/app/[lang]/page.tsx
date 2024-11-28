'use client'

import NumberFlow from '@number-flow/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/context/language'

export default function Home() {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

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

  return (
    <motion.main
      className="mt-8 flex min-h-[calc(100vh-15rem)] flex-col items-center justify-center gap-8 font-cooperBlack"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex justify-center space-x-8">
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <NumberFlow value={days} className="text-6xl" continuous />
          <div className="text-xl">{dictionary.days}</div>
        </motion.div>
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <NumberFlow
            value={hours}
            className="text-6xl"
            continuous
            digits={{ 1: { max: 9 }, 0: { max: 9 } }}
          />
          <div className="text-xl">{dictionary.hours}</div>
        </motion.div>
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <NumberFlow
            value={minutes}
            className="text-6xl"
            continuous
            digits={{ 1: { max: 10 }, 0: { max: 10 } }}
          />
          <div className="text-xl">{dictionary.minutes}</div>
        </motion.div>
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <NumberFlow
            value={seconds}
            className="text-6xl"
            continuous
            digits={{ 1: { max: 10 }, 0: { max: 10 } }}
          />
          <div className="text-xl">{dictionary.seconds}</div>
        </motion.div>
      </div>

      <form className="flex w-full max-w-md flex-col gap-4">
        <Input type="email" placeholder={dictionary.email} />
        <Button type="submit">{dictionary.preRegister}</Button>
      </form>
    </motion.main>
  )
}
