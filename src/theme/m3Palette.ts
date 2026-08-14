import { PaletteOptions } from '@mui/material/styles';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normalizeHex = (hex: string): string => {
  const sanitized = hex.trim();
  const withoutHash = sanitized.startsWith('#') ? sanitized.slice(1) : sanitized;
  const fullHex = withoutHash.length === 3
    ? withoutHash.split('').map((char) => char + char).join('')
    : withoutHash;

  if (/^[0-9a-fA-F]{6}$/.test(fullHex)) {
    return `#${fullHex.toLowerCase()}`;
  }

  return '#a75b2c';
};

const hexToRgb = (hex: string) => {
  const normalized = normalizeHex(hex);
  const value = normalized.slice(1);

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0')).join('')}`;

const mixHex = (base: string, target: string, ratio: number): string => {
  const start = hexToRgb(base);
  const end = hexToRgb(target);
  const amount = clamp(ratio, 0, 1);

  return rgbToHex(
    start.r + (end.r - start.r) * amount,
    start.g + (end.g - start.g) * amount,
    start.b + (end.b - start.b) * amount,
  );
};

const getContrastText = (hex: string): string => {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? '#111111' : '#ffffff';
};

export function createM3Palette(sourceHexColor: string, isDark: boolean = false): PaletteOptions {
  const source = normalizeHex(sourceHexColor);
  const primaryMain = source;
  const primaryLight = mixHex(primaryMain, '#ffffff', isDark ? 0.22 : 0.38);
  const primaryDark = mixHex(primaryMain, '#000000', 0.26);
  const secondaryMain = mixHex(primaryMain, '#d4a57a', 0.7);
  const secondaryLight = mixHex(secondaryMain, '#ffffff', 0.2);
  const secondaryDark = mixHex(secondaryMain, '#000000', 0.24);

  const backgroundDefault = isDark ? '#111827' : '#f5efe6';
  const backgroundPaper = isDark ? '#1d2430' : '#fffdf9';

  return {
    mode: isDark ? 'dark' : 'light',
    primary: {
      main: primaryMain,
      light: primaryLight,
      dark: primaryDark,
      contrastText: getContrastText(primaryMain),
    },
    secondary: {
      main: secondaryMain,
      light: secondaryLight,
      dark: secondaryDark,
      contrastText: getContrastText(secondaryMain),
    },
    error: {
      main: '#b42318',
      light: '#d64b40',
      dark: '#811d16',
      contrastText: '#ffffff',
    },
    background: {
      default: backgroundDefault,
      paper: backgroundPaper,
    },
    text: {
      primary: isDark ? '#f9fafb' : '#1f2937',
      secondary: isDark ? '#cbd5e1' : '#6b7280',
    },
  };
}