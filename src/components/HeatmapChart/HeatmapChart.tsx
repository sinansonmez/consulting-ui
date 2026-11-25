import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import { Brand, HeatmapStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import {
  buildTooltipBase,
  escapeHtml,
  getContrastTextColor,
  lerpHexColor,
  type ChartTheme,
} from '../../charts/chartTheme';
import { EChartsCanvas } from '../../charts/EChartsCanvas';
import type { ConsultingChartOption } from '../../charts/echartsCore';

export interface HeatmapCellSelection {
  row: string;
  column: string;
  rowIndex: number;
  columnIndex: number;
  value: number;
}

export interface HeatmapChartProps {
  rows: readonly string[];
  columns: readonly string[];
  values: readonly (readonly number[])[];
  style?: HeatmapStyle;
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  showRowSummary?: boolean;
  rowSummaryLabel?: string;
  rowSummaryMode?: 'average' | 'sum';
  formatValue?: (value: number) => string;
  ariaLabel?: string;
  onSelectCell?: (selection: HeatmapCellSelection) => void;
}

function resolveCellColor(
  value: number,
  minVal: number,
  maxVal: number,
  maxAbs: number,
  style: HeatmapStyle,
  chartTheme: ChartTheme,
): string {
  if (style === HeatmapStyle.Diverging) {
    if (value === 0) return chartTheme.background;
    if (value > 0) {
      const t = Math.min(1, value / Math.max(1e-9, maxAbs));
      return lerpHexColor(
        chartTheme.background,
        chartTheme.positive,
        0.16 + t * 0.84,
      );
    }
    const t = Math.min(1, Math.abs(value) / Math.max(1e-9, maxAbs));
    return lerpHexColor(
      chartTheme.background,
      chartTheme.negative,
      0.16 + t * 0.84,
    );
  }

  const baseLow = minVal >= 0 ? 0 : minVal;
  const span = maxVal - baseLow || 1;
  const norm = Math.min(1, Math.max(0, (value - baseLow) / span));

  if (style === HeatmapStyle.Scorecard) {
    if (norm >= 0.75) return chartTheme.series[0];
    if (norm >= 0.5)
      return lerpHexColor(chartTheme.muted, chartTheme.series[0], 0.62);
    if (norm >= 0.25)
      return lerpHexColor(chartTheme.muted, chartTheme.series[0], 0.28);
    return chartTheme.muted;
  }

  return lerpHexColor(chartTheme.muted, chartTheme.series[0], 0.1 + norm * 0.9);
}

export function HeatmapChart({
  rows,
  columns,
  values,
  style = HeatmapStyle.Sequential,
  brand,
  surface,
  height,
  showTooltip = true,
  showRowSummary,
  rowSummaryLabel,
  rowSummaryMode = 'average',
  formatValue = (v) => String(v),
  ariaLabel = 'Matrix intensity heatmap chart',
  onSelectCell,
}: HeatmapChartProps) {
  const theme = useResolvedTheme(brand, surface);
  const displayRowSummary = showRowSummary ?? style === HeatmapStyle.Scorecard;
  const summaryHeader =
    rowSummaryLabel ?? (rowSummaryMode === 'sum' ? 'Total' : 'Avg');

  const { flatCells, minVal, maxVal, maxAbs, rowSummaries } = useMemo(() => {
    const cells: Array<{ r: number; c: number; val: number }> = [];
    let lo = Infinity;
    let hi = -Infinity;
    let absMax = 0;

    rows.forEach((_, rIdx) => {
      columns.forEach((_, cIdx) => {
        const val = values[rIdx]?.[cIdx] ?? 0;
        cells.push({ r: rIdx, c: cIdx, val });
        lo = Math.min(lo, val);
        hi = Math.max(hi, val);
        absMax = Math.max(absMax, Math.abs(val));
      });
    });

    const summaries = rows.map((_, rIdx) => {
      const rowVals = columns.map((_, cIdx) => values[rIdx]?.[cIdx] ?? 0);
      const total = rowVals.reduce((a, b) => a + b, 0);
      if (rowSummaryMode === 'sum') return Number(total.toFixed(1));
      const avg = rowVals.length > 0 ? total / rowVals.length : 0;
      return Number(avg.toFixed(1));
    });

    return {
      flatCells: cells,
      minVal: Number.isFinite(lo) ? lo : 0,
      maxVal: Number.isFinite(hi) ? hi : 100,
      maxAbs: Math.max(1, absMax),
      rowSummaries: summaries,
    };
  }, [columns, rowSummaryMode, rows, values]);

  const resolvedHeight = height ?? Math.max(220, rows.length * 44 + 62);

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const maxRowLen = Math.max(6, ...rows.map((r) => r.length));
      const leftPad = Math.min(184, Math.max(88, maxRowLen * 7.4 + 18));
      const rightPad = displayRowSummary ? 74 : 16;

      const yAxes: ConsultingChartOption['yAxis'] = [
        {
          type: 'category',
          inverse: true,
          data: [...rows],
          axisLine: { show: false },
          axisTick: { show: false },
          splitArea: { show: false },
          axisLabel: {
            color: chartTheme.textPrimary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12.5,
            fontWeight: 600,
            margin: 12,
            width: leftPad - 18,
            overflow: 'truncate',
          },
        },
      ];

      if (displayRowSummary) {
        yAxes.push({
          type: 'category',
          position: 'right',
          inverse: true,
          data: rowSummaries.map((v) => formatValue(v)),
          name: summaryHeader,
          nameLocation: 'start',
          nameGap: 10,
          nameTextStyle: {
            color: chartTheme.textMuted,
            fontFamily: chartTheme.fontSans,
            fontSize: 11.5,
            fontWeight: 700,
            align: 'left',
            padding: [0, 0, 0, 14],
          },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            margin: 14,
            color: chartTheme.textPrimary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12,
            fontWeight: 700,
          },
        });
      }

      return {
        animationDuration: 320,
        animationEasing: 'cubicOut',
        grid: {
          left: leftPad,
          right: rightPad,
          top: 40,
          bottom: 12,
          containLabel: false,
        },
        visualMap: {
          show: false,
          min:
            style === HeatmapStyle.Diverging
              ? -maxAbs
              : minVal >= 0
                ? 0
                : minVal,
          max: style === HeatmapStyle.Diverging ? maxAbs : maxVal,
        },
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'item',
          formatter: (params: unknown) => {
            const p = params as { value?: [number, number, number] };
            const [cIdx = 0, rIdx = 0, val = 0] = p.value ?? [];
            const cellColor = resolveCellColor(
              val,
              minVal,
              maxVal,
              maxAbs,
              style,
              chartTheme,
            );
            return `
              <div style="font-weight:700;margin-bottom:3px;">${escapeHtml(rows[rIdx] ?? '')} · ${escapeHtml(columns[cIdx] ?? '')}</div>
              <div><span style="display:inline-block;width:8px;height:8px;background:${cellColor};margin-right:6px;"></span>Value: <strong>${escapeHtml(formatValue(val))}</strong></div>
            `;
          },
        },
        xAxis: {
          type: 'category',
          position: 'top',
          data: [...columns],
          axisLine: { show: false },
          axisTick: { show: false },
          splitArea: { show: false },
          axisLabel: {
            color: chartTheme.textSecondary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12,
            fontWeight: 600,
            margin: 12,
            interval: 0,
          },
        },
        yAxis: yAxes,
        series: [
          {
            type: 'heatmap',
            name: ariaLabel,
            emphasis: {
              itemStyle: {
                borderColor: chartTheme.borderStrong,
                borderWidth: 2,
              },
            },
            data: flatCells.map((cell) => {
              const fill = resolveCellColor(
                cell.val,
                minVal,
                maxVal,
                maxAbs,
                style,
                chartTheme,
              );
              const textColor = getContrastTextColor(fill, chartTheme.inkDark);
              return {
                value: [cell.c, cell.r, cell.val],
                itemStyle: {
                  color: fill,
                  borderColor: chartTheme.divider,
                  borderWidth: 2,
                  borderRadius: chartTheme.barRadius,
                },
                label: {
                  show: true,
                  color: textColor,
                  fontFamily: chartTheme.fontSans,
                  fontSize: 12,
                  fontWeight: 700,
                  formatter: () => formatValue(cell.val),
                },
              };
            }),
          },
        ],
      };
    },
    [
      ariaLabel,
      columns,
      displayRowSummary,
      flatCells,
      formatValue,
      maxAbs,
      maxVal,
      minVal,
      rowSummaries,
      rows,
      showTooltip,
      style,
      summaryHeader,
    ],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectCell) return;
    const tuple = (event.value as [number, number, number] | undefined) ?? null;
    if (!tuple) return;
    const [cIdx, rIdx, val] = tuple;
    onSelectCell({
      row: rows[rIdx] ?? '',
      column: columns[cIdx] ?? '',
      rowIndex: rIdx,
      columnIndex: cIdx,
      value: val,
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
      onElementClick={onSelectCell ? handleElementClick : undefined}
    />
  );
}
