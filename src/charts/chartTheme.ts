import { Brand, Surface } from '../theme/enums';

export type ChartSemanticTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'quinary'
  | 'neutral'
  | 'muted'
  | 'positive'
  | 'negative';

export interface ChartTheme {
  brand: Brand;
  surface: Surface;
  fontSans: string;
  barRadius: number;
  background: string;
  inkDark: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  divider: string;
  gridLine: string;
  callout: string;
  positive: string;
  negative: string;
  neutral: string;
  muted: string;
  hoverTint: string;
  series: readonly [string, string, string, string, string];
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  tooltipShadow: string;
}

const CHART_THEMES: Record<Brand, Record<Surface, ChartTheme>> = {
  [Brand.McKinsey]: {
    [Surface.Light]: {
      brand: Brand.McKinsey,
      surface: Surface.Light,
      fontSans:
        "'McKinsey Sans', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      barRadius: 0,
      background: '#ffffff',
      inkDark: '#051c2c',
      textPrimary: '#051c2c',
      textSecondary: '#22384a',
      textMuted: '#526475',
      border: '#d0d7de',
      borderStrong: '#051c2c',
      divider: '#ffffff',
      gridLine: '#e4e9ef',
      callout: '#051c2c',
      positive: '#0f6b48',
      negative: '#b81414',
      neutral: '#b3b3b3',
      muted: '#dce2e8',
      hoverTint: 'rgba(5, 28, 44, 0.04)',
      series: ['#2251ff', '#061f79', '#00a9f4', '#051c2c', '#6e8497'],
      tooltipBg: '#051c2c',
      tooltipBorder: '#051c2c',
      tooltipText: '#f7f9fc',
      tooltipShadow: '0 8px 24px rgba(5, 28, 44, 0.18)',
    },
    [Surface.Dark]: {
      brand: Brand.McKinsey,
      surface: Surface.Dark,
      fontSans:
        "'McKinsey Sans', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      barRadius: 0,
      background: '#051c2c',
      inkDark: '#051c2c',
      textPrimary: '#f7f9fc',
      textSecondary: '#d4e0ec',
      textMuted: '#8fa6bc',
      border: 'rgba(255, 255, 255, 0.16)',
      borderStrong: 'rgba(255, 255, 255, 0.72)',
      divider: '#051c2c',
      gridLine: 'rgba(255, 255, 255, 0.14)',
      callout: '#f7f9fc',
      positive: '#6de2a7',
      negative: '#ff8080',
      neutral: '#50667b',
      muted: '#1b3b57',
      hoverTint: 'rgba(255, 255, 255, 0.05)',
      series: ['#4c76ff', '#00b4ff', '#8cb0ff', '#244a9a', '#8fa6bc'],
      tooltipBg: '#0b2940',
      tooltipBorder: 'rgba(255, 255, 255, 0.24)',
      tooltipText: '#f7f9fc',
      tooltipShadow: '0 12px 28px rgba(0, 0, 0, 0.44)',
    },
  },
  [Brand.BCG]: {
    [Surface.Light]: {
      brand: Brand.BCG,
      surface: Surface.Light,
      fontSans:
        "'Henderson BCG Sans', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      barRadius: 4,
      background: '#ffffff',
      inkDark: '#0e3b2c',
      textPrimary: '#111a16',
      textSecondary: '#2c3e35',
      textMuted: '#52665c',
      border: '#d2e0d8',
      borderStrong: '#147b58',
      divider: '#ffffff',
      gridLine: '#dfeae4',
      callout: '#0e3b2c',
      positive: '#0f6b48',
      negative: '#b81414',
      neutral: '#becbc4',
      muted: '#e3eee8',
      hoverTint: 'rgba(14, 59, 44, 0.04)',
      series: ['#147b58', '#0e3b2c', '#29ba74', '#5a967e', '#88b9a5'],
      tooltipBg: '#0e3b2c',
      tooltipBorder: '#147b58',
      tooltipText: '#f3faf6',
      tooltipShadow: '0 8px 24px rgba(14, 59, 44, 0.16)',
    },
    [Surface.Dark]: {
      brand: Brand.BCG,
      surface: Surface.Dark,
      fontSans:
        "'Henderson BCG Sans', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      barRadius: 4,
      background: '#0b291e',
      inkDark: '#0b291e',
      textPrimary: '#f3faf6',
      textSecondary: '#cde4d7',
      textMuted: '#8fb4a2',
      border: 'rgba(255, 255, 255, 0.16)',
      borderStrong: '#29ba74',
      divider: '#0b291e',
      gridLine: 'rgba(255, 255, 255, 0.14)',
      callout: '#f3faf6',
      positive: '#6de2a7',
      negative: '#ff8080',
      neutral: '#3d5d4e',
      muted: '#164030',
      hoverTint: 'rgba(255, 255, 255, 0.05)',
      series: ['#29ba74', '#6ce3a5', '#1a8a5e', '#9cecc2', '#78a590'],
      tooltipBg: '#123a2b',
      tooltipBorder: '#29ba74',
      tooltipText: '#f3faf6',
      tooltipShadow: '0 12px 28px rgba(0, 0, 0, 0.44)',
    },
  },
  [Brand.Bain]: {
    [Surface.Light]: {
      brand: Brand.Bain,
      surface: Surface.Light,
      fontSans:
        "'Graphik', 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      barRadius: 1.5,
      background: '#ffffff',
      inkDark: '#1c1c1c',
      textPrimary: '#222222',
      textSecondary: '#3d3d3d',
      textMuted: '#626262',
      border: '#d9d9d9',
      borderStrong: '#222222',
      divider: '#ffffff',
      gridLine: '#e5e5e5',
      callout: '#222222',
      positive: '#0f6b48',
      negative: '#b81414',
      neutral: '#c2c2c2',
      muted: '#eaeaea',
      hoverTint: 'rgba(34, 34, 34, 0.04)',
      series: ['#cc0000', '#222222', '#7f1d1d', '#5c5c5c', '#8e8e8e'],
      tooltipBg: '#1c1c1c',
      tooltipBorder: '#cc0000',
      tooltipText: '#f7f7f7',
      tooltipShadow: '0 8px 24px rgba(28, 28, 28, 0.18)',
    },
    [Surface.Dark]: {
      brand: Brand.Bain,
      surface: Surface.Dark,
      fontSans:
        "'Graphik', 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      barRadius: 1.5,
      background: '#181818',
      inkDark: '#181818',
      textPrimary: '#f5f5f5',
      textSecondary: '#d4d4d4',
      textMuted: '#a1a1a1',
      border: 'rgba(255, 255, 255, 0.16)',
      borderStrong: 'rgba(255, 255, 255, 0.72)',
      divider: '#181818',
      gridLine: 'rgba(255, 255, 255, 0.14)',
      callout: '#f5f5f5',
      positive: '#6de2a7',
      negative: '#ff8080',
      neutral: '#4f4f4f',
      muted: '#2c2c2c',
      hoverTint: 'rgba(255, 255, 255, 0.05)',
      series: ['#e62020', '#f5f5f5', '#ff7070', '#999999', '#666666'],
      tooltipBg: '#242424',
      tooltipBorder: '#e62020',
      tooltipText: '#f5f5f5',
      tooltipShadow: '0 12px 28px rgba(0, 0, 0, 0.44)',
    },
  },
};

export function getChartTheme(brand: Brand, surface: Surface): ChartTheme {
  return CHART_THEMES[brand][surface];
}

export function resolveChartThemeFromElement(
  el: HTMLElement | null,
  brand: Brand,
  surface: Surface,
): ChartTheme {
  const base = CHART_THEMES[brand][surface];
  if (!el || typeof window === 'undefined' || !window.getComputedStyle) {
    return base;
  }
  const styles = window.getComputedStyle(el);
  const read = (token: string, fallback: string) => {
    const val = styles.getPropertyValue(token).trim();
    return val || fallback;
  };
  return {
    ...base,
    fontSans: read('--mbb-font-sans', base.fontSans),
    background: read('--mbb-bg-canvas', base.background),
    textPrimary: read('--mbb-text-primary', base.textPrimary),
    textSecondary: read('--mbb-text-secondary', base.textSecondary),
    textMuted: read('--mbb-text-muted', base.textMuted),
    border: read('--mbb-border', base.border),
    borderStrong: read('--mbb-border-strong', base.borderStrong),
    divider: read('--mbb-chart-divider', base.divider),
    gridLine: read('--mbb-chart-grid', base.gridLine),
    callout: read('--mbb-chart-callout', base.callout),
    positive: read('--mbb-positive-text', base.positive),
    negative: read('--mbb-negative-text', base.negative),
    neutral: read('--mbb-chart-neutral', base.neutral),
    muted: read('--mbb-chart-muted', base.muted),
    series: [
      read('--mbb-chart-1', base.series[0]),
      read('--mbb-chart-2', base.series[1]),
      read('--mbb-chart-3', base.series[2]),
      read('--mbb-chart-4', base.series[3]),
      read('--mbb-chart-5', base.series[4]),
    ],
  };
}

export function resolveToneColor(
  theme: ChartTheme,
  tone?: ChartSemanticTone,
  fallbackIndex = 0,
): string {
  switch (tone) {
    case 'primary':
      return theme.series[0];
    case 'secondary':
      return theme.series[1];
    case 'tertiary':
      return theme.series[2];
    case 'quaternary':
      return theme.series[3];
    case 'quinary':
      return theme.series[4];
    case 'neutral':
      return theme.neutral;
    case 'muted':
      return theme.muted;
    case 'positive':
      return theme.positive;
    case 'negative':
      return theme.negative;
    default:
      return theme.series[fallbackIndex % theme.series.length];
  }
}

export function getContrastTextColor(
  hexColor: string,
  darkTextFallback = '#111a16',
): string {
  const cleaned = hexColor.replace('#', '');
  if (cleaned.length !== 6) return '#ffffff';
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? darkTextFallback : '#ffffff';
}

export function escapeHtml(raw: string): string {
  return raw
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildTooltipBase(theme: ChartTheme, enabled = true) {
  return {
    show: enabled,
    confine: true,
    backgroundColor: theme.tooltipBg,
    borderColor: theme.tooltipBorder,
    borderWidth: 1,
    padding: [10, 12],
    textStyle: {
      color: theme.tooltipText,
      fontFamily: theme.fontSans,
      fontSize: 12,
      lineHeight: 18,
    },
    extraCssText: `border-radius: ${theme.barRadius}px; box-shadow: ${theme.tooltipShadow};`,
  };
}
