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

// Full names for the dropdown — code is what actually gets sent to Revolut
// and stored (they require a strict 2-letter ISO code), name is what the
// customer sees and picks from.
export const SHIPPING_COUNTRY_OPTIONS = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czechia' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NO', name: 'Norway' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
].sort((a, b) => a.name.localeCompare(b.name))

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
