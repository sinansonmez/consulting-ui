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
  controls?: ReactNode;
  note?: string;
  source?: string;
}

export function ExhibitFrame({
  title,
  children,
  style = ExhibitStyle.Editorial,
  brand,
  surface,
  exhibitLabel,
  subtitle,
  controls,
  note,
  source,
}: ExhibitFrameProps) {
  const theme = useResolvedTheme(brand, surface);

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

      <div className={styles.canvas}>{children}</div>

      {(note || source) && (
        <div className={styles.footer}>
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
        </div>
      )}
    </figure>
  );
}
