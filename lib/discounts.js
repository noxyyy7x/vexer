// Validates a discount code against the current time, usage limits, and
// order subtotal. Returns { valid, discountAmount, discount, error }.
// discountAmount is always in GBP, capped so it can never exceed the subtotal.
export async function validateDiscountCode(supabase, code, subtotalGBP) {
  if (!code) return { valid: false, error: 'No code provided.' }

  const { data: discount, error } = await supabase
    .from('discounts')
    .select('*')
    .ilike('code', code.trim())
    .maybeSingle()

  if (error || !discount) {
    return { valid: false, error: 'Invalid discount code.' }
  }
  if (!discount.is_active) {
    return { valid: false, error: 'This code is no longer active.' }
  }
  const now = Date.now()
  if (discount.starts_at && new Date(discount.starts_at).getTime() > now) {
    return { valid: false, error: 'This code isn\'t active yet.' }
  }
  if (discount.expires_at && new Date(discount.expires_at).getTime() < now) {
    return { valid: false, error: 'This code has expired.' }
  }
  if (discount.usage_limit !== null && discount.usage_count >= discount.usage_limit) {
    return { valid: false, error: 'This code has reached its usage limit.' }
  }
  if (discount.min_order_value && subtotalGBP < discount.min_order_value) {
    return { valid: false, error: `This code requires a minimum order of £${Number(discount.min_order_value).toFixed(2)}.` }
  }

  const rawAmount = discount.type === 'percentage'
    ? subtotalGBP * (Number(discount.value) / 100)
    : Number(discount.value)

  const discountAmount = Math.min(rawAmount, subtotalGBP)

  return { valid: true, discountAmount, discount }
}
