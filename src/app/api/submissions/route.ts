import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { submissionCreateSchema } from '@zod/form';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { formId, data } = submissionCreateSchema.parse(json);

    const form = await prisma.form.findUnique({ where: { id: formId } });
    if (!form || !form.published) {
      return NextResponse.json({ error: 'Form is not available' }, { status: 400 });
    }

    const submission = await prisma.submission.create({
      data: { formId, data }
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
