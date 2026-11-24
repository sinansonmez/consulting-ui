import { useId } from 'react';
import { Brand, ControlSize, InputStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { useControllableState } from '../../hooks/useControllableState';
import { CloseGlyph, SearchGlyph } from '../../icons/Glyphs';
import styles from './Input.module.css';

export interface InputProps {
  style?: InputStyle;
  size?: ControlSize;
  brand?: Brand;
  surface?: Surface;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (nextValue: string) => void;
  type?: 'text' | 'search' | 'email' | 'number';
  prefix?: string;
  suffix?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
}

export function Input({
  style = InputStyle.Standard,
  size = ControlSize.Md,
  brand,
  surface,
  label,
  placeholder,
  helperText,
  error,
  value,
  defaultValue = '',
  onChange,
  type = 'text',
  prefix,
  suffix,
  searchable = false,
  clearable = false,
  disabled = false,
  required = false,
  id,
  name,
}: InputProps) {
  const theme = useResolvedTheme(brand, surface);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const noteId = `${inputId}-note`;
  const [currentValue, setCurrentValue] = useControllableState<string>({
    value,
    defaultValue,
    onChange,
  });

  const hasNote = Boolean(error || helperText);
  const showClear = clearable && !disabled && currentValue.length > 0;

  return (
    <div
      className={styles.field}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
      data-invalid={Boolean(error) || undefined}
    >
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          <span>{label}</span>
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div
        className={`${styles.control} ${styles[`style_${style}`]} ${styles[`size_${size}`]} ${error ? styles.invalid : ''} ${disabled ? styles.disabled : ''}`}
      >
        {searchable && (
          <span className={styles.adornment} aria-hidden="true">
            <SearchGlyph size={15} />
          </span>
        )}
        {prefix && <span className={styles.affix}>{prefix}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          className={styles.input}
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={hasNote ? noteId : undefined}
          onChange={(event) => setCurrentValue(event.target.value)}
        />
        {suffix && <span className={styles.affix}>{suffix}</span>}
        {showClear && (
          <button
            type="button"
            className={styles.clearButton}
            aria-label="Clear input"
            onClick={() => setCurrentValue('')}
          >
            <CloseGlyph size={12} />
          </button>
        )}
      </div>
      {hasNote && (
        <p
          id={noteId}
          className={error ? styles.errorText : styles.helperText}
          role={error ? 'alert' : undefined}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
