import { Brand, MatrixStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { useControllableState } from '../../hooks/useControllableState';
import styles from './Matrix2x2.module.css';

export interface MatrixQuadrantLabels {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

export interface MatrixItem {
  id: string;
  label: string;
  x: number;
  y: number;
  meta?: string;
  highlighted?: boolean;
}

export interface Matrix2x2Props {
  xAxisLabel: string;
  yAxisLabel: string;
  quadrantLabels: MatrixQuadrantLabels;
  items: readonly MatrixItem[];
  style?: MatrixStyle;
  brand?: Brand;
  surface?: Surface;
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectItem?: (item: MatrixItem) => void;
}

function clampCoord(n: number): number {
  return Math.min(94, Math.max(6, n));
}

export function Matrix2x2({
  xAxisLabel,
  yAxisLabel,
  quadrantLabels,
  items,
  style = MatrixStyle.Quadrant,
  brand,
  surface,
  selectedId,
  defaultSelectedId = '',
  onSelectItem,
}: Matrix2x2Props) {
  const theme = useResolvedTheme(brand, surface);
  const [activeId, setActiveId] = useControllableState<string>({
    value: selectedId,
    defaultValue: defaultSelectedId,
  });

  const handleSelect = (item: MatrixItem) => {
    setActiveId(item.id);
    onSelectItem?.(item);
  };

  return (
    <div
      className={`${styles.root} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <div className={styles.layout}>
        <div className={styles.yAxis}>
          <span className={styles.yAxisText}>{yAxisLabel} ↑</span>
        </div>

        <div className={styles.plane}>
          <div className={styles.quadrants} aria-hidden="true">
            <div className={styles.quadCell}>
              <span className={styles.quadTitle}>{quadrantLabels.topLeft}</span>
            </div>
            <div className={`${styles.quadCell} ${styles.leaderQuad}`}>
              <span className={styles.quadTitle}>{quadrantLabels.topRight}</span>
            </div>
            <div className={styles.quadCell}>
              <span className={styles.quadTitle}>
                {quadrantLabels.bottomLeft}
              </span>
            </div>
            <div className={styles.quadCell}>
              <span className={styles.quadTitle}>
                {quadrantLabels.bottomRight}
              </span>
            </div>
          </div>

          <div className={styles.pointsLayer}>
            {items.map((item) => {
              const isSelected = item.id === activeId;
              const leftPct = clampCoord(item.x);
              const topPct = 100 - clampCoord(item.y);

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  className={`${styles.point} ${isSelected ? styles.pointSelected : ''} ${item.highlighted ? styles.pointHighlighted : ''}`}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  onClick={() => handleSelect(item)}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.tag}>
                    <span className={styles.tagLabel}>{item.label}</span>
                    {item.meta && (
                      <span className={styles.tagMeta}>{item.meta}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.xAxis}>
        <span>{xAxisLabel} →</span>
      </div>
    </div>
  );
}
