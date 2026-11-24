import { Brand, PullQuoteStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import styles from './PullQuote.module.css';

export interface PullQuoteProps {
  quote: string;
  style?: PullQuoteStyle;
  brand?: Brand;
  surface?: Surface;
  author?: string;
  role?: string;
  organization?: string;
}

export function PullQuote({
  quote,
  style = PullQuoteStyle.Editorial,
  brand,
  surface,
  author,
  role,
  organization,
}: PullQuoteProps) {
  const theme = useResolvedTheme(brand, surface);
  const roleLine = [role, organization].filter(Boolean).join(' · ');

  return (
    <figure
      className={`${styles.root} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <span className={styles.mark} aria-hidden="true">
        “
      </span>
      <blockquote className={styles.blockquote}>{quote}</blockquote>
      {(author || roleLine) && (
        <figcaption className={styles.attribution}>
          {author && <span className={styles.author}>{author}</span>}
          {roleLine && <span className={styles.role}>{roleLine}</span>}
        </figcaption>
      )}
    </figure>
  );
}
