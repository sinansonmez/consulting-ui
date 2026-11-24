import type { MouseEventHandler, ReactNode } from 'react';
import { Brand, ButtonStyle, ControlSize, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { ArrowRightGlyph, ChevronRightGlyph } from '../../icons/Glyphs';
import styles from './Button.module.css';

export interface ButtonProps {
  children: ReactNode;
  style?: ButtonStyle;
  size?: ControlSize;
  brand?: Brand;
  surface?: Surface;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  showArrow?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
}

export function Button({
  children,
  style = ButtonStyle.Primary,
  size = ControlSize.Md,
  brand,
  surface,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  showArrow,
  onClick,
  ariaLabel,
}: ButtonProps) {
  const theme = useResolvedTheme(brand, surface);
  const isDisabled = disabled || loading;
  const shouldRenderArrow =
    showArrow ?? style === ButtonStyle.Editorial;

  const classNames = [
    styles.button,
    styles[`style_${style}`],
    styles[`size_${size}`],
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
      data-size={size}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={styles.label}>{children}</span>
      {shouldRenderArrow && !loading && (
        <span className={styles.arrowSlot} aria-hidden="true">
          {theme.brand === Brand.Bain && style === ButtonStyle.Editorial ? (
            <ChevronRightGlyph size={16} />
          ) : (
            <ArrowRightGlyph size={size === ControlSize.Sm ? 14 : 16} />
          )}
        </span>
      )}
    </button>
  );
}
