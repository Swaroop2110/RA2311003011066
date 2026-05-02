

import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { formatTimestamp, getTypeIcon } from '../utils/priorityHelper';

const TYPE_STYLES = {
  Placement: {
    chipColor: '#7B2FBE',
    chipBg: '#EDE9FE',
    unreadBorder: '#7B2FBE',
    unreadBg: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)',
  },
  Result: {
    chipColor: '#1A73E8',
    chipBg: '#E8F0FE',
    unreadBorder: '#1A73E8',
    unreadBg: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)',
  },
  Event: {
    chipColor: '#00796B',
    chipBg: '#E0F7FA',
    unreadBorder: '#00BFA5',
    unreadBg: 'linear-gradient(135deg, #E0FAF6 0%, #FFFFFF 100%)',
  },
};


export default function NotificationCard({ notification, isRead, onRead, isPriority = false }) {
  const { ID, Type, Message, Timestamp } = notification;
  const style = TYPE_STYLES[Type] ?? TYPE_STYLES['Event'];
  const icon = getTypeIcon(Type);
  const formattedTime = formatTimestamp(Timestamp);

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        border: '1.5px solid',
        borderColor: isRead ? 'divider' : style.unreadBorder,
        background: isRead ? 'background.paper' : style.unreadBg,
        opacity: isRead ? 0.72 : 1,
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          opacity: 1,
        },
      }}
    >
      {}
      {!isRead && (
        <Box
          sx={{
            position: 'absolute',
            top: -4,
            left: -4,
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: style.unreadBorder,
            border: '2px solid white',
            zIndex: 1,
          }}
        />
      )}

      <CardActionArea
        onClick={() => !isRead && onRead && onRead(ID)}
        disabled={isRead}
        sx={{
          borderRadius: 'inherit',
          cursor: isRead ? 'default' : 'pointer',
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            {}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: style.chipBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              {icon}
            </Box>

            {}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 0.5,
                  flexWrap: 'wrap',
                }}
              >
                <Chip
                  label={Type}
                  size="small"
                  sx={{
                    bgcolor: style.chipBg,
                    color: style.chipColor,
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    letterSpacing: '0.05em',
                    height: 20,
                    borderRadius: 1,
                  }}
                />
                {isPriority && (
                  <Chip
                    label="Priority"
                    size="small"
                    sx={{
                      bgcolor: '#FFF3E0',
                      color: '#E65100',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      height: 20,
                      borderRadius: 1,
                    }}
                  />
                )}
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isRead ? (
                    <Tooltip title="Read">
                      <CheckCircleOutlineIcon sx={{ fontSize: 14, color: 'success.main' }} />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Unread — click to mark as read">
                      <FiberManualRecordIcon
                        sx={{ fontSize: 10, color: style.unreadBorder }}
                      />
                    </Tooltip>
                  )}
                  <Typography
                    variant="caption"
                    color={isRead ? 'success.main' : style.unreadBorder}
                    fontWeight={600}
                    sx={{ fontSize: '0.7rem' }}
                  >
                    {isRead ? 'Read' : 'Unread'}
                  </Typography>
                </Box>
              </Box>

              {}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isRead ? 400 : 600,
                  color: isRead ? 'text.secondary' : 'text.primary',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                  textTransform: 'capitalize',
                  mb: 0.75,
                }}
              >
                {Message}
              </Typography>

              {}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.72rem', letterSpacing: '0.02em' }}
              >
                🕐 {formattedTime}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
