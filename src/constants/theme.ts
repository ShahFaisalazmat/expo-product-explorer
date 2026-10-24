import { Platform } from 'react-native';

export const Palette = {
  deepNavy: '#101828',
  darkSurface: '#182338',
  warmIvory: '#F8F6F0',
  mutedGold: '#C6A96B',
  primaryText: '#182338',
  secondaryText: '#667085',
  whiteCards: '#FFFFFF',
  cardBorder: '#E4E7EC',
  badgeBg: '#F2EDE4',
  success: '#12B76A',
  danger: '#F04438',
  lightGrayBg: '#F4F5F7',
} as const;

export const Colors = {
  light: {
    text: Palette.primaryText,
    background: Palette.warmIvory,
    backgroundElement: '#ECE8DF',
    backgroundSelected: '#E0D8C8',
    textSecondary: Palette.secondaryText,
    tint: Palette.mutedGold,
  },
  dark: {
    text: '#FFFFFF',
    background: Palette.deepNavy,
    backgroundElement: Palette.darkSurface,
    backgroundSelected: '#253550',
    textSecondary: '#98A2B3',
    tint: Palette.mutedGold,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    rounded: 'system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const CardShadow = Platform.select({
  web: {
    boxShadow: '0px 2px 8px rgba(16, 24, 40, 0.06)',
  },
  default: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});

export const ElevatedShadow = Platform.select({
  web: {
    boxShadow: '0px 4px 16px rgba(16, 24, 40, 0.12)',
  },
  default: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 840;
