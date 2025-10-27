'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Registration error');
      setLoading(false);
      return;
    }

    router.push('/login');
  };

  return (
    <Paper
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 10,
        p: 4,
        borderRadius: 4,
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{
          fontWeight: 600,
          mb: 3,
          background: 'linear-gradient(90deg, #007AFF, #00C6FF)',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Registration
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'Error'}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            mt: 1,
            background: 'linear-gradient(90deg, #007AFF, #00C6FF)',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 3,
          }}
        >
          {loading ? 'Registration...' : 'Register'}
        </Button>
      </Stack>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 2, color: 'text.secondary' }}
      >
        Already have an account? <a href="/login">Login</a>
      </Typography>
    </Paper>
  );
}
