import type { ReactNode } from 'react';
import { Brand, CalloutStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import styles from './Callout.module.css';

export interface CalloutProps {
  title: string;
  children: ReactNode;
  style?: CalloutStyle;
  brand?: Brand;
  surface?: Surface;
  eyebrow?: string;
  footer?: ReactNode;
}

export function Callout({
  title,
  children,
  style = CalloutStyle.Executive,
  brand,
  surface,
  eyebrow,
  footer,
}: CalloutProps) {
  const theme = useResolvedTheme(brand, surface);

  return (
    <aside
      className={`${styles.callout} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
      aria-label={title}
    >
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </aside>
  );
}
