import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import type { BarSeriesOption } from 'echarts/charts';
import { Brand, StackedBarStyle, Surface } from '../../theme/enums';
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

export interface StackedBarSegmentSpec {
  id: string;
  label: string;
  tone?: ChartSemanticTone;
  polarity?: 'positive' | 'negative';
}

export interface StackedBarCategory {
  id: string;
  label: string;
  values: readonly number[];
}

export interface StackedBarSelection {
  category: StackedBarCategory;
  series: StackedBarSegmentSpec;
  value: number;
  sharePct: number;
}

export interface StackedBarChartProps {
  categories: readonly StackedBarCategory[];
  series: readonly StackedBarSegmentSpec[];
  style?: StackedBarStyle;
  orientation?: 'horizontal' | 'vertical';
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  minLabelPercent?: number;
  ariaLabel?: string;
  onSelectSegment?: (selection: StackedBarSelection) => void;
}

export function StackedBarChart({
  categories,
  series,
  style = StackedBarStyle.Proportional,
  orientation = 'horizontal',
  brand,
  surface,
  height,
  showTooltip = true,
  formatValue = (v) => String(v),
  minLabelPercent = 7,
  ariaLabel = 'Stacked composition bar chart',
  onSelectSegment,
}: StackedBarChartProps) {
  const theme = useResolvedTheme(brand, surface);
  const isVertical =
    orientation === 'vertical' && style !== StackedBarStyle.Diverging;

  const rowTotals = useMemo(
    () =>
      categories.map((cat) =>
        cat.values.reduce((acc, v) => acc + Math.abs(v), 0),
      ),
    [categories],
  );

  const resolvedHeight =
    height ??
    (isVertical ? 310 : Math.max(200, categories.length * 48 + 64));

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const categoryNames = categories.map((c) => c.label);
      const maxLabelLen = Math.max(8, ...categoryNames.map((c) => c.length));
      const leftPad = isVertical
        ? 24
        : Math.min(196, Math.max(108, maxLabelLen * 7.2 + 16));
      const rightPad =
        !isVertical && style === StackedBarStyle.Absolute ? 68 : 20;

      const echartsSeries: BarSeriesOption[] = series.map((spec, sIdx) => {
        const fill = resolveToneColor(chartTheme, spec.tone, sIdx);
        const contrastText = getContrastTextColor(fill, chartTheme.textPrimary);
        const isNegativeStack =
          style === StackedBarStyle.Diverging && spec.polarity === 'negative';

        return {
          type: 'bar',
          name: spec.label,
          stack:
            style === StackedBarStyle.Diverging
              ? isNegativeStack
                ? 'neg'
                : 'pos'
              : 'total',
          barMaxWidth: isVertical ? 54 : 30,
          itemStyle: {
            color: fill,
            borderColor: chartTheme.divider,
            borderWidth: 1,
          },
          emphasis: { focus: 'series' },
          label: {
            show: true,
            position: 'inside',
            color: contrastText,
            fontFamily: chartTheme.fontSans,
            fontSize: 12,
            fontWeight: 700,
            formatter: (params: unknown) => {
              const p = params as { dataIndex?: number };
              const cIdx = p.dataIndex ?? 0;
              const raw = categories[cIdx]?.values[sIdx] ?? 0;
              const total = rowTotals[cIdx] || 1;
              const share = (Math.abs(raw) / total) * 100;
              if (share < minLabelPercent) return '';
              if (
                style === StackedBarStyle.Proportional ||
                style === StackedBarStyle.Diverging
              ) {
                return `${Math.round(share)}%`;
              }
              return formatValue(Math.abs(raw));
            },
          },
          markLine:
            sIdx === 0 && style === StackedBarStyle.Diverging
              ? {
                  symbol: 'none',
                  silent: true,
                  lineStyle: {
                    color: chartTheme.borderStrong,
                    width: 1.25,
                  },
                  label: {
                    show: true,
                    formatter: '0%',
                    position: 'start',
                    color: chartTheme.textMuted,
                    fontFamily: chartTheme.fontSans,
                    fontSize: 11,
                    fontWeight: 600,
                  },
                  data: [{ xAxis: 0 }],
                }
              : undefined,
          data: categories.map((cat, cIdx) => {
            const raw = cat.values[sIdx] ?? 0;
            const total = rowTotals[cIdx] || 1;
            const pct = Number(((Math.abs(raw) / total) * 100).toFixed(2));
            if (style === StackedBarStyle.Proportional) {
              return pct;
            }
            if (style === StackedBarStyle.Diverging) {
              return isNegativeStack ? -pct : pct;
            }
            return raw;
          }),
        };
      });

      if (style === StackedBarStyle.Absolute) {
        echartsSeries.push({
          type: 'bar',
          name: '__total__',
          stack: 'total',
          silent: true,
          tooltip: { show: false },
          barMaxWidth: isVertical ? 54 : 30,
          itemStyle: { color: 'transparent' },
          label: {
            show: true,
            position: isVertical ? 'top' : 'right',
            distance: 8,
            color: chartTheme.textPrimary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12.5,
            fontWeight: 700,
            formatter: (params: unknown) => {
              const idx = (params as { dataIndex?: number }).dataIndex ?? 0;
              return formatValue(rowTotals[idx] ?? 0);
            },
          },
          data: categories.map(() => 0),
        });
      }

      const maxTotal = Math.max(1, ...rowTotals);
      let valueMin = 0;
      let valueMax =
        style === StackedBarStyle.Proportional ? 100 : maxTotal * 1.15;

      if (style === StackedBarStyle.Diverging) {
        let maxSidePct = 10;
        categories.forEach((cat, cIdx) => {
          const total = rowTotals[cIdx] || 1;
          let negPct = 0;
          let posPct = 0;
          series.forEach((spec, i) => {
            const pct = (Math.abs(cat.values[i] ?? 0) / total) * 100;
            if (spec.polarity === 'negative') negPct += pct;
            else posPct += pct;
          });
          maxSidePct = Math.max(maxSidePct, negPct, posPct);
        });
        const bound = Math.min(100, Math.ceil(maxSidePct * 1.12));
        valueMin = -bound;
        valueMax = bound;
      }

      const categoryAxis = {
        type: 'category' as const,
        inverse: !isVertical,
        data: categoryNames,
        axisLine: {
          show: style !== StackedBarStyle.Diverging,
          lineStyle: { color: chartTheme.border, width: 1 },
        },
        axisTick: { show: false },
        axisLabel: {
          color: chartTheme.textPrimary,
          fontFamily: chartTheme.fontSans,
          fontSize: 12.5,
          fontWeight: 600,
          margin: 12,
          width: isVertical ? undefined : leftPad - 18,
          overflow: 'truncate' as const,
        },
      };

      const valueAxis = {
        type: 'value' as const,
        min: valueMin,
        max: valueMax,
        show: false,
      };

      return {
        animationDuration: 360,
        animationEasing: 'cubicOut',
        grid: {
          left: leftPad,
          right: rightPad,
          top: 42,
          bottom: isVertical ? 36 : 18,
          containLabel: false,
        },
        legend: buildInlineLegend(
          chartTheme,
          series.map((s) => s.label),
          'rect',
        ),
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'axis',
          axisPointer: buildAxisPointerShadow(chartTheme),
          formatter: (params: unknown) => {
            const list = Array.isArray(params) ? params : [params];
            const first = list[0] as { dataIndex?: number } | undefined;
            const cIdx = first?.dataIndex ?? 0;
            const cat = categories[cIdx];
            if (!cat) return '';
            const total = rowTotals[cIdx] || 1;

            const lines: string[] = [
              `<div style="font-weight:700;margin-bottom:4px;">${escapeHtml(cat.label)}</div>`,
            ];
            series.forEach((spec, sIdx) => {
              const raw = Math.abs(cat.values[sIdx] ?? 0);
              const share = Math.round((raw / total) * 100);
              const swatch = resolveToneColor(chartTheme, spec.tone, sIdx);
              const metric =
                style === StackedBarStyle.Proportional ||
                style === StackedBarStyle.Diverging
                  ? `${share}%`
                  : `${formatValue(raw)} (${share}%)`;
              lines.push(
                `<div><span style="display:inline-block;width:8px;height:8px;background:${swatch};margin-right:6px;"></span>${escapeHtml(spec.label)}: <strong>${escapeHtml(metric)}</strong></div>`,
              );
            });
            if (style === StackedBarStyle.Absolute) {
              lines.push(
                `<div style="border-top:1px solid rgba(255,255,255,0.16);margin-top:4px;padding-top:4px;">Total: <strong>${escapeHtml(formatValue(total))}</strong></div>`,
              );
            }
            return lines.join('');
          },
        },
        xAxis: isVertical ? categoryAxis : valueAxis,
        yAxis: isVertical ? valueAxis : categoryAxis,
        series: echartsSeries,
      };
    },
    [
      categories,
      formatValue,
      isVertical,
      minLabelPercent,
      rowTotals,
      series,
      showTooltip,
      style,
    ],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectSegment) return;
    const cat = categories[event.dataIndex];
    const spec = series[event.seriesIndex ?? -1];
    if (!cat || !spec) return;
    const raw = cat.values[event.seriesIndex ?? 0] ?? 0;
    const total = rowTotals[event.dataIndex] || 1;
    onSelectSegment({
      category: cat,
      series: spec,
      value: raw,
      sharePct: Number(((Math.abs(raw) / total) * 100).toFixed(1)),
    });
  };

  return (
    <EChartsCanvas
      buildOption={buildOption}
      height={resolvedHeight}
      brand={theme.brand}
      surface={theme.surface}
      styleVariant={style}
      ariaLabel={ariaLabel}
      onElementClick={onSelectSegment ? handleElementClick : undefined}
    />
  );
}
