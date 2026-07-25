import { supabase } from '@/lib/supabase'
import ReviewsPageClient from '@/components/ReviewsPageClient'

export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) console.error('Failed to load reviews:', error.message)

  return <ReviewsPageClient initialReviews={reviews || []} />
}
