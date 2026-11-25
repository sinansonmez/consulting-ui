import { useCallback } from 'react';
import type { ECElementEvent } from 'echarts/core';
import { Brand, DumbbellStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import {
  buildTooltipBase,
  escapeHtml,
  type ChartTheme,
} from '../../charts/chartTheme';
import {
  buildAxisPointerShadow,
  buildDeltaRightAxis,
  buildInlineLegend,
  defaultFormatDelta,
} from '../../charts/chartHelpers';
import { EChartsCanvas } from '../../charts/EChartsCanvas';
import type { ConsultingChartOption } from '../../charts/echartsCore';

export interface DumbbellDatum {
  id: string;
  label: string;
  start: number;
  end: number;
  benchmark?: number;
}

export interface DumbbellChartProps {
  data: readonly DumbbellDatum[];
  startLabel: string;
  endLabel: string;
  benchmarkLabel?: string;
  style?: DumbbellStyle;
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  deltaColumnLabel?: string;
  formatValue?: (value: number) => string;
  formatDelta?: (delta: number) => string;
  ariaLabel?: string;
  onSelectDatum?: (datum: DumbbellDatum) => void;
}

export function DumbbellChart({
  data,
  startLabel,
  endLabel,
  benchmarkLabel = 'Median',
  style = DumbbellStyle.Gap,
  brand,
  surface,
  height,
  showTooltip = true,
  deltaColumnLabel = 'Delta',
  formatValue = (v) => String(v),
  formatDelta = defaultFormatDelta,
  ariaLabel = 'Cohort comparison dumbbell chart',
  onSelectDatum,
}: DumbbellChartProps) {
  const theme = useResolvedTheme(brand, surface);
  const showGapColumn = style === DumbbellStyle.Gap;
  const hasBenchmarks =
    style === DumbbellStyle.Range &&
    data.some((d) => d.benchmark !== undefined);

  const resolvedHeight = height ?? Math.max(220, data.length * 46 + 64);

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const categories = data.map((d) => d.label);
      const maxLabelLen = Math.max(5, ...categories.map((c) => c.length));
      const leftPad = Math.min(200, Math.max(76, maxLabelLen * 7.4 + 18));
      const rightPad = showGapColumn
        ? Math.min(132, Math.max(76, deltaColumnLabel.length * 6.8 + 24))
        : 36;

      const allNumbers = data.flatMap((d) =>
        d.benchmark !== undefined
          ? [d.start, d.end, d.benchmark]
          : [d.start, d.end],
      );
      const dataMin = allNumbers.length > 0 ? Math.min(...allNumbers) : 0;
      const dataMax = allNumbers.length > 0 ? Math.max(...allNumbers) : 100;
      const hasNegative = dataMin < 0;
      const includeZero =
        style !== DumbbellStyle.Range ? hasNegative : hasNegative;
      const rawMin = includeZero ? Math.min(dataMin, 0) : dataMin;
      const rawMax = includeZero ? Math.max(dataMax, 0) : dataMax;
      const showZeroLine = hasNegative || (dataMin <= 0 && dataMax >= 0);
      const span = rawMax - rawMin || 1;
      const xMin = rawMin - span * 0.28;
      const xMax = rawMax + span * 0.28;

      const deltas = data.map((d) => d.end - d.start);

      const yAxes: ConsultingChartOption['yAxis'] = [
        {
          type: 'category',
          inverse: true,
          data: categories,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: {
              color: chartTheme.gridLine,
              width: 1,
            },
          },
          axisLabel: {
            color: chartTheme.textPrimary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12.5,
            fontWeight: 500,
            margin: 14,
            width: leftPad - 20,
            overflow: 'truncate',
          },
        },
      ];

      if (showGapColumn) {
        yAxes.push(
          buildDeltaRightAxis(
            deltas.map((d) => formatDelta(d)),
            deltas.map((d) => (d > 0 ? 'pos' : d < 0 ? 'neg' : 'flat')),
            chartTheme,
            deltaColumnLabel,
          ),
        );
      }

      const legendItems = [startLabel, endLabel];
      if (hasBenchmarks) legendItems.push(benchmarkLabel);

      const series: ConsultingChartOption['series'] = [
        {
          type: 'custom',
          name: '__bridge__',
          silent: true,
          z: 1,
          tooltip: { show: false },
          renderItem: (_params, api) => {
            const idx = api.value(0) as number;
            const sVal = api.value(1) as number;
            const eVal = api.value(2) as number;
            const pStart = api.coord([sVal, idx]);
            const pEnd = api.coord([eVal, idx]);
            const x1 = Math.min(pStart[0], pEnd[0]);
            const width = Math.max(2, Math.abs(pEnd[0] - pStart[0]));
            const barH = 4;
            const delta = eVal - sVal;
            const bridgeColor =
              style === DumbbellStyle.Gap
                ? delta > 0
                  ? chartTheme.positive
                  : delta < 0
                    ? chartTheme.negative
                    : chartTheme.neutral
                : chartTheme.neutral;

            const children: Array<Record<string, unknown>> = [
              {
                type: 'rect',
                shape: {
                  x: x1,
                  y: pStart[1] - barH / 2,
                  width,
                  height: barH,
                  r: 2,
                },
                style: {
                  fill: bridgeColor,
                  opacity: style === DumbbellStyle.Gap ? 0.36 : 0.72,
                },
              },
            ];

            // Subtle directional midpoint chevron in Gap mode when bridge is wide enough
            if (style === DumbbellStyle.Gap && width >= 28 && delta !== 0) {
              const midX = (pStart[0] + pEnd[0]) / 2;
              const cy = pStart[1];
              const dir = pEnd[0] > pStart[0] ? 1 : -1;
              children.push({
                type: 'polyline',
                shape: {
                  points: [
                    [midX - 3.5 * dir, cy - 3.5],
                    [midX + 1.5 * dir, cy],
                    [midX - 3.5 * dir, cy + 3.5],
                  ],
                },
                style: {
                  stroke: bridgeColor,
                  lineWidth: 1.5,
                  fill: 'none',
                  opacity: 0.9,
                },
              });
            }

            return {
              type: 'group',
              children,
            } as never;
          },
          data: data.map((d, idx) => [idx, d.start, d.end]),
        },
        {
          type: 'scatter',
          name: startLabel,
          symbol: 'circle',
          symbolSize: 12,
          z: 3,
          itemStyle: {
            color: chartTheme.background,
            borderColor: chartTheme.series[1],
            borderWidth: 2.5,
          },
          markLine: showZeroLine
            ? {
                symbol: 'none',
                silent: true,
                lineStyle: {
                  color: chartTheme.borderStrong,
                  width: 1.25,
                  type: 'solid',
                },
                label: {
                  show: true,
                  formatter: '0',
                  position: 'start',
                  color: chartTheme.textMuted,
                  fontFamily: chartTheme.fontSans,
                  fontSize: 11,
                  fontWeight: 600,
                },
                data: [{ xAxis: 0 }],
              }
            : undefined,
          data: data.map((d, idx) => {
            const isLeft = d.start <= d.end;
            return {
              value: [d.start, idx],
              label: {
                show: true,
                position: isLeft ? 'left' : 'right',
                distance: 8,
                color: chartTheme.textSecondary,
                fontFamily: chartTheme.fontSans,
                fontSize: 11.5,
                fontWeight: 600,
                formatter: () => formatValue(d.start),
              },
            };
          }),
        },
        {
          type: 'scatter',
          name: endLabel,
          symbol: 'circle',
          symbolSize: 13,
          z: 4,
          itemStyle: {
            color: chartTheme.series[0],
            borderColor: chartTheme.background,
            borderWidth: 1.5,
          },
          data: data.map((d, idx) => {
            const isRight = d.end >= d.start;
            return {
              value: [d.end, idx],
              label: {
                show: true,
                position: isRight ? 'right' : 'left',
                distance: 8,
                color: chartTheme.textPrimary,
                fontFamily: chartTheme.fontSans,
                fontSize: 12,
                fontWeight: 700,
                formatter: () => formatValue(d.end),
              },
            };
          }),
        },
      ];

      if (hasBenchmarks) {
        series.push({
          type: 'scatter',
          name: benchmarkLabel,
          symbol: 'diamond',
          symbolSize: 9,
          z: 5,
          itemStyle: {
            color: chartTheme.textMuted,
          },
          data: data
            .map((d, idx) =>
              d.benchmark !== undefined ? [d.benchmark, idx] : null,
            )
            .filter((item): item is [number, number] => item !== null),
        });
      }

      return {
        animationDuration: 360,
        animationEasing: 'cubicOut',
        grid: {
          left: leftPad,
          right: rightPad,
          top: 44,
          bottom: 22,
          containLabel: false,
        },
        legend: buildInlineLegend(chartTheme, legendItems, 'circle'),
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'axis',
          axisPointer: buildAxisPointerShadow(chartTheme),
          formatter: (params: unknown) => {
            const list = Array.isArray(params) ? params : [params];
            const first = list[0] as { dataIndex?: number } | undefined;
            const idx = first?.dataIndex ?? 0;
            const datum = data[idx];
            if (!datum) return '';
            const delta = datum.end - datum.start;
            const benchLine =
              datum.benchmark !== undefined
                ? `<div>${escapeHtml(benchmarkLabel)}: <strong>${escapeHtml(formatValue(datum.benchmark))}</strong></div>`
                : '';
            return `
              <div style="font-weight:700;margin-bottom:4px;">${escapeHtml(datum.label)}</div>
              <div>${escapeHtml(startLabel)}: <strong>${escapeHtml(formatValue(datum.start))}</strong></div>
              <div>${escapeHtml(endLabel)}: <strong>${escapeHtml(formatValue(datum.end))}</strong></div>
              ${benchLine}
              <div style="border-top:1px solid rgba(255,255,255,0.16);margin-top:4px;padding-top:4px;">${escapeHtml(deltaColumnLabel)}: <strong>${escapeHtml(formatDelta(delta))}</strong></div>
            `;
          },
        },
        xAxis: {
          type: 'value',
          min: xMin,
          max: xMax,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            show: style === DumbbellStyle.Range,
            color: chartTheme.textMuted,
            fontFamily: chartTheme.fontSans,
            fontSize: 11,
            formatter: (v: number) => formatValue(v),
          },
        },
        yAxis: yAxes,
        series,
      };
    },
    [
      benchmarkLabel,
      data,
      deltaColumnLabel,
      endLabel,
      formatDelta,
      formatValue,
      hasBenchmarks,
      showGapColumn,
      showTooltip,
      startLabel,
      style,
    ],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectDatum) return;
    const datum = data[event.dataIndex];
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
