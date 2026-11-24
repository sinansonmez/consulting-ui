import { BenchmarkBarStyle, Brand, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import styles from './BenchmarkBar.module.css';

export interface BenchmarkBarProps {
  label: string;
  value: number;
  style?: BenchmarkBarStyle;
  brand?: Brand;
  surface?: Surface;
  min?: number;
  max?: number;
  median?: number;
  topQuartile?: number;
  unit?: string;
  formatValue?: (value: number) => string;
}

function clampPct(val: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
}

export function BenchmarkBar({
  label,
  value,
  style = BenchmarkBarStyle.Bullet,
  brand,
  surface,
  min = 0,
  max = 100,
  median,
  topQuartile,
  unit = '%',
  formatValue,
}: BenchmarkBarProps) {
  const theme = useResolvedTheme(brand, surface);
  const fmt = formatValue ?? ((n: number) => `${n}${unit}`);

  const valuePct = clampPct(value, min, max);
  const medianPct =
    median !== undefined ? clampPct(median, min, max) : undefined;
  const topPct =
    topQuartile !== undefined ? clampPct(topQuartile, min, max) : undefined;

  return (
    <div
      className={`${styles.root} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.valueReadout}>{fmt(value)}</span>
      </div>

      {style === BenchmarkBarStyle.Split && topQuartile !== undefined ? (
        <div className={styles.splitTracks}>
          <div className={styles.trackRow}>
            <span className={styles.trackTag}>Current</span>
            <div className={styles.track}>
              <div
                className={styles.fillPrimary}
                style={{ width: `${valuePct}%` }}
              />
            </div>
          </div>
          <div className={styles.trackRow}>
            <span className={styles.trackTag}>Leaders</span>
            <div className={styles.track}>
              <div
                className={styles.fillLeader}
                style={{ width: `${topPct}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={styles.track}
          role="meter"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        >
          {topPct !== undefined && style === BenchmarkBarStyle.Bullet && (
            <div
              className={styles.quartileZone}
              style={{ left: `${topPct}%`, width: `${100 - topPct}%` }}
              aria-hidden="true"
            />
          )}
          <div
            className={styles.fillPrimary}
            style={{ width: `${valuePct}%` }}
          />
          {medianPct !== undefined && (
            <span
              className={styles.medianTick}
              style={{ left: `${medianPct}%` }}
              aria-hidden="true"
            />
          )}
          {topPct !== undefined && (
            <span
              className={styles.topTick}
              style={{ left: `${topPct}%` }}
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {(median !== undefined || topQuartile !== undefined) && (
        <div className={styles.benchmarks}>
          {median !== undefined && (
            <span className={styles.markerNote}>
              <span className={styles.medianSwatch} aria-hidden="true" />
              Median: {fmt(median)}
            </span>
          )}
          {topQuartile !== undefined && (
            <span className={styles.markerNote}>
              <span className={styles.topSwatch} aria-hidden="true" />
              Top quartile: {fmt(topQuartile)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
