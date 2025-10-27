import { Suspense } from 'react';
import { prisma } from '../../lib/prisma';
import { verifyJwt } from '../../lib/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Paper,
  Fade,
  Skeleton,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from 'next/link';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LaunchIcon from '@mui/icons-material/Launch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

type SubmissionWithForm = {
  id: string;
  data: Record<string, unknown>;
  createdAt: Date;
  form: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
  };
};

function SubmissionCard({ submission }: { submission: SubmissionWithForm }) {
  const submissionData = submission.data as Record<string, unknown>;
  
  return (
    <Fade in timeout={600}>
      <Card 
        sx={{ 
          mb: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <CardHeader
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '& .MuiCardHeader-title': {
              color: 'white',
              fontWeight: 600,
            },
            '& .MuiCardHeader-subheader': {
              color: 'rgba(255,255,255,0.8)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                <Link 
                  href={`/forms/${submission.form.slug}`}
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: 20 }} />
                  {submission.form.title}
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                {submission.form.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<CalendarTodayIcon />}
                  label={new Date(submission.createdAt).toLocaleDateString('uk-UA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  size="small"
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '& .MuiChip-icon': {
                      color: 'white',
                    },
                  }}
                />
                <Chip 
                  icon={<TrendingUpIcon />}
                  label={`${Object.keys(submissionData).length} responses`}
                  size="small"
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '& .MuiChip-icon': {
                      color: 'white',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardHeader>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {Object.entries(submissionData).slice(0, 3).map(([key, value]) => (
              <Box 
                key={key} 
                sx={{ 
                  display: 'flex', 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(102, 126, 234, 0.05)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    minWidth: '120px',
                    color: 'primary.main',
                  }}
                >
                  {key}:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    flex: 1,
                    color: 'text.secondary',
                  }}
                >
                  {String(value).length > 50 
                    ? `${String(value).substring(0, 50)}...` 
                    : String(value)
                  }
                </Typography>
              </Box>
            ))}
            {Object.keys(submissionData).length > 3 && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  textAlign: 'center',
                  fontStyle: 'italic',
                  py: 1,
                }}
              >
                ... and {Object.keys(submissionData).length - 3} responses
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              component={Link} 
              href={`/forms/${submission.form.slug}`}
              variant="outlined"
              startIcon={<VisibilityIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              View form
            </Button>
            <Button 
              component={Link} 
              href={`/forms/${submission.form.slug}?submission=${submission.id}`}
              variant="contained"
              startIcon={<LaunchIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              View response
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}

function ProfileSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Skeleton variant="text" width="300px" height={60} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="200px" height={40} sx={{ mx: 'auto' }} />
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[1, 2, 3].map((i) => (
          <Card key={i} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={16} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Skeleton variant="rounded" width={120} height={24} />
              <Skeleton variant="rounded" width={100} height={24} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rounded" width={120} height={36} />
              <Skeleton variant="rounded" width={140} height={36} />
            </Box>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

async function ProfileContent() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const payload = verifyJwt(token);
  if (!payload) {
    redirect('/login');
  }

  const submissions = await prisma.submission.findMany({
    where: {
      userId: payload.sub,
    },
    include: {
      form: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

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
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <PersonIcon sx={{ fontSize: 48, mr: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              My profile
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            My responses to forms ({submissions.length})
          </Typography>
        </Paper>
      </Fade>

      {submissions.length === 0 ? (
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
                No responses yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                You havent filled in any forms yet. Go to the home page to find interesting forms to fill in.
              </Typography>
              <Button 
                component={Link} 
                href="/" 
                variant="contained"
                size="large"
                startIcon={<LaunchIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Go to the home page
              </Button>
            </CardContent>
          </Card>
        </Fade>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {submissions.map((submission, index) => (
            <Fade in timeout={600 + index * 200} key={submission.id}>
              <div>
                <SubmissionCard 
                  submission={{
                    ...submission,
                    data: submission.data as Record<string, unknown>
                  }} 
                />
              </div>
            </Fade>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}