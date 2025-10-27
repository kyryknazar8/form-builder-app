import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { comparePassword, signJwt } from '../../../../lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { email, password } = loginSchema.parse(json);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signJwt({
      sub: user.id,
      email: user.email,
      role: user.role as 'ADMIN' | 'USER'
    });

    const res = NextResponse.json({ ok: true });
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

    if (e instanceof Error) {
      console.error('Login error:', e.message);
    } else {
      console.error('Login error: Unknown type');
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
