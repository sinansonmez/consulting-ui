import { useCallback, useEffect, useRef, useState } from 'react';
import { Brand, Surface } from '../../index';

export interface BrandMeta {
  label: string;
  enumName: string;
  alternateEnum: string;
  alternateLabel: string;
  attribution: string;
}

export const BRAND_META: Readonly<Record<Brand, BrandMeta>> = {
  [Brand.McKinsey]: {
    label: 'McKinsey',
    enumName: 'Brand.McKinsey',
    alternateEnum: 'Brand.BCG',
    alternateLabel: 'BCG override',
    attribution: 'McKinsey Style · Illustrative Exhibit',
  },
  [Brand.BCG]: {
    label: 'BCG',
    enumName: 'Brand.BCG',
    alternateEnum: 'Brand.McKinsey',
    alternateLabel: 'McKinsey override',
    attribution: 'BCG Style · Illustrative Exhibit',
  },
  [Brand.Bain]: {
    label: 'Bain',
    enumName: 'Brand.Bain',
    alternateEnum: 'Brand.BCG',
    alternateLabel: 'BCG override',
    attribution: 'Bain Style · Illustrative Exhibit',
  },
};

export function formatBrandLabel(brand: Brand): string {
  return BRAND_META[brand].label;
}

export function formatSurfaceLabel(surface: Surface): string {
  return surface === Surface.Dark ? 'Dark' : 'Light';
}

export function formatSurfaceEnumName(surface: Surface): string {
  return surface === Surface.Dark ? 'Surface.Dark' : 'Surface.Light';
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy textarea fallback
    }
  }
  if (typeof document === 'undefined') return false;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }
  document.body.removeChild(textarea);
  return copied;
}

export function useCopyFeedback(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyTextToClipboard(text);
      if (!ok) return false;
      setCopied(true);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, resetMs);
      return true;
    },
    [resetMs],
  );

  return { copied, copy };
}
