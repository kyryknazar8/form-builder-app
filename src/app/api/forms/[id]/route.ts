import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdminServer } from '../../../../lib/authServer';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdminServer();
  const { id } = await context.params;

  try {
    const form = await prisma.form.findUnique({ where: { id } });
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    await prisma.submission.deleteMany({ where: { formId: id } });

    await prisma.form.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Form deletion error:', err);
    return NextResponse.json({ error: 'Error deleting form' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdminServer();
  const { id } = await context.params;

  const form = await prisma.form.findUnique({ where: { id } });
  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 });
  }

  return NextResponse.json(form);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdminServer();
  const { id } = await context.params;

  const body = await req.json();

  try {
    const updated = await prisma.form.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        published: body.published,
        fields: body.fields,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Form update error:', err);
    return NextResponse.json({ error: 'Error updating form' }, { status: 500 });
  }
}
