'use client';

import { useState, useEffect } from 'react';
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
  Alert,
  Chip,
  Container,
  Card,
  CardContent,
  CardHeader,
  Fade,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TitleIcon from '@mui/icons-material/Title';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import EmailIcon from '@mui/icons-material/Email';
import NotesIcon from '@mui/icons-material/Notes';

type FieldType = 'text' | 'email' | 'number' | 'textarea';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}

interface EditFormPageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default function EditFormPage(props: EditFormPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const awaited = await props.params;
      setResolvedParams(awaited);
    };
    resolveParams();
  }, [props.params]);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFields, setAiFields] = useState<FormField[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (!resolvedParams) return;
    const { id } = resolvedParams;
    const isNew = id === 'new';
    if (isNew) return;

    const loadForm = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/forms/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error loading form');

        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description || '');
        setPublished(data.published);
        setFields(Array.isArray(data.fields) ? data.fields : JSON.parse(data.fields || '[]'));
      } catch (err) {
        console.error(err);
        setError('Error loading form');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [resolvedParams]);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: '',
      placeholder: '',
      required: false,
    };
    setFields((prev) => [...prev, newField]);
  };

  const updateField = (id: string, updated: Partial<FormField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedParams) return;
    const { id } = resolvedParams;
    const isNew = id === 'new';

    setLoading(true);
    setError(null);

    const url = isNew ? '/api/forms' : `/api/forms/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
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
      alert(isNew ? '✅ Form created successfully!' : '✅ Form updated!');
      if (isNew) {
        setTitle('');
        setSlug('');
        setDescription('');
        setPublished(false);
        setFields([]);
      }
    } else {
      setError('❌ Error saving form');
    }
  };

  const askAI = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: aiInput }],
        }),
      });

      const data: { fields?: FormField[]; error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI error');

      const generated = (data.fields ?? []).map((f) => ({
        ...f,
        id: crypto.randomUUID(),
      }));
      setAiFields(generated);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('429'))
          setAiError('Exceeded OpenAI API limit. Try again later.');
        else setAiError(err.message);
      } else setAiError('Unknown error');
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiFields = () => {
    if (!aiFields.length) return;
    setFields((prev) => [...prev, ...aiFields]);
    setAiFields([]);
    setAiInput('');
  };

  if (!resolvedParams) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />
          <Typography variant="h6" color="text.secondary">
            ⏳ Loading form...
          </Typography>
        </Box>
      </Container>
    );
  }

  const { id } = resolvedParams;
  const isNew = id === 'new';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <EditIcon sx={{ fontSize: 48, mr: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {isNew ? 'Creating form' : 'Editing form'}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {isNew ? 'Create a new form with fields' : 'Edit existing form'}
          </Typography>
        </Paper>
      </Fade>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: 2 }}>
          <Fade in timeout={1000}>
            <Card
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
              }}
            >
              <CardHeader
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 3,
                  mb: 3,
                }}
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TitleIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Main information
                    </Typography>
                  </Box>
                }
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Form name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Slug (automatically generated if empty)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />

                  <Box sx={{ 
                    p: 3, 
                    borderRadius: 3, 
                    background: 'rgba(102, 126, 234, 0.05)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={published}
                          onChange={(e) => setPublished(e.target.checked)}
                          sx={{
                            color: '#667eea',
                            '&.Mui-checked': {
                              color: '#667eea',
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {published ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Published form
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>

                  <Divider sx={{ my: 3, borderColor: 'rgba(102, 126, 234, 0.2)' }} />
                  
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>
                      Form fields
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add fields to collect information
                    </Typography>
                  </Box>

                  {fields.map((field, index) => (
                    <Fade in timeout={600 + index * 200} key={field.id}>
                      <Card
                        sx={{
                          p: 3,
                          mb: 3,
                          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          borderRadius: 3,
                          '&:hover': {
                            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <CardHeader
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: 2,
                            mb: 2,
                          }}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {field.type === 'text' && <TextFieldsIcon />}
                                {field.type === 'email' && <EmailIcon />}
                                {field.type === 'number' && <NumbersIcon />}
                                {field.type === 'textarea' && <NotesIcon />}
                                <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                                  {field.type}
                                </Typography>
                                {field.required && (
                                  <Chip 
                                    label="Required" 
                                    size="small" 
                                    color="warning" 
                                    variant="outlined"
                                    sx={{ color: 'white', borderColor: 'white' }}
                                  />
                                )}
                              </Box>
                              <Tooltip title="Delete field">
                                <IconButton 
                                  onClick={() => removeField(field.id)} 
                                  sx={{ color: 'white' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          }
                        />
                        <CardContent>
                          <Stack spacing={2}>
                            <TextField
                              label="Field name"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                            />
                            <TextField
                              label="Placeholder (optional)"
                              value={field.placeholder}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.required}
                                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                  sx={{
                                    color: '#667eea',
                                    '&.Mui-checked': {
                                      color: '#667eea',
                                    },
                                  }}
                                />
                              }
                              label="Required field"
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Fade>
                  ))}

                  <Fade in timeout={1200}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                        Add field
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                          variant="outlined"
                          startIcon={<TextFieldsIcon />}
                          onClick={() => addField('text')}
                          sx={{
                            borderRadius: 3,
                            px: 3,
                            py: 1.5,
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              borderColor: '#5a6fd8',
                              backgroundColor: 'rgba(102, 126, 234, 0.05)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Text
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<EmailIcon />}
                          onClick={() => addField('email')}
                          sx={{
                            borderRadius: 3,
                            px: 3,
                            py: 1.5,
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              borderColor: '#5a6fd8',
                              backgroundColor: 'rgba(102, 126, 234, 0.05)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Email
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<NumbersIcon />}
                          onClick={() => addField('number')}
                          sx={{
                            borderRadius: 3,
                            px: 3,
                            py: 1.5,
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              borderColor: '#5a6fd8',
                              backgroundColor: 'rgba(102, 126, 234, 0.05)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Number
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<NotesIcon />}
                          onClick={() => addField('textarea')}
                          sx={{
                            borderRadius: 3,
                            px: 3,
                            py: 1.5,
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              borderColor: '#5a6fd8',
                              backgroundColor: 'rgba(102, 126, 234, 0.05)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Textarea
                        </Button>
                      </Stack>
                    </Box>
                  </Fade>

                  <Fade in timeout={1400}>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                        sx={{
                          px: 6,
                          py: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 3,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                          },
                          '&:disabled': {
                            background: 'rgba(102, 126, 234, 0.3)',
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {loading ? 'Saving...' : (isNew ? 'Create form' : 'Save changes')}
                      </Button>
                    </Box>
                  </Fade>
                </Stack>
              </form>
            </Card>
          </Fade>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Fade in timeout={1200}>
            <Card
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
                height: 'fit-content',
              }}
            >
              <CardHeader
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 3,
                  mb: 3,
                }}
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SmartToyIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      AI assistant
                    </Typography>
                  </Box>
                }
              />

              <Stack spacing={3}>
                <TextField
                  label="Describe the fields to generate"
                  placeholder="For example: Add a field for the phone, required"
                  multiline
                  minRows={3}
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={askAI}
                    disabled={aiLoading || !aiInput.trim()}
                    startIcon={aiLoading ? <LinearProgress /> : <AutoAwesomeIcon />}
                    sx={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 3,
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        background: 'rgba(102, 126, 234, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {aiLoading ? 'Generating...' : 'Generate'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={applyAiFields}
                    disabled={!aiFields.length}
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#5a6fd8',
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        borderColor: 'rgba(102, 126, 234, 0.3)',
                        color: 'rgba(102, 126, 234, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Add
                  </Button>
                </Stack>

                {aiError && (
                  <Alert severity="error" sx={{ borderRadius: 3 }}>
                    {aiError}
                  </Alert>
                )}

                {aiFields.length > 0 && (
                  <Fade in timeout={600}>
                    <Box>
                      <Divider sx={{ my: 2, borderColor: 'rgba(102, 126, 234, 0.2)' }} />
                      <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                        Generated fields:
                      </Typography>
                      <Stack spacing={1}>
                        {aiFields.map((f, i) => (
                          <Chip
                            key={i}
                            label={`${f.label} — ${f.type}${f.required ? ' (required.)' : ''}`}
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              borderColor: '#667eea',
                              color: '#667eea',
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.05)',
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Fade>
                )}
              </Stack>
            </Card>
          </Fade>
        </Box>
      </Box>
    </Container>
  );
}
