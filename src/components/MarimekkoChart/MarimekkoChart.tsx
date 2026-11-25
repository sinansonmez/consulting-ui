import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import { Brand, MarimekkoStyle, Surface } from '../../theme/enums';
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
import styles from './MarimekkoChart.module.css';

export interface MarimekkoSegment {
  id: string;
  label: string;
  value: number;
  tone?: ChartSemanticTone;
  footnoteRef?: string;
}

export interface MarimekkoColumn {
  id: string;
  label?: string;
  segments: readonly MarimekkoSegment[];
}

export interface MarimekkoHeroCallout {
  label: string;
  value: string;
}

export interface MarimekkoSelection {
  column: MarimekkoColumn;
  segment: MarimekkoSegment;
  shareOfTotalPct: number;
}

export interface MarimekkoChartProps {
  columns: readonly MarimekkoColumn[];
  style?: MarimekkoStyle;
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  totalCallout?: MarimekkoHeroCallout;
  highlightCallout?: MarimekkoHeroCallout;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
  onSelectSegment?: (selection: MarimekkoSelection) => void;
}

interface ComputedGeometryBlock {
  flatIndex: number;
  colIndex: number;
  segIndex: number;
  isRightmostCol: boolean;
  column: MarimekkoColumn;
  segment: MarimekkoSegment;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  shareOfTotalPct: number;
  displayLabel: string;
  formattedValue: string;
  needsExternalCallout: boolean;
  calloutYMidPct: number;
}

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

function toSuperscript(ref?: string): string {
  if (!ref) return '';
  return ref
    .split('')
    .map((ch) => SUPERSCRIPTS[ch] ?? ch)
    .join('');
}

export function MarimekkoChart({
  columns,
  style = MarimekkoStyle.Editorial,
  brand,
  surface,
  height,
  showTooltip = true,
  totalCallout,
  highlightCallout,
  formatValue = (v) => v.toFixed(1),
  ariaLabel = 'Marimekko proportional composition chart',
  onSelectSegment,
}: MarimekkoChartProps) {
  const theme = useResolvedTheme(brand, surface);
  const isCompact = style === MarimekkoStyle.Compact;
  const resolvedHeight = height ?? (isCompact ? 240 : 410);

  const { blocks, columnSummaries, hasRightCallouts } = useMemo(() => {
    const colTotals = columns.map((col) =>
      col.segments.reduce((sum, s) => sum + Math.max(0, s.value), 0),
    );
    const grandTotal = colTotals.reduce((a, b) => a + b, 0) || 1;
    const plotHeight = resolvedHeight - 16;

    const computed: ComputedGeometryBlock[] = [];
    const summaries = columns.map((col, idx) => ({
      id: col.id,
      label: col.label ?? col.id,
      total: colTotals[idx],
      widthPct: (colTotals[idx] / grandTotal) * 100,
    }));

    let curX = 0;
    let flatIndex = 0;

    columns.forEach((col, colIndex) => {
      const colTotal = colTotals[colIndex] || 1;
      const widthPct = (colTotals[colIndex] / grandTotal) * 100;
      const x0 = curX;
      const x1 = curX + widthPct;
      curX = x1;

      const isRightmostCol = colIndex === columns.length - 1;
      let curY = 0;

      col.segments.forEach((seg, segIndex) => {
        const val = Math.max(0, seg.value);
        const hPct = (val / colTotal) * 100;
        const y0 = curY;
        const y1 = curY + hPct;
        curY = y1;

        const estPxHeight = (hPct / 100) * plotHeight;
        const displayLabel = `${seg.label}${toSuperscript(seg.footnoteRef)}`;
        const needsExternalCallout =
          !isCompact && isRightmostCol && estPxHeight < 25;

        computed.push({
          flatIndex,
          colIndex,
          segIndex,
          isRightmostCol,
          column: col,
          segment: seg,
          x0,
          x1,
          y0,
          y1,
          shareOfTotalPct: (val / grandTotal) * 100,
          displayLabel,
          formattedValue: formatValue(val),
          needsExternalCallout,
          calloutYMidPct: (y0 + y1) / 2,
        });
        flatIndex++;
      });
    });

    const minSepPct = (20 / Math.max(120, plotHeight)) * 100;
    const minStartPct =
      !isCompact && highlightCallout
        ? (74 / Math.max(120, plotHeight)) * 100
        : 3;
    const slivers = computed.filter((b) => b.needsExternalCallout);
    for (let i = 0; i < slivers.length; i++) {
      if (i === 0) {
        slivers[i].calloutYMidPct = Math.max(
          minStartPct,
          slivers[i].calloutYMidPct,
        );
      } else {
        const prev = slivers[i - 1].calloutYMidPct;
        if (slivers[i].calloutYMidPct - prev < minSepPct) {
          slivers[i].calloutYMidPct = prev + minSepPct;
        }
      }
    }
    for (let i = slivers.length - 1; i >= 0; i--) {
      const limit = 97 - (slivers.length - 1 - i) * minSepPct;
      if (slivers[i].calloutYMidPct > limit) {
        slivers[i].calloutYMidPct = Math.max(minStartPct, limit);
      }
    }

    return {
      blocks: computed,
      columnSummaries: summaries,
      hasRightCallouts:
        slivers.length > 0 || Boolean(!isCompact && highlightCallout),
    };
  }, [columns, formatValue, highlightCallout, isCompact, resolvedHeight]);

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const rightGutter = hasRightCallouts ? 225 : 4;

      return {
        animationDuration: 360,
        animationEasing: 'cubicOut',
        grid: {
          left: 2,
          right: rightGutter,
          top: 6,
          bottom: 6,
          containLabel: false,
        },
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'item',
          formatter: (params: unknown) => {
            const idx = (params as { dataIndex?: number }).dataIndex ?? 0;
            const block = blocks[idx];
            if (!block) return '';
            const fill = resolveToneColor(
              chartTheme,
              block.segment.tone,
              block.segIndex,
            );
            return `
              <div style="font-weight:700;margin-bottom:3px;">${escapeHtml(block.displayLabel)}</div>
              <div><span style="display:inline-block;width:8px;height:8px;background:${fill};margin-right:6px;"></span>Value: <strong>${escapeHtml(block.formattedValue)}</strong></div>
              <div style="opacity:0.82;margin-top:2px;">Share of total: <strong>${block.shareOfTotalPct.toFixed(1)}%</strong></div>
            `;
          },
        },
        xAxis: {
          type: 'value',
          min: 0,
          max: 100,
          show: false,
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          inverse: true,
          show: false,
        },
        series: [
          {
            type: 'custom',
            name: 'Marimekko',
            renderItem: (params, api) => {
              const idx = params.dataIndex;
              const block = blocks[idx];
              if (!block) return null;

              const topLeft = api.coord([block.x0, block.y0]);
              const bottomRight = api.coord([block.x1, block.y1]);
              const x = topLeft[0];
              const y = topLeft[1];
              const w = Math.max(1, bottomRight[0] - topLeft[0]);
              const h = Math.max(1, bottomRight[1] - topLeft[1]);
              const fill = resolveToneColor(
                chartTheme,
                block.segment.tone,
                block.segIndex,
              );
              const textColor = getContrastTextColor(
                fill,
                chartTheme.textPrimary,
              );

              const children: Array<Record<string, unknown>> = [
                {
                  type: 'rect',
                  shape: { x, y, width: w, height: h },
                  style: {
                    fill,
                    stroke: chartTheme.divider,
                    lineWidth: 1,
                  },
                  emphasis: {
                    style: { opacity: 0.9 },
                  },
                },
              ];

              const padX = isCompact ? 8 : 12;
              const labelFontSize = isCompact ? 11 : 13;
              const valFontSize = isCompact ? 11 : 13.5;

              if (h >= 42 && w >= 68) {
                children.push(
                  {
                    type: 'text',
                    silent: true,
                    style: {
                      text: block.displayLabel,
                      x: x + padX,
                      y: y + (isCompact ? 10 : 14),
                      width: Math.max(24, w - padX * 2),
                      overflow: 'truncate',
                      textAlign: 'left',
                      textVerticalAlign: 'top',
                      fill: textColor,
                      font: `500 ${labelFontSize}px ${chartTheme.fontSans}`,
                    },
                  },
                  {
                    type: 'text',
                    silent: true,
                    style: {
                      text: block.formattedValue,
                      x: x + w - padX,
                      y: y + h - (isCompact ? 8 : 11),
                      textAlign: 'right',
                      textVerticalAlign: 'bottom',
                      fill: textColor,
                      font: `700 ${valFontSize}px ${chartTheme.fontSans}`,
                    },
                  },
                );
              } else if (h >= 24 && w >= 80 && !block.needsExternalCallout) {
                const cy = y + h / 2;
                children.push(
                  {
                    type: 'text',
                    silent: true,
                    style: {
                      text: block.displayLabel,
                      x: x + padX,
                      y: cy,
                      width: Math.max(24, w - padX * 2 - 38),
                      overflow: 'truncate',
                      textAlign: 'left',
                      textVerticalAlign: 'middle',
                      fill: textColor,
                      font: `500 ${labelFontSize - 0.5}px ${chartTheme.fontSans}`,
                    },
                  },
                  {
                    type: 'text',
                    silent: true,
                    style: {
                      text: block.formattedValue,
                      x: x + w - padX,
                      y: cy,
                      textAlign: 'right',
                      textVerticalAlign: 'middle',
                      fill: textColor,
                      font: `700 ${valFontSize - 0.5}px ${chartTheme.fontSans}`,
                    },
                  },
                );
              } else if (block.needsExternalCallout) {
                const rawY = y + h / 2;
                const adjY = api.coord([100, block.calloutYMidPct])[1];
                const arrowTipX = x + w + 4;
                const lineEndX = x + w + 38;
                const textX = lineEndX + 7;

                if (Math.abs(adjY - rawY) > 2) {
                  children.push({
                    type: 'polyline',
                    silent: true,
                    shape: {
                      points: [
                        [arrowTipX + 4, rawY],
                        [arrowTipX + 16, rawY],
                        [arrowTipX + 24, adjY],
                        [lineEndX, adjY],
                      ],
                    },
                    style: {
                      stroke: chartTheme.callout,
                      lineWidth: 1,
                      fill: 'none',
                    },
                  });
                } else {
                  children.push({
                    type: 'line',
                    silent: true,
                    shape: {
                      x1: arrowTipX + 4,
                      y1: rawY,
                      x2: lineEndX,
                      y2: rawY,
                    },
                    style: {
                      stroke: chartTheme.callout,
                      lineWidth: 1,
                    },
                  });
                }

                children.push({
                  type: 'polygon',
                  silent: true,
                  shape: {
                    points: [
                      [arrowTipX, rawY],
                      [arrowTipX + 5.5, rawY - 3],
                      [arrowTipX + 5.5, rawY + 3],
                    ],
                  },
                  style: {
                    fill: chartTheme.callout,
                  },
                });

                children.push({
                  type: 'text',
                  silent: true,
                  style: {
                    text: `{lbl|${block.displayLabel}\u00A0\u00A0}{val|${block.formattedValue}}`,
                    x: textX,
                    y: adjY,
                    textAlign: 'left',
                    textVerticalAlign: 'middle',
                    rich: {
                      lbl: {
                        fill: chartTheme.textPrimary,
                        fontFamily: chartTheme.fontSans,
                        fontSize: 12.5,
                        fontWeight: 400,
                      },
                      val: {
                        fill: chartTheme.textPrimary,
                        fontFamily: chartTheme.fontSans,
                        fontSize: 12.5,
                        fontWeight: 700,
                        padding: [0, 0, 0, 4],
                      },
                    },
                  },
                });
              }

              return {
                type: 'group',
                children,
              } as never;
            },
            data: blocks.map((b) => [b.x0, b.y0, b.x1, b.y1, b.segment.value]),
          },
        ],
      };
    },
    [blocks, hasRightCallouts, isCompact, showTooltip],
  );

  const handleElementClick = (event: ECElementEvent) => {
    if (!onSelectSegment) return;
    const block = blocks[event.dataIndex];
    if (!block) return;
    onSelectSegment({
      column: block.column,
      segment: block.segment,
      shareOfTotalPct: Number(block.shareOfTotalPct.toFixed(1)),
    });
  };

  const showTotalGutter = !isCompact && Boolean(totalCallout);

  const canvasNode = (
    <div className={styles.canvasShell}>
      {style === MarimekkoStyle.Outlined && (
        <div
          className={styles.columnHeaders}
          style={{ paddingRight: hasRightCallouts ? '225px' : undefined }}
        >
          {columnSummaries.map((col) => (
            <div
              key={col.id}
              className={styles.columnHeaderPill}
              style={{ flex: `${col.widthPct} 0 0%` }}
            >
              <span className={styles.columnHeaderLabel}>{col.label}</span>
              <span className={styles.columnHeaderShare}>
                {col.widthPct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {!isCompact && highlightCallout && (
        <div className={styles.highlightCallout}>
          <span className={styles.highlightLabel}>
            {highlightCallout.label}
          </span>
          <span className={styles.heroFigure}>{highlightCallout.value}</span>
        </div>
      )}

      <EChartsCanvas
        buildOption={buildOption}
        height={resolvedHeight}
        fallbackWidth={hasRightCallouts ? 780 : 540}
        brand={theme.brand}
        surface={theme.surface}
        styleVariant={style}
        ariaLabel={ariaLabel}
        onElementClick={onSelectSegment ? handleElementClick : undefined}
      />
    </div>
  );

  return (
    <div
      className={styles.wrapper}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      {showTotalGutter && totalCallout ? (
        <div className={styles.editorialGrid}>
          <div className={styles.leftGutter}>
            <div className={styles.totalInline}>
              <span className={styles.totalLabel}>{totalCallout.label}</span>
              <span className={styles.heroFigure}>{totalCallout.value}</span>
            </div>
          </div>
          {canvasNode}
        </div>
      ) : (
        canvasNode
      )}
    </div>
  );
}
