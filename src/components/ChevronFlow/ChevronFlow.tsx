import { Brand, ChevronFlowStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import styles from './ChevronFlow.module.css';

export interface ChevronStep {
  id: string;
  title: string;
  phase?: string;
  subtitle?: string;
  items?: readonly string[];
  active?: boolean;
}

export interface ChevronFlowProps {
  steps: readonly ChevronStep[];
  style?: ChevronFlowStyle;
  brand?: Brand;
  surface?: Surface;
  ariaLabel?: string;
}

export function ChevronFlow({
  steps,
  style = ChevronFlowStyle.Interlocking,
  brand,
  surface,
  ariaLabel = 'Transformation stages',
}: ChevronFlowProps) {
  const theme = useResolvedTheme(brand, surface);

  return (
    <div
      className={`${styles.root} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <ol className={styles.list} aria-label={ariaLabel}>
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`${styles.step} ${step.active ? styles.stepActive : ''}`}
          >
            <div className={styles.headerBanner}>
              <span className={styles.phase}>
                {step.phase ?? `Stage ${index + 1}`}
              </span>
              <span className={styles.title}>{step.title}</span>
            </div>

            {(step.subtitle || (step.items && step.items.length > 0)) && (
              <div className={styles.body}>
                {step.subtitle && (
                  <p className={styles.subtitle}>{step.subtitle}</p>
                )}
                {step.items && step.items.length > 0 && (
                  <ul className={styles.items}>
                    {step.items.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
