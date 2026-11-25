import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts';
import { Brand, ComboChartStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import {
  buildTooltipBase,
  escapeHtml,
  getContrastTextColor,
  resolveToneColor,
  type ChartSemanticTone,
  type ChartTheme,
} from '../../charts/chartTheme';
import {
  buildAxisPointerShadow,
  buildInlineLegend,
} from '../../charts/chartHelpers';
import { EChartsCanvas } from '../../charts/EChartsCanvas';
import type { ConsultingChartOption } from '../../charts/echartsCore';

export interface ComboBarSeriesSpec {
  id: string;
  label: string;
  values: readonly number[];
  tone?: ChartSemanticTone;
}

export interface ComboLineSeriesSpec {
  id: string;
  label: string;
  values: readonly (number | null)[];
  tone?: ChartSemanticTone;
}

export interface ComboChartProps {
  periods: readonly string[];
  barSeries: readonly ComboBarSeriesSpec[];
  lineSeries: readonly ComboLineSeriesSpec[];
  style?: ComboChartStyle;
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  barAxisLabel?: string;
  lineAxisLabel?: string;
  formatBarValue?: (value: number) => string;
  formatLineValue?: (value: number) => string;
  ariaLabel?: string;
  onSelectPeriod?: (period: string, index: number) => void;
}

export function ComboChart({
  periods,
  barSeries,
  lineSeries,
  style = ComboChartStyle.BarLine,
  brand,
  surface,
  height,
  showTooltip = true,
  barAxisLabel,
  lineAxisLabel,
  formatBarValue = (v) => String(v),
  formatLineValue,
  ariaLabel = 'Dual-axis bar and line combination chart',
  onSelectPeriod,
}: ComboChartProps) {
  const theme = useResolvedTheme(brand, surface);
  const resolvedHeight = height ?? 320;
  const isStacked = style === ComboChartStyle.StackedLine;
  const isDualAxis = style !== ComboChartStyle.Indexed;
  const fmtLine = useMemo(
    () =>
      formatLineValue ?? (isDualAxis ? (v: number) => `${v}%` : formatBarValue),
    [formatBarValue, formatLineValue, isDualAxis],
  );

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const r = chartTheme.barRadius;
      const echartsSeries: Array<BarSeriesOption | LineSeriesOption> = [];

      // Bars
      barSeries.forEach((spec, idx) => {
        const fill = resolveToneColor(
          chartTheme,
          spec.tone ?? (idx === 0 ? 'neutral' : 'secondary'),
          idx,
        );
        const contrast = getContrastTextColor(fill, chartTheme.inkDark);
        const isTopStack = idx === barSeries.length - 1;

        echartsSeries.push({
          type: 'bar',
          name: spec.label,
          yAxisIndex: 0,
          stack: isStacked ? 'combo_bars' : undefined,
          barMaxWidth: 42,
          itemStyle: {
            color: fill,
            borderRadius: isStacked
              ? isTopStack
                ? [r, r, 0, 0]
                : [0, 0, 0, 0]
              : [r, r, 0, 0],
            borderColor: isStacked ? chartTheme.divider : 'transparent',
            borderWidth: isStacked ? 1 : 0,
          },
          emphasis: { focus: 'series' },
          label: {
            show: !isStacked || barSeries.length <= 2,
            position: isStacked ? 'inside' : 'insideBottom',
            distance: isStacked ? 0 : 8,
            color: contrast,
            fontFamily: chartTheme.fontSans,
            fontSize: 11.5,
            fontWeight: 700,
            formatter: (params: unknown) => {
              const val = Number((params as { value?: number }).value ?? 0);
              return formatBarValue(val);
            },
          },
          data: [...spec.values],
        });
      });

      // Overlaid lines
      lineSeries.forEach((spec, idx) => {
        const color = resolveToneColor(
          chartTheme,
          spec.tone ?? (idx === 0 ? 'primary' : 'tertiary'),
          idx,
        );
        echartsSeries.push({
          type: 'line',
          name: spec.label,
          yAxisIndex: isDualAxis ? 1 : 0,
          symbol: 'circle',
          symbolSize: 8,
          z: 5,
          lineStyle: {
            color,
            width: 2.75,
          },
          itemStyle: {
            color,
            borderColor: chartTheme.background,
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'top',
            distance: 8,
            color,
            fontFamily: chartTheme.fontSans,
            fontSize: 12,
            fontWeight: 700,
            formatter: (params: unknown) => {
              const raw = (params as { value?: number | null }).value;
              if (raw === null || raw === undefined) return '';
              return fmtLine(raw);
            },
          },
          data: [...spec.values],
        });
      });

      const yAxes: ConsultingChartOption['yAxis'] = [
        {
          type: 'value',
          name: barAxisLabel ?? '',
          nameLocation: 'end',
          nameGap: 14,
          nameTextStyle: {
            color: chartTheme.textMuted,
            fontFamily: chartTheme.fontSans,
            fontSize: 11,
            fontWeight: 600,
            align: 'left',
          },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: { color: chartTheme.gridLine, width: 1 },
          },
          axisLabel: {
            color: chartTheme.textMuted,
            fontFamily: chartTheme.fontSans,
            fontSize: 11.5,
            formatter: (v: number) => formatBarValue(v),
          },
        },
      ];

      if (isDualAxis) {
        const allLineVals = lineSeries
          .flatMap((s) => s.values)
          .filter((v): v is number => v !== null);
        const minL = allLineVals.length > 0 ? Math.min(...allLineVals) : 0;
        const maxL = allLineVals.length > 0 ? Math.max(...allLineVals) : 100;
        const spanL = maxL - minL || 1;
        yAxes.push({
          type: 'value',
          position: 'right',
          min: Math.floor(Math.min(0, minL - spanL * 0.25)),
          max: Math.ceil(maxL + spanL * 0.3),
          name: lineAxisLabel ?? '',
          nameLocation: 'end',
          nameGap: 14,
          nameTextStyle: {
            color: chartTheme.textMuted,
            fontFamily: chartTheme.fontSans,
            fontSize: 11,
            fontWeight: 600,
            align: 'right',
          },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            color: chartTheme.textMuted,
            fontFamily: chartTheme.fontSans,
            fontSize: 11.5,
            formatter: (v: number) => fmtLine(v),
          },
        });
      }

      const legendNames = [
        ...barSeries.map((b) => b.label),
        ...lineSeries.map((l) => l.label),
      ];

      return {
        animationDuration: 360,
        animationEasing: 'cubicOut',
        grid: {
          left: 56,
          right: isDualAxis ? 58 : 24,
          top: barAxisLabel || lineAxisLabel ? 58 : 44,
          bottom: 32,
          containLabel: false,
        },
        legend: buildInlineLegend(chartTheme, legendNames, 'rect'),
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'axis',
          axisPointer: buildAxisPointerShadow(chartTheme),
          formatter: (params: unknown) => {
            const list = Array.isArray(params) ? params : [params];
            const first = list[0] as { dataIndex?: number } | undefined;
            const pIdx = first?.dataIndex ?? 0;
            const period = periods[pIdx] ?? '';
            const lines: string[] = [
              `<div style="font-weight:700;margin-bottom:4px;">${escapeHtml(period)}</div>`,
            ];
            barSeries.forEach((spec, idx) => {
              const v = spec.values[pIdx] ?? 0;
              const swatch = resolveToneColor(
                chartTheme,
                spec.tone ?? (idx === 0 ? 'neutral' : 'secondary'),
                idx,
              );
              lines.push(
                `<div><span style="display:inline-block;width:8px;height:8px;background:${swatch};margin-right:6px;"></span>${escapeHtml(spec.label)}: <strong>${escapeHtml(formatBarValue(v))}</strong></div>`,
              );
            });
            lineSeries.forEach((spec, idx) => {
              const v = spec.values[pIdx];
              if (v === null || v === undefined) return;
              const swatch = resolveToneColor(
                chartTheme,
                spec.tone ?? (idx === 0 ? 'primary' : 'tertiary'),
                idx,
              );
              lines.push(
                `<div><span style="display:inline-block;width:8px;height:8px;border-radius:999px;background:${swatch};margin-right:6px;"></span>${escapeHtml(spec.label)}: <strong>${escapeHtml(fmtLine(v))}</strong></div>`,
              );
            });
            return lines.join('');
          },
        },
        xAxis: {
          type: 'category',
          data: [...periods],
          axisLine: {
            show: true,
            lineStyle: { color: chartTheme.borderStrong, width: 1 },
          },
          axisTick: { show: false },
          axisLabel: {
            color: chartTheme.textPrimary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12,
            fontWeight: 600,
            margin: 10,
          },
        },
        yAxis: yAxes,
        series: echartsSeries,
      };
    },
    [
      barAxisLabel,
      barSeries,
      fmtLine,
      formatBarValue,
      isDualAxis,
      isStacked,
      lineAxisLabel,
      lineSeries,
      periods,
      showTooltip,
    ],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectPeriod) return;
    const period = periods[event.dataIndex];
    if (period !== undefined) onSelectPeriod(period, event.dataIndex);
  };

  return (
    <EChartsCanvas
      buildOption={buildOption}
      height={resolvedHeight}
      brand={theme.brand}
      surface={theme.surface}
      styleVariant={style}
      ariaLabel={ariaLabel}
      onElementClick={onSelectPeriod ? handleElementClick : undefined}
    />
  );
}
