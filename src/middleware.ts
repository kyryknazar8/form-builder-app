import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtEdge, type JwtPayload } from './lib/auth';

const protectedRoutes = ['/admin'];
const authRoutes = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  const user: JwtPayload | null = token ? verifyJwtEdge(token) : null;

  console.log('MIDDLEWARE PATH:', pathname);
  console.log('TOKEN:', token ? token.slice(0, 40) + '...' : 'no token');
  console.log('USER PAYLOAD:', user);

  if (!user && protectedRoutes.some((r) => pathname.startsWith(r))) {
    console.log('[BLOCK] Unauthorized access to /admin → redirect to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (user && user.role !== 'ADMIN' && pathname.startsWith('/admin')) {
    console.log(`[BLOCK] ${user.email} (${user.role}) → redirect to /profile`);
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  if (user && authRoutes.includes(pathname)) {
    console.log(`[REDIRECT] ${user.email} already authorized → to home`);
    return NextResponse.redirect(new URL('/', req.url));
  }

  console.log('[PASS] Allowed:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register', '/profile', '/'],
};
