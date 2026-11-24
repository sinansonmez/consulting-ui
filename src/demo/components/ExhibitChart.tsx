import { Brand, useBrand } from '../../index';
import type { ExhibitBarDatum } from '../data/reports';
import styles from './ExhibitChart.module.css';

export interface ExhibitChartProps {
  data: readonly ExhibitBarDatum[];
}

export function ExhibitChart({ data }: ExhibitChartProps) {
  const { brand } = useBrand();
  const barRadius = brand === Brand.BCG ? 6 : brand === Brand.Bain ? 1.5 : 0;

  return (
    <div className={styles.chartRoot} role="img" aria-label="Leaders versus sector median benchmark chart">
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.swatchPrimary}`} />
          <span>Top-quartile leaders (%)</span>
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.swatchSecondary}`} />
          <span>Sector median (%)</span>
        </span>
      </div>

      <div className={styles.rows}>
        {data.map((datum) => {
          const gap = datum.leaders - datum.median;
          return (
            <div key={datum.label} className={styles.row}>
              <div className={styles.rowHeader}>
                <span className={styles.sectorLabel}>{datum.label}</span>
                <span className={styles.gapPill}>+{gap} pp spread</span>
              </div>

              <svg
                className={styles.svgBar}
                viewBox="0 0 560 34"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <rect
                  x="0"
                  y="2"
                  width="500"
                  height="12"
                  rx={barRadius}
                  fill="var(--mbb-bg-surface)"
                />
                <rect
                  x="0"
                  y="2"
                  width={Math.max(12, datum.leaders * 5)}
                  height="12"
                  rx={barRadius}
                  fill="var(--mbb-accent)"
                />
                <text
                  x={Math.min(554, datum.leaders * 5 + 8)}
                  y="12"
                  fill="var(--mbb-text-primary)"
                  fontSize="11.5"
                  fontWeight="700"
                >
                  {datum.leaders}%
                </text>

                <rect
                  x="0"
                  y="19"
                  width="500"
                  height="10"
                  rx={barRadius}
                  fill="var(--mbb-bg-surface)"
                />
                <rect
                  x="0"
                  y="19"
                  width={Math.max(12, datum.median * 5)}
                  height="10"
                  rx={barRadius}
                  fill="var(--mbb-border-strong)"
                  opacity="0.45"
                />
                <text
                  x={Math.min(554, datum.median * 5 + 8)}
                  y="28"
                  fill="var(--mbb-text-muted)"
                  fontSize="11"
                  fontWeight="600"
                >
                  {datum.median}%
                </text>
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
