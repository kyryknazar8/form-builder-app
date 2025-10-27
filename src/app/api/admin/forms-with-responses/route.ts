import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { requireAdminServer } from '@lib/authServer';

export async function GET() {
  await requireAdminServer();

  const forms = await prisma.form.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      submissions: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true } }, 
        },
      },
    },
  });

  const parsed = forms.map((f) => ({
    ...f,
    submissions: f.submissions.map((s) => ({
      ...s,
      data: typeof s.data === 'string' ? JSON.parse(s.data) : s.data,
    })),
  }));

  return NextResponse.json(parsed);
}
