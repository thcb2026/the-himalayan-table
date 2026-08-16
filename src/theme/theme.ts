// theme/theme.ts
import { alpha, createTheme } from '@mui/material/styles';
import { createM3Palette } from './m3Palette';

export const buildM3Theme = (sourceColor: string = '#a75b2c', isDark: boolean = false) => {
  const palette = createM3Palette(sourceColor, isDark);

  return createTheme({
    palette,
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: '0.01em',
            padding: '10px 24px',
            backgroundColor: theme.palette.primary.main,
            color: '#fffaf6',
            border: '1px solid transparent',
          }),
          contained: ({ theme }) => ({
            boxShadow: 'none',
            color: '#fffaf6',
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              boxShadow: theme.shadows[1],
              backgroundColor: alpha(theme.palette.primary.main, 0.92),
            },
          }),
          outlined: ({ theme }) => ({
            borderColor: alpha(theme.palette.primary.main, 0.65),
            color: '#3d2a21',
            backgroundColor: '#fffaf7',
            '&:hover': {
              borderColor: alpha(theme.palette.primary.main, 0.9),
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            fontWeight: 500,
            backgroundColor: alpha(theme.palette.secondary.main, 0.12),
            color: theme.palette.secondary.main,
          }),
        },
      },
    },
  });
};