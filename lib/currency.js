// EU/Eurozone-ish country codes that should see EUR pricing. Not a legal
// definition of "Europe" — a practical list for currency + shipping display.
const EUR_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE', 'NO', 'CH', 'IS',
])

const UK_COUNTRIES = new Set(['GB', 'UK'])
const USD_COUNTRIES = new Set(['US'])

// Everywhere we currently ship — used to gate checkout, not browsing.
export const ALLOWED_SHIPPING_COUNTRIES = new Set([
  ...EUR_COUNTRIES,
  ...UK_COUNTRIES,
  ...USD_COUNTRIES,
])

export const CURRENCY_SYMBOLS = { GBP: '£', EUR: '€', USD: '$' }

export function currencyForCountry(countryCode) {
  const code = (countryCode || '').toUpperCase()
  if (UK_COUNTRIES.has(code)) return 'GBP'
  if (EUR_COUNTRIES.has(code)) return 'EUR'
  if (USD_COUNTRIES.has(code)) return 'USD'
  return 'GBP' // fallback for undetected/unsupported regions
}

export function isShippingAllowed(countryCode) {
  const code = (countryCode || '').toUpperCase()
  if (!code) return true // unknown (e.g. localhost) — don't block, checkout will validate address anyway
  return ALLOWED_SHIPPING_COUNTRIES.has(code)
}
