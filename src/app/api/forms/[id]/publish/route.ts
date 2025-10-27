import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { getUserFromCookies } from '@lib/authServer';
import { z } from 'zod';

const publishSchema = z.object({
  published: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  const { id } = await context.params; 
  const user = await getUserFromCookies();

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const { published } = publishSchema.parse(json);

    const form = await prisma.form.update({
      where: { id },
      data: { published },
    });

    return NextResponse.json({ form });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    console.error('Error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
