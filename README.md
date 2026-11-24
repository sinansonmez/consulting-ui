# consulting-ui — Strategy Consulting React UI Component Library

[![npm version](https://img.shields.io/npm/v/consulting-ui?style=flat-square&color=147B58)](https://www.npmjs.com/package/consulting-ui)
[![Live Showcase](https://img.shields.io/badge/Live%20Showcase-GitHub%20Pages-2251FF?style=flat-square)](https://sinansonmez.github.io/consulting-ui/)
[![React 19](https://img.shields.io/badge/React-19-051C2C?style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-051C2C?style=flat-square)](https://www.typescriptlang.org/)
[![Zero Runtime Dependencies](https://img.shields.io/badge/Runtime%20Deps-0-CC0000?style=flat-square)](#architecture)
[![npm Provenance](https://img.shields.io/badge/npm-Trusted%20Publishing%20OIDC-147B58?style=flat-square)](#automated-npm-publishing-oidc)
[![License: MIT](https://img.shields.io/badge/License-MIT-222222?style=flat-square)](./LICENSE)

**`consulting-ui`** is a zero-dependency **React 19 + TypeScript UI component library** engineered for strategy consulting digital reports, executive briefings, and analytical client dashboards—inspired by the distinctive visual design languages of **McKinsey & Company**, **Boston Consulting Group (BCG)**, and **Bain & Company**.

Switch a single `<BrandProvider>` (or override `brand` on any individual component) to transform **color palettes, display/body typography, corner geometry, accent rules, directional CTA motifs, and Light / Executive Dark surfaces** without changing component code.

**[Explore the Live Interactive Showcase on GitHub Pages →](https://sinansonmez.github.io/consulting-ui/)**

---

## Installation

```bash
npm install consulting-ui
```

> **Peer dependencies:** `react >= 19` and `react-dom >= 19`. Zero external runtime dependencies.

---

## Why `consulting-ui`?

- **Three Distinct Consulting Design Languages — Not Just Color Swaps:** Switching between `Brand.McKinsey`, `Brand.BCG`, and `Brand.Bain` changes structural geometry (`0px` sharp corners vs. `9999px` pill controls vs. `2px` financial precision), typographic pairings, callout architecture, and button arrow motifs.
- **Strict TypeScript `enum` `style` API:** Every component exposes a small, brand-safe interface using classic TypeScript `enum`s (`ButtonStyle.Primary`, `CalloutStyle.Executive`, `ExhibitStyle.Editorial`, etc.) and intentionally omits raw inline `CSSProperties` and arbitrary `className` overrides so teams stay on-brand.
- **Zero External Runtime Dependencies:** Only `react` and `react-dom` peer dependencies. Styles compile into one zero-runtime CSS stylesheet (`consulting-ui/styles.css`) powered by CSS Custom Properties (`[data-brand]` × `[data-surface]`).
- **Built for Data Storytelling & Analytical Workbenches:** Pairs 5 core interactive controls (`Button`, `Badge`, `Input`, `Select`, `Tabs`) with 5 consulting-report primitives (`Callout`, `MetricCard`, `ExhibitFrame`, `DataTable`, `Accordion`).
- **Accessible by Default:** Custom brand-styled ARIA `listbox` in `<Select>`, WAI-ARIA roving keyboard navigation in `<Tabs>`, `aria-sort` + `tabular-nums` in `<DataTable>`, visible focus rings, and `prefers-reduced-motion` support.

---

## Consulting Design System Matrix

| Brand Enum | Light Palette | Executive Dark Surface | Geometry & Signature Motifs | Typography Stack (Corporate First + Open Fallback) |
| :--- | :--- | :--- | :--- | :--- |
| **`Brand.McKinsey`** | Midnight Navy `#051C2C`, Electric Blue `#2251FF`, Canvas `#FFFFFF` | Deep Navy `#051C2C` / `#0B2940` | `0px` sharp architectural corners, `2px` navy exhibit rules, sliding horizontal arrow CTAs | `"Bower", "Newsreader"` serif display + `"McKinsey Sans", "Plus Jakarta Sans"` UI |
| **`Brand.BCG`** | Deep Emerald `#147B58`, Signal Green `#29BA74`, Forest `#0E3B2C` | Deep Forest `#0B291E` / `#123A2B` | `9999px` pill buttons & badges, `10px` modular cards, circular emerald arrow disc on editorial CTAs | `"Henderson BCG Sans", "DM Sans"` display & UI + `"Henderson BCG Serif", "Fraunces"` accents |
| **`Brand.Bain`** | Crimson `#CC0000` (`#A30000` hover), Charcoal `#222222`, Stone `#F4F4F4` | Executive Charcoal `#181818` / `#242424` | `2px` financial precision corners, `3px–4px` crimson accent rules, red chevron & underline CTAs | `"Tiempos Headline", "Source Serif 4"` serif display + `"Graphik", "Public Sans"` tabular UI |

---

## Quick Start

```tsx
import {
  Brand,
  BrandProvider,
  Button,
  ButtonStyle,
  Callout,
  CalloutStyle,
  ExhibitFrame,
  ExhibitStyle,
  MetricCard,
  MetricCardStyle,
  Surface,
} from 'consulting-ui';
import 'consulting-ui/styles.css';

export function StrategyBriefing() {
  return (
    <BrandProvider brand={Brand.McKinsey} surface={Surface.Light}>
      <MetricCard
        style={MetricCardStyle.Hero}
        value="2.4x"
        label="Top-quartile productivity lead"
        delta="+0.5x YoY"
        deltaDirection="up"
        benchmark="Sector median: 1.0x"
      />

      <Callout
        style={CalloutStyle.Executive}
        eyebrow="Executive Summary"
        title="Operating-model redesign outperforms isolated AI pilots"
      >
        <p>Enterprises rewiring core P&amp;L workflows capture measurable EBITDA expansion within 12 months.</p>
      </Callout>

      <ExhibitFrame
        style={ExhibitStyle.Editorial}
        exhibitLabel="Exhibit 1"
        title="Leaders outpace medians across every major industry vertical"
        source="Illustrative 2026 strategy benchmark"
      >
        {/* Drop in SVG, Recharts, Visx, or <DataTable /> */}
      </ExhibitFrame>

      {/* Strict enum `style` prop + optional per-component `brand` override */}
      <Button style={ButtonStyle.Primary} showArrow>
        Download full report
      </Button>
      <Button brand={Brand.BCG} style={ButtonStyle.Editorial}>
        Compare in BCG style
      </Button>
      <Button brand={Brand.Bain} style={ButtonStyle.Secondary}>
        Compare in Bain style
      </Button>
    </BrandProvider>
  );
}
```

---

## Top 10 POC Component Catalog

| # | Component | `style` Enum Variants | Key Capabilities |
| :-: | :--- | :--- | :--- |
| 1 | **`Button`** | `ButtonStyle`: `Primary` · `Secondary` · `Editorial` · `Quiet` | Brand-distinct geometry & arrow/chevron motifs, `loading` (`aria-busy`), `ControlSize`, `fullWidth` |
| 2 | **`Badge`** | `BadgeStyle`: `Accent` · `Neutral` · `Outline` · `Positive` · `Negative` | Automatic delta triangles (`up`/`down`) and `tabular-nums` for KPI deltas & practice tags |
| 3 | **`Input`** | `InputStyle`: `Standard` · `Underline` · `Filled` | Controlled + uncontrolled, `searchable`, `clearable`, `prefix`/`suffix`, accessible `error` alerts |
| 4 | **`Select`** | `SelectStyle`: `Standard` · `Underline` · `Compact` | Custom brand-styled ARIA `combobox`/`listbox` with full keyboard navigation (`↑/↓/Home/End/Enter/Esc`) |
| 5 | **`Tabs`** | `TabsStyle`: `Underline` · `Segmented` · `Minimal` | WAI-ARIA `tablist`/`tabpanel` with roving arrow-key focus and optional item counts |
| 6 | **`Callout`** | `CalloutStyle`: `Executive` · `Methodology` · `Highlight` | Firm-specific executive takeaway framing (McKinsey blue top rule, BCG forest block, Bain crimson left rule) |
| 7 | **`MetricCard`** | `MetricCardStyle`: `Hero` · `Compact` · `Split` | Oversized `tabular-nums` KPI display, trend delta badge, benchmark comparison, and source line |
| 8 | **`ExhibitFrame`** | `ExhibitStyle`: `Editorial` · `Card` · `AccentHeader` | Chart-agnostic consulting exhibit wrapper with `exhibitLabel`, action title, header `controls` slot, `Note`, and `Source` |
| 9 | **`DataTable`** | `DataTableStyle`: `Editorial` · `Zebra` · `Compact` | Declarative `columns` + `rows` + pinned `summaryRow`, highlighted target rows, numeric-aware sorting (`aria-sort`) |
| 10 | **`Accordion`** | `AccordionStyle`: `Bordered` · `Separated` · `Minimal` | Single- or multi-expand collapsible sections for report methodology, demographics, and footnotes |

---

## Automated npm Publishing (OIDC)

This repository automates CI and npm releases via GitHub Actions with **npm Trusted Publishing (GitHub OIDC)** and cryptographic Sigstore **provenance**—zero long-lived `NPM_TOKEN` secrets required:

- **[`.github/workflows/pr-check.yml`](./.github/workflows/pr-check.yml)**: Runs lint, typecheck, Vitest suite, and library + showcase builds on every pull request.
- **[`.github/workflows/publish.yml`](./.github/workflows/publish.yml)**: Triggered on GitHub **Release `published`** (or manual `workflow_dispatch`). Verifies types, lint, tests, and build on Node 24, then publishes with `npm publish --provenance --access public` using short-lived GitHub OIDC credentials (`id-token: write`).
- **[`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)**: Deploys the interactive Showcase to GitHub Pages on every push to `main`.

### One-Time Trusted Publisher Setup on npmjs.com

1. Publish the initial version once locally (`npm login && npm publish --access public`) to register `consulting-ui` on npmjs.com.
2. Open **npmjs.com → `consulting-ui` → Settings → Trusted Publishers → GitHub Actions** and configure:
   - **Organization / User:** `sinansonmez`
   - **Repository:** `consulting-ui`
   - **Workflow filename:** `publish.yml`
3. For every future release, bump the version (`npm version patch|minor|major`), push tags (`git push --follow-tags`), and publish a GitHub Release—GitHub Actions publishes automatically with verified provenance.

---

## Architecture

- **Theme Seam (`BrandProvider` + `tokens.css`):** Zero-runtime CSS Custom Properties cascade from `[data-brand="mckinsey|bcg|bain"]` and `[data-surface="light|dark"]`. Every component stamps its resolved brand/surface attributes so per-component overrides work even in side-by-side multi-firm grids or without a provider.
- **Controlled + Uncontrolled State:** Interactive modules (`Input`, `Select`, `Tabs`, `Accordion`, `DataTable`) share a clean internal controllable-state hook so simple report prototypes work out of the box with `defaultValue` while production apps can control state explicitly.
- **Dual Build Targets:**
  - `npm run build` outputs the publishable ESM library (`dist/index.js`, `dist/index.d.ts`, `dist/styles.css`) with `react` and `react-dom` externalized.
  - `npm run build:demo` builds the live GitHub Pages Showcase (`dist-demo/`) featuring both the **Interactive 2026 Strategy Report** and the **Tri-Brand Side-by-Side Component Lab**.

---

## Local Development

```bash
git clone https://github.com/sinansonmez/consulting-ui.git
cd consulting-ui
npm install

# Run interactive Showcase & Tri-Brand Lab locally
npm run dev

# Run Vitest + Testing Library suite across all 10 components
npm test

# Typecheck, lint, and build library + GitHub Pages showcase
npm run typecheck
npm run lint
npm run build
npm run build:demo
```

---

## Disclaimer

`consulting-ui` is an independent, open-source React UI proof-of-concept and design-system study. It is **not affiliated with, sponsored by, or endorsed by** McKinsey & Company, Boston Consulting Group, or Bain & Company. All trademarks, brand names, and proprietary corporate typeface names belong to their respective owners; open-source Google Font fallbacks are used in the live showcase, and all report metrics shown in the demo are illustrative benchmark datasets.

## License

[MIT](./LICENSE)
