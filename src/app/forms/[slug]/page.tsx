import { prisma } from '@lib/prisma';
import { notFound } from 'next/navigation';
import FormPage, { FormDataType, FormField } from './FormPage'; 

export default async function FormSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);

  const form = await prisma.form.findUnique({
    where: { slug },
  });

  if (!form || !form.published) {
    notFound();
  }

  const safeForm: FormDataType = {
    id: form.id,
    title: form.title,
    description: form.description,
    slug: form.slug,
    fields: form.fields as unknown as string | FormField[] | null, 
  };

  return <FormPage form={safeForm} />;
}
