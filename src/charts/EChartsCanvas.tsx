import { useEffect, useRef, useState } from 'react';
import type { ECElementEvent } from 'echarts/core';
import { Brand, Surface } from '../theme/enums';
import {
  echarts,
  type ConsultingChartOption,
  type EChartsInstance,
} from './echartsCore';
import {
  getChartTheme,
  resolveChartThemeFromElement,
  type ChartTheme,
} from './chartTheme';
import styles from './EChartsCanvas.module.css';

export interface EChartsCanvasProps {
  buildOption: (theme: ChartTheme) => ConsultingChartOption;
  height: number;
  fallbackWidth?: number;
  brand: Brand;
  surface: Surface;
  styleVariant: string;
  ariaLabel: string;
  onElementClick?: (event: ECElementEvent) => void;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function EChartsCanvas({
  buildOption,
  height,
  fallbackWidth = 680,
  brand,
  surface,
  styleVariant,
  ariaLabel,
  onElementClick,
}: EChartsCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<EChartsInstance | null>(null);
  const clickHandlerRef = useRef(onElementClick);
  const heightRef = useRef(height);
  const fallbackWidthRef = useRef(fallbackWidth);
  const [resolvedTheme, setResolvedTheme] = useState<ChartTheme>(() =>
    getChartTheme(brand, surface),
  );

  useEffect(() => {
    clickHandlerRef.current = onElementClick;
  }, [onElementClick]);

  useEffect(() => {
    heightRef.current = height;
    fallbackWidthRef.current = fallbackWidth;
  }, [height, fallbackWidth]);

  // Read live CSS custom property overrides from the mounted [data-brand][data-surface] root
  useEffect(() => {
    setResolvedTheme(
      resolveChartThemeFromElement(rootRef.current, brand, surface),
    );
  }, [brand, surface]);

  // Initialize ECharts once on mount and observe container resizes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measuredWidth = el.clientWidth;
    const measuredHeight = el.clientHeight;

    const chart = echarts.init(el, undefined, {
      renderer: 'svg',
      width: measuredWidth > 0 ? undefined : fallbackWidthRef.current,
      height: measuredHeight > 0 ? undefined : heightRef.current,
    });
    instanceRef.current = chart;

    const handleClick = (params: ECElementEvent) => {
      clickHandlerRef.current?.(params);
    };
    chart.on('click', handleClick);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const nextWidth = Math.round(entry.contentRect.width);
      if (nextWidth > 0) {
        chart.resize({ width: nextWidth, height: heightRef.current });
      }
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      chart.off('click', handleClick);
      chart.dispose();
      instanceRef.current = null;
    };
  }, []);

  // Resize smoothly without disposing when height or fallbackWidth changes
  useEffect(() => {
    const chart = instanceRef.current;
    const el = containerRef.current;
    if (!chart || !el) return;
    const width = el.clientWidth > 0 ? el.clientWidth : fallbackWidth;
    chart.resize({ width, height });
  }, [height, fallbackWidth]);

  // Apply option + global prefers-reduced-motion compliance
  useEffect(() => {
    const chart = instanceRef.current;
    if (!chart) return;
    const option = buildOption(resolvedTheme);
    const reduced = prefersReducedMotion();
    const finalOption: ConsultingChartOption = reduced
      ? { ...option, animation: false, animationDuration: 0 }
      : option;
    chart.setOption(finalOption, { notMerge: true, lazyUpdate: false });
  }, [buildOption, resolvedTheme]);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={ariaLabel}
      aria-roledescription="chart"
      tabIndex={onElementClick ? 0 : undefined}
      className={styles.root}
      data-brand={brand}
      data-surface={surface}
      data-style={styleVariant}
    >
      <div
        ref={containerRef}
        className={styles.canvas}
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
