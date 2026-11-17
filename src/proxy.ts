import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/** Bảo vệ /loans và /admin — không gọi auth() ở layout gốc để giữ SSG. */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (pathname.startsWith('/loans') || pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const login = new URL('/login', req.nextUrl.origin);
      login.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(login);
    }
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/forbidden', req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/loans/:path*', '/admin/:path*'],
};
