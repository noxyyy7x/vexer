import HeroCarousel from '@/components/HeroCarousel'
import GenderStrip from '@/components/GenderStrip'
import FeaturedCollections from '@/components/FeaturedCollections'
import FeaturedProducts from '@/components/FeaturedProducts'
import { HowItWorks, TrustBadges, DiscordCTA } from '@/components/StaticSections'

// Product/collection data now comes from the admin panel and can change at
// any time — this page must never be statically cached, or new products
// won't appear until the next deploy.
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <TrustBadges />
      <GenderStrip />
      <FeaturedCollections />
      <FeaturedProducts />
      <HowItWorks />
      <DiscordCTA />
    </main>
  )
}
