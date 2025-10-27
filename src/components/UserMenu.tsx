'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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

type UserMenuProps = {
  user: { email: string; role: 'ADMIN' | 'USER' } | null;
};

export default function UserMenu({ user }: UserMenuProps) {
  const [currentUser, setCurrentUser] = useState(user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setCurrentUser(null);
        setAnchorEl(null);
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
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

      {currentUser ? (
        <>
          {currentUser.role === 'ADMIN' ? (
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
              {currentUser.email.charAt(0).toUpperCase()}
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
                secondary={currentUser.email}
              />
            </MenuItem>
            
            {currentUser.role === 'ADMIN' && (
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
  );
}
