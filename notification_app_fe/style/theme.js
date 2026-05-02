import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A237E',       
      light: '#534BAE',
      dark: '#000051',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00BFA5',       
      light: '#5DF2D6',
      dark: '#008E76',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F0F2F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0D1B3E',
      secondary: '#4A5568',
    },
    error: {
      main: '#E53E3E',
    },
    warning: {
      main: '#DD6B20',
    },
    success: {
      main: '#38A169',
    },
    
    placement: {
      main: '#7B2FBE',
      light: '#EDE9FE',
      contrastText: '#FFFFFF',
    },
    result: {
      main: '#1A73E8',
      light: '#E8F0FE',
      contrastText: '#FFFFFF',
    },
    event: {
      main: '#00BFA5',
      light: '#E0F7FA',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Sora", "DM Sans", sans-serif',
      fontWeight: 700,
      fontSize: '2.25rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Sora", "DM Sans", sans-serif',
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '-0.015em',
    },
    h3: {
      fontFamily: '"Sora", "DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.375rem',
    },
    h4: {
      fontFamily: '"Sora", "DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h5: {
      fontFamily: '"Sora", "DM Sans", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Sora", "DM Sans", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      color: '#4A5568',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(26,35,126,0.12), 0 2px 6px rgba(0,0,0,0.06)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.72rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          borderRadius: 6,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.01em',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(26,35,126,0.08)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(26,35,126,0.08)',
            '&:hover': {
              backgroundColor: 'rgba(26,35,126,0.12)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
