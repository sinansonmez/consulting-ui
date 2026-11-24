import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Brand, ControlSize, DrawerStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { CloseGlyph } from '../../icons/Glyphs';
import styles from './Drawer.module.css';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  style?: DrawerStyle;
  size?: ControlSize;
  brand?: Brand;
  surface?: Surface;
  side?: 'right' | 'left';
  eyebrow?: string;
  subtitle?: string;
  footer?: ReactNode;
  inline?: boolean;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  style = DrawerStyle.Standard,
  size = ControlSize.Md,
  brand,
  surface,
  side = 'right',
  eyebrow,
  subtitle,
  footer,
  inline = false,
}: DrawerProps) {
  const theme = useResolvedTheme(brand, surface);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || inline) return;

    const previousFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocused?.focus?.();
    };
  }, [open, inline, onClose]);

  if (!open) return null;

  const panelContent = (
    <div
      role={inline ? 'region' : 'dialog'}
      aria-modal={inline ? undefined : true}
      aria-labelledby={titleId}
      className={`${styles.sheet} ${styles[`style_${style}`]} ${styles[`size_${size}`]} ${inline ? styles.inlineSheet : styles[`side_${side}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <div className={styles.header}>
        <div className={styles.headingGroup}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeBtn}
          aria-label="Close panel"
          onClick={onClose}
        >
          <CloseGlyph size={14} />
        </button>
      </div>

      <div className={styles.body}>{children}</div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );

  if (inline) {
    return panelContent;
  }

  return createPortal(
    <div
      className={styles.backdrop}
      data-brand={theme.brand}
      data-surface={theme.surface}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {panelContent}
    </div>,
    document.body,
  );
}
