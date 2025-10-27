import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAdminServer } from '../../../lib/authServer';

export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true, 
        published: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error loading forms:', error);
    return NextResponse.json({ error: 'Error loading forms' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminServer();

    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const newForm = await prisma.form.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || '',
        published: body.published ?? false,
        fields: body.fields ? JSON.stringify(body.fields) : '[]',
      },
    });

    return NextResponse.json(newForm);
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Error creating form' }, { status: 500 });
  }
}
