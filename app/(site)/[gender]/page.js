import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import GenderPageClient from '@/components/GenderPageClient'

const VALID_GENDERS = ['men', 'women', 'kids', 'babies']
const GENDER_LABEL = { men: "Men's", women: "Women's", kids: "Kids'", babies: "Babies'" }

export async function generateMetadata({ params }) {
  const label = GENDER_LABEL[params.gender]
  if (!label) return {}
  return { title: `${label} Jerseys — Vexer` }
}

export default async function GenderPage({ params, searchParams }) {
  const gender = params.gender
  if (!VALID_GENDERS.includes(gender)) notFound()

  const { data: products, error } = await supabase
    .from('products')
    .select('*, collections(id, title, type), product_variants(stock)')
    .eq('is_active', true)
    .eq('gender', gender)
    .order('created_at', { ascending: false })

  if (error) console.error('Failed to load products:', error.message)

  return (
    <GenderPageClient
      gender={gender}
      genderLabel={GENDER_LABEL[gender]}
      products={products || []}
      initialCategory={searchParams?.category || ''}
    />
  )
}
