import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    console.log('/api/auth/me: token received:', token ? token.slice(0, 30) + '...' : 'немає токена');

    if (!token) {
      console.log('No token — user not authorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJwt(token);
    console.log('JWT payload:', payload);

    if (!payload) {
      console.log('Invalid or expired token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      console.log('User with ID', payload.sub, 'not found in the database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Authorized user:', user.email, 'role:', user.role);

    return NextResponse.json(user);
  } catch (err) {
    console.error('/api/auth/me:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
