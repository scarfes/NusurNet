import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/routing';

// Middleware: redirects "/" to "/it" (default locale), validates locale segments,
// and enables locale-aware navigation.
export default createMiddleware(routing);

export const config = {
  // Match all pathnames EXCEPT:
  //   - /api routes
  //   - /_next (Next.js internals)
  //   - /_vercel (Vercel internals)
  //   - static files (anything with a dot in the path)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
