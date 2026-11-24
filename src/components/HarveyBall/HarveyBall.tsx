import { Brand, ControlSize, HarveyBallStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import styles from './HarveyBall.module.css';

export type HarveyBallValue = 0 | 25 | 50 | 75 | 100;

export interface HarveyBallProps {
  value: HarveyBallValue;
  style?: HarveyBallStyle;
  size?: ControlSize;
  brand?: Brand;
  surface?: Surface;
  label?: string;
  showValue?: boolean;
}

function getWedgePath(value: HarveyBallValue): string | null {
  switch (value) {
    case 0:
      return null;
    case 25:
      return 'M12 12 L12 2 A10 10 0 0 1 22 12 Z';
    case 50:
      return 'M12 12 L12 2 A10 10 0 0 1 12 22 Z';
    case 75:
      return 'M12 12 L12 2 A10 10 0 1 1 2 12 Z';
    case 100:
      return 'M12 2 A10 10 0 1 1 11.999 2 Z';
  }
}

export function HarveyBall({
  value,
  style = HarveyBallStyle.Solid,
  size = ControlSize.Md,
  brand,
  surface,
  label,
  showValue = false,
}: HarveyBallProps) {
  const theme = useResolvedTheme(brand, surface);
  const pixelSize =
    size === ControlSize.Sm ? 16 : size === ControlSize.Lg ? 28 : 20;
  const circumference = 2 * Math.PI * 8.5;
  const dashOffset = circumference * (1 - value / 100);
  const wedgePath = getWedgePath(value);
  const accessibleName = label ? `${label}: ${value}%` : `${value}% completion`;

  return (
    <span
      role="img"
      aria-label={accessibleName}
      className={`${styles.root} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
      data-value={value}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {style === HarveyBallStyle.Ring ? (
          <>
            <circle
              cx="12"
              cy="12"
              r="8.5"
              stroke="var(--mbb-border)"
              strokeWidth="3"
            />
            {value > 0 && (
              <circle
                cx="12"
                cy="12"
                r="8.5"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 12 12)"
              />
            )}
          </>
        ) : (
          <>
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.75"
              fill="var(--mbb-bg-canvas)"
            />
            {wedgePath && <path d={wedgePath} fill="currentColor" />}
          </>
        )}
      </svg>
      {showValue && <span className={styles.valueText}>{value}%</span>}
    </span>
  );
}
