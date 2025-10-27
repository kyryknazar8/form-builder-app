import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { getUserFromCookies } from '@lib/authServer';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const form = await prisma.form.findFirst({
    where: {
      OR: [{ id }, { slug: decodeURIComponent(id) }],
    },
  });

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 });
  }

  const user = await getUserFromCookies();
  const formData = await req.formData();
  const values: Record<string, string> = {};

  formData.forEach((value, key) => {
    if (key !== 'anonymous') values[key] = value.toString();
  });

  const anonymous = formData.get('anonymous') === 'on';

  const userId = !anonymous && user?.sub ? user.sub : null;

  await prisma.submission.create({
    data: {
      formId: form.id,
      data: values,
      anonymous,
      userId,
    },
  });

  return NextResponse.redirect(new URL(`/forms/${form.slug}?submitted=1`, req.url));
}
