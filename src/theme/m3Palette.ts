import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities';
import { PaletteOptions } from '@mui/material/styles';

export function createM3Palette(sourceHexColor: string, isDark: boolean = false): PaletteOptions {
  // Generate M3 tonal palettes from a single brand source color
  const m3Theme = themeFromSourceColor(argbFromHex(sourceHexColor));
  const scheme = isDark ? m3Theme.schemes.dark : m3Theme.schemes.light;

  // Convert ARGB integer to CSS hex string
  const hex = (argb: number) => '#' + (argb & 0xffffff).toString(16).padStart(6, '0');

  return {
    mode: isDark ? 'dark' : 'light',
    primary: {
      main: hex(scheme.primary),
      contrastText: hex(scheme.onPrimary),
    },
    secondary: {
      main: hex(scheme.secondary),
      contrastText: hex(scheme.onSecondary),
    },
    error: {
      main: hex(scheme.error),
      contrastText: hex(scheme.onError),
    },
    background: {
      default: hex(scheme.background),
      paper: hex(scheme.surface),
    },
    text: {
      primary: hex(scheme.onBackground),
      secondary: hex(scheme.onSurfaceVariant),
    },
  };
}