import { NextResponse } from 'next/server'
import { currencyForCountry, isShippingAllowed } from '@/lib/currency'

// Routes admin.vexer.org traffic to the /admin section internally, so
// visitors see clean URLs like admin.vexer.org/orders instead of
// admin.vexer.org/admin/orders. The main domain (vexer.org) is completely
// unaffected and continues serving the normal storefront.
export function middleware(request) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('admin-')

  let response
  if (isAdminSubdomain && !url.pathname.startsWith('/admin')) {
    url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`
    response = NextResponse.rewrite(url)
  } else {
    response = NextResponse.next()
  }

  // Vercel injects this header in production based on the visitor's IP —
  // it's empty on localhost/other hosts, which the currency context treats
  // as "unknown" and falls back to GBP without blocking anything.
  const country = request.headers.get('x-vercel-ip-country') || ''
  if (country) {
    response.cookies.set('vx_country', country, { path: '/', maxAge: 60 * 60 * 24 })
    response.cookies.set('vx_currency', currencyForCountry(country), { path: '/', maxAge: 60 * 60 * 24 })
    response.cookies.set('vx_shipping_allowed', String(isShippingAllowed(country)), { path: '/', maxAge: 60 * 60 * 24 })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next static/image
     * - files with an extension (images, favicon, etc.)
     */
    '/((?!api|_next/static|_next/image|.*\\..*).*)',
  ],
}
