

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Skeleton,
  Alert,
  Button,
  Grid,
  Stack,
  Chip,
  Toolbar,
  useTheme,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import InboxIcon from '@mui/icons-material/Inbox';

import Header from '../components/Header';
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar';
import NotificationCard from '../components/NotificationCard';
import FilterBar from '../components/FilterBar';
import PaginationBar from '../components/PaginationBar';
import { useNotificationStore } from '../state/notificationStore';
import { useNotifications } from '../hooks/useNotifications';
import Log from '../middleware/loggingMiddleware';

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterType, setFilterType] = useState(null);

  const { markAsRead, isRead, getUnreadCount } = useNotificationStore();

  const {
    notifications,
    page,
    loading,
    error,
    hasMore,
    goToNextPage,
    goToPrevPage,
    refresh,
  } = useNotifications({ filterType, limit: ITEMS_PER_PAGE });

  const unreadCount = getUnreadCount(notifications);

  
  useEffect(() => {
    Log('frontend', 'info', 'page', 'Notifications page mounted');
  }, []);

  
  const handleFilterChange = async (newType) => {
    setFilterType(newType || null);
    await Log('frontend', 'info', 'page', `Filter changed to: ${newType || 'all'}`);
  };

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleRefresh = async () => {
    await Log('frontend', 'info', 'page', 'User triggered manual refresh');
    refresh();
  };

  
  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, i) => (
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
        <InboxIcon sx={{ fontSize: 36, color: 'primary.light' }} />
      </Box>
      <Typography variant="h6" fontWeight={600} color="text.primary">
        No notifications found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {filterType
          ? `No "${filterType}" notifications available at the moment.`
          : 'You are all caught up! No new notifications.'}
      </Typography>
      {filterType && (
        <Button variant="outlined" size="small" onClick={() => handleFilterChange(null)}>
          Clear filter
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        unreadCount={unreadCount}
        priorityCount={0}
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
          title="All Notifications"
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
                Notifications
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} unread`}
                    size="small"
                    color="error"
                    sx={{ fontWeight: 700, fontSize: '0.72rem', height: 22 }}
                  />
                )}
                <Typography variant="body2" color="text.secondary">
                  Page {page}
                </Typography>
              </Stack>
            </Box>

            <Button
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              variant="outlined"
              size="small"
              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
            >
              Refresh
            </Button>
          </Stack>

          {}
          <FilterBar
            filterType={filterType || ''}
            onFilterChange={handleFilterChange}
            totalCount={notifications.length}
          />

          {}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 2 }}
              action={
                <Button size="small" onClick={handleRefresh} color="error">
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {}
          <Grid container spacing={0}>
            <Grid item xs={12}>
              {loading
                ? renderSkeletons()
                : notifications.length === 0 && !error
                ? renderEmpty()
                : notifications.map((n) => (
                    <NotificationCard
                      key={n.ID}
                      notification={n}
                      isRead={isRead(n.ID)}
                      onRead={handleMarkAsRead}
                    />
                  ))}
            </Grid>
          </Grid>

          {}
          {!loading && notifications.length > 0 && (
            <PaginationBar
              page={page}
              hasMore={hasMore}
              loading={loading}
              onNext={goToNextPage}
              onPrev={goToPrevPage}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
}
