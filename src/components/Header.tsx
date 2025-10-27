'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CreateIcon from '@mui/icons-material/Create';
import ViewListIcon from '@mui/icons-material/ViewList';
import AnalyticsIcon from '@mui/icons-material/Analytics';

type UserData = {
  email: string;
  role: 'ADMIN' | 'USER';
};

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!res.ok) {
          setUser(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        setAnchorEl(null);
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Помилка при виході:', err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) return null;

  return (
    <AppBar
      component="nav"
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        py: 1,
        maxWidth: '1200px',
        mx: 'auto',
        width: '100%',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              backgroundClip: 'text',
              color: 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            component={Link}
            href="/"
          >
            📝 Form Builder
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button 
            LinkComponent={Link} 
            href="/" 
            startIcon={<HomeIcon />}
            sx={{
              color: 'white',
              fontWeight: 600,
              borderRadius: 2,
              px: 2,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Home
          </Button>

          {user ? (
            <>
              {user.role === 'ADMIN' ? (
                <>
                  <Button 
                    LinkComponent={Link} 
                    href="/admin/forms/new" 
                    startIcon={<CreateIcon />}
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      background: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Create
                  </Button>
                  <Button 
                    LinkComponent={Link} 
                    href="/admin/forms" 
                    startIcon={<ViewListIcon />}
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Forms
                  </Button>
                  <Button 
                    LinkComponent={Link} 
                    href="/admin/responses" 
                    startIcon={<AnalyticsIcon />}
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Responses
                  </Button>
                </>
              ) : null}

              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  ml: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem 
                  component={Link} 
                  href="/profile" 
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="My profile" 
                    secondary={user.email}
                  />
                </MenuItem>
                
                {user.role === 'ADMIN' && (
                  <MenuItem 
                    component={Link} 
                    href="/admin" 
                    onClick={handleMenuClose}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon>
                      <AdminPanelSettingsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Admin panel" />
                  </MenuItem>
                )}

                <Divider />
                
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ py: 1.5, color: 'error.main' }}
                >
                  <ListItemIcon>
                    <LogoutIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                LinkComponent={Link} 
                href="/login" 
                startIcon={<LoginIcon />}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Login
              </Button>
              <Button 
                LinkComponent={Link} 
                href="/register" 
                startIcon={<AppRegistrationIcon />}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'primary.main',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Registration
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
