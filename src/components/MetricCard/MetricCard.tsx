import { Brand, MetricCardStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { DeltaGlyph } from '../../icons/Glyphs';
import styles from './MetricCard.module.css';

export interface MetricCardProps {
  value: string;
  label: string;
  style?: MetricCardStyle;
  brand?: Brand;
  surface?: Surface;
  delta?: string;
  deltaDirection?: 'up' | 'down';
  caption?: string;
  benchmark?: string;
  source?: string;
}

export function MetricCard({
  value,
  label,
  style = MetricCardStyle.Hero,
  brand,
  surface,
  delta,
  deltaDirection,
  caption,
  benchmark,
  source,
}: MetricCardProps) {
  const theme = useResolvedTheme(brand, surface);

  return (
    <article
      className={`${styles.card} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <div className={styles.headerRow}>
        <span className={styles.label}>{label}</span>
        {delta && (
          <span
            className={`${styles.delta} ${deltaDirection === 'up' ? styles.deltaUp : deltaDirection === 'down' ? styles.deltaDown : styles.deltaNeutral}`}
          >
            {deltaDirection && <DeltaGlyph direction={deltaDirection} />}
            <span>{delta}</span>
          </span>
        )}
      </div>

      <div className={styles.figure}>{value}</div>

      {caption && <p className={styles.caption}>{caption}</p>}

      {(benchmark || source) && (
        <div className={styles.meta}>
          {benchmark && <span className={styles.benchmark}>{benchmark}</span>}
          {source && <span className={styles.source}>{source}</span>}
        </div>
      )}
    </article>
  );
}
