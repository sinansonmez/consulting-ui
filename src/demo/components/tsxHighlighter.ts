export type HighlightTokenKind =
  | 'comment'
  | 'keyword'
  | 'tag'
  | 'attr'
  | 'enum'
  | 'string'
  | 'number'
  | 'punctuation'
  | 'plain';

export interface HighlightToken {
  kind: HighlightTokenKind;
  text: string;
}

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'default',
  'function',
  'const',
  'let',
  'var',
  'return',
  'type',
  'interface',
  'as',
  'true',
  'false',
  'null',
  'undefined',
]);

function pushToken(
  tokens: HighlightToken[],
  kind: HighlightTokenKind,
  text: string,
): void {
  if (!text) return;
  const prev = tokens[tokens.length - 1];
  if (prev && prev.kind === kind) {
    prev.text += text;
  } else {
    tokens.push({ kind, text });
  }
}

function findStringEnd(line: string, start: number, quote: string): number {
  let i = start + 1;
  while (i < line.length) {
    const ch = line[i];
    if (ch === '\\') {
      i += 2;
      continue;
    }
    if (ch === quote) {
      return i;
    }
    i += 1;
  }
  return -1;
}

/**
 * Lightweight zero-dependency TSX/JSX tokenizer for showcase code panels.
 * Lossless: rejoining token text across lines always reproduces the exact input.
 */
export function tokenizeTsx(code: string): HighlightToken[][] {
  const rawLines = code.split('\n');
  const result: HighlightToken[][] = [];
  let inBlockComment = false;

  for (const line of rawLines) {
    const tokens: HighlightToken[] = [];
    let i = 0;

    while (i < line.length) {
      if (inBlockComment) {
        const endIdx = line.indexOf('*/', i);
        if (endIdx === -1) {
          pushToken(tokens, 'comment', line.slice(i));
          i = line.length;
        } else {
          pushToken(tokens, 'comment', line.slice(i, endIdx + 2));
          i = endIdx + 2;
          inBlockComment = false;
        }
        continue;
      }

      const ch = line[i];
      const next = line[i + 1];

      // Whitespace
      if (ch === ' ' || ch === '\t' || ch === '\r') {
        let j = i + 1;
        while (j < line.length && (line[j] === ' ' || line[j] === '\t' || line[j] === '\r')) {
          j += 1;
        }
        pushToken(tokens, 'plain', line.slice(i, j));
        i = j;
        continue;
      }

      // Single-line comment
      if (ch === '/' && next === '/') {
        pushToken(tokens, 'comment', line.slice(i));
        break;
      }

      // Block comment start
      if (ch === '/' && next === '*') {
        const endIdx = line.indexOf('*/', i + 2);
        if (endIdx === -1) {
          pushToken(tokens, 'comment', line.slice(i));
          inBlockComment = true;
          break;
        } else {
          pushToken(tokens, 'comment', line.slice(i, endIdx + 2));
          i = endIdx + 2;
          continue;
        }
      }

      // String / template literal (only when closed on same line so prose apostrophes don't bleed)
      if (ch === "'" || ch === '"' || ch === '`') {
        const endIdx = findStringEnd(line, i, ch);
        if (endIdx !== -1) {
          pushToken(tokens, 'string', line.slice(i, endIdx + 1));
          i = endIdx + 1;
          continue;
        }
      }

      // JSX opening or closing tag: <Component or </Component
      if (ch === '<') {
        const isClosing = next === '/';
        const nameStart = isClosing ? i + 2 : i + 1;
        if (nameStart < line.length && /[A-Za-z]/.test(line[nameStart])) {
          let nameEnd = nameStart + 1;
          while (nameEnd < line.length && /[A-Za-z0-9]/.test(line[nameEnd])) {
            nameEnd += 1;
          }
          pushToken(tokens, 'punctuation', isClosing ? '</' : '<');
          pushToken(tokens, 'tag', line.slice(nameStart, nameEnd));
          i = nameEnd;
          continue;
        }
      }

      // Two-char punctuation
      if ((ch === '/' && next === '>') || (ch === '=' && next === '>')) {
        pushToken(tokens, 'punctuation', line.slice(i, i + 2));
        i += 2;
        continue;
      }

      // Numeric literal (including leading minus when preceded by boundary)
      const prevChar = i > 0 ? line[i - 1] : '';
      const isNegativeStart =
        ch === '-' &&
        next !== undefined &&
        /\d/.test(next) &&
        (i === 0 || /[\s([{:,=]/.test(prevChar));
      if (/\d/.test(ch) || isNegativeStart) {
        let j = isNegativeStart ? i + 1 : i;
        while (j < line.length && /\d/.test(line[j])) j += 1;
        if (line[j] === '.' && j + 1 < line.length && /\d/.test(line[j + 1])) {
          j += 1;
          while (j < line.length && /\d/.test(line[j])) j += 1;
        }
        pushToken(tokens, 'number', line.slice(i, j));
        i = j;
        continue;
      }

      // Identifier / keyword / attr / enum
      if (/[A-Za-z_$]/.test(ch)) {
        let j = i + 1;
        while (j < line.length && /[A-Za-z0-9_$]/.test(line[j])) {
          j += 1;
        }
        const word = line.slice(i, j);
        const afterChar = line[j];
        if (afterChar === '=' && line[j + 1] !== '=' && line[j + 1] !== '>') {
          pushToken(tokens, 'attr', word);
        } else if (afterChar === ':' && line[j + 1] !== ':') {
          pushToken(tokens, 'attr', word);
        } else if (KEYWORDS.has(word)) {
          pushToken(tokens, 'keyword', word);
        } else if (/^[A-Z]/.test(word)) {
          pushToken(tokens, 'enum', word);
        } else {
          pushToken(tokens, 'plain', word);
        }
        i = j;
        continue;
      }

      // Single punctuation
      if (/[{}()[\]=:;,<>./?+-]/.test(ch)) {
        pushToken(tokens, 'punctuation', ch);
        i += 1;
        continue;
      }

      // Fallback character
      pushToken(tokens, 'plain', ch);
      i += 1;
    }

    result.push(tokens);
  }

  return result;
}
