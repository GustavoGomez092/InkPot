/**
 * Design System Tokens
 * Type-safe access to CSS custom properties
 */

export const colorTokens = {
  background: 'var(--color-background)',
  foreground: 'var(--color-foreground)',
  card: 'var(--color-card)',
  cardForeground: 'var(--color-card-foreground)',
  popover: 'var(--color-popover)',
  popoverForeground: 'var(--color-popover-foreground)',
  primary: 'var(--color-primary)',
  primaryForeground: 'var(--color-primary-foreground)',
  secondary: 'var(--color-secondary)',
  secondaryForeground: 'var(--color-secondary-foreground)',
  muted: 'var(--color-muted)',
  mutedForeground: 'var(--color-muted-foreground)',
  accent: 'var(--color-accent)',
  accentForeground: 'var(--color-accent-foreground)',
  destructive: 'var(--color-destructive)',
  destructiveForeground: 'var(--color-destructive-foreground)',
  border: 'var(--color-border)',
  input: 'var(--color-input)',
  ring: 'var(--color-ring)',
} as const;

export const fontTokens = {
  sans: 'var(--font-sans)',
  serif: 'var(--font-serif)',
  mono: 'var(--font-mono)',
} as const;

export const shadowTokens = {
  '2xs': 'var(--shadow-2xs)',
  'xs': 'var(--shadow-xs)',
  'sm': 'var(--shadow-sm)',
  'md': 'var(--shadow-md)',
  'lg': 'var(--shadow-lg)',
  'xl': 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
} as const;

export const radiusTokens = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
} as const;

export const spacingToken = 'var(--spacing)' as const;

export type ColorToken = keyof typeof colorTokens;
export type FontToken = keyof typeof fontTokens;
export type ShadowToken = keyof typeof shadowTokens;
export type RadiusToken = keyof typeof radiusTokens;
