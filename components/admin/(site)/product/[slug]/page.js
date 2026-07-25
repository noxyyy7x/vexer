import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProductPageClient from '@/components/ProductPageClient'

export async function generateMetadata({ params }) {
  const { data: product } = await supabase
    .from('products')
    .select('title, description')
    .eq('slug', params.slug)
    .maybeSingle()
  if (!product) return {}
  return { title: `${product.title} — Vexer`, description: product.description }
}

export default async function ProductPage({ params }) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*, collections(id, title, type), product_variants(id, size, stock)')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) console.error('Failed to load product:', error.message)
  if (!product) notFound()

  return <ProductPageClient product={product} />
}
