/**
 * Canonical design tokens for INSAFCHAIN web frontend.
 * Color values are kept in sync with D App/mobile/src/theme/tokens.ts
 * — if you change a value here, update the mobile file too.
 *
 * These tokens are:
 *  1. Applied as CSS custom properties in index.css (:root / .dark)
 *  2. Exposed via ThemeContext so components can read them in JS
 *  3. Used by Tailwind v4 @theme block for custom utility generation
 */

export const lightTokens = {
  // Backgrounds
  bg:             '#f4fbf6',
  bgDeep:         '#ecfdf3',
  bgElevated:     '#ffffff',
  surface:        '#e8f8ee',
  surfaceStrong:  '#ffffff',

  // Brand (primary green)
  primary:        '#15803d',
  primaryDim:     'rgba(21, 128, 61, 0.4)',
  secondary:      '#14532d',

  // Semantic
  danger:         '#ef4444',
  warning:        '#ca8a04',
  success:        '#166534',

  // Text
  text:           '#0f172a',
  textMuted:      '#475569',
  textDim:        '#64748b',

  // Borders
  border:         'rgba(21, 128, 61, 0.35)',
  borderSoft:     'rgba(15, 23, 42, 0.08)',

  // CTA card tint
  ctaCardBg:      '#d1fae5',
  ctaCardBorder:  'rgba(21, 128, 61, 0.28)',

  // Radius (CSS string form for web)
  radiusLg:       '18px',
  radiusMd:       '14px',
  radiusPill:     '999px',
};

export const darkTokens = {
  // Backgrounds
  bg:             '#0a0f1a',
  bgDeep:         '#060912',
  bgElevated:     '#111827',
  surface:        '#152238',
  surfaceStrong:  '#1e293b',

  // Brand (bright lime green for dark-mode contrast)
  primary:        '#4ade80',
  primaryDim:     'rgba(74, 222, 128, 0.4)',
  secondary:      '#86efac',

  // Semantic
  danger:         '#f87171',
  warning:        '#fbbf24',
  success:        '#4ade80',

  // Text
  text:           '#f1f5f9',
  textMuted:      '#94a3b8',
  textDim:        '#64748b',

  // Borders
  border:         'rgba(74, 222, 128, 0.35)',
  borderSoft:     'rgba(148, 163, 184, 0.14)',

  // CTA card tint
  ctaCardBg:      '#14532d',
  ctaCardBorder:  'rgba(74, 222, 128, 0.35)',

  // Radius (CSS string form for web)
  radiusLg:       '18px',
  radiusMd:       '14px',
  radiusPill:     '999px',
};
