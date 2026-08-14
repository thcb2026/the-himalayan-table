// theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const buildM3Theme = (sourceColor: string = '#a75b2c', isDark: boolean = false) => {
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: sourceColor,
        dark: '#7c411a',
        light: '#d9b07a',
      },
      secondary: {
        main: '#d9b07a',
      },
      background: {
        default: isDark ? '#1a1a1a' : '#f5efe6',
        paper: isDark ? '#2d2d2d' : '#fffdf9',
      },
      error: {
        main: '#b42318',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 50,
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 24px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
    },
  });
};