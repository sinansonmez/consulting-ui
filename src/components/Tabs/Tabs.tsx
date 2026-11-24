import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Brand, ControlSize, Surface, TabsStyle } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { useControllableState } from '../../hooks/useControllableState';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
  content?: ReactNode;
}

export interface TabsProps {
  items: readonly TabItem[];
  style?: TabsStyle;
  size?: ControlSize;
  brand?: Brand;
  surface?: Surface;
  value?: string;
  defaultValue?: string;
  onChange?: (nextId: string) => void;
  ariaLabel?: string;
}

export function Tabs({
  items,
  style = TabsStyle.Underline,
  size = ControlSize.Md,
  brand,
  surface,
  value,
  defaultValue,
  onChange,
  ariaLabel = 'Section views',
}: TabsProps) {
  const theme = useResolvedTheme(brand, surface);
  const baseId = useId();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstEnabledId = items.find((item) => !item.disabled)?.id ?? '';

  const [activeId, setActiveId] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? firstEnabledId,
    onChange,
  });

  const activeItem = items.find((item) => item.id === activeId);
  const hasPanels = items.some((item) => item.content !== undefined);

  const moveFocus = (currentIndex: number, delta: 1 | -1) => {
    let idx = currentIndex;
    for (let step = 0; step < items.length; step++) {
      idx = (idx + delta + items.length) % items.length;
      if (!items[idx]?.disabled) {
        setActiveId(items[idx].id);
        buttonRefs.current[idx]?.focus();
        return;
      }
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        moveFocus(index, 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveFocus(index, -1);
        break;
      case 'Home': {
        event.preventDefault();
        const firstIdx = items.findIndex((i) => !i.disabled);
        if (firstIdx >= 0) {
          setActiveId(items[firstIdx].id);
          buttonRefs.current[firstIdx]?.focus();
        }
        break;
      }
      case 'End': {
        event.preventDefault();
        for (let i = items.length - 1; i >= 0; i--) {
          if (!items[i].disabled) {
            setActiveId(items[i].id);
            buttonRefs.current[i]?.focus();
            break;
          }
        }
        break;
      }
    }
  };

  return (
    <div
      className={styles.root}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={`${styles.list} ${styles[`list_${style}`]}`}
      >
        {items.map((item, index) => {
          const isSelected = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={
                hasPanels ? `${baseId}-panel-${item.id}` : undefined
              }
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              className={`${styles.tab} ${styles[`tab_${style}`]} ${styles[`size_${size}`]} ${isSelected ? styles.selected : ''}`}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className={styles.count}>{item.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {hasPanels && activeItem && (
        <div
          id={`${baseId}-panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          className={styles.panel}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
