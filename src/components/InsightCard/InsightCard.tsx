import type { ReactNode } from 'react';
import { Brand, InsightCardStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { ArrowRightGlyph, ChevronRightGlyph } from '../../icons/Glyphs';
import styles from './InsightCard.module.css';

export interface InsightCardProps {
  title: string;
  summary: string;
  style?: InsightCardStyle;
  brand?: Brand;
  surface?: Surface;
  eyebrow?: string;
  meta?: string;
  ctaLabel?: string;
  href?: string;
  target?: '_blank' | '_self';
  onAction?: () => void;
  badges?: ReactNode;
}

export function InsightCard({
  title,
  summary,
  style = InsightCardStyle.Editorial,
  brand,
  surface,
  eyebrow,
  meta,
  ctaLabel = 'Read insight',
  href,
  target,
  onAction,
  badges,
}: InsightCardProps) {
  const theme = useResolvedTheme(brand, surface);
  const arrowContent = (
    <span className={styles.ctaArrow} aria-hidden="true">
      {theme.brand === Brand.Bain ? (
        <ChevronRightGlyph size={15} />
      ) : (
        <ArrowRightGlyph size={15} />
      )}
    </span>
  );

  return (
    <article
      className={`${styles.card} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      {(eyebrow || meta) && (
        <div className={styles.topRow}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          {meta && <span className={styles.meta}>{meta}</span>}
        </div>
      )}

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.summary}>{summary}</p>

      {badges && <div className={styles.badges}>{badges}</div>}

      {(href || onAction) && (
        <div className={styles.footer}>
          {href ? (
            <a
              href={href}
              target={target}
              rel={target === '_blank' ? 'noreferrer' : undefined}
              className={styles.cta}
            >
              <span className={styles.ctaText}>{ctaLabel}</span>
              {arrowContent}
            </a>
          ) : (
            <button type="button" className={styles.cta} onClick={onAction}>
              <span className={styles.ctaText}>{ctaLabel}</span>
              {arrowContent}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
