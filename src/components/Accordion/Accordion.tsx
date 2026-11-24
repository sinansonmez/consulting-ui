import { useId, type ReactNode } from 'react';
import { AccordionStyle, Brand, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { useControllableState } from '../../hooks/useControllableState';
import { ChevronDownGlyph, PlusMinusGlyph } from '../../icons/Glyphs';
import styles from './Accordion.module.css';

export interface AccordionItem {
  id: string;
  title: string;
  meta?: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: readonly AccordionItem[];
  style?: AccordionStyle;
  brand?: Brand;
  surface?: Surface;
  allowMultiple?: boolean;
  expandedIds?: readonly string[];
  defaultExpandedIds?: readonly string[];
  onExpandedChange?: (nextIds: string[]) => void;
}

export function Accordion({
  items,
  style = AccordionStyle.Bordered,
  brand,
  surface,
  allowMultiple = false,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
}: AccordionProps) {
  const theme = useResolvedTheme(brand, surface);
  const baseId = useId();

  const [openIds, setOpenIds] = useControllableState<string[]>({
    value: expandedIds ? [...expandedIds] : undefined,
    defaultValue: [...defaultExpandedIds],
    onChange: onExpandedChange,
  });

  const toggleItem = (itemId: string) => {
    const isOpen = openIds.includes(itemId);
    if (isOpen) {
      setOpenIds(openIds.filter((id) => id !== itemId));
    } else if (allowMultiple) {
      setOpenIds([...openIds, itemId]);
    } else {
      setOpenIds([itemId]);
    }
  };

  return (
    <div
      className={`${styles.root} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      {items.map((item) => {
        const isExpanded = openIds.includes(item.id);
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={`${styles.item} ${isExpanded ? styles.itemOpen : ''}`}
          >
            <h3 className={styles.heading}>
              <button
                id={triggerId}
                type="button"
                className={styles.trigger}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggleItem(item.id)}
              >
                <span className={styles.titleBlock}>
                  <span className={styles.title}>{item.title}</span>
                  {item.meta && <span className={styles.meta}>{item.meta}</span>}
                </span>
                <span
                  className={`${styles.icon} ${isExpanded ? styles.iconOpen : ''}`}
                  aria-hidden="true"
                >
                  {theme.brand === Brand.BCG ? (
                    <ChevronDownGlyph size={16} />
                  ) : (
                    <PlusMinusGlyph expanded={isExpanded} />
                  )}
                </span>
              </button>
            </h3>
            {isExpanded && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={styles.panel}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
