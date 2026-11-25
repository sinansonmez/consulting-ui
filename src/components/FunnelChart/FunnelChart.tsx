import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import { Brand, FunnelStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import {
  buildTooltipBase,
  escapeHtml,
  getContrastTextColor,
  resolveToneColor,
  type ChartSemanticTone,
  type ChartTheme,
} from '../../charts/chartTheme';
import { EChartsCanvas } from '../../charts/EChartsCanvas';
import type { ConsultingChartOption } from '../../charts/echartsCore';

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  note?: string;
  tone?: ChartSemanticTone;
}

export interface FunnelChartProps {
  stages: readonly FunnelStage[];
  style?: FunnelStyle;
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  showConversionRates?: boolean;
  conversionColumnLabel?: string;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
  onSelectStage?: (stage: FunnelStage, index: number) => void;
}

interface ComputedFunnelStage {
  index: number;
  stage: FunnelStage;
  shareOfStartPct: number;
  stepConversionPct: number;
  formattedValue: string;
}

function resolveStageColor(
  chartTheme: ChartTheme,
  stage: FunnelStage,
  index: number,
  totalStages: number,
): string {
  if (stage.tone) {
    return resolveToneColor(chartTheme, stage.tone, index);
  }
  // Default consulting progression: anchor top stages in deep/muted progression, highlight apex or step smoothly
  if (totalStages <= 1) return chartTheme.series[0];
  if (index === totalStages - 1) return chartTheme.series[0];
  if (index === 0) return chartTheme.series[1];
  return chartTheme.series[Math.min(index + 1, chartTheme.series.length - 1)];
}

function formatPct(pct: number): string {
  if (pct >= 10 || pct === 0) return `${Math.round(pct)}%`;
  return `${pct.toFixed(1).replace(/\.0$/, '')}%`;
}

export function FunnelChart({
  stages,
  style = FunnelStyle.Tiered,
  brand,
  surface,
  height,
  showTooltip = true,
  showConversionRates = true,
  conversionColumnLabel = 'Of start',
  formatValue = (v) => String(v),
  ariaLabel = 'Scaling attrition funnel chart',
  onSelectStage,
}: FunnelChartProps) {
  const theme = useResolvedTheme(brand, surface);

  const computed = useMemo<readonly ComputedFunnelStage[]>(() => {
    const startVal = Math.max(1e-9, stages[0]?.value ?? 1);
    return stages.map((stage, index) => {
      const prevVal = index === 0 ? startVal : Math.max(1e-9, stages[index - 1].value);
      return {
        index,
        stage,
        shareOfStartPct: (stage.value / startVal) * 100,
        stepConversionPct: (stage.value / prevVal) * 100,
        formattedValue: formatValue(stage.value),
      };
    });
  }, [formatValue, stages]);

  const resolvedHeight =
    height ??
    (style === FunnelStyle.Horizontal
      ? 260
      : style === FunnelStyle.Tapered
        ? Math.max(260, stages.length * 64 + 36)
        : Math.max(220, stages.length * 58 + 40));

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const tooltipFormatter = (params: unknown) => {
        const idx = (params as { dataIndex?: number }).dataIndex ?? 0;
        const item = computed[idx];
        if (!item) return '';
        const fill = resolveStageColor(
          chartTheme,
          item.stage,
          idx,
          computed.length,
        );
        const noteLine = item.stage.note
          ? `<div style="opacity:0.78;margin-top:2px;">${escapeHtml(item.stage.note)}</div>`
          : '';
        const stepLine =
          idx > 0
            ? `<div style="opacity:0.82;">Step conversion: <strong>${formatPct(item.stepConversionPct)}</strong></div>`
            : '';
        return `
          <div style="font-weight:700;margin-bottom:3px;">${escapeHtml(item.stage.label)}</div>
          <div><span style="display:inline-block;width:8px;height:8px;background:${fill};margin-right:6px;"></span>Count: <strong>${escapeHtml(item.formattedValue)}</strong></div>
          <div style="opacity:0.82;">Share of start: <strong>${formatPct(item.shareOfStartPct)}</strong></div>
          ${stepLine}
          ${noteLine}
        `;
      };

      const baseChrome = {
        animationDuration: 360,
        animationEasing: 'cubicOut' as const,
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'item' as const,
          formatter: tooltipFormatter,
        },
      };

      // -----------------------------------------------------------------------
      // STYLE 2: TAPERED — Native ECharts centered trapezoid funnel
      // -----------------------------------------------------------------------
      if (style === FunnelStyle.Tapered) {
        return {
          ...baseChrome,
          series: [
            {
              type: 'funnel',
              name: ariaLabel,
              sort: 'none',
              left: '8%',
              right: showConversionRates ? '30%' : '18%',
              top: 16,
              bottom: 16,
              minSize: '14%',
              maxSize: '100%',
              gap: 3,
              itemStyle: {
                borderColor: chartTheme.divider,
                borderWidth: 1,
              },
              labelLine: {
                show: true,
                length: 16,
                lineStyle: {
                  color: chartTheme.borderStrong,
                  width: 1,
                },
              },
              emphasis: {
                itemStyle: {
                  opacity: 0.9,
                },
              },
              data: computed.map((item) => {
                const fill = resolveStageColor(
                  chartTheme,
                  item.stage,
                  item.index,
                  computed.length,
                );
                const pctSuffix = showConversionRates
                  ? `  (${formatPct(item.shareOfStartPct)})`
                  : '';
                return {
                  name: item.stage.label,
                  value: item.stage.value,
                  itemStyle: { color: fill },
                  label: {
                    show: true,
                    position: 'right',
                    formatter: `{lbl|${item.stage.label}}\n{val|${item.formattedValue}}{pct|${pctSuffix}}`,
                    rich: {
                      lbl: {
                        color: chartTheme.textPrimary,
                        fontFamily: chartTheme.fontSans,
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: 16,
                      },
                      val: {
                        color: chartTheme.textPrimary,
                        fontFamily: chartTheme.fontSans,
                        fontSize: 12.5,
                        fontWeight: 700,
                        lineHeight: 17,
                      },
                      pct: {
                        color: chartTheme.textMuted,
                        fontFamily: chartTheme.fontSans,
                        fontSize: 11.5,
                        fontWeight: 500,
                        lineHeight: 17,
                      },
                    },
                  },
                };
              }),
            },
          ],
        };
      }

      // -----------------------------------------------------------------------
      // STYLE 3: HORIZONTAL — Left-to-right tapered stage funnel
      // -----------------------------------------------------------------------
      if (style === FunnelStyle.Horizontal) {
        const count = Math.max(1, computed.length);
        const maxVal = Math.max(1, ...computed.map((c) => c.stage.value));

        return {
          ...baseChrome,
          grid: {
            left: 16,
            right: 16,
            top: 44,
            bottom: showConversionRates ? 36 : 18,
            containLabel: false,
          },
          xAxis: {
            type: 'value',
            min: 0,
            max: count,
            show: false,
          },
          yAxis: {
            type: 'value',
            min: -100,
            max: 100,
            show: false,
          },
          series: [
            {
              type: 'custom',
              name: ariaLabel,
              renderItem: (params, api) => {
                const idx = params.dataIndex;
                const item = computed[idx];
                if (!item) return null;
                const next = computed[idx + 1];

                const leftRatio = Math.max(0.14, item.stage.value / maxVal);
                const rightRatio = next
                  ? Math.max(0.14, next.stage.value / maxVal)
                  : leftRatio * 0.72;

                const gapX = 0.04;
                const x0 = idx + gapX / 2;
                const x1 = idx + 1 - gapX / 2;
                const yHalfLeft = leftRatio * 84;
                const yHalfRight = rightRatio * 84;

                const pTL = api.coord([x0, yHalfLeft]);
                const pTR = api.coord([x1, yHalfRight]);
                const pBR = api.coord([x1, -yHalfRight]);
                const pBL = api.coord([x0, -yHalfLeft]);
                const centerX = (pTL[0] + pTR[0]) / 2;
                const centerY = api.coord([0, 0])[1];
                const topY = api.coord([0, 100])[1];
                const bottomY = api.coord([0, -100])[1];
                const fill = resolveStageColor(
                  chartTheme,
                  item.stage,
                  idx,
                  computed.length,
                );
                const textColor = getContrastTextColor(
                  fill,
                  chartTheme.inkDark,
                );
                const minBandH = Math.min(pBL[1] - pTL[1], pBR[1] - pTR[1]);

                const children: Array<Record<string, unknown>> = [
                  {
                    type: 'polygon',
                    shape: {
                      points: [pTL, pTR, pBR, pBL],
                    },
                    style: {
                      fill,
                      stroke: chartTheme.divider,
                      lineWidth: 1,
                    },
                    emphasis: {
                      style: { opacity: 0.9 },
                    },
                  },
                  // Stage label above polygon
                  {
                    type: 'text',
                    silent: true,
                    style: {
                      text: item.stage.label,
                      x: centerX,
                      y: topY - 16,
                      textAlign: 'center',
                      textVerticalAlign: 'bottom',
                      fill: chartTheme.textPrimary,
                      font: `600 12px ${chartTheme.fontSans}`,
                    },
                  },
                  // Value label (centered inside if tall enough, otherwise just above band)
                  {
                    type: 'text',
                    silent: true,
                    style: {
                      text: item.formattedValue,
                      x: centerX,
                      y: minBandH >= 28 ? centerY : Math.min(pTL[1], pTR[1]) - 10,
                      textAlign: 'center',
                      textVerticalAlign: 'middle',
                      fill: minBandH >= 28 ? textColor : chartTheme.textPrimary,
                      font: `700 12.5px ${chartTheme.fontSans}`,
                    },
                  },
                ];

                if (showConversionRates) {
                  children.push({
                    type: 'text',
                    silent: true,
                    style: {
                      text:
                        idx === 0
                          ? '100%'
                          : `${formatPct(item.shareOfStartPct)} of start`,
                      x: centerX,
                      y: bottomY + 14,
                      textAlign: 'center',
                      textVerticalAlign: 'top',
                      fill: chartTheme.textMuted,
                      font: `600 11.5px ${chartTheme.fontSans}`,
                    },
                  });
                }

                return {
                  type: 'group',
                  children,
                } as never;
              },
              data: computed.map((c) => [c.index, c.stage.value]),
            },
          ],
        };
      }

      // -----------------------------------------------------------------------
      // STYLE 1: TIERED (Default) — Consulting stepped bars + drop-off bridges
      // -----------------------------------------------------------------------
      const categories = computed.map((c) => c.stage.label);
      const maxLabelLen = Math.max(
        8,
        ...computed.map((c) =>
          Math.max(c.stage.label.length, (c.stage.note?.length ?? 0) * 0.88),
        ),
      );
      const leftPad = Math.min(220, Math.max(104, Math.ceil(maxLabelLen * 7.4 + 20)));
      const rightPad = showConversionRates
        ? Math.min(126, Math.max(78, conversionColumnLabel.length * 6.8 + 24))
        : 24;
      const maxVal = Math.max(1, ...computed.map((c) => c.stage.value));

      const yAxes: ConsultingChartOption['yAxis'] = [
        {
          type: 'category',
          inverse: true,
          data: categories,
          axisLine: {
            show: true,
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
              const note = computed[idx]?.stage.note;
              if (!note) return `{lbl|${val}}`;
              return `{lbl|${val}}\n{note|${note}}`;
            },
            rich: {
              lbl: {
                color: chartTheme.textPrimary,
                fontFamily: chartTheme.fontSans,
                fontSize: 12.5,
                fontWeight: 600,
                lineHeight: 16,
              },
              note: {
                color: chartTheme.textMuted,
                fontFamily: chartTheme.fontSans,
                fontSize: 11,
                fontWeight: 400,
                lineHeight: 15,
              },
            },
          },
        },
      ];

      if (showConversionRates) {
        yAxes.push({
          type: 'category',
          position: 'right',
          inverse: true,
          data: computed.map((c) => formatPct(c.shareOfStartPct)),
          name: conversionColumnLabel,
          nameLocation: 'start',
          nameGap: 10,
          nameTextStyle: {
            color: chartTheme.textMuted,
            fontFamily: chartTheme.fontSans,
            fontSize: 11,
            fontWeight: 700,
            align: 'left',
            padding: [0, 0, 0, 14],
          },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            margin: 14,
            fontFamily: chartTheme.fontSans,
            fontSize: 12,
            formatter: (val: string, idx: number) => {
              const kind =
                idx === computed.length - 1
                  ? 'apex'
                  : idx === 0
                    ? 'base'
                    : 'mid';
              return `{${kind}|${val}}`;
            },
            rich: {
              base: {
                color: chartTheme.textMuted,
                fontWeight: 600,
                fontFamily: chartTheme.fontSans,
                fontSize: 12,
              },
              mid: {
                color: chartTheme.textPrimary,
                fontWeight: 600,
                fontFamily: chartTheme.fontSans,
                fontSize: 12,
              },
              apex: {
                color: chartTheme.series[0],
                fontWeight: 700,
                fontFamily: chartTheme.fontSans,
                fontSize: 12.5,
              },
            },
          },
        });
      }

      return {
        ...baseChrome,
        grid: {
          left: leftPad,
          right: rightPad,
          top: showConversionRates ? 30 : 14,
          bottom: 14,
          containLabel: false,
        },
        xAxis: {
          type: 'value',
          min: 0,
          max: maxVal * 1.28,
          show: false,
        },
        yAxis: yAxes,
        series: [
          {
            type: 'custom',
            name: ariaLabel,
            renderItem: (params, api) => {
              const idx = params.dataIndex;
              const item = computed[idx];
              if (!item) return null;

              const zeroPt = api.coord([0, idx]);
              const endPt = api.coord([item.stage.value, idx]);
              const sizeRes = api.size!([0, 1]);
              const rowStep = Array.isArray(sizeRes) ? sizeRes[1] : sizeRes;
              const barH = Math.min(30, Math.max(18, rowStep * 0.54));
              const y = zeroPt[1] - barH / 2;
              const barW = Math.max(8, endPt[0] - zeroPt[0]);
              const fill = resolveStageColor(
                chartTheme,
                item.stage,
                idx,
                computed.length,
              );
              const r = chartTheme.barRadius;

              const children: Array<Record<string, unknown>> = [];

              // Connecting subtle trapezoid bridge to the next tier below
              const next = computed[idx + 1];
              if (next) {
                const nextZeroPt = api.coord([0, idx + 1]);
                const nextEndPt = api.coord([next.stage.value, idx + 1]);
                const nextYTop = nextZeroPt[1] - barH / 2;
                const nextW = Math.max(8, nextEndPt[0] - nextZeroPt[0]);
                children.push({
                  type: 'polygon',
                  silent: true,
                  shape: {
                    points: [
                      [zeroPt[0], y + barH],
                      [zeroPt[0] + barW, y + barH],
                      [nextZeroPt[0] + nextW, nextYTop],
                      [nextZeroPt[0], nextYTop],
                    ],
                  },
                  style: {
                    fill: chartTheme.muted,
                    opacity: 0.55,
                  },
                });
              }

              // Main stepped tier bar
              children.push({
                type: 'rect',
                shape: {
                  x: zeroPt[0],
                  y,
                  width: barW,
                  height: barH,
                  r: [0, r, r, 0],
                },
                style: {
                  fill,
                },
                emphasis: {
                  style: { opacity: 0.88 },
                },
              });

              // Direct bold value label at bar end
              children.push({
                type: 'text',
                silent: true,
                style: {
                  text: item.formattedValue,
                  x: zeroPt[0] + barW + 8,
                  y: zeroPt[1],
                  textAlign: 'left',
                  textVerticalAlign: 'middle',
                  fill: chartTheme.textPrimary,
                  font: `700 12px ${chartTheme.fontSans}`,
                },
              });

              return {
                type: 'group',
                children,
              } as never;
            },
            data: computed.map((c) => [c.stage.value, c.index]),
          },
        ],
      };
    },
    [
      ariaLabel,
      computed,
      conversionColumnLabel,
      showConversionRates,
      showTooltip,
      style,
    ],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectStage) return;
    const item = computed[event.dataIndex];
    if (item) onSelectStage(item.stage, item.index);
  };

  return (
    <EChartsCanvas
      buildOption={buildOption}
      height={resolvedHeight}
      brand={theme.brand}
      surface={theme.surface}
      styleVariant={style}
      ariaLabel={ariaLabel}
      onElementClick={onSelectStage ? handleElementClick : undefined}
    />
  );
}
