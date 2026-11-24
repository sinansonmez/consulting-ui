import { useMemo } from 'react';
import { Brand, Surface, WaterfallStyle } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import styles from './WaterfallChart.module.css';

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
  formatValue?: (value: number) => string;
  ariaLabel?: string;
}

interface ComputedBar {
  id: string;
  label: string;
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
  const computed: ComputedBar[] = [];

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

    computed.push({
      id: step.id,
      label: step.label,
      kind,
      raw,
      startVal,
      endVal,
      displayLabel,
    });
  }

  const span = maxV - minV || 1;
  return {
    bars: computed,
    minDomain: minV < 0 ? minV - span * 0.12 : 0,
    maxDomain: maxV + span * 0.18,
  };
}

export function WaterfallChart({
  steps,
  style = WaterfallStyle.Classic,
  brand,
  surface,
  formatValue = (n) => String(n),
  ariaLabel = 'Waterfall value bridge chart',
}: WaterfallChartProps) {
  const theme = useResolvedTheme(brand, surface);

  const { bars, minDomain, maxDomain } = useMemo(
    () => computeWaterfallLayout(steps, formatValue),
    [steps, formatValue],
  );

  const svgWidth = Math.max(520, bars.length * 108);
  const svgHeight = style === WaterfallStyle.Compact ? 210 : 260;
  const padTop = 30;
  const padBottom = 56;
  const padX = 24;
  const plotHeight = svgHeight - padTop - padBottom;
  const domainSpan = maxDomain - minDomain || 1;

  const toY = (val: number) =>
    padTop + ((maxDomain - val) / domainSpan) * plotHeight;

  const slotWidth =
    bars.length > 0 ? (svgWidth - padX * 2) / bars.length : svgWidth;
  const barWidth = Math.min(58, slotWidth * 0.56);
  const radius =
    theme.brand === Brand.BCG ? 5 : theme.brand === Brand.Bain ? 1.5 : 0;
  const zeroY = toY(0);

  const getFill = (bar: ComputedBar): string => {
    if (bar.kind === 'start' || bar.kind === 'subtotal' || bar.kind === 'total') {
      return 'var(--mbb-accent-strong)';
    }
    return bar.raw >= 0 ? 'var(--mbb-accent)' : 'var(--mbb-negative-text)';
  };

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`${styles.root} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <svg
        className={styles.svg}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <line
          x1={padX / 2}
          y1={zeroY}
          x2={svgWidth - padX / 2}
          y2={zeroY}
          stroke="var(--mbb-border-strong)"
          strokeWidth="1.25"
        />

        {bars.map((bar, idx) => {
          const cx = padX + idx * slotWidth + slotWidth / 2;
          const x = cx - barWidth / 2;
          const topVal = Math.max(bar.startVal, bar.endVal);
          const bottomVal = Math.min(bar.startVal, bar.endVal);
          const y = toY(topVal);
          const h = Math.max(3, toY(bottomVal) - y);
          const nextBar = bars[idx + 1];
          const connectorY = toY(bar.endVal);

          return (
            <g key={bar.id}>
              {style === WaterfallStyle.Classic && nextBar && (
                <line
                  x1={x + barWidth}
                  y1={connectorY}
                  x2={padX + (idx + 1) * slotWidth + slotWidth / 2 - barWidth / 2}
                  y2={connectorY}
                  stroke="var(--mbb-border-strong)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.65"
                />
              )}

              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx={radius}
                fill={getFill(bar)}
              />

              <text
                x={cx}
                y={bar.raw < 0 && bar.kind === 'delta' ? y + h + 15 : y - 8}
                textAnchor="middle"
                fill="var(--mbb-text-primary)"
                fontSize="12"
                fontWeight="700"
              >
                {bar.displayLabel}
              </text>

              <text
                x={cx}
                y={svgHeight - 24}
                textAnchor="middle"
                fill="var(--mbb-text-secondary)"
                fontSize="11.5"
                fontWeight={
                  bar.kind === 'total' || bar.kind === 'subtotal' ? '700' : '500'
                }
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
