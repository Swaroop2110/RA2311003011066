

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Badge,
  useTheme,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useRouter } from 'next/router';

export const DRAWER_WIDTH = 240;

const navItems = [
  {
    label: 'All Notifications',
    icon: <NotificationsIcon />,
    path: '/notifications',
    badgeKey: 'total',
  },
  {
    label: 'Priority Inbox',
    icon: <StarIcon />,
    path: '/priority',
    badgeKey: 'priority',
  },
];


export default function Sidebar({ mobileOpen, onClose, unreadCount = 0, priorityCount = 0 }) {
  const router = useRouter();
  const theme = useTheme();

  const badgeCounts = {
    total: unreadCount,
    priority: priorityCount,
  };

  const drawerContent = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CampaignIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              lineHeight: 1.2,
              color: 'primary.main',
              fontFamily: '"Sora", sans-serif',
            }}
          >
            CampusNotify
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            Hiring &amp; Updates
          </Typography>
        </Box>
      </Box>

      {}
      <Box sx={{ flex: 1, py: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            px: 3,
            pb: 0.5,
            display: 'block',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            fontSize: '0.68rem',
          }}
        >
          Navigation
        </Typography>
        <List disablePadding>
          {navItems.map((item) => {
            const isActive = router.pathname === item.path;
            const count = badgeCounts[item.badgeKey] ?? 0;

            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={isActive}
                  onClick={() => {
                    router.push(item.path);
                    if (onClose) onClose();
                  }}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    py: 1.25,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(26,35,126,0.08)',
                      '& .MuiListItemIcon-root': { color: 'primary.main' },
                      '& .MuiListItemText-primary': {
                        color: 'primary.main',
                        fontWeight: 700,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: 'text.secondary' }}>
                    <Badge
                      badgeContent={count}
                      color={item.badgeKey === 'priority' ? 'secondary' : 'error'}
                      max={99}
                    >
                      {item.icon}
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider />

      {}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
          Campus Hiring Platform
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
