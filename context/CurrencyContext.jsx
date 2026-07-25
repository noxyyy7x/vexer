'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { CURRENCY_SYMBOLS } from '@/lib/currency'

const CurrencyContext = createContext(null)

function readCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export function CurrencyProvider({ children }) {
  // Defaults to GBP until the cookie/rates load — never blocks rendering.
  const [currency, setCurrency] = useState('GBP')
  const [country, setCountry] = useState('')
  const [shippingAllowed, setShippingAllowed] = useState(true)
  const [rates, setRates] = useState({ GBP: 1, EUR: null, USD: null })

  useEffect(() => {
    const cookieCurrency = readCookie('vx_currency')
    const cookieCountry = readCookie('vx_country')
    const cookieShipping = readCookie('vx_shipping_allowed')
    if (cookieCurrency) setCurrency(cookieCurrency)
    if (cookieCountry) setCountry(cookieCountry)
    if (cookieShipping) setShippingAllowed(cookieShipping === 'true')

    fetch('/api/exchange-rates')
      .then(res => res.json())
      .then(data => setRates(data.rates))
      .catch(() => {}) // stays on GBP-only rates, display just won't convert
  }, [])

  // Converts a GBP amount to the visitor's currency for display only.
  // Actual charges always happen in GBP — see checkout for that logic.
  function convert(gbpAmount) {
    const rate = rates[currency]
    if (!rate || currency === 'GBP') return { amount: gbpAmount, currency: 'GBP', symbol: '£' }
    return { amount: gbpAmount * rate, currency, symbol: CURRENCY_SYMBOLS[currency] || currency }
  }

  function formatPrice(gbpAmount) {
    const { amount, symbol } = convert(gbpAmount)
    return `${symbol}${amount.toFixed(2)}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, country, shippingAllowed, rates, convert, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider')
  return ctx
}
