'use client'

import { CTASection } from '@/components/sections/cta-section'
import { OurMissionSection } from '@/components/sections/our-mission-section'
import { PaperworkSection } from '@/components/sections/paperwork-section'
import { PricingSection } from '@/components/sections/pricing-section'

export default function Home() {
  return (
    // eslint-disable-next-line prettier/prettier
    <main className="mt-8 font-cooperBlack">
      <CTASection />

      <PaperworkSection />

      <OurMissionSection />

      <PricingSection />
    </main>
  )
}
