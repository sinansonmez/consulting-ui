import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import type { BarSeriesOption } from 'echarts/charts';
import { BarChartStyle, Brand, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import {
  buildTooltipBase,
  escapeHtml,
  resolveToneColor,
  type ChartSemanticTone,
  type ChartTheme,
} from '../../charts/chartTheme';
import {
  buildAxisPointerShadow,
  buildDeltaRightAxis,
  buildInlineLegend,
  classifyDelta,
  defaultFormatDelta,
} from '../../charts/chartHelpers';
import { EChartsCanvas } from '../../charts/EChartsCanvas';
import type { ConsultingChartOption } from '../../charts/echartsCore';

export interface BarDatum {
  id: string;
  label: string;
  value?: number;
  values?: readonly number[];
  delta?: number | string;
  highlighted?: boolean;
  tone?: ChartSemanticTone;
}

export interface BarSeriesSpec {
  id: string;
  label: string;
  tone?: ChartSemanticTone;
}

export interface BarReferenceLine {
  value: number;
  label?: string;
}

export interface BarChartProps {
  data: readonly BarDatum[];
  style?: BarChartStyle;
  series?: readonly BarSeriesSpec[];
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  sort?: 'descending' | 'ascending' | 'none';
  deltaColumnLabel?: string;
  formatValue?: (value: number) => string;
  formatDelta?: (delta: number) => string;
  referenceLine?: BarReferenceLine;
  ariaLabel?: string;
  onSelectDatum?: (datum: BarDatum) => void;
}

export function BarChart({
  data,
  style = BarChartStyle.Ranked,
  series,
  brand,
  surface,
  height,
  showTooltip = true,
  sort,
  deltaColumnLabel,
  formatValue = (v) => String(v),
  formatDelta = defaultFormatDelta,
  referenceLine,
  ariaLabel = 'Consulting bar chart',
  onSelectDatum,
}: BarChartProps) {
  const theme = useResolvedTheme(brand, surface);

  const orderedData = useMemo(() => {
    const mode =
      sort ?? (style === BarChartStyle.Ranked ? 'descending' : 'none');
    if (mode === 'none') return [...data];
    const getSortVal = (d: BarDatum) => d.value ?? d.values?.[0] ?? 0;
    return [...data].sort((a, b) =>
      mode === 'descending'
        ? getSortVal(b) - getSortVal(a)
        : getSortVal(a) - getSortVal(b),
    );
  }, [data, sort, style]);

  const hasDeltaColumn = useMemo(
    () => orderedData.some((d) => d.delta !== undefined),
    [orderedData],
  );

  const seriesSpecs = useMemo<readonly BarSeriesSpec[]>(() => {
    if (style !== BarChartStyle.Grouped) return [];
    if (series && series.length > 0) return series;
    const count = Math.max(1, orderedData[0]?.values?.length ?? 2);
    return Array.from({ length: count }, (_, idx) => ({
      id: `s${idx}`,
      label: `Series ${idx + 1}`,
    }));
  }, [orderedData, series, style]);

  const resolvedHeight =
    height ??
    Math.max(
      210,
      orderedData.length *
        (style === BarChartStyle.Grouped
          ? Math.max(46, seriesSpecs.length * 22 + 14)
          : 40) +
        (style === BarChartStyle.Grouped ? 52 : deltaColumnLabel ? 42 : 24),
    );

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const categories = orderedData.map((d) => d.label);
      const anyHighlighted = orderedData.some((d) => d.highlighted);
      const maxLabelLen = Math.max(6, ...categories.map((c) => c.length));
      const leftPad = Math.min(200, Math.max(88, maxLabelLen * 7.4 + 16));
      const rightPad = hasDeltaColumn
        ? Math.min(132, Math.max(82, (deltaColumnLabel?.length ?? 5) * 6.8 + 24))
        : style === BarChartStyle.Diverging
          ? 64
          : 58;
      const topPad =
        style === BarChartStyle.Grouped ? 38 : deltaColumnLabel ? 28 : 12;

      const markLineEntries: Array<Record<string, unknown>> = [];
      if (style === BarChartStyle.Diverging) {
        markLineEntries.push({
          xAxis: 0,
          lineStyle: {
            color: chartTheme.borderStrong,
            width: 1.25,
            type: 'solid',
          },
          label: { show: false },
        });
      }
      if (referenceLine) {
        markLineEntries.push({
          xAxis: referenceLine.value,
          lineStyle: {
            color: chartTheme.borderStrong,
            type: 'dashed',
            width: 1.25,
          },
          label: {
            show: Boolean(referenceLine.label),
            formatter: referenceLine.label ?? '',
            position: 'insideEndTop',
            color: chartTheme.textSecondary,
            fontFamily: chartTheme.fontSans,
            fontSize: 11,
            fontWeight: 600,
          },
        });
      }

      const markLine =
        markLineEntries.length > 0
          ? {
              symbol: 'none',
              silent: true,
              data: markLineEntries as never,
            }
          : undefined;

      const yAxes: ConsultingChartOption['yAxis'] = [
        {
          type: 'category',
          inverse: true,
          data: categories,
          axisLine: {
            show: style !== BarChartStyle.Diverging,
            lineStyle: { color: chartTheme.border, width: 1 },
          },
          axisTick: { show: false },
          axisLabel: {
            color: chartTheme.textPrimary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12.5,
            margin: 12,
            width: leftPad - 18,
            overflow: 'truncate',
            formatter: (val: string, idx: number) => {
              const datum = orderedData[idx];
              return datum?.highlighted ? `{hi|${val}}` : val;
            },
            rich: {
              hi: {
                fontWeight: 700,
                color: chartTheme.textPrimary,
                fontFamily: chartTheme.fontSans,
                fontSize: 12.5,
              },
            },
          },
        },
      ];

      if (hasDeltaColumn) {
        const deltaLabels = orderedData.map((d) => {
          if (d.delta === undefined) return '';
          return typeof d.delta === 'number' ? formatDelta(d.delta) : d.delta;
        });
        const polarities = orderedData.map((d) => classifyDelta(d.delta));
        yAxes.push(
          buildDeltaRightAxis(
            deltaLabels,
            polarities,
            chartTheme,
            deltaColumnLabel,
          ),
        );
      }

      const r = chartTheme.barRadius;
      const echartsSeries: BarSeriesOption[] = [];

      if (style === BarChartStyle.Grouped) {
        seriesSpecs.forEach((spec, sIdx) => {
          const color = resolveToneColor(chartTheme, spec.tone, sIdx);
          echartsSeries.push({
            type: 'bar',
            name: spec.label,
            barMaxWidth: 14,
            barGap: '22%',
            itemStyle: {
              color,
              borderRadius: [0, r, r, 0],
            },
            emphasis: { focus: 'series' },
            label: {
              show: true,
              position: 'right',
              distance: 6,
              color: sIdx === 0 ? chartTheme.textPrimary : chartTheme.textMuted,
              fontFamily: chartTheme.fontSans,
              fontSize: 11.5,
              fontWeight: sIdx === 0 ? 700 : 600,
              formatter: (params: unknown) => {
                const val = Number((params as { value?: number }).value ?? 0);
                return formatValue(val);
              },
            },
            markLine: sIdx === 0 ? markLine : undefined,
            data: orderedData.map((d) => d.values?.[sIdx] ?? 0),
          });
        });
      } else if (style === BarChartStyle.Diverging) {
        echartsSeries.push({
          type: 'bar',
          name: ariaLabel,
          barMaxWidth: 22,
          emphasis: { itemStyle: { opacity: 0.88 } },
          markLine,
          data: orderedData.map((d) => {
            const val = d.value ?? 0;
            const isNeg = val < 0;
            const fill = d.tone
              ? resolveToneColor(chartTheme, d.tone, 0)
              : isNeg
                ? chartTheme.negative
                : chartTheme.series[0];
            return {
              value: val,
              itemStyle: {
                color: fill,
                borderRadius: isNeg ? [r, 0, 0, r] : [0, r, r, 0],
              },
              label: {
                show: true,
                position: isNeg ? 'left' : 'right',
                distance: 8,
                color: isNeg ? chartTheme.negative : chartTheme.textPrimary,
                fontFamily: chartTheme.fontSans,
                fontSize: 12,
                fontWeight: 700,
                formatter: () => formatValue(val),
              },
            };
          }),
        });
      } else {
        echartsSeries.push({
          type: 'bar',
          name: ariaLabel,
          barMaxWidth: 22,
          emphasis: { itemStyle: { opacity: 0.88 } },
          markLine,
          data: orderedData.map((d) => {
            const val = d.value ?? 0;
            const fill = d.tone
              ? resolveToneColor(chartTheme, d.tone, 0)
              : anyHighlighted
                ? d.highlighted
                  ? chartTheme.series[0]
                  : chartTheme.neutral
                : chartTheme.series[0];
            return {
              value: val,
              itemStyle: {
                color: fill,
                borderRadius: [0, r, r, 0],
              },
              label: {
                show: true,
                position: 'right',
                distance: 8,
                color:
                  anyHighlighted && !d.highlighted
                    ? chartTheme.textSecondary
                    : chartTheme.textPrimary,
                fontFamily: chartTheme.fontSans,
                fontSize: 12,
                fontWeight: d.highlighted || !anyHighlighted ? 700 : 600,
                formatter: () => formatValue(val),
              },
            };
          }),
        });
      }

      const rawValues =
        style === BarChartStyle.Grouped
          ? orderedData.flatMap((d) => [...(d.values ?? [])])
          : orderedData.map((d) => d.value ?? 0);
      const minVal = Math.min(0, ...rawValues);
      const maxVal = Math.max(0, ...rawValues);
      const span = maxVal - minVal || 1;

      let xMin = 0;
      let xMax = maxVal + span * (hasDeltaColumn ? 0.34 : 0.22);
      if (style === BarChartStyle.Diverging) {
        const absMax = Math.max(Math.abs(minVal), Math.abs(maxVal), 1);
        xMin = -absMax * 1.24;
        xMax = absMax * 1.24;
      }

      return {
        animationDuration: 360,
        animationEasing: 'cubicOut',
        grid: {
          left: leftPad,
          right: rightPad,
          top: topPad,
          bottom: 12,
          containLabel: false,
        },
        legend:
          style === BarChartStyle.Grouped
            ? buildInlineLegend(chartTheme)
            : { show: false },
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'axis',
          axisPointer: buildAxisPointerShadow(chartTheme),
          formatter: (params: unknown) => {
            const list = Array.isArray(params) ? params : [params];
            const first = list[0] as { dataIndex?: number } | undefined;
            const idx = first?.dataIndex ?? 0;
            const datum = orderedData[idx];
            if (!datum) return '';

            const lines: string[] = [
              `<div style="font-weight:700;margin-bottom:3px;">${escapeHtml(datum.label)}</div>`,
            ];
            if (style === BarChartStyle.Grouped) {
              seriesSpecs.forEach((spec, sIdx) => {
                const v = datum.values?.[sIdx] ?? 0;
                const swatch = resolveToneColor(chartTheme, spec.tone, sIdx);
                lines.push(
                  `<div><span style="display:inline-block;width:8px;height:8px;background:${swatch};margin-right:6px;"></span>${escapeHtml(spec.label)}: <strong>${escapeHtml(formatValue(v))}</strong></div>`,
                );
              });
            } else {
              lines.push(
                `<div>Value: <strong>${escapeHtml(formatValue(datum.value ?? 0))}</strong></div>`,
              );
            }
            if (datum.delta !== undefined) {
              const dStr =
                typeof datum.delta === 'number'
                  ? formatDelta(datum.delta)
                  : datum.delta;
              const dLabel = deltaColumnLabel ?? 'Change';
              lines.push(
                `<div style="opacity:0.82;margin-top:2px;">${escapeHtml(dLabel)}: <strong>${escapeHtml(dStr)}</strong></div>`,
              );
            }
            return lines.join('');
          },
        },
        xAxis: {
          type: 'value',
          min: xMin,
          max: xMax,
          show: false,
        },
        yAxis: yAxes,
        series: echartsSeries,
      };
    },
    [
      ariaLabel,
      deltaColumnLabel,
      formatDelta,
      formatValue,
      hasDeltaColumn,
      orderedData,
      referenceLine,
      seriesSpecs,
      showTooltip,
      style,
    ],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectDatum) return;
    const datum = orderedData[event.dataIndex];
    if (datum) onSelectDatum(datum);
  };

  return (
    <EChartsCanvas
      buildOption={buildOption}
      height={resolvedHeight}
      brand={theme.brand}
      surface={theme.surface}
      styleVariant={style}
      ariaLabel={ariaLabel}
      onElementClick={onSelectDatum ? handleElementClick : undefined}
    />
  );
}
