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
            fontWeight: 600,
            padding: '10px 24px',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }),
          contained: ({ theme }) => ({
            boxShadow: 'none',
            '&:hover': {
              boxShadow: theme.shadows[1],
              backgroundColor: alpha(theme.palette.primary.main, 0.92),
            },
          }),
          outlined: ({ theme }) => ({
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
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