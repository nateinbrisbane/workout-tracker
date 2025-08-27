import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                       req.nextUrl.pathname.startsWith('/register')
    
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      return null
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // We handle auth in the middleware function
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - api/user/status (status check endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login page
     * - register page
     * - pending-approval page
     * - unauthorized page
     */
    '/((?!api/auth|api/user/status|_next/static|_next/image|favicon.ico|login|register|pending-approval|unauthorized).*)',
  ],
}