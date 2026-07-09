/**
 * Health Care Hub — Design System Tokens
 * ═══════════════════════════════════════
 *
 * Single source of truth for every visual property in the app.
 * Import `theme` wherever you need a value; never use raw hex / px literals.
 *
 * Usage:
 *   import { theme } from '@/src/styles/theme';
 *   <div style={{ background: theme.colors.background, padding: theme.spacing[16] }}>
 */

// ─── Colors ────────────────────────────────────────────────────────
export const colors = {
  /** Warm off-white page background */
  background: '#FAF7F2',
  /** Deep forest-green primary brand color */
  primary: '#2F5233',
  /** Energetic terracotta accent for CTAs & highlights */
  accent: '#F2865E',
  /** Soft sage success / positive state */
  success: '#B7CBB0',
  /** Near-black text for maximum readability on warm bg */
  text: '#26291F',
  /** De-emphasized / secondary text */
  muted: '#6B7060',
  /** Pure white for card surfaces */
  white: '#FFFFFF',
  /** Soft blue for data tracking elements (MyFitnessPal style) */
  blue: '#5B8DBE',
} as const;

// ─── Fonts ─────────────────────────────────────────────────────────
export const fonts = {
  /** Rounded serif for headings — imported via Google Fonts */
  heading: '"Fraunces", "Georgia", serif',
  /** Clean sans-serif for body copy */
  body: '"Inter", "Helvetica Neue", Arial, sans-serif',
} as const;

// ─── Font Sizes (rem) ──────────────────────────────────────────────
export const fontSizes = {
  xs: '0.75rem',   // 12px
  sm: '0.875rem',  // 14px
  base: '1rem',    // 16px
  lg: '1.125rem',  // 18px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
} as const;

// ─── Font Weights ──────────────────────────────────────────────────
export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ─── Border Radius ─────────────────────────────────────────────────
export const radii = {
  /** Cards, modals, large containers */
  card: '16px',
  /** Buttons, inputs, chips */
  button: '9999px',
  /** Fully round (avatars, badges) */
  full: '9999px',
} as const;

// ─── Shadow ────────────────────────────────────────────────────────
export const shadows = {
  /**
   * The ONE shadow used across the entire app.
   * Soft, warm, and barely-there — avoids the "floating div" look.
   */
  card: '0 2px 12px rgba(38, 41, 31, 0.08)',
} as const;

// ─── Spacing Scale ─────────────────────────────────────────────────
export const spacing = {
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  48: '48px',
} as const;

// ─── Transitions ───────────────────────────────────────────────────
export const transitions = {
  /** Default micro-interaction curve */
  default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ─── Aggregate Export ──────────────────────────────────────────────
export const theme = {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  radii,
  shadows,
  spacing,
  transitions,
} as const;

export type Theme = typeof theme;

export default theme;
