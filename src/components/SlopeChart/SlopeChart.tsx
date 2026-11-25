import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import type { LineSeriesOption } from 'echarts/charts';
import { Brand, SlopeChartStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import {
  buildTooltipBase,
  escapeHtml,
  resolveToneColor,
  type ChartSemanticTone,
  type ChartTheme,
} from '../../charts/chartTheme';
import { defaultFormatDelta } from '../../charts/chartHelpers';
import { EChartsCanvas } from '../../charts/EChartsCanvas';
import type { ConsultingChartOption } from '../../charts/echartsCore';

export interface SlopeSeriesSpec {
  id: string;
  label: string;
  values: readonly number[];
  highlighted?: boolean;
  tone?: ChartSemanticTone;
}

export interface SlopeChartProps {
  periods: readonly string[];
  series: readonly SlopeSeriesSpec[];
  style?: SlopeChartStyle;
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  formatDelta?: (delta: number) => string;
  ariaLabel?: string;
  onSelectSeries?: (series: SlopeSeriesSpec) => void;
}

export function SlopeChart({
  periods,
  series,
  style = SlopeChartStyle.BeforeAfter,
  brand,
  surface,
  height,
  showTooltip = true,
  formatValue,
  formatDelta = defaultFormatDelta,
  ariaLabel = 'Before-and-after slope shift chart',
  onSelectSeries,
}: SlopeChartProps) {
  const theme = useResolvedTheme(brand, surface);
  const isRankShift = style === SlopeChartStyle.RankShift;
  const isIndexed = style === SlopeChartStyle.Indexed;

  const fmtVal = useMemo(
    () =>
      formatValue ??
      ((v: number) => (isRankShift ? `#${Math.round(v)}` : String(v))),
    [formatValue, isRankShift],
  );

  const resolvedHeight = height ?? Math.max(260, series.length * 44 + 66);

  const { yMin, yMax } = useMemo(() => {
    const all = series.flatMap((s) => [...s.values]);
    if (all.length === 0) return { yMin: 0, yMax: 100 };
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    if (isRankShift) {
      return { yMin: Math.max(1, lo) - 0.4, yMax: hi + 0.4 };
    }
    const span = hi - lo || 1;
    return { yMin: lo - span * 0.14, yMax: hi + span * 0.14 };
  }, [isRankShift, series]);

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const anyHighlighted = series.some((s) => s.highlighted);
      const lastPeriodIdx = Math.max(0, periods.length - 1);

      const maxLabelLen = Math.max(8, ...series.map((s) => s.label.length));
      const leftPad = Math.min(188, Math.max(108, maxLabelLen * 7.2 + 44));
      const rightPad = Math.min(
        228,
        Math.max(122, maxLabelLen * 7.2 + (isIndexed ? 92 : 48)),
      );

      const echartsSeries: LineSeriesOption[] = series.map((spec, idx) => {
        const startVal = spec.values[0] ?? 0;
        const endVal = spec.values[lastPeriodIdx] ?? startVal;
        const delta = endVal - startVal;
        const isImproved = isRankShift ? endVal < startVal : endVal > startVal;

        const color = spec.tone
          ? resolveToneColor(chartTheme, spec.tone, idx)
          : anyHighlighted
            ? spec.highlighted
              ? chartTheme.series[0]
              : chartTheme.neutral
            : isImproved
              ? chartTheme.series[0]
              : chartTheme.neutral;

        const isEmphasized = spec.highlighted || (!anyHighlighted && isImproved);
        const deltaStr = formatDelta(delta);
        const deltaKind =
          delta === 0
            ? 'flat'
            : isImproved
              ? 'pos'
              : 'neg';

        return {
          type: 'line',
          name: spec.label,
          smooth: isRankShift ? 0.25 : 0,
          symbol: 'circle',
          symbolSize: isEmphasized ? 9 : 7,
          z: isEmphasized ? 4 : 2,
          lineStyle: {
            color,
            width: isEmphasized ? 3 : 1.75,
            opacity: anyHighlighted && !spec.highlighted ? 0.65 : 1,
          },
          itemStyle: {
            color,
            borderColor: chartTheme.background,
            borderWidth: 1.5,
          },
          emphasis: {
            focus: 'series',
            lineStyle: { width: 3.5 },
          },
          labelLayout: {
            moveOverlap: 'shiftY',
          },
          data: spec.values.map((val, pIdx) => {
            if (pIdx === 0) {
              return {
                value: val,
                label: {
                  show: true,
                  position: 'left' as const,
                  distance: 10,
                  formatter: `{lbl|${spec.label}\u00A0\u00A0}{val|${fmtVal(val)}}`,
                  rich: {
                    lbl: {
                      color: isEmphasized
                        ? chartTheme.textPrimary
                        : chartTheme.textSecondary,
                      fontFamily: chartTheme.fontSans,
                      fontSize: 12,
                      fontWeight: isEmphasized ? 700 : 500,
                    },
                    val: {
                      color: isEmphasized ? color : chartTheme.textMuted,
                      fontFamily: chartTheme.fontSans,
                      fontSize: 12,
                      fontWeight: 700,
                    },
                  },
                },
              };
            }
            if (pIdx === lastPeriodIdx) {
              const suffix = isIndexed
                ? `  {${deltaKind}|${deltaStr}}`
                : '';
              return {
                value: val,
                label: {
                  show: true,
                  position: 'right' as const,
                  distance: 10,
                  formatter: `{val|${fmtVal(val)}}${suffix}  {lbl|${spec.label}}`,
                  rich: {
                    val: {
                      color: isEmphasized ? color : chartTheme.textSecondary,
                      fontFamily: chartTheme.fontSans,
                      fontSize: 12,
                      fontWeight: 700,
                    },
                    lbl: {
                      color: isEmphasized
                        ? chartTheme.textPrimary
                        : chartTheme.textSecondary,
                      fontFamily: chartTheme.fontSans,
                      fontSize: 12,
                      fontWeight: isEmphasized ? 700 : 500,
                    },
                    pos: {
                      color: chartTheme.positive,
                      fontFamily: chartTheme.fontSans,
                      fontSize: 11.5,
                      fontWeight: 700,
                    },
                    neg: {
                      color: chartTheme.negative,
                      fontFamily: chartTheme.fontSans,
                      fontSize: 11.5,
                      fontWeight: 700,
                    },
                    flat: {
                      color: chartTheme.textMuted,
                      fontFamily: chartTheme.fontSans,
                      fontSize: 11.5,
                      fontWeight: 600,
                    },
                  },
                },
              };
            }
            return {
              value: val,
              label: { show: false },
            };
          }) as NonNullable<LineSeriesOption['data']>,
        };
      });

      return {
        animationDuration: 360,
        animationEasing: 'cubicOut',
        grid: {
          left: leftPad,
          right: rightPad,
          top: 40,
          bottom: 18,
          containLabel: false,
        },
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'item',
          formatter: (params: unknown) => {
            const p = params as { seriesIndex?: number };
            const spec = series[p.seriesIndex ?? 0];
            if (!spec) return '';
            const startVal = spec.values[0] ?? 0;
            const endVal = spec.values[lastPeriodIdx] ?? startVal;
            const delta = endVal - startVal;
            const trajectory = periods
              .map(
                (period, i) =>
                  `<div>${escapeHtml(period)}: <strong>${escapeHtml(fmtVal(spec.values[i] ?? 0))}</strong></div>`,
              )
              .join('');
            return `
              <div style="font-weight:700;margin-bottom:4px;">${escapeHtml(spec.label)}</div>
              ${trajectory}
              <div style="border-top:1px solid rgba(255,255,255,0.16);margin-top:4px;padding-top:4px;">Shift: <strong>${escapeHtml(formatDelta(delta))}</strong></div>
            `;
          },
        },
        xAxis: {
          type: 'category',
          position: 'top',
          boundaryGap: false,
          data: [...periods],
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: {
              color: chartTheme.border,
              width: 1,
            },
          },
          axisLabel: {
            color: chartTheme.textPrimary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12.5,
            fontWeight: 700,
            margin: 14,
          },
        },
        yAxis: {
          type: 'value',
          inverse: isRankShift,
          min: yMin,
          max: yMax,
          show: false,
        },
        series: echartsSeries,
      };
    },
    [
      fmtVal,
      formatDelta,
      isIndexed,
      isRankShift,
      periods,
      series,
      showTooltip,
      yMax,
      yMin,
    ],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectSeries) return;
    const spec = series[event.seriesIndex ?? -1];
    if (spec) onSelectSeries(spec);
  };

  return (
    <EChartsCanvas
      buildOption={buildOption}
      height={resolvedHeight}
      brand={theme.brand}
      surface={theme.surface}
      styleVariant={style}
      ariaLabel={ariaLabel}
      onElementClick={onSelectSeries ? handleElementClick : undefined}
    />
  );
}
