import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import { Brand, BubbleChartStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import {
  buildTooltipBase,
  escapeHtml,
  resolveToneColor,
  type ChartSemanticTone,
  type ChartTheme,
} from '../../charts/chartTheme';
import { EChartsCanvas } from '../../charts/EChartsCanvas';
import type { ConsultingChartOption } from '../../charts/echartsCore';

export interface BubbleDatum {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  group?: string;
  tone?: ChartSemanticTone;
  highlighted?: boolean;
}

export interface BubbleQuadrantLabels {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

export interface BubbleChartProps {
  data: readonly BubbleDatum[];
  xAxisLabel: string;
  yAxisLabel: string;
  sizeLabel?: string;
  style?: BubbleChartStyle;
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  xThreshold?: number;
  yThreshold?: number;
  quadrantLabels?: BubbleQuadrantLabels;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  formatSize?: (value: number) => string;
  ariaLabel?: string;
  onSelectBubble?: (datum: BubbleDatum) => void;
}

function median(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function BubbleChart({
  data,
  xAxisLabel,
  yAxisLabel,
  sizeLabel = 'Size',
  style = BubbleChartStyle.GrowthShare,
  brand,
  surface,
  height,
  showTooltip = true,
  xThreshold,
  yThreshold,
  quadrantLabels,
  formatX = (v) => String(v),
  formatY = (v) => String(v),
  formatSize = (v) => String(v),
  ariaLabel = 'Quantitative bubble scatter chart',
  onSelectBubble,
}: BubbleChartProps) {
  const theme = useResolvedTheme(brand, surface);
  const resolvedHeight = height ?? 360;
  const hasQuadrants =
    style === BubbleChartStyle.GrowthShare ||
    style === BubbleChartStyle.Quadrant;

  const {
    xMin,
    xMax,
    yMin,
    yMax,
    resolvedXThreshold,
    resolvedYThreshold,
    maxSize,
  } = useMemo(() => {
    const xs = data.map((d) => d.x);
    const ys = data.map((d) => d.y);
    const sizes = data.map((d) => Math.max(0, d.size));

    const minXRaw = xs.length > 0 ? Math.min(...xs) : 0;
    const maxXRaw = xs.length > 0 ? Math.max(...xs) : 100;
    const minYRaw = ys.length > 0 ? Math.min(...ys) : 0;
    const maxYRaw = ys.length > 0 ? Math.max(...ys) : 100;

    const rX = xThreshold ?? median(xs);
    const rY = yThreshold ?? median(ys);

    const lowX = Math.min(minXRaw, rX);
    const highX = Math.max(maxXRaw, rX);
    const lowY = Math.min(minYRaw, rY);
    const highY = Math.max(maxYRaw, rY);

    const spanX = highX - lowX || 1;
    const spanY = highY - lowY || 1;

    const niceBound = (val: number, span: number, dir: 'down' | 'up') => {
      const step = span >= 50 ? 10 : span >= 10 ? 5 : span >= 2 ? 0.5 : 0.2;
      return dir === 'down'
        ? Math.floor(val / step) * step
        : Math.ceil(val / step) * step;
    };

    const computedXMin =
      lowX >= 0
        ? Math.max(0, niceBound(lowX - spanX * 0.18, spanX, 'down'))
        : niceBound(lowX - spanX * 0.18, spanX, 'down');
    const computedYMin =
      lowY >= 0
        ? Math.max(0, niceBound(lowY - spanY * 0.18, spanY, 'down'))
        : niceBound(lowY - spanY * 0.18, spanY, 'down');

    return {
      xMin: Number(computedXMin.toFixed(2)),
      xMax: Number(niceBound(highX + spanX * 0.18, spanX, 'up').toFixed(2)),
      yMin: Number(computedYMin.toFixed(2)),
      yMax: Number(niceBound(highY + spanY * 0.22, spanY, 'up').toFixed(2)),
      resolvedXThreshold: rX,
      resolvedYThreshold: rY,
      maxSize: Math.max(1, ...sizes),
    };
  }, [data, xThreshold, yThreshold]);

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const anyHighlighted = data.some((d) => d.highlighted);
      const resolveBubbleColor = (datum: BubbleDatum, idx: number): string =>
        datum.tone
          ? resolveToneColor(chartTheme, datum.tone, idx)
          : anyHighlighted
            ? datum.highlighted
              ? chartTheme.series[0]
              : chartTheme.neutral
            : chartTheme.series[idx % chartTheme.series.length];

      const markLine = hasQuadrants
        ? {
            symbol: 'none',
            silent: true,
            lineStyle: {
              color: chartTheme.borderStrong,
              type: 'dashed' as const,
              width: 1.25,
              opacity: 0.65,
            },
            label: { show: false },
            data: [
              { xAxis: resolvedXThreshold },
              { yAxis: resolvedYThreshold },
            ],
          }
        : xThreshold !== undefined || yThreshold !== undefined
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
              data: [
                ...(xThreshold !== undefined ? [{ xAxis: xThreshold }] : []),
                ...(yThreshold !== undefined ? [{ yAxis: yThreshold }] : []),
              ],
            }
          : undefined;

      const quadAreas: Array<[Record<string, unknown>, Record<string, unknown>]> =
        [];

      if (hasQuadrants) {
        const labels = quadrantLabels;
        if (style === BubbleChartStyle.Quadrant || labels?.topRight) {
          quadAreas.push([
            {
              name: labels?.topRight ?? '',
              xAxis: resolvedXThreshold,
              yAxis: resolvedYThreshold,
              itemStyle: {
                color:
                  style === BubbleChartStyle.Quadrant
                    ? chartTheme.hoverTint
                    : 'transparent',
              },
              label: {
                show: Boolean(labels?.topRight),
                position: 'insideTopRight',
                distance: 10,
                color: chartTheme.series[0],
                fontFamily: chartTheme.fontSans,
                fontSize: 11.5,
                fontWeight: 700,
              },
            },
            { xAxis: xMax, yAxis: yMax },
          ]);
        }
        if (labels?.topLeft) {
          quadAreas.push([
            {
              name: labels.topLeft,
              xAxis: xMin,
              yAxis: resolvedYThreshold,
              itemStyle: { color: 'transparent' },
              label: {
                show: true,
                position: 'insideTopLeft',
                distance: 10,
                color: chartTheme.textMuted,
                fontFamily: chartTheme.fontSans,
                fontSize: 11.5,
                fontWeight: 600,
              },
            },
            { xAxis: resolvedXThreshold, yAxis: yMax },
          ]);
        }
        if (labels?.bottomLeft) {
          quadAreas.push([
            {
              name: labels.bottomLeft,
              xAxis: xMin,
              yAxis: yMin,
              itemStyle: { color: 'transparent' },
              label: {
                show: true,
                position: 'insideBottomLeft',
                distance: 10,
                color: chartTheme.textMuted,
                fontFamily: chartTheme.fontSans,
                fontSize: 11.5,
                fontWeight: 600,
              },
            },
            { xAxis: resolvedXThreshold, yAxis: resolvedYThreshold },
          ]);
        }
        if (labels?.bottomRight) {
          quadAreas.push([
            {
              name: labels.bottomRight,
              xAxis: resolvedXThreshold,
              yAxis: yMin,
              itemStyle: { color: 'transparent' },
              label: {
                show: true,
                position: 'insideBottomRight',
                distance: 10,
                color: chartTheme.textMuted,
                fontFamily: chartTheme.fontSans,
                fontSize: 11.5,
                fontWeight: 600,
              },
            },
            { xAxis: xMax, yAxis: resolvedYThreshold },
          ]);
        }
      }

      return {
        animationDuration: 380,
        animationEasing: 'cubicOut',
        grid: {
          left: 64,
          right: 28,
          top: 24,
          bottom: 52,
          containLabel: false,
        },
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'item',
          formatter: (params: unknown) => {
            const idx = (params as { dataIndex?: number }).dataIndex ?? 0;
            const datum = data[idx];
            if (!datum) return '';
            const fill = resolveBubbleColor(datum, idx);
            const groupLine = datum.group
              ? `<div style="opacity:0.76;font-size:11px;margin-bottom:2px;">${escapeHtml(datum.group)}</div>`
              : '';
            return `
              <div style="font-weight:700;">${escapeHtml(datum.label)}</div>
              ${groupLine}
              <div><span style="display:inline-block;width:8px;height:8px;border-radius:999px;background:${fill};margin-right:6px;"></span>${escapeHtml(xAxisLabel)}: <strong>${escapeHtml(formatX(datum.x))}</strong></div>
              <div>${escapeHtml(yAxisLabel)}: <strong>${escapeHtml(formatY(datum.y))}</strong></div>
              <div style="border-top:1px solid rgba(255,255,255,0.16);margin-top:4px;padding-top:4px;">${escapeHtml(sizeLabel)}: <strong>${escapeHtml(formatSize(datum.size))}</strong></div>
            `;
          },
        },
        xAxis: {
          type: 'value',
          min: xMin,
          max: xMax,
          name: xAxisLabel,
          nameLocation: 'middle',
          nameGap: 32,
          nameTextStyle: {
            color: chartTheme.textSecondary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12,
            fontWeight: 600,
          },
          axisLine: {
            show: true,
            lineStyle: { color: chartTheme.borderStrong, width: 1 },
          },
          axisTick: { show: false },
          splitLine: {
            show: style === BubbleChartStyle.Scatter,
            lineStyle: { color: chartTheme.gridLine, width: 1 },
          },
          axisLabel: {
            color: chartTheme.textMuted,
            fontFamily: chartTheme.fontSans,
            fontSize: 11.5,
            formatter: (v: number) => formatX(v),
          },
        },
        yAxis: {
          type: 'value',
          min: yMin,
          max: yMax,
          name: yAxisLabel,
          nameLocation: 'middle',
          nameGap: 46,
          nameTextStyle: {
            color: chartTheme.textSecondary,
            fontFamily: chartTheme.fontSans,
            fontSize: 12,
            fontWeight: 600,
          },
          axisLine: {
            show: true,
            lineStyle: { color: chartTheme.borderStrong, width: 1 },
          },
          axisTick: { show: false },
          splitLine: {
            show: style === BubbleChartStyle.Scatter,
            lineStyle: { color: chartTheme.gridLine, width: 1 },
          },
          axisLabel: {
            color: chartTheme.textMuted,
            fontFamily: chartTheme.fontSans,
            fontSize: 11.5,
            formatter: (v: number) => formatY(v),
          },
        },
        series: [
          {
            type: 'scatter',
            name: ariaLabel,
            markLine,
            markArea:
              quadAreas.length > 0
                ? {
                    silent: true,
                    data: quadAreas as never,
                  }
                : undefined,
            labelLayout: {
              moveOverlap: 'shiftY',
            },
            data: data.map((datum, idx) => {
              // True area-proportional bubble diameter (sqrt scaling, 10px floor)
              const ratio = Math.sqrt(Math.max(0, datum.size) / maxSize);
              const diameter = Math.max(10, Math.round(ratio * 56));
              const fill = resolveBubbleColor(datum, idx);

              return {
                name: datum.label,
                value: [datum.x, datum.y, datum.size],
                symbolSize: diameter,
                itemStyle: {
                  color: fill,
                  opacity:
                    anyHighlighted && !datum.highlighted ? 0.55 : 0.84,
                  borderColor: fill,
                  borderWidth: datum.highlighted ? 2 : 1,
                },
                label: {
                  show: true,
                  position: 'top',
                  distance: 5,
                  formatter: datum.label,
                  color: datum.highlighted
                    ? chartTheme.textPrimary
                    : chartTheme.textSecondary,
                  fontFamily: chartTheme.fontSans,
                  fontSize: 11.5,
                  fontWeight: datum.highlighted ? 700 : 600,
                },
              };
            }),
          },
        ],
      };
    },
    [
      ariaLabel,
      data,
      formatSize,
      formatX,
      formatY,
      hasQuadrants,
      maxSize,
      quadrantLabels,
      resolvedXThreshold,
      resolvedYThreshold,
      showTooltip,
      sizeLabel,
      style,
      xAxisLabel,
      xMax,
      xMin,
      xThreshold,
      yAxisLabel,
      yMax,
      yMin,
      yThreshold,
    ],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectBubble) return;
    const datum = data[event.dataIndex];
    if (datum) onSelectBubble(datum);
  };

  return (
    <EChartsCanvas
      buildOption={buildOption}
      height={resolvedHeight}
      brand={theme.brand}
      surface={theme.surface}
      styleVariant={style}
      ariaLabel={ariaLabel}
      onElementClick={onSelectBubble ? handleElementClick : undefined}
    />
  );
}
