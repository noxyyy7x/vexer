import { NextResponse } from 'next/server'

// Routes admin.vexer.org traffic to the /admin section internally, so
// visitors see clean URLs like admin.vexer.org/orders instead of
// admin.vexer.org/admin/orders. The main domain (vexer.org) is completely
// unaffected and continues serving the normal storefront.
export function middleware(request) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('admin-')

  if (isAdminSubdomain && !url.pathname.startsWith('/admin')) {
    url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
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
