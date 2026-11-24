import { useRef, type KeyboardEvent } from 'react';
import {
  Brand,
  ControlSize,
  SegmentedControlStyle,
  Surface,
} from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { useControllableState } from '../../hooks/useControllableState';
import styles from './SegmentedControl.module.css';

export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: readonly SegmentedOption[];
  style?: SegmentedControlStyle;
  size?: ControlSize;
  brand?: Brand;
  surface?: Surface;
  value?: string;
  defaultValue?: string;
  onChange?: (nextValue: string) => void;
  fullWidth?: boolean;
  ariaLabel?: string;
}

export function SegmentedControl({
  options,
  style = SegmentedControlStyle.Filled,
  size = ControlSize.Md,
  brand,
  surface,
  value,
  defaultValue,
  onChange,
  fullWidth = false,
  ariaLabel = 'Options',
}: SegmentedControlProps) {
  const theme = useResolvedTheme(brand, surface);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstEnabled = options.find((opt) => !opt.disabled)?.value ?? '';

  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? firstEnabled,
    onChange,
  });

  const moveFocus = (currentIndex: number, delta: 1 | -1) => {
    let idx = currentIndex;
    for (let step = 0; step < options.length; step++) {
      idx = (idx + delta + options.length) % options.length;
      if (!options[idx]?.disabled) {
        setSelectedValue(options[idx].value);
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
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(index, 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(index, -1);
        break;
      case 'Home': {
        event.preventDefault();
        const firstIdx = options.findIndex((o) => !o.disabled);
        if (firstIdx >= 0) {
          setSelectedValue(options[firstIdx].value);
          buttonRefs.current[firstIdx]?.focus();
        }
        break;
      }
      case 'End': {
        event.preventDefault();
        for (let i = options.length - 1; i >= 0; i--) {
          if (!options[i].disabled) {
            setSelectedValue(options[i].value);
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
      role="radiogroup"
      aria-label={ariaLabel}
      className={`${styles.group} ${styles[`style_${style}`]} ${fullWidth ? styles.fullWidth : ''}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      {options.map((option, index) => {
        const isChecked = option.value === selectedValue;
        return (
          <button
            key={option.value}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isChecked}
            tabIndex={isChecked ? 0 : -1}
            disabled={option.disabled}
            className={`${styles.item} ${styles[`size_${size}`]} ${isChecked ? styles.checked : ''}`}
            onClick={() => setSelectedValue(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
