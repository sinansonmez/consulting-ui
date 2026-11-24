import { useId } from 'react';
import { Brand, SliderStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { useControllableState } from '../../hooks/useControllableState';
import styles from './Slider.module.css';

export interface SliderProps {
  label: string;
  style?: SliderStyle;
  brand?: Brand;
  surface?: Surface;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (nextValue: number) => void;
  formatValue?: (value: number) => string;
  benchmarkValue?: number;
  benchmarkLabel?: string;
  disabled?: boolean;
  id?: string;
}

export function Slider({
  label,
  style = SliderStyle.Standard,
  brand,
  surface,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 50,
  onChange,
  formatValue = (v) => String(v),
  benchmarkValue,
  benchmarkLabel,
  disabled = false,
  id,
}: SliderProps) {
  const theme = useResolvedTheme(brand, surface);
  const generatedId = useId();
  const sliderId = id ?? generatedId;

  const [currentValue, setCurrentValue] = useControllableState<number>({
    value,
    defaultValue,
    onChange,
  });

  const span = max - min || 1;
  const fillPct = Math.min(100, Math.max(0, ((currentValue - min) / span) * 100));
  const benchPct =
    benchmarkValue !== undefined
      ? Math.min(100, Math.max(0, ((benchmarkValue - min) / span) * 100))
      : undefined;

  const stepCount =
    style === SliderStyle.Stepped && step > 0
      ? Math.min(20, Math.floor(span / step))
      : 0;

  return (
    <div
      className={`${styles.root} ${styles[`style_${style}`]} ${disabled ? styles.disabled : ''}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <div className={styles.header}>
        <label htmlFor={sliderId} className={styles.label}>
          {label}
        </label>
        <output htmlFor={sliderId} className={styles.readout}>
          {formatValue(currentValue)}
        </output>
      </div>

      <div className={styles.trackArea}>
        <div className={styles.rail} aria-hidden="true">
          <div className={styles.fill} style={{ width: `${fillPct}%` }} />
          {stepCount > 1 &&
            Array.from({ length: stepCount + 1 }, (_, idx) => (
              <span
                key={idx}
                className={styles.tick}
                style={{ left: `${(idx / stepCount) * 100}%` }}
              />
            ))}
          {benchPct !== undefined && (
            <span
              className={styles.benchTick}
              style={{ left: `${benchPct}%` }}
            />
          )}
        </div>

        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={disabled}
          className={styles.rangeInput}
          onChange={(event) => setCurrentValue(Number(event.target.value))}
        />
      </div>

      <div className={styles.footer}>
        <span>{formatValue(min)}</span>
        {benchmarkLabel && (
          <span className={styles.benchNote}>{benchmarkLabel}</span>
        )}
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
