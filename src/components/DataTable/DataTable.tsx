import { useMemo, useState, type ReactNode } from 'react';
import { Brand, DataTableStyle, Surface } from '../../theme/enums';
import { useResolvedTheme } from '../../theme/BrandProvider';
import { SortGlyph } from '../../icons/Glyphs';
import styles from './DataTable.module.css';

export interface DataTableRow {
  id: string;
  highlighted?: boolean;
}

export interface DataTableColumn<T extends DataTableRow> {
  key: keyof T & string;
  header: string;
  align?: 'left' | 'right';
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface DataTableSortState {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T extends DataTableRow> {
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  style?: DataTableStyle;
  brand?: Brand;
  surface?: Surface;
  caption?: string;
  summaryRow?: Partial<Record<keyof T & string, ReactNode>>;
  sortState?: DataTableSortState | null;
  onSortChange?: (next: DataTableSortState | null) => void;
  emptyMessage?: string;
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  const numA =
    typeof a === 'string'
      ? Number(a.replace(/[$,%+,\s]/g, ''))
      : Number.NaN;
  const numB =
    typeof b === 'string'
      ? Number(b.replace(/[$,%+,\s]/g, ''))
      : Number.NaN;

  if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
    return numA - numB;
  }

  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

export function DataTable<T extends DataTableRow>({
  columns,
  rows,
  style = DataTableStyle.Editorial,
  brand,
  surface,
  caption,
  summaryRow,
  sortState,
  onSortChange,
  emptyMessage = 'No matching records available.',
}: DataTableProps<T>) {
  const theme = useResolvedTheme(brand, surface);
  const [internalSort, setInternalSort] = useState<DataTableSortState | null>(
    null,
  );
  const activeSort = sortState !== undefined ? sortState : internalSort;

  const handleSort = (columnKey: string) => {
    let next: DataTableSortState | null;
    if (!activeSort || activeSort.key !== columnKey) {
      next = { key: columnKey, direction: 'desc' };
    } else if (activeSort.direction === 'desc') {
      next = { key: columnKey, direction: 'asc' };
    } else {
      next = null;
    }

    if (sortState === undefined) {
      setInternalSort(next);
    }
    onSortChange?.(next);
  };

  const sortedRows = useMemo(() => {
    if (!activeSort) return rows;
    const { key, direction } = activeSort;
    const factor = direction === 'asc' ? 1 : -1;
    return [...rows].sort(
      (a, b) => compareValues(a[key as keyof T], b[key as keyof T]) * factor,
    );
  }, [rows, activeSort]);

  return (
    <div
      className={`${styles.container} ${styles[`style_${style}`]}`}
      data-brand={theme.brand}
      data-surface={theme.surface}
      data-style={style}
    >
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr className={styles.headRow}>
            {columns.map((column) => {
              const isSorted = activeSort?.key === column.key;
              const ariaSort = !column.sortable
                ? undefined
                : isSorted
                  ? activeSort.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none';

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={`${styles.th} ${column.align === 'right' ? styles.alignRight : styles.alignLeft}`}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className={`${styles.sortButton} ${column.align === 'right' ? styles.sortRight : ''}`}
                      onClick={() => handleSort(column.key)}
                    >
                      <span>{column.header}</span>
                      <SortGlyph
                        direction={isSorted ? activeSort.direction : null}
                      />
                    </button>
                  ) : (
                    <span>{column.header}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyCell}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => (
              <tr
                key={row.id}
                className={`${styles.bodyRow} ${row.highlighted ? styles.highlightedRow : ''}`}
                data-highlighted={row.highlighted ? 'true' : undefined}
              >
                {columns.map((column, colIdx) => {
                  const rawValue = row[column.key];
                  const rendered = column.render
                    ? column.render(rawValue, row)
                    : (rawValue as ReactNode);

                  return (
                    <td
                      key={column.key}
                      className={`${styles.td} ${column.align === 'right' ? styles.alignRight : styles.alignLeft} ${colIdx === 0 ? styles.leadCell : ''}`}
                    >
                      {rendered}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>

        {summaryRow && sortedRows.length > 0 && (
          <tfoot>
            <tr className={styles.summaryRow}>
              {columns.map((column, colIdx) => (
                <td
                  key={column.key}
                  className={`${styles.td} ${styles.summaryCell} ${column.align === 'right' ? styles.alignRight : styles.alignLeft} ${colIdx === 0 ? styles.leadCell : ''}`}
                >
                  {summaryRow[column.key] ?? ''}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
