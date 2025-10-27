'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Collapse,
  Container,
  Fade,
  Chip,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CelebrationIcon from '@mui/icons-material/Celebration';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';

export interface FormField {
  id?: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}

export interface FormDataType {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  fields: FormField[] | string | null;
}

export default function FormPage({ form }: { form: FormDataType }) {
  const [anonymous, setAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('submitted') === '1') {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const fields: FormField[] = form?.fields
    ? Array.isArray(form.fields)
      ? form.fields
      : typeof form.fields === 'string'
      ? JSON.parse(form.fields)
      : []
    : [];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Collapse in={showSuccess}>
        <Fade in={showSuccess} timeout={600}>
          <Card
            sx={{
              mb: 4,
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              color: 'white',
              boxShadow: '0 12px 40px rgba(76, 175, 80, 0.4)',
              borderRadius: 4,
              overflow: 'hidden',
              animation: showSuccess ? 'successPulse 2s ease-in-out' : 'none',
              '@keyframes successPulse': {
                '0%': {
                  transform: 'scale(0.95)',
                  opacity: 0,
                },
                '50%': {
                  transform: 'scale(1.02)',
                  opacity: 1,
                },
                '100%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 5 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3,
                  animation: showSuccess ? 'bounce 1s ease-in-out' : 'none',
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '40%': {
                      transform: 'translateY(-10px)',
                    },
                    '60%': {
                      transform: 'translateY(-5px)',
                    },
                  },
                }}
              >
                <CelebrationIcon 
                  sx={{ 
                    fontSize: 56, 
                    color: '#FFD700', 
                    mr: 2,
                    animation: showSuccess ? 'sparkle 1.5s ease-in-out infinite' : 'none',
                    '@keyframes sparkle': {
                      '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
                      '50%': { transform: 'rotate(180deg) scale(1.1)' },
                    },
                  }} 
                />
                <CheckCircleIcon 
                  sx={{ 
                    fontSize: 56, 
                    color: 'white',
                    animation: showSuccess ? 'checkmark 0.8s ease-in-out' : 'none',
                    '@keyframes checkmark': {
                      '0%': { transform: 'scale(0)' },
                      '50%': { transform: 'scale(1.2)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  }} 
                />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  animation: showSuccess ? 'fadeInUp 0.6s ease-out 0.2s both' : 'none',
                  '@keyframes fadeInUp': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(20px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                Congratulations!
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  opacity: 0.9,
                  animation: showSuccess ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none',
                }}
              >
                Your response has been successfully sent!
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.8, 
                  mb: 4,
                  animation: showSuccess ? 'fadeInUp 0.6s ease-out 0.6s both' : 'none',
                }}
              >
                Thank you for your time and valuable information
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  justifyContent: 'center',
                  animation: showSuccess ? 'fadeInUp 0.6s ease-out 0.8s both' : 'none',
                }}
              >
                <Button
                  component={Link}
                  href="/profile"
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  size="large"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    borderWidth: 2,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  My profile
                </Button>
                <Button
                  component={Link}
                  href="/"
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  size="large"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    borderWidth: 2,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Home
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Collapse>

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
            <AssignmentIcon sx={{ fontSize: 48, mr: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {form.title}
            </Typography>
          </Box>
          {form.description && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DescriptionIcon sx={{ fontSize: 24, mr: 1, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {form.description}
              </Typography>
            </Box>
          )}
        </Paper>
      </Fade>

      {fields.length === 0 ? (
        <Fade in timeout={1000}>
          <Card 
            sx={{ 
              textAlign: 'center', 
              py: 6,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '2px dashed rgba(102, 126, 234, 0.3)',
            }}
          >
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <AssignmentIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.5 }} />
              </Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Empty form
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This form has no fields to fill in.
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      ) : (
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
            <form action={`/api/forms/${form.id}/submit`} method="POST">
              <Stack spacing={3}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Fill in the form
                  </Typography>
                  <Divider sx={{ mt: 1, borderColor: 'rgba(102, 126, 234, 0.2)' }} />
                </Box>

                {fields.map((field, index) => (
                  <Fade in timeout={600 + index * 200} key={index}>
                    <Box>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.label}
                        placeholder={field.placeholder || ''}
                        required={field.required}
                        type={
                          field.type === 'number'
                            ? 'number'
                            : field.type === 'email'
                            ? 'email'
                            : 'text'
                        }
                        multiline={field.type === 'textarea'}
                        minRows={field.rows ?? undefined}
                        inputProps={{
                          min: field.min,
                          max: field.max,
                          step: field.step,
                          maxLength: field.maxLength,
                          minLength: field.minLength,
                        }}
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
                          '& .MuiInputLabel-root': {
                            color: '#667eea',
                            '&.Mui-focused': {
                              color: '#667eea',
                            },
                          },
                        }}
                      />
                      {field.required && (
                        <Chip 
                          label="Required field" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ mt: 1, fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  </Fade>
                ))}

                <Divider sx={{ my: 2, borderColor: 'rgba(102, 126, 234, 0.2)' }} />

                <Fade in timeout={800 + fields.length * 200}>
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: 3, 
                    background: 'rgba(102, 126, 234, 0.05)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={anonymous}
                          onChange={(e) => setAnonymous(e.target.checked)}
                          name="anonymous"
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
                          <VisibilityOffIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Send anonymously (without saving personal data)
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </Fade>

                <Fade in timeout={1000 + fields.length * 200}>
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SendIcon />}
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
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Send response
                    </Button>
                  </Box>
                </Fade>
              </Stack>
            </form>
          </Card>
        </Fade>
      )}
    </Container>
  );
}
