import { redirect } from 'next/navigation';
import { getUserFromCookies } from '../lib/authServer';
import Link from 'next/link';
import { prisma } from '../lib/prisma';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default async function HomePage() {
  const user = await getUserFromCookies();
  
  if (!user) {
    redirect('/login');
  }

  const forms: Array<{ id: string; title: string; description: string | null; slug: string }> = await prisma.form.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, description: true, slug: true }
  });

  return (
    <>
      <Typography variant="h4" gutterBottom>Published forms</Typography>
      <Stack spacing={2}>
        {forms.map((f) => (
          <Card key={f.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">{f.title}</Typography>
              {f.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {f.description}
                </Typography>
              )}
              <Button component={Link} href={`/forms/${f.slug}`} variant="contained">
                Open form
              </Button>
            </CardContent>
          </Card>
        ))}
        {forms.length === 0 && (
          <Typography color="text.secondary">No published forms.</Typography>
        )}
      </Stack>
    </>
  );
}
