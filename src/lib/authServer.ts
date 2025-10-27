import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwt, JwtPayload } from './auth';

export async function getUserFromCookies(): Promise<JwtPayload | null> {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function requireUserServer(): Promise<JwtPayload> {
  const user = await getUserFromCookies();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireAdminServer(): Promise<JwtPayload> {
  const user = await requireUserServer();
  if (user.role !== 'ADMIN') {
    redirect('/login');
  }
  return user;
}
