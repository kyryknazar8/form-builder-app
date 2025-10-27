'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

type FormListItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published: boolean;
};

export default function AdminFormsPage() {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPublished, setNewPublished] = useState(false);

  const loadForms = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/forms');
      const data = await res.json();
      setForms(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error loading forms', e);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  const createForm = async () => {
    if (!newTitle.trim()) return;

    const slugValue = newSlug.trim()
      ? newSlug.trim().toLowerCase().replace(/\s+/g, '-')
      : newTitle.toLowerCase().replace(/\s+/g, '-');

    await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        slug: slugValue,
        description: newDescription,
        published: newPublished
      })
    });

    setNewTitle('');
    setNewSlug('');
    setNewDescription('');
    setNewPublished(false);
    loadForms();
  };

  useEffect(() => {
    loadForms();
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 5 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 4,
          textAlign: 'center',
          background: 'linear-gradient(90deg, #007AFF, #00C6FF)',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Forms management
      </Typography>

      
        

      {loading ? (
        <Typography color="text.secondary" align="center">
          Loading...
        </Typography>
      ) : forms.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No forms created.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {forms.map((f) => (
            <Card
              key={f.id}
              variant="outlined"
              sx={{
                borderRadius: 4,
                boxShadow:
                  '0 4px 16px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.05)',
                transition: 'all 0.2s ease',
                ':hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                },
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {f.title}
                  </Typography>

                  {f.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: 'pre-wrap', mb: 0.5 }}
                    >
                      {f.description}
                    </Typography>
                  )}

                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: 14, opacity: 0.7 }}
                  >
                    /{f.slug} —{' '}
                    <span
                      style={{
                        color: f.published ? '#007AFF' : '#888',
                        fontWeight: 500,
                      }}
                    >
                      {f.published ? 'published' : 'draft'}
                    </span>
                  </Typography>

                  <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                    <Button
                      component={Link}
                      href={`/admin/forms/${f.id}`}
                      variant="contained"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        backgroundColor: '#007AFF',
                        ':hover': { backgroundColor: '#0063E1' },
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        borderColor: 'rgba(255,0,0,0.4)',
                        color: '#D32F2F',
                        ':hover': { backgroundColor: 'rgba(255,0,0,0.08)' },
                      }}
                      onClick={async () => {
                        await fetch(`/api/forms/${f.id}`, { method: 'DELETE' });
                        loadForms();
                      }}
                    >
                    Delete
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
