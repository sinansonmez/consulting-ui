import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Brand, ControlSize, SelectStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { useControllableState } from '../../hooks/useControllableState';
import { CheckGlyph, ChevronDownGlyph } from '../../icons/Glyphs';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  meta?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: readonly SelectOption[];
  style?: SelectStyle;
  size?: ControlSize;
  brand?: Brand;
  surface?: Surface;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (nextValue: string) => void;
  disabled?: boolean;
  id?: string;
}

export function Select({
  options,
  style = SelectStyle.Standard,
  size = ControlSize.Md,
  brand,
  surface,
  label,
  placeholder = 'Select an option',
  value,
  defaultValue = '',
  onChange,
  disabled = false,
  id,
}: SelectProps) {
  const theme = useResolvedTheme(brand, surface);
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;

  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue,
    onChange,
  });

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const findNextEnabledIndex = (start: number, delta: 1 | -1): number => {
    if (options.length === 0) return -1;
    let index = start;
    for (let step = 0; step < options.length; step++) {
      index = (index + delta + options.length) % options.length;
      if (!options[index]?.disabled) return index;
    }
    return -1;
  };

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const openMenu = () => {
    if (disabled) return;
    const selectedIdx = options.findIndex(
      (opt) => opt.value === selectedValue && !opt.disabled,
    );
    const initialIdx =
      selectedIdx >= 0 ? selectedIdx : findNextEnabledIndex(-1, 1);
    setActiveIndex(initialIdx);
    setOpen(true);
  };

  const commitOption = (option: SelectOption) => {
    if (option.disabled) return;
    setSelectedValue(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          setActiveIndex((prev) => findNextEnabledIndex(prev, 1));
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          setActiveIndex((prev) => findNextEnabledIndex(prev, -1));
        }
        break;
      }
      case 'Home': {
        if (open) {
          event.preventDefault();
          setActiveIndex(findNextEnabledIndex(-1, 1));
        }
        break;
      }
      case 'End': {
        if (open) {
          event.preventDefault();
          setActiveIndex(findNextEnabledIndex(0, -1));
        }
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!open) {
          openMenu();
        } else if (activeIndex >= 0 && options[activeIndex]) {
          commitOption(options[activeIndex]);
        }
        break;
      }
      case 'Escape': {
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      }
      case 'Tab': {
        setOpen(false);
        break;
      }
    }
  };

  const activeOptionId =
    open && activeIndex >= 0 ? `${baseId}-opt-${activeIndex}` : undefined;

  return (
    <div
      ref={rootRef}
      className={styles.wrapper}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      {label && (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        id={baseId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={label ? `${labelId} ${baseId}` : undefined}
        aria-activedescendant={activeOptionId}
        disabled={disabled}
        className={`${styles.trigger} ${styles[`style_${style}`]} ${styles[`size_${size}`]} ${open ? styles.open : ''}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span
          className={
            selectedOption ? styles.selectedText : styles.placeholderText
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          aria-hidden="true"
        >
          <ChevronDownGlyph size={15} />
        </span>
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : baseId}
          className={styles.menu}
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${baseId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                className={`${styles.option} ${isSelected ? styles.optionSelected : ''} ${isActive ? styles.optionActive : ''} ${option.disabled ? styles.optionDisabled : ''}`}
                onMouseEnter={() => {
                  if (!option.disabled) setActiveIndex(index);
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  commitOption(option);
                }}
              >
                <span className={styles.optionCopy}>
                  <span className={styles.optionLabel}>{option.label}</span>
                  {option.meta && (
                    <span className={styles.optionMeta}>{option.meta}</span>
                  )}
                </span>
                {isSelected && (
                  <span className={styles.check} aria-hidden="true">
                    <CheckGlyph size={14} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
