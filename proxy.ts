import { clerkMiddleware } from '@clerk/nextjs/server'

// Make these routes public so Clerk's middleware doesn't block webhooks
// or the auth pages. `publicRoutes` uses path patterns, so include
// `(.*)` where you want to cover sub-paths.
export default clerkMiddleware({
  publicRoutes: [
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
  ],
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}