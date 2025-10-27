'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface FormField {
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea';
  required: boolean;
  placeholder?: string;
}

export default function AdminFormsPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [fields, setFields] = useState<FormField[]>([
    { label: '', type: 'text', required: false, placeholder: '' },
  ]);
  const [loading, setLoading] = useState(false);

  const addField = () => {
    setFields([...fields, { label: '', type: 'text', required: false, placeholder: '' }]);
  };

  const updateField = <K extends keyof FormField>(
    index: number,
    key: K,
    value: FormField[K]
  ) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug,
        description,
        published,
        fields,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert('✅ Form created successfully!');
      setTitle('');
      setSlug('');
      setDescription('');
      setPublished(false);
      setFields([{ label: '', type: 'text', required: false, placeholder: '' }]);
    } else {
      alert('❌ Error creating form.');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 5 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          background: 'linear-gradient(90deg, #007AFF, #00C6FF)',
          backgroundClip: 'text',
          color: 'transparent',
          textAlign: 'center',
        }}
      >
        Forms management
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ➕ Create a new form
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Form name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Slug (automatically generated if empty)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
              }
              label="Published"
            />

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Form fields</Typography>

            {fields.map((field, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  position: 'relative',
                  backgroundColor: '#fafafa',
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    label="Field label (Label)"
                    value={field.label}
                    onChange={(e) =>
                      updateField(index, 'label', e.target.value)
                    }
                    required
                  />

                  <TextField
                    label="Placeholder (optional)"
                    value={field.placeholder}
                    onChange={(e) =>
                      updateField(index, 'placeholder', e.target.value)
                    }
                  />

                  <TextField
                    select
                        label="Field type"
                    value={field.type}
                    onChange={(e) =>
                      updateField(
                        index,
                        'type',
                        e.target.value as FormField['type']
                      )
                    }
                    SelectProps={{ native: true }}
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="textarea">Textarea</option>
                  </TextField>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.required}
                        onChange={(e) =>
                          updateField(index, 'required', e.target.checked)
                        }
                      />
                    }
                    label="Required field"
                  />

                  <IconButton
                    color="error"
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                    onClick={() => removeField(index)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}

            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="outlined"
              onClick={addField}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add field
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                background: 'linear-gradient(90deg, #007AFF, #00C6FF)',
                ':hover': { opacity: 0.9 },
              }}
            >
            {loading ? 'Saving...' : 'Create form'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
