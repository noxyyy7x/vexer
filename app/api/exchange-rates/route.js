// Live GBP -> EUR/USD rates, sourced from the European Central Bank via
// Frankfurter (frankfurter.dev) — free, no API key, no rate limit issues.
// Cached for an hour so we're not hitting it on every single page view.
export async function GET() {
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=GBP&symbols=EUR,USD', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`Rate fetch failed: ${res.status}`)
    const data = await res.json()

    return Response.json({
      base: 'GBP',
      rates: { GBP: 1, EUR: data.rates?.EUR, USD: data.rates?.USD },
      updatedAt: data.date,
    })
  } catch (err) {
    console.error('Exchange rate fetch failed:', err.message)
    // Fall back to GBP-only so the site never breaks over a rates API hiccup —
    // prices just stay in GBP for everyone until the next successful fetch.
    return Response.json({ base: 'GBP', rates: { GBP: 1, EUR: null, USD: null }, updatedAt: null })
  }
}
