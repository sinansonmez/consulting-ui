import type { ChartTheme } from './chartTheme';

export type DeltaPolarity = 'pos' | 'neg' | 'flat';

export function defaultFormatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

export function classifyDelta(
  delta: number | string | undefined,
): DeltaPolarity {
  if (delta === undefined) return 'flat';
  if (typeof delta === 'number') {
    if (delta > 0) return 'pos';
    if (delta < 0) return 'neg';
    return 'flat';
  }
  const trimmed = delta.trim();
  if (trimmed.startsWith('+')) return 'pos';
  if (trimmed.startsWith('-') || trimmed.startsWith('−')) return 'neg';
  return 'flat';
}

export function buildDeltaRightAxis(
  labels: readonly string[],
  polarities: readonly DeltaPolarity[],
  chartTheme: ChartTheme,
  columnLabel?: string,
) {
  return {
    type: 'category' as const,
    position: 'right' as const,
    inverse: true,
    data: [...labels],
    name: columnLabel ?? '',
    nameLocation: 'start' as const,
    nameGap: 10,
    nameTextStyle: {
      color: chartTheme.textMuted,
      fontFamily: chartTheme.fontSans,
      fontSize: 11,
      fontWeight: 700,
      align: 'left' as const,
      padding: [0, 0, 0, 14],
    },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      margin: 14,
      fontFamily: chartTheme.fontSans,
      fontSize: 12,
      formatter: (val: string, idx: number) => {
        if (!val) return '';
        const kind = polarities[idx] ?? 'flat';
        return `{${kind}|${val}}`;
      },
      rich: {
        pos: {
          color: chartTheme.positive,
          fontWeight: 700,
          fontFamily: chartTheme.fontSans,
          fontSize: 12,
        },
        neg: {
          color: chartTheme.negative,
          fontWeight: 700,
          fontFamily: chartTheme.fontSans,
          fontSize: 12,
        },
        flat: {
          color: chartTheme.textMuted,
          fontWeight: 600,
          fontFamily: chartTheme.fontSans,
          fontSize: 12,
        },
      },
    },
  };
}

export function buildInlineLegend(
  chartTheme: ChartTheme,
  items?: readonly string[],
  icon: 'rect' | 'circle' = 'rect',
) {
  return {
    show: true,
    top: 0,
    left: 0,
    icon,
    itemWidth: 11,
    itemHeight: 11,
    itemGap: 18,
    ...(items ? { data: [...items] } : {}),
    textStyle: {
      color: chartTheme.textSecondary,
      fontFamily: chartTheme.fontSans,
      fontSize: 12,
      fontWeight: 500,
    },
  };
}

export function buildAxisPointerShadow(chartTheme: ChartTheme) {
  return {
    type: 'shadow' as const,
    shadowStyle: {
      color: chartTheme.hoverTint,
    },
  };
}
