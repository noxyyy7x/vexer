// Server-side only — uses the secret key, never import this in a client component.
const REVOLUT_API_BASE = 'https://merchant.revolut.com/api'
const API_VERSION = '2026-04-20'

export async function createRevolutOrder({ amount, currency, description, customer, lineItems, shipping, reference }) {
  const res = await fetch(`${REVOLUT_API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
      'Revolut-Api-Version': API_VERSION,
    },
    body: JSON.stringify({
      amount, // minor units — e.g. 4999 = £49.99
      currency,
      description,
      customer,
      line_items: lineItems,
      shipping,
      capture_mode: 'automatic',
      merchant_order_data: { reference },
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || `Revolut order creation failed (${res.status})`)
  }
  // data.id = permanent order id (used to match webhook events)
  // data.token = temporary public token (used by the embedded checkout widget)
  return data
}
