import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import { Brand, Surface, WaterfallStyle } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import {
  buildTooltipBase,
  escapeHtml,
  type ChartTheme,
} from '../../charts/chartTheme';
import { EChartsCanvas } from '../../charts/EChartsCanvas';
import type { ConsultingChartOption } from '../../charts/echartsCore';

export type WaterfallStepKind = 'start' | 'delta' | 'subtotal' | 'total';

export interface WaterfallStep {
  id: string;
  label: string;
  value: number;
  kind?: WaterfallStepKind;
}

export interface WaterfallChartProps {
  steps: readonly WaterfallStep[];
  style?: WaterfallStyle;
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
  onSelectStep?: (step: WaterfallStep) => void;
}

interface ComputedWaterfallBar {
  index: number;
  step: WaterfallStep;
  kind: WaterfallStepKind;
  raw: number;
  startVal: number;
  endVal: number;
  displayLabel: string;
}

function computeWaterfallLayout(
  steps: readonly WaterfallStep[],
  formatValue: (value: number) => string,
) {
  let running = 0;
  let minV = 0;
  let maxV = 0;
  const bars: ComputedWaterfallBar[] = [];

  for (let index = 0; index < steps.length; index++) {
    const step = steps[index];
    const kind: WaterfallStepKind =
      step.kind ?? (index === 0 ? 'start' : 'delta');

    let startVal = 0;
    let endVal = 0;
    let raw = step.value;
    let displayLabel = '';

    if (kind === 'start') {
      running = step.value;
      startVal = 0;
      endVal = running;
      displayLabel = formatValue(running);
    } else if (kind === 'subtotal' || kind === 'total') {
      startVal = 0;
      endVal = running;
      raw = running;
      displayLabel = formatValue(running);
    } else {
      startVal = running;
      endVal = running + step.value;
      running = endVal;
      const absFormatted = formatValue(Math.abs(step.value));
      displayLabel =
        step.value > 0
          ? `+${absFormatted}`
          : step.value < 0
            ? `-${absFormatted}`
            : absFormatted;
    }

    minV = Math.min(minV, startVal, endVal);
    maxV = Math.max(maxV, startVal, endVal);

    bars.push({
      index,
      step,
      kind,
      raw,
      startVal,
      endVal,
      displayLabel,
    });
  }

  const span = maxV - minV || 1;
  return {
    bars,
    minDomain: minV < 0 ? minV - span * 0.16 : 0,
    maxDomain: maxV + span * 0.22,
  };
}

export function WaterfallChart({
  steps,
  style = WaterfallStyle.Classic,
  brand,
  surface,
  height,
  showTooltip = true,
  formatValue = (n) => String(n),
  ariaLabel = 'Waterfall value bridge chart',
  onSelectStep,
}: WaterfallChartProps) {
  const theme = useResolvedTheme(brand, surface);
  const resolvedHeight =
    height ?? (style === WaterfallStyle.Compact ? 236 : 300);

  const { bars, minDomain, maxDomain } = useMemo(
    () => computeWaterfallLayout(steps, formatValue),
    [steps, formatValue],
  );

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const categories = bars.map((b) => b.step.label);

      const resolveBarFill = (bar: ComputedWaterfallBar): string => {
        if (
          bar.kind === 'start' ||
          bar.kind === 'subtotal' ||
          bar.kind === 'total'
        ) {
          return chartTheme.series[1];
        }
        return bar.raw >= 0 ? chartTheme.series[0] : chartTheme.negative;
      };

      const resolveLabelColor = (bar: ComputedWaterfallBar): string => {
        if (bar.kind === 'delta' && bar.raw < 0) return chartTheme.negative;
        return chartTheme.textPrimary;
      };

      return {
        animationDuration: 360,
        animationEasing: 'cubicOut',
        grid: {
          left: 20,
          right: 20,
          top: 36,
          bottom: style === WaterfallStyle.Compact ? 42 : 52,
          containLabel: false,
        },
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'item',
          formatter: (params: unknown) => {
            const idx = (params as { dataIndex?: number }).dataIndex ?? 0;
            const bar = bars[idx];
            if (!bar) return '';
            const role =
              bar.kind === 'start'
                ? 'Baseline'
                : bar.kind === 'subtotal'
                  ? 'Subtotal'
                  : bar.kind === 'total'
                    ? 'Ending Total'
                    : bar.raw >= 0
                      ? 'Positive Driver'
                      : 'Negative Driver';
            const detailLine =
              bar.kind === 'delta'
                ? `<div style="opacity:0.78;margin-top:2px;">Running total: ${escapeHtml(formatValue(bar.endVal))}</div>`
                : '';
            return `
              <div style="font-weight:700;margin-bottom:2px;">${escapeHtml(bar.step.label)}</div>
              <div><span style="opacity:0.78;">${role}:</span> <strong>${escapeHtml(bar.displayLabel)}</strong></div>
              ${detailLine}
            `;
          },
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            interval: 0,
            margin: 14,
            color: chartTheme.textSecondary,
            fontFamily: chartTheme.fontSans,
            fontSize: style === WaterfallStyle.Compact ? 11 : 12,
            lineHeight: 15,
            formatter: (val: string, idx: number) => {
              const bar = bars[idx];
              const isEmphasis =
                bar?.kind === 'total' ||
                bar?.kind === 'subtotal' ||
                bar?.kind === 'start';
              return isEmphasis ? `{bold|${val}}` : val;
            },
            rich: {
              bold: {
                fontWeight: 700,
                color: chartTheme.textPrimary,
                fontFamily: chartTheme.fontSans,
                fontSize: style === WaterfallStyle.Compact ? 11 : 12,
              },
            },
          },
        },
        yAxis: {
          type: 'value',
          min: minDomain,
          max: maxDomain,
          show: false,
        },
        series: [
          {
            type: 'custom',
            name: 'Waterfall',
            silent: false,
            renderItem: (params, api) => {
              const idx = params.dataIndex;
              const bar = bars[idx];
              if (!bar) return null;

              const topVal = Math.max(bar.startVal, bar.endVal);
              const bottomVal = Math.min(bar.startVal, bar.endVal);
              const topCoord = api.coord([idx, topVal]);
              const bottomCoord = api.coord([idx, bottomVal]);
              const sizeResult = api.size!([1, 0]);
              const slotWidth = Array.isArray(sizeResult)
                ? sizeResult[0]
                : sizeResult;
              const barWidth = Math.min(64, Math.max(20, slotWidth * 0.56));
              const x = topCoord[0] - barWidth / 2;
              const y = topCoord[1];
              const rectH = Math.max(3, bottomCoord[1] - topCoord[1]);
              const fill = resolveBarFill(bar);
              const isNegativeDelta = bar.kind === 'delta' && bar.raw < 0;
              const radius = chartTheme.barRadius;

              const children: Array<Record<string, unknown>> = [];

              if (idx === 0) {
                const zeroY = api.coord([0, 0])[1];
                const coordSys = params.coordSys as unknown as {
                  x: number;
                  width: number;
                };
                children.push({
                  type: 'line',
                  silent: true,
                  shape: {
                    x1: coordSys.x,
                    y1: zeroY,
                    x2: coordSys.x + coordSys.width,
                    y2: zeroY,
                  },
                  style: {
                    stroke: chartTheme.borderStrong,
                    lineWidth: 1.25,
                  },
                });
              }

              if (style === WaterfallStyle.Classic && idx < bars.length - 1) {
                const connectorY = api.coord([idx, bar.endVal])[1];
                const nextCenterX = api.coord([idx + 1, bar.endVal])[0];
                children.push({
                  type: 'line',
                  silent: true,
                  shape: {
                    x1: x + barWidth,
                    y1: connectorY,
                    x2: nextCenterX - barWidth / 2,
                    y2: connectorY,
                  },
                  style: {
                    stroke: chartTheme.textMuted,
                    lineWidth: 1,
                    lineDash: [3, 3],
                    opacity: 0.7,
                  },
                });
              }

              children.push({
                type: 'rect',
                shape: {
                  x,
                  y,
                  width: barWidth,
                  height: rectH,
                  r: radius,
                },
                style: {
                  fill,
                },
                emphasis: {
                  style: {
                    opacity: 0.88,
                  },
                },
              });

              children.push({
                type: 'text',
                silent: true,
                style: {
                  text: bar.displayLabel,
                  x: topCoord[0],
                  y: isNegativeDelta ? y + rectH + 14 : y - 10,
                  textAlign: 'center',
                  textVerticalAlign: 'middle',
                  fill: resolveLabelColor(bar),
                  font: `700 ${style === WaterfallStyle.Compact ? 11.5 : 12.5}px ${chartTheme.fontSans}`,
                },
              });

              return {
                type: 'group',
                children,
              } as never;
            },
            data: bars.map((b) => [b.index, b.endVal, b.startVal, b.raw]),
          },
        ],
      };
    },
    [bars, formatValue, maxDomain, minDomain, showTooltip, style],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectStep) return;
    const bar = bars[event.dataIndex];
    if (bar) onSelectStep(bar.step);
  };

  return (
    <EChartsCanvas
      buildOption={buildOption}
      height={resolvedHeight}
      brand={theme.brand}
      surface={theme.surface}
      styleVariant={style}
      ariaLabel={ariaLabel}
      onElementClick={onSelectStep ? handleElementClick : undefined}
    />
  );
}
