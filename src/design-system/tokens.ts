export const designSystem = {
  colors: {
    page: '#061126',
    pageGlow: '#12254d',
    sidebar: '#091120',
    card: 'rgba(11, 24, 48, 0.86)',
    cardElevated: 'rgba(17, 34, 68, 0.92)',
    cardSoft: 'rgba(15, 28, 57, 0.7)',
    accent: '#3291ff',
    accentSoft: 'rgba(50, 145, 255, 0.18)',
    cyan: '#38bdf8',
    mint: '#2dd4bf',
    gold: '#fbbf24',
    coral: '#fb7185',
    violet: '#a78bfa',
    textPrimary: '#f5f7ff',
    textSecondary: '#d9e2ff',
    textMuted: '#8fa0c4',
    border: 'rgba(148, 163, 184, 0.18)',
    borderStrong: 'rgba(96, 165, 250, 0.24)',
    grid: 'rgba(115, 130, 164, 0.18)',
  },
  typography: {
    display: '"Space Grotesk", "Segoe UI", sans-serif',
    body: '"Manrope", "Segoe UI", sans-serif',
    mono: '"IBM Plex Mono", "Consolas", monospace',
  },
  radii: {
    sm: '14px',
    md: '20px',
    lg: '28px',
    pill: '999px',
  },
  shadows: {
    soft: '0 24px 48px rgba(1, 7, 18, 0.28)',
    strong: '0 28px 70px rgba(1, 7, 18, 0.45)',
  },
  chartPalette: ['#3291ff', '#38bdf8', '#2dd4bf', '#fbbf24', '#fb7185', '#a78bfa'],
} as const

export const rangeOptions = ['1D', '1W', '1M', '1Q'] as const
export const portfolioOptions = [
  'All mandates',
  'Income Focus',
  'Balanced Core',
  'Opportunistic',
] as const
export const alertFilters = ['All', 'Funding', 'Trading', 'Risk'] as const

export type TimeRange = (typeof rangeOptions)[number]
export type PortfolioKey = (typeof portfolioOptions)[number]
export type AlertFilter = (typeof alertFilters)[number]
