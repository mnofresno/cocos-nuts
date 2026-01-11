import { Platform } from 'react-native';

export const colors = {
  background: '#0B0F16',
  surface: '#111827',
  surfaceAlt: '#1F2937',
  primary: '#F97316',
  primarySoft: '#FDBA74',
  accent: '#22D3EE',
  text: '#F9FAFB',
  textMuted: '#9CA3AF',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#FACC15',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const fonts = {
  heading: Platform.select({ ios: 'AvenirNext-DemiBold', android: 'serif' }),
  body: Platform.select({ ios: 'AvenirNext-Regular', android: 'serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace' }),
};
