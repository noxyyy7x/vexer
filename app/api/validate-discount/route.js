import { createClient } from '@supabase/supabase-js'
import { validateDiscountCode } from '@/lib/discounts'

// Service role client — discounts table has no public read policy (don't
// want anon able to enumerate active codes), so this route is the only way
// to check a code, and only ever returns whether it's valid + the resulting
// amount, never the full discount row.
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json()
    if (!code || typeof subtotal !== 'number') {
      return Response.json({ valid: false, error: 'Missing code or subtotal.' }, { status: 400 })
    }

    const result = await validateDiscountCode(supabase, code, subtotal)
    if (!result.valid) {
      return Response.json({ valid: false, error: result.error })
    }

    return Response.json({
      valid: true,
      discountAmount: result.discountAmount,
      type: result.discount.type,
      value: result.discount.value,
    })
  } catch (err) {
    console.error('validate-discount error:', err.message)
    return Response.json({ valid: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
