// Middleware for API route protection (optional)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all requests in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Add any additional middleware logic here
  // Examples:
  // - Rate limiting
  // - Authentication checks
  // - CORS headers

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: '/api/:path*',
};

