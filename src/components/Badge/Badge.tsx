import type { ReactNode } from 'react';
import { BadgeStyle, Brand, ControlSize, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { DeltaGlyph } from '../../icons/Glyphs';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: ReactNode;
  style?: BadgeStyle;
  size?: ControlSize;
  brand?: Brand;
  surface?: Surface;
  showDeltaIcon?: boolean;
}

export function Badge({
  children,
  style = BadgeStyle.Neutral,
  size = ControlSize.Md,
  brand,
  surface,
  showDeltaIcon,
}: BadgeProps) {
  const theme = useResolvedTheme(brand, surface);
  const showDelta =
    showDeltaIcon ??
    (style === BadgeStyle.Positive || style === BadgeStyle.Negative);

  return (
    <span
      className={`${styles.badge} ${styles[`style_${style}`]} ${styles[`size_${size}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      {showDelta && style === BadgeStyle.Positive && (
        <DeltaGlyph direction="up" />
      )}
      {showDelta && style === BadgeStyle.Negative && (
        <DeltaGlyph direction="down" />
      )}
      <span>{children}</span>
    </span>
  );
}
