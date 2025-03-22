import { auth } from '@/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/submit-startup')
  
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(new URL('/auth/signin', req.url))
  }
})

export const config = {
  matcher: ['/submit-startup']
} 