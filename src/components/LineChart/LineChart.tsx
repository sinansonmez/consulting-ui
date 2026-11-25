import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import type { LineSeriesOption } from 'echarts/charts';
import { Brand, LineChartStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import {
  buildTooltipBase,
  escapeHtml,
  resolveToneColor,
  type ChartSemanticTone,
  type ChartTheme,
} from '../../charts/chartTheme';
import { buildInlineLegend } from '../../charts/chartHelpers';
import { EChartsCanvas } from '../../charts/EChartsCanvas';
import type { ConsultingChartOption } from '../../charts/echartsCore';

export interface LineSeriesSpec {
  id: string;
  label: string;
  values: readonly (number | null)[];
  tone?: ChartSemanticTone;
  emphasized?: boolean;
}

export interface LineConfidenceBand {
  low: readonly (number | null)[];
  high: readonly (number | null)[];
  label?: string;
}

export interface LineRegimeZone {
  startPeriod: string;
  endPeriod: string;
  label?: string;
}

export interface LinePointSelection {
  series: LineSeriesSpec;
  period: string;
  value: number;
  index: number;
}

export interface LineChartProps {
  periods: readonly string[];
  series: readonly LineSeriesSpec[];
  style?: LineChartStyle;
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  forecastStartIndex?: number;
  band?: LineConfidenceBand;
  regimes?: readonly LineRegimeZone[];
  formatValue?: (value: number) => string;
  ariaLabel?: string;
  onSelectPoint?: (selection: LinePointSelection) => void;
}

export function LineChart({
  periods,
  series,
  style = LineChartStyle.Trend,
  brand,
  surface,
  height,
  showTooltip = true,
  forecastStartIndex,
  band,
  regimes,
  formatValue = (v) => String(v),
  ariaLabel = 'Time-series consulting line chart',
  onSelectPoint,
}: LineChartProps) {
  const theme = useResolvedTheme(brand, surface);
  const resolvedHeight = height ?? 310;
  const isStackedArea = style === LineChartStyle.StackedArea;

  const hasForecastSplit =
    style === LineChartStyle.Forecast &&
    forecastStartIndex !== undefined &&
    forecastStartIndex > 0 &&
    forecastStartIndex < periods.length - 1;

  const effectiveRegimes = useMemo<readonly LineRegimeZone[]>(() => {
    if (regimes && regimes.length > 0) return regimes;
    if (hasForecastSplit && forecastStartIndex !== undefined) {
      return [
        {
          startPeriod: periods[forecastStartIndex],
          endPeriod: periods[periods.length - 1],
          label: 'Forecast',
        },
      ];
    }
    return [];
  }, [forecastStartIndex, hasForecastSplit, periods, regimes]);

  const finalPeriodTotals = useMemo(() => {
    if (!isStackedArea || periods.length === 0) return [];
    return periods.map((_, pIdx) =>
      series.reduce((sum, s) => sum + (s.values[pIdx] ?? 0), 0),
    );
  }, [isStackedArea, periods, series]);

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const maxEndLabelLen = Math.max(
        10,
        ...series.map((s) => {
          const lastVal = [...s.values].reverse().find((v) => v !== null);
          const vStr = lastVal !== undefined && lastVal !== null ? formatValue(lastVal) : '';
          return s.label.length + vStr.length + 3;
        }),
      );
      const rightPad = isStackedArea
        ? 58
        : Math.min(190, Math.max(108, maxEndLabelLen * 6.8 + 14));

      const markArea =
        effectiveRegimes.length > 0
          ? {
              silent: true,
              itemStyle: {
                color: chartTheme.hoverTint,
              },
              label: {
                show: true,
                position: 'insideTop' as const,
                distance: 8,
                color: chartTheme.textMuted,
                fontFamily: chartTheme.fontSans,
                fontSize: 11,
                fontWeight: 600,
              },
              data: effectiveRegimes.map(
                (r): [{ name: string; xAxis: string }, { xAxis: string }] => [
                  { name: r.label ?? '', xAxis: r.startPeriod },
                  { xAxis: r.endPeriod },
                ],
              ),
            }
          : undefined;

      const forecastMarkLine =
        hasForecastSplit && forecastStartIndex !== undefined
          ? {
              symbol: 'none',
              silent: true,
              lineStyle: {
                color: chartTheme.borderStrong,
                type: 'dashed' as const,
                width: 1,
                opacity: 0.6,
              },
              label: { show: false },
              data: [{ xAxis: periods[forecastStartIndex] }],
            }
          : undefined;

      const echartsSeries: LineSeriesOption[] = [];

      // Optional shaded confidence / scenario band in Forecast or Trend mode
      if (band && !isStackedArea) {
        const bandDelta = periods.map((_, idx) => {
          const lo = band.low[idx];
          const hi = band.high[idx];
          if (lo === null || lo === undefined || hi === null || hi === undefined) {
            return null;
          }
          return Math.max(0, hi - lo);
        });
        echartsSeries.push(
          {
            type: 'line',
            name: '__band_base__',
            stack: '__band__',
            silent: true,
            symbol: 'none',
            lineStyle: { opacity: 0 },
            tooltip: { show: false },
            data: [...band.low],
          },
          {
            type: 'line',
            name: band.label ?? 'Range',
            stack: '__band__',
            silent: true,
            symbol: 'none',
            lineStyle: { opacity: 0 },
            areaStyle: {
              color: chartTheme.series[0],
              opacity: 0.14,
            },
            tooltip: { show: false },
            data: bandDelta,
          },
        );
      }

      series.forEach((spec, sIdx) => {
        const color = resolveToneColor(chartTheme, spec.tone, sIdx);
        const lineWidth = spec.emphasized ? 3 : 2.25;
        const lastIdx = spec.values.length - 1;

        if (isStackedArea) {
          echartsSeries.push({
            type: 'line',
            name: spec.label,
            stack: 'area',
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              width: 1.5,
              color: chartTheme.divider,
            },
            itemStyle: { color },
            areaStyle: {
              color,
              opacity: 0.88,
            },
            emphasis: { focus: 'series' },
            markArea: sIdx === 0 ? markArea : undefined,
            data: spec.values.map((v) => v ?? 0),
          });
          return;
        }

        const pointEndLabel = {
          show: true,
          position: 'right' as const,
          distance: 10,
          formatter: (params: unknown) => {
            const val = Number((params as { value?: number }).value ?? 0);
            return `{lbl|${spec.label}}  {val|${formatValue(val)}}`;
          },
          rich: {
            lbl: {
              color: spec.emphasized
                ? chartTheme.textPrimary
                : chartTheme.textSecondary,
              fontFamily: chartTheme.fontSans,
              fontSize: 12,
              fontWeight: spec.emphasized ? 700 : 500,
            },
            val: {
              color,
              fontFamily: chartTheme.fontSans,
              fontSize: 12,
              fontWeight: 700,
              padding: [0, 0, 0, 4],
            },
          },
        };

        let lastNonNullIdx = lastIdx;
        while (
          lastNonNullIdx >= 0 &&
          (spec.values[lastNonNullIdx] === null ||
            spec.values[lastNonNullIdx] === undefined)
        ) {
          lastNonNullIdx--;
        }

        const interactiveSymbolSize = onSelectPoint ? 6 : 0;

        if (hasForecastSplit && forecastStartIndex !== undefined) {
          const actualData = spec.values.map((v, idx) =>
            idx <= forecastStartIndex ? v : null,
          );
          const forecastData = spec.values.map((v, idx) => {
            if (idx < forecastStartIndex) return null;
            if (idx === lastNonNullIdx && v !== null) {
              return {
                value: v,
                symbol: 'circle',
                symbolSize: 7,
                label: pointEndLabel,
              };
            }
            return v;
          });

          echartsSeries.push(
            {
              type: 'line',
              name: spec.label,
              symbol: 'circle',
              symbolSize: interactiveSymbolSize,
              showSymbol: Boolean(onSelectPoint),
              itemStyle: { color },
              lineStyle: { color, width: lineWidth, type: 'solid' },
              markArea: sIdx === 0 ? markArea : undefined,
              markLine: sIdx === 0 ? forecastMarkLine : undefined,
              data: actualData,
            },
            {
              type: 'line',
              name: `${spec.label}__forecast`,
              symbol: 'circle',
              symbolSize: interactiveSymbolSize,
              showSymbol: true,
              itemStyle: { color },
              lineStyle: { color, width: lineWidth, type: 'dashed' },
              labelLayout: { moveOverlap: 'shiftY' },
              data: forecastData as NonNullable<LineSeriesOption['data']>,
            },
          );
        } else {
          echartsSeries.push({
            type: 'line',
            name: spec.label,
            symbol: 'circle',
            symbolSize: interactiveSymbolSize,
            showSymbol: true,
            itemStyle: { color },
            lineStyle: { color, width: lineWidth },
            emphasis: { focus: 'series' },
            labelLayout: { moveOverlap: 'shiftY' },
            markArea: sIdx === 0 ? markArea : undefined,
            data: spec.values.map((v, idx) =>
              idx === lastNonNullIdx && v !== null
                ? {
                    value: v,
                    symbol: 'circle',
                    symbolSize: 7,
                    label: pointEndLabel,
                  }
                : v,
            ) as NonNullable<LineSeriesOption['data']>,
          });
        }
      });

      // Add crisp final-period total marker in StackedArea mode
      if (isStackedArea && finalPeriodTotals.length > 0) {
        const lastIdx = finalPeriodTotals.length - 1;
        echartsSeries.push({
          type: 'line',
          name: '__area_total__',
          silent: true,
          tooltip: { show: false },
          lineStyle: { width: 0 },
          symbol: 'circle',
          symbolSize: 1,
          itemStyle: { color: 'transparent' },
          label: {
            show: true,
            position: 'right',
            distance: 8,
            color: chartTheme.textPrimary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12.5,
            fontWeight: 700,
            formatter: () => formatValue(finalPeriodTotals[lastIdx]),
          },
          data: finalPeriodTotals.map((t, idx) => (idx === lastIdx ? t : null)),
        });
      }

      return {
        animationDuration: 380,
        animationEasing: 'cubicOut',
        grid: {
          left: 52,
          right: rightPad,
          top: isStackedArea ? 44 : 24,
          bottom: 32,
          containLabel: false,
        },
        legend: isStackedArea
          ? buildInlineLegend(
              chartTheme,
              series.map((s) => s.label),
              'rect',
            )
          : { show: false },
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: chartTheme.borderStrong,
              width: 1,
              type: 'dashed',
            },
          },
          formatter: (params: unknown) => {
            const list = Array.isArray(params) ? params : [params];
            const first = list[0] as { dataIndex?: number } | undefined;
            const pIdx = first?.dataIndex ?? 0;
            const period = periods[pIdx] ?? '';
            const isFcast =
              hasForecastSplit &&
              forecastStartIndex !== undefined &&
              pIdx > forecastStartIndex;

            const lines: string[] = [
              `<div style="font-weight:700;margin-bottom:4px;">${escapeHtml(period)}${isFcast ? ' <span style="opacity:0.7;font-weight:500;">(Forecast)</span>' : ''}</div>`,
            ];
            series.forEach((spec, sIdx) => {
              const val = spec.values[pIdx];
              if (val === null || val === undefined) return;
              const swatch = resolveToneColor(chartTheme, spec.tone, sIdx);
              lines.push(
                `<div><span style="display:inline-block;width:8px;height:8px;background:${swatch};margin-right:6px;"></span>${escapeHtml(spec.label)}: <strong>${escapeHtml(formatValue(val))}</strong></div>`,
              );
            });
            if (
              band &&
              band.low[pIdx] !== null &&
              band.low[pIdx] !== undefined &&
              band.high[pIdx] !== null &&
              band.high[pIdx] !== undefined
            ) {
              lines.push(
                `<div style="opacity:0.8;margin-top:2px;">${escapeHtml(band.label ?? 'Range')}: ${escapeHtml(formatValue(band.low[pIdx]!))} – ${escapeHtml(formatValue(band.high[pIdx]!))}</div>`,
              );
            }
            if (isStackedArea && finalPeriodTotals[pIdx] !== undefined) {
              lines.push(
                `<div style="border-top:1px solid rgba(255,255,255,0.16);margin-top:4px;padding-top:4px;">Total: <strong>${escapeHtml(formatValue(finalPeriodTotals[pIdx]))}</strong></div>`,
              );
            }
            return lines.join('');
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [...periods],
          axisLine: {
            show: true,
            lineStyle: { color: chartTheme.borderStrong, width: 1 },
          },
          axisTick: { show: false },
          axisLabel: {
            color: chartTheme.textSecondary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12,
            margin: 10,
          },
        },
        yAxis: {
          type: 'value',
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
            formatter: (v: number) => formatValue(v),
          },
        },
        series: echartsSeries,
      };
    },
    [
      band,
      effectiveRegimes,
      finalPeriodTotals,
      forecastStartIndex,
      formatValue,
      hasForecastSplit,
      isStackedArea,
      onSelectPoint,
      periods,
      series,
      showTooltip,
    ],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectPoint) return;
    const rawName = (event.seriesName ?? '').replace(/__forecast$/, '');
    const spec = series.find((s) => s.label === rawName);
    const idx = event.dataIndex;
    const val = spec?.values[idx];
    if (spec && val !== null && val !== undefined) {
      onSelectPoint({
        series: spec,
        period: periods[idx] ?? '',
        value: val,
        index: idx,
      });
    }
  };

  return (
    <EChartsCanvas
      buildOption={buildOption}
      height={resolvedHeight}
      brand={theme.brand}
      surface={theme.surface}
      styleVariant={style}
      ariaLabel={ariaLabel}
      onElementClick={onSelectPoint ? handleElementClick : undefined}
    />
  );
}
