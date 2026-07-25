import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Next.js patches the global fetch() to auto-cache requests, and that
// caching can persist across deployments on Vercel. Product/collection data
// changes constantly via the admin panel, so every Supabase request must
// explicitly opt out of that cache — relying on the page-level
// `export const dynamic = 'force-dynamic'` alone isn't reliable here, since
// it's not guaranteed to reach every fetch a library makes internally.
export const supabase = createClient(url, anonKey, {
  global: {
    fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
  },
})
