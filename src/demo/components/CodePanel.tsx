import { useMemo } from 'react';
import { useBrand } from '../../index';
import {
  formatBrandLabel,
  formatSurfaceLabel,
  useCopyFeedback,
} from './codeUtils';
import { tokenizeTsx } from './tsxHighlighter';
import styles from './CodePanel.module.css';

export interface CodePanelProps {
  code: string;
  title?: string;
  id?: string;
}

export function CodePanel({ code, title, id }: CodePanelProps) {
  const { brand, surface } = useBrand();
  const { copied, copy } = useCopyFeedback();

  const lines = useMemo(() => tokenizeTsx(code), [code]);
  const themeLabel = `${formatBrandLabel(brand)} · ${formatSurfaceLabel(surface)}`;

  return (
    <div id={id} className={styles.panel} data-surface={surface}>
      <div className={styles.header}>
        <div className={styles.metaCluster}>
          <span className={styles.langBadge}>TSX</span>
          {title && <span className={styles.titleText}>{title}</span>}
          <span className={styles.themePill}>{themeLabel}</span>
        </div>
        <button
          type="button"
          className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`}
          aria-label={copied ? 'Copied code to clipboard' : 'Copy code to clipboard'}
          onClick={() => void copy(code)}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className={styles.pre}>
        <code className={styles.code}>
          {lines.map((tokens, lineIdx) => (
            <span key={lineIdx} className={styles.line}>
              <span className={styles.lineNum} aria-hidden="true">
                {lineIdx + 1}
              </span>
              <span className={styles.lineContent}>
                {tokens.length === 0
                  ? '\u200B'
                  : tokens.map((token, tokIdx) => (
                      <span
                        key={tokIdx}
                        className={styles[`tok_${token.kind}`]}
                      >
                        {token.text}
                      </span>
                    ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

export interface CodeToggleButtonProps {
  expanded: boolean;
  controlsId: string;
  onToggle: () => void;
  itemLabel?: string;
}

export function CodeToggleButton({
  expanded,
  controlsId,
  onToggle,
  itemLabel,
}: CodeToggleButtonProps) {
  const ariaLabel = expanded
    ? itemLabel
      ? `Hide code for ${itemLabel}`
      : 'Hide code'
    : itemLabel
      ? `Show code for ${itemLabel}`
      : 'Show code';

  return (
    <button
      type="button"
      className={`${styles.toggleBtn} ${expanded ? styles.toggleBtnActive : ''}`}
      aria-expanded={expanded}
      aria-controls={controlsId}
      aria-label={ariaLabel}
      onClick={onToggle}
    >
      <span className={styles.glyph} aria-hidden="true">
        &lt;/&gt;
      </span>
      <span>{expanded ? 'Hide code' : 'Code'}</span>
    </button>
  );
}
