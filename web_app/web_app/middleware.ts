import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    '/',
    '/api/health',
    '/api/voice/process', 
    '/api/detect', 
    '/api/geocode', 
    '/api/route'
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [],
})

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!.+\\.[\\w]+$|_next).*)', 
    '/',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}
