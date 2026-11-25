import type { ReactNode } from 'react';
import { Brand, ExhibitStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import styles from './ExhibitFrame.module.css';

export interface ExhibitFrameProps {
  title: string;
  children: ReactNode;
  style?: ExhibitStyle;
  brand?: Brand;
  surface?: Surface;
  exhibitLabel?: string;
  subtitle?: string;
  unitLabel?: string;
  controls?: ReactNode;
  note?: string;
  footnotes?: readonly string[];
  source?: string;
  attribution?: string;
}

export function ExhibitFrame({
  title,
  children,
  style = ExhibitStyle.Editorial,
  brand,
  surface,
  exhibitLabel,
  subtitle,
  unitLabel,
  controls,
  note,
  footnotes,
  source,
  attribution,
}: ExhibitFrameProps) {
  const theme = useResolvedTheme(brand, surface);
  const hasFooter = Boolean(
    note || source || attribution || (footnotes && footnotes.length > 0),
  );

  return (
    <figure
      className={`${styles.frame} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <div className={styles.header}>
        <div className={styles.headingGroup}>
          {exhibitLabel && (
            <span className={styles.exhibitLabel}>{exhibitLabel}</span>
          )}
          <figcaption className={styles.title}>{title}</figcaption>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {controls && <div className={styles.controls}>{controls}</div>}
      </div>

      {unitLabel && <p className={styles.unitLabel}>{unitLabel}</p>}

      <div className={styles.canvas}>{children}</div>

      {hasFooter && (
        <div className={styles.footer}>
          {footnotes && footnotes.length > 0 && (
            <ol className={styles.footnotes}>
              {footnotes.map((item, idx) => (
                <li key={`${idx}-${item}`} className={styles.footnoteItem}>
                  <sup className={styles.footnoteNum}>{idx + 1}</sup>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          )}
          {note && (
            <p className={styles.footerLine}>
              <span className={styles.footerKey}>Note:</span> {note}
            </p>
          )}
          {source && (
            <p className={styles.footerLine}>
              <span className={styles.footerKey}>Source:</span> {source}
            </p>
          )}
          {attribution && (
            <p className={styles.attribution}>{attribution}</p>
          )}
        </div>
      )}
    </figure>
  );
}
