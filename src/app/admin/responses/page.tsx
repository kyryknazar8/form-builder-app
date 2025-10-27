'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

interface Submission {
  id: string;
  data: Record<string, string>;
  createdAt: string;
  user?: {
    email: string | null;
  } | null;
}

interface Form {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  submissions: Submission[];
}

export default function AdminResponsesPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFormsWithResponses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/forms-with-responses');
      if (!res.ok) throw new Error('Помилка при завантаженні даних');
      const data = await res.json();
      setForms(data);
    } catch (e) {
      console.error(e);
      setError('❌ Error loading responses.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Delete this response?')) return;
    await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' });
    loadFormsWithResponses();
  };

  useEffect(() => {
    loadFormsWithResponses();
  }, []);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 5 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          background: 'linear-gradient(90deg, #007AFF, #00C6FF)',
          backgroundClip: 'text',
          color: 'transparent',
          mb: 3,
        }}
      >
        📋 Responses from users
      </Typography>

      <Stack direction="row" justifyContent="center" sx={{ mb: 3 }}>
        <Button
          onClick={loadFormsWithResponses}
          startIcon={<RefreshIcon />}
          variant="outlined"
        >
          Refresh
        </Button>
      </Stack>

      {loading && (
        <Stack alignItems="center" sx={{ py: 5 }}>
          <CircularProgress />
        </Stack>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && forms.length === 0 && (
        <Typography align="center" color="text.secondary">
          No forms or responses.
        </Typography>
      )}

      {!loading &&
        forms.map((form) => (
          <Accordion key={form.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>
                {form.title} ({form.submissions.length} responses)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {form.description || 'No description'}
              </Typography>

              {form.submissions.length === 0 ? (
                <Alert severity="info">No responses.</Alert>
              ) : (
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Responses</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {form.submissions.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>
                            {new Date(s.createdAt).toLocaleString('uk-UA')}
                          </TableCell>
                          <TableCell>
                            {s.user?.email || (
                              <Typography color="text.secondary" fontStyle="italic">
                                anonymous
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              {Object.entries(s.data).map(([key, value]) => (
                                <Typography key={key} sx={{ fontSize: 14 }}>
                                  <b>{key}:</b> {value}
                                </Typography>
                              ))}
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => deleteSubmission(s.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
    </Box>
  );
}
