import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isDashboardRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/home') || 
    request.nextUrl.pathname.startsWith('/events') ||
    request.nextUrl.pathname.startsWith('/orders') ||
    request.nextUrl.pathname.startsWith('/finance') ||
    request.nextUrl.pathname.startsWith('/settings');

  // If trying to access auth page while already logged in
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // If trying to access protected routes without auth
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/dashboard/:path*',
    '/home/:path*',
    '/events/:path*',
    '/orders/:path*',
    '/finance/:path*',
    '/settings/:path*',
  ],
}; 