

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Skeleton,
  Alert,
  Button,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Toolbar,
  Divider,
  Paper,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RefreshIcon from '@mui/icons-material/Refresh';
import NumbersIcon from '@mui/icons-material/Numbers';

import Header from '../components/Header';
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar';
import NotificationCard from '../components/NotificationCard';
import { useNotificationStore } from '../state/notificationStore';
import { fetchAllNotificationsForPriority } from '../api/notificationsApi';
import { getTopPriorityNotifications } from '../utils/priorityHelper';
import Log from '../middleware/loggingMiddleware';

const DEFAULT_TOP_N = 10;
const MIN_N = 1;
const MAX_N = 50;

export default function PriorityPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(DEFAULT_TOP_N);
  const [topNInput, setTopNInput] = useState(String(DEFAULT_TOP_N));

  const { markAsRead, isRead, readIds, getUnreadCount } = useNotificationStore();

  
  const priorityNotifications = useMemo(() => {
    return getTopPriorityNotifications(allNotifications, readIds, topN);
  }, [allNotifications, readIds, topN]);

  const unreadCount = getUnreadCount(allNotifications);

  async function loadAll() {
    setLoading(true);
    setError(null);
    await Log('frontend', 'info', 'page', `Priority page loading all notifications — topN=${topN}`);

    try {
      const data = await fetchAllNotificationsForPriority(10);
      setAllNotifications(data);
      await Log('frontend', 'info', 'page', `Priority page loaded — total=${data.length}, unread=${data.filter(n => !readIds.has(n.ID)).length}`);
    } catch (err) {
      setError(err.message || 'Failed to load priority notifications.');
      await Log('frontend', 'error', 'page', `Priority page error — ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Log('frontend', 'info', 'page', 'Priority page mounted');
    loadAll();
    
  }, []);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleTopNChange = (e) => {
    const val = e.target.value;
    setTopNInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= MIN_N && num <= MAX_N) {
      setTopN(num);
      Log('frontend', 'debug', 'page', `Priority top-N changed to ${num}`);
    }
  };

  const renderSkeletons = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <Box key={i} sx={{ mb: 1.5 }}>
        <Skeleton variant="rounded" height={96} animation="wave" />
      </Box>
    ));

  const renderEmpty = () => (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 4,
          bgcolor: 'rgba(26,35,126,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StarIcon sx={{ fontSize: 36, color: 'secondary.main' }} />
      </Box>
      <Typography variant="h6" fontWeight={600}>
        No unread priority notifications
      </Typography>
      <Typography variant="body2" color="text.secondary">
        You've read all your notifications — great job! 🎉
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        unreadCount={unreadCount}
        priorityCount={priorityNotifications.length}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        <Header
          onMenuClick={() => setMobileOpen(true)}
          title="Priority Inbox"
          unreadCount={unreadCount}
        />
        <Toolbar sx={{ minHeight: 64 }} />

        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          {}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
            spacing={1.5}
            mb={2.5}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 0.25 }}>
                Priority Inbox
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Top unread notifications ranked by importance and recency
              </Typography>
            </Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadAll}
              disabled={loading}
              variant="outlined"
              size="small"
              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
            >
              Refresh
            </Button>
          </Stack>

          {}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              bgcolor: 'rgba(26,35,126,0.02)',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ sm: 'center' }}
              flexWrap="wrap"
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.68rem' }}>
                  Priority Order
                </Typography>
                <Stack direction="row" spacing={1} mt={0.75} flexWrap="wrap">
                  {[
                    { label: '1. Placement', color: '#7B2FBE', bg: '#EDE9FE' },
                    { label: '2. Result', color: '#1A73E8', bg: '#E8F0FE' },
                    { label: '3. Event', color: '#00796B', bg: '#E0F7FA' },
                  ].map(({ label, color, bg }) => (
                    <Chip
                      key={label}
                      label={label}
                      size="small"
                      sx={{ bgcolor: bg, color, fontWeight: 700, fontSize: '0.7rem', height: 22, borderRadius: 1 }}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <NumbersIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Show top
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={topNInput}
                  onChange={handleTopNChange}
                  inputProps={{ min: MIN_N, max: MAX_N }}
                  sx={{ width: 80 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end" sx={{ typography: 'caption' }}>N</InputAdornment>,
                  }}
                />
              </Box>
            </Stack>
          </Paper>

          {}
          {!loading && !error && (
            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
              <Chip
                label={`${priorityNotifications.length} shown`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.72rem', height: 24 }}
              />
              <Chip
                label={`${unreadCount} total unread`}
                size="small"
                color="error"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.72rem', height: 24 }}
              />
            </Stack>
          )}

          {}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 2 }}
              action={
                <Button size="small" onClick={loadAll} color="error">
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {}
          {loading
            ? renderSkeletons()
            : priorityNotifications.length === 0 && !error
            ? renderEmpty()
            : priorityNotifications.map((n, idx) => (
                <Box key={n.ID} sx={{ position: 'relative' }}>
                  {}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -32,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: { xs: 'none', lg: 'flex' },
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: idx < 3 ? 'secondary.main' : 'divider',
                      color: idx < 3 ? 'white' : 'text.secondary',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </Box>
                  <NotificationCard
                    notification={n}
                    isRead={isRead(n.ID)}
                    onRead={handleMarkAsRead}
                    isPriority
                  />
                </Box>
              ))}
        </Container>
      </Box>
    </Box>
  );
}
