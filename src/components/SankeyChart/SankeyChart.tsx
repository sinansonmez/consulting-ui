import { useCallback, useMemo } from 'react';
import type { ECElementEvent } from 'echarts/core';
import { Brand, SankeyStyle, Surface } from '../../theme/enums';
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

export interface SankeyNode {
  id: string;
  label: string;
  depth?: number;
  tone?: ChartSemanticTone;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyChartProps {
  nodes: readonly SankeyNode[];
  links: readonly SankeyLink[];
  style?: SankeyStyle;
  brand?: Brand;
  surface?: Surface;
  height?: number;
  showTooltip?: boolean;
  showShares?: boolean;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
  onSelectNode?: (node: SankeyNode, totalValue: number) => void;
  onSelectLink?: (link: SankeyLink) => void;
}

interface ComputedSankeyNode {
  node: SankeyNode;
  index: number;
  totalValue: number;
  sharePct: number;
  inferredDepth: number;
}

function inferNodeDepths(
  nodes: readonly SankeyNode[],
  links: readonly SankeyLink[],
): Map<string, number> {
  const depthMap = new Map<string, number>();
  const incomingCount = new Map<string, number>();
  const adj = new Map<string, string[]>();

  nodes.forEach((n) => {
    incomingCount.set(n.id, 0);
    adj.set(n.id, []);
    if (n.depth !== undefined) {
      depthMap.set(n.id, n.depth);
    }
  });

  links.forEach((l) => {
    incomingCount.set(l.target, (incomingCount.get(l.target) ?? 0) + 1);
    adj.get(l.source)?.push(l.target);
  });

  const queue: string[] = [];
  nodes.forEach((n) => {
    if (!depthMap.has(n.id) && (incomingCount.get(n.id) ?? 0) === 0) {
      depthMap.set(n.id, 0);
      queue.push(n.id);
    } else if (depthMap.has(n.id)) {
      queue.push(n.id);
    }
  });

  let guard = 0;
  while (queue.length > 0 && guard < nodes.length * 4) {
    guard++;
    const curr = queue.shift()!;
    const currDepth = depthMap.get(curr) ?? 0;
    for (const next of adj.get(curr) ?? []) {
      const existingNode = nodes.find((n) => n.id === next);
      if (existingNode?.depth !== undefined) continue;
      const prevDepth = depthMap.get(next) ?? -1;
      if (currDepth + 1 > prevDepth) {
        depthMap.set(next, currDepth + 1);
        queue.push(next);
      }
    }
  }

  nodes.forEach((n) => {
    if (!depthMap.has(n.id)) depthMap.set(n.id, 0);
  });

  return depthMap;
}

function getSankeyStylePreset(style: SankeyStyle, chartTheme: ChartTheme) {
  switch (style) {
    case SankeyStyle.Flow:
      return {
        nodeWidth: 18,
        borderColor: chartTheme.border,
        borderWidth: 1,
        lineStyle: {
          color: 'gradient' as const,
          curveness: 0.48,
          opacity: 0.44,
        },
        emphasisLineStyle: {
          opacity: 0.68,
        },
      };
    case SankeyStyle.Minimal:
      return {
        nodeWidth: 15,
        borderColor: 'transparent',
        borderWidth: 0,
        lineStyle: {
          color: chartTheme.neutral,
          curveness: 0.48,
          opacity: 0.24,
        },
        emphasisLineStyle: {
          color: chartTheme.series[0],
          opacity: 0.56,
        },
      };
    default:
      return {
        nodeWidth: 15,
        borderColor: 'transparent',
        borderWidth: 0,
        lineStyle: {
          color: 'source' as const,
          curveness: 0.48,
          opacity: 0.28,
        },
        emphasisLineStyle: {
          opacity: 0.62,
        },
      };
  }
}

export function SankeyChart({
  nodes,
  links,
  style = SankeyStyle.Editorial,
  brand,
  surface,
  height,
  showTooltip = true,
  showShares = true,
  formatValue = (v) => String(v),
  ariaLabel = 'Multi-stage value flow Sankey chart',
  onSelectNode,
  onSelectLink,
}: SankeyChartProps) {
  const theme = useResolvedTheme(brand, surface);

  const { computedNodes, nodeById, maxDepth, grandTotal } = useMemo(() => {
    const outSum = new Map<string, number>();
    const inSum = new Map<string, number>();

    links.forEach((l) => {
      const v = Math.max(0, l.value);
      outSum.set(l.source, (outSum.get(l.source) ?? 0) + v);
      inSum.set(l.target, (inSum.get(l.target) ?? 0) + v);
    });

    const depths = inferNodeDepths(nodes, links);
    const maxD = Math.max(0, ...Array.from(depths.values()));

    const rawTotals = nodes.map((n) =>
      Math.max(outSum.get(n.id) ?? 0, inSum.get(n.id) ?? 0),
    );
    const depthTotals = new Map<number, number>();
    nodes.forEach((n, idx) => {
      const d = depths.get(n.id) ?? 0;
      depthTotals.set(d, (depthTotals.get(d) ?? 0) + rawTotals[idx]);
    });
    const total = Math.max(1, ...Array.from(depthTotals.values()));

    const list: ComputedSankeyNode[] = nodes.map((node, index) => ({
      node,
      index,
      totalValue: rawTotals[index],
      sharePct: (rawTotals[index] / total) * 100,
      inferredDepth: depths.get(node.id) ?? 0,
    }));

    const lookup = new Map<string, ComputedSankeyNode>();
    list.forEach((item) => lookup.set(item.node.id, item));

    return {
      computedNodes: list,
      nodeById: lookup,
      maxDepth: maxD,
      grandTotal: total,
    };
  }, [links, nodes]);

  const resolvedHeight =
    height ??
    Math.max(
      290,
      Math.ceil(nodes.length / Math.max(1, maxDepth + 1)) * 68 + 44,
    );

  const buildOption = useCallback(
    (chartTheme: ChartTheme): ConsultingChartOption => {
      const preset = getSankeyStylePreset(style, chartTheme);
      const leftNodes = computedNodes.filter((n) => n.inferredDepth === 0);
      const rightNodes = computedNodes.filter(
        (n) => n.inferredDepth === maxDepth && maxDepth > 0,
      );
      const maxLeftLen = Math.max(
        6,
        ...leftNodes.map((n) => n.node.label.length),
      );
      const maxRightLen = Math.max(
        6,
        ...rightNodes.map((n) => n.node.label.length),
      );
      const leftPad = Math.min(148, Math.max(82, maxLeftLen * 6.8 + 18));
      const rightPad = Math.min(156, Math.max(86, maxRightLen * 6.8 + 20));

      return {
        animationDuration: 400,
        animationEasing: 'cubicOut',
        tooltip: {
          ...buildTooltipBase(chartTheme, showTooltip),
          trigger: 'item',
          formatter: (params: unknown) => {
            const p = params as {
              dataType?: 'node' | 'edge';
              data?: {
                name?: string;
                source?: string;
                target?: string;
                value?: number;
              };
            };
            if (p.dataType === 'edge' && p.data?.source && p.data?.target) {
              const src = nodeById.get(p.data.source);
              const tgt = nodeById.get(p.data.target);
              const val = p.data.value ?? 0;
              const shareTotal = ((val / grandTotal) * 100).toFixed(1);
              const shareSrc =
                src && src.totalValue > 0
                  ? ((val / src.totalValue) * 100).toFixed(0)
                  : '0';
              return `
                <div style="font-weight:700;margin-bottom:3px;">${escapeHtml(src?.node.label ?? p.data.source)} → ${escapeHtml(tgt?.node.label ?? p.data.target)}</div>
                <div>Flow: <strong>${escapeHtml(formatValue(val))}</strong></div>
                <div style="opacity:0.82;">${shareSrc}% of source · ${shareTotal}% of total</div>
              `;
            }
            const id = p.data?.name;
            const item = id ? nodeById.get(id) : undefined;
            if (!item) return '';
            const fill = resolveToneColor(
              chartTheme,
              item.node.tone,
              item.index,
            );
            return `
              <div style="font-weight:700;margin-bottom:3px;">${escapeHtml(item.node.label)}</div>
              <div><span style="display:inline-block;width:8px;height:8px;background:${fill};margin-right:6px;"></span>Total: <strong>${escapeHtml(formatValue(item.totalValue))}</strong></div>
              <div style="opacity:0.82;">Share of total flow: <strong>${item.sharePct.toFixed(1)}%</strong></div>
            `;
          },
        },
        series: [
          {
            type: 'sankey',
            name: ariaLabel,
            left: leftPad,
            right: rightPad,
            top: 14,
            bottom: 14,
            nodeWidth: preset.nodeWidth,
            nodeGap: 14,
            draggable: false,
            selectedMode: 'single',
            emphasis: {
              focus: 'adjacency',
              lineStyle: preset.emphasisLineStyle,
            },
            select: {
              lineStyle: preset.emphasisLineStyle,
            },
            lineStyle: preset.lineStyle,
            data: computedNodes.map((item) => {
              const fill = resolveToneColor(
                chartTheme,
                item.node.tone,
                item.index,
              );
              const isLeft = item.inferredDepth === 0;
              const textAlign = isLeft ? ('right' as const) : ('left' as const);
              const sharePart = showShares
                ? `\u00A0· ${Math.round(item.sharePct)}%`
                : '';
              return {
                name: item.node.id,
                depth: item.node.depth,
                itemStyle: {
                  color: fill,
                  borderColor: preset.borderColor,
                  borderWidth: preset.borderWidth,
                  borderRadius: chartTheme.barRadius,
                },
                label: {
                  show: true,
                  position: isLeft ? 'left' : 'right',
                  align: textAlign,
                  distance: 8,
                  formatter: () =>
                    `{lbl|${item.node.label}}\n{val|${formatValue(item.totalValue)}}{pct|${sharePart}}`,
                  rich: {
                    lbl: {
                      color: chartTheme.textPrimary,
                      fontFamily: chartTheme.fontSans,
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: 16,
                      align: textAlign,
                    },
                    val: {
                      color: chartTheme.textPrimary,
                      fontFamily: chartTheme.fontSans,
                      fontSize: 11.5,
                      fontWeight: 700,
                      lineHeight: 15,
                      align: textAlign,
                    },
                    pct: {
                      color: chartTheme.textMuted,
                      fontFamily: chartTheme.fontSans,
                      fontSize: 11,
                      fontWeight: 500,
                      lineHeight: 15,
                      align: textAlign,
                    },
                  },
                },
              };
            }),
            links: links.map((l) => ({
              source: l.source,
              target: l.target,
              value: l.value,
            })),
          },
        ],
      };
    },
    [
      ariaLabel,
      computedNodes,
      formatValue,
      grandTotal,
      links,
      maxDepth,
      nodeById,
      showShares,
      showTooltip,
      style,
    ],
  );

  const handleElementClick = (event: ECElementEvent) => {
    const dataType = (event as unknown as { dataType?: string }).dataType;
    if (dataType === 'edge' && onSelectLink) {
      const edge = event.data as
        | { source?: string; target?: string }
        | undefined;
      const match = links.find(
        (l) => l.source === edge?.source && l.target === edge?.target,
      );
      if (match) onSelectLink(match);
    } else if (dataType === 'node' && onSelectNode) {
      const nodeData = event.data as { name?: string } | undefined;
      const found = nodeData?.name ? nodeById.get(nodeData.name) : undefined;
      if (found) onSelectNode(found.node, found.totalValue);
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
      onElementClick={
        onSelectNode || onSelectLink ? handleElementClick : undefined
      }
    />
  );
}
