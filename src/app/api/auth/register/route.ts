import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { hashPassword, signJwt } from '../../../../lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { email, password } = registerSchema.parse(json);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const userCount = await prisma.user.count();
    const role: 'ADMIN' | 'USER' = userCount === 0 ? 'ADMIN' : 'USER';

    const user = await prisma.user.create({
      data: { email, passwordHash, role }
    });

    const token = signJwt({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    const res = NextResponse.json({
      ok: true,
      user: { email: user.email, role: user.role }
    });

    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 
    });

    return res;
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    console.error('Registration error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
