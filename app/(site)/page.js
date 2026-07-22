import HeroCarousel from '@/components/HeroCarousel'
import GenderStrip from '@/components/GenderStrip'
import FeaturedProducts from '@/components/FeaturedProducts'
import { HowItWorks, TrustBadges, DiscordCTA } from '@/components/StaticSections'

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <TrustBadges />
      <GenderStrip />
      <FeaturedProducts />
      <HowItWorks />
      <DiscordCTA />
    </main>
  )
}
