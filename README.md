# consulting-ui — Strategy Consulting React UI Component Library

[![npm version](https://img.shields.io/npm/v/consulting-ui?style=flat-square&color=147B58)](https://www.npmjs.com/package/consulting-ui)
[![Live Showcase](https://img.shields.io/badge/Live%20Showcase-GitHub%20Pages-2251FF?style=flat-square)](https://sinansonmez.github.io/consulting-ui/)
[![React 19](https://img.shields.io/badge/React-19-051C2C?style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-051C2C?style=flat-square)](https://www.typescriptlang.org/)
[![Zero Runtime Dependencies](https://img.shields.io/badge/Runtime%20Deps-0-CC0000?style=flat-square)](#architecture)
[![npm Provenance](https://img.shields.io/badge/npm-Trusted%20Publishing%20OIDC-147B58?style=flat-square)](#automated-npm-publishing-oidc)
[![License: MIT](https://img.shields.io/badge/License-MIT-222222?style=flat-square)](./LICENSE)

**`consulting-ui`** is a zero-dependency **React 19 + TypeScript UI & consulting-framework component library (20 components)** engineered for strategy consulting digital reports, executive slide briefings, interactive ROI/maturity simulators, and analytical client dashboards—inspired by the distinctive visual design languages of **McKinsey & Company**, **Boston Consulting Group (BCG)**, and **Bain & Company**.

Switch a single `<BrandProvider>` (or override `brand` on any individual component) to transform **color palettes, display/body typography, corner geometry, accent rules, directional CTA motifs, and Light / Executive Dark surfaces** without changing component code.

**[Explore the Live 3-View Interactive Showcase on GitHub Pages →](https://sinansonmez.github.io/consulting-ui/)**

---

## Installation

```bash
npm install consulting-ui
```

> **Peer dependencies:** `react >= 19` and `react-dom >= 19`. Zero external runtime dependencies.

---

## Why `consulting-ui`?

- **Three Distinct Consulting Design Languages — Not Just Color Swaps:** Switching between `Brand.McKinsey`, `Brand.BCG`, and `Brand.Bain` changes structural geometry (`0px` sharp corners vs. `9999px` pill controls vs. `2px` financial precision), typographic pairings, chevron shapes, callout architecture, and button arrow motifs.
- **Native Strategy Consulting Visuals & Frameworks:** Ships first-class pure-SVG consulting staples you won't find in generic SaaS kits—`WaterfallChart` (auto-computed EBITDA bridges), `Matrix2x2` (interactive 4-quadrant frameworks), `HarveyBall` (`0–100%` qualitative comparison circles), `ChevronFlow` (phased transformation roadmaps), and `BenchmarkBar` (median + top-quartile bullet gauges).
- **Strict TypeScript `enum` `style` API:** Every component exposes a small, brand-safe interface using classic TypeScript `enum`s (`ButtonStyle.Primary`, `WaterfallStyle.Classic`, `MatrixStyle.Quadrant`, etc.) and intentionally omits raw inline `CSSProperties` and arbitrary `className` overrides so teams stay on-brand.
- **Zero External Runtime Dependencies:** Only `react` and `react-dom` peer dependencies. Styles compile into one zero-runtime CSS stylesheet (`consulting-ui/styles.css`) powered by CSS Custom Properties (`[data-brand]` × `[data-surface]`).
- **Accessible by Default:** Custom brand-styled ARIA `listbox` in `<Select>`, WAI-ARIA roving keyboard focus in `<Tabs>` and `<SegmentedControl>`, portal `dialog` focus management in `<Drawer>`, `aria-sort` + `tabular-nums` in `<DataTable>`, visible focus rings, and `prefers-reduced-motion` support.

---

## Consulting Design System Matrix

| Brand Enum | Light Palette | Executive Dark Surface | Geometry & Signature Motifs | Typography Stack (Corporate First + Open Fallback) |
| :--- | :--- | :--- | :--- | :--- |
| **`Brand.McKinsey`** | Midnight Navy `#051C2C`, Electric Blue `#2251FF`, Cyan `#00A9F4`, Canvas `#FFFFFF` | Deep Navy `#051C2C` / `#0B2940` | `0px` sharp architectural corners, `2px` navy exhibit rules, pointed chevrons, sliding horizontal arrow CTAs | `"Bower", "Newsreader"` serif display + `"McKinsey Sans", "Plus Jakarta Sans"` UI |
| **`Brand.BCG`** | Deep Emerald `#147B58`, Signal Green `#29BA74`, Forest `#0E3B2C` | Deep Forest `#0B291E` / `#123A2B` | `9999px` pill buttons & capsules, `10px` modular cards, circular emerald arrow disc on editorial CTAs | `"Henderson BCG Sans", "DM Sans"` display & UI + `"Henderson BCG Serif", "Fraunces"` accents |
| **`Brand.Bain`** | Crimson `#CC0000` (`#A30000` hover), Charcoal `#222222`, Stone `#F4F4F4` | Executive Charcoal `#181818` / `#242424` | `2px` financial precision corners, `3px–4px` crimson accent rules, red chevron & underline CTAs | `"Tiempos Headline", "Source Serif 4"` serif display + `"Graphik", "Public Sans"` tabular UI |

---

## Quick Start

```tsx
import {
  Brand,
  BrandProvider,
  Button,
  ButtonStyle,
  ExhibitFrame,
  ExhibitStyle,
  HarveyBall,
  HarveyBallStyle,
  MetricCard,
  MetricCardStyle,
  Surface,
  WaterfallChart,
  WaterfallStyle,
} from 'consulting-ui';
import 'consulting-ui/styles.css';

export function ValueCreationBrief() {
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

      <ExhibitFrame
        style={ExhibitStyle.Editorial}
        exhibitLabel="Exhibit 1"
        title="Operational levers drive $40M in run-rate EBITDA expansion"
        source="2026 transformation benchmark"
      >
        <WaterfallChart
          style={WaterfallStyle.Classic}
          formatValue={(n) => `$${n}M`}
          steps={[
            { id: 'base', label: 'FY24 Base', value: 100, kind: 'start' },
            { id: 'price', label: 'Pricing', value: 35 },
            { id: 'infl', label: 'Inflation', value: -15 },
            { id: 'sub', label: 'Subtotal', value: 0, kind: 'subtotal' },
            { id: 'ai', label: 'AI Ops', value: 20 },
            { id: 'end', label: 'FY26 Run-Rate', value: 0, kind: 'total' },
          ]}
        />
      </ExhibitFrame>

      <HarveyBall value={75} style={HarveyBallStyle.Solid} label="Governance readiness" showValue />

      <Button style={ButtonStyle.Primary} showArrow>
        Download full report
      </Button>
      <Button brand={Brand.BCG} style={ButtonStyle.Editorial}>
        Compare in BCG style
      </Button>
    </BrandProvider>
  );
}
```

---

## Complete 20-Component Catalog

### Interactive Controls (7)

| # | Component | `style` Enum Variants | Key Capabilities |
| :-: | :--- | :--- | :--- |
| 1 | **`Button`** | `ButtonStyle`: `Primary` · `Secondary` · `Editorial` · `Quiet` | Brand-distinct geometry & arrow/chevron motifs, `loading` (`aria-busy`), `ControlSize`, `fullWidth` |
| 2 | **`Badge`** | `BadgeStyle`: `Accent` · `Neutral` · `Outline` · `Positive` · `Negative` | Automatic delta triangles (`up`/`down`) and `tabular-nums` for KPI deltas & practice tags |
| 3 | **`Input`** | `InputStyle`: `Standard` · `Underline` · `Filled` | Controlled + uncontrolled, `searchable`, `clearable`, `prefix`/`suffix`, accessible `error` alerts |
| 4 | **`Select`** | `SelectStyle`: `Standard` · `Underline` · `Compact` | Custom brand-styled ARIA `combobox`/`listbox` with full keyboard navigation (`↑/↓/Home/End/Enter/Esc`) |
| 5 | **`Tabs`** | `TabsStyle`: `Underline` · `Segmented` · `Minimal` | WAI-ARIA `tablist`/`tabpanel` with roving arrow-key focus and optional item counts |
| 18 | **`Slider`** | `SliderStyle`: `Standard` · `Stepped` · `Minimal` | Brand-shaped thumb, live `tabular-nums` readout, optional `benchmarkValue` reference tick |
| 19 | **`SegmentedControl`** | `SegmentedControlStyle`: `Filled` · `Outline` · `Subtle` | WAI-ARIA `radiogroup` roving arrow focus for scenario, currency, and horizon toggles |

### Editorial & Report Modules (5)

| # | Component | `style` Enum Variants | Key Capabilities |
| :-: | :--- | :--- | :--- |
| 6 | **`Callout`** | `CalloutStyle`: `Executive` · `Methodology` · `Highlight` | Firm-specific executive takeaway framing (McKinsey blue top rule, BCG forest block, Bain crimson left rule) |
| 10 | **`Accordion`** | `AccordionStyle`: `Bordered` · `Separated` · `Minimal` | Single- or multi-expand collapsible sections for report methodology, demographics, and footnotes |
| 16 | **`PullQuote`** | `PullQuoteStyle`: `Editorial` · `Centered` · `Compact` | Oversized brand quotation mark / forest card / crimson rule with speaker, role, and organization |
| 17 | **`InsightCard`** | `InsightCardStyle`: `Editorial` · `Bordered` · `Featured` | Publication / PDF report teaser card with router-agnostic `href` link or `onAction` trigger |
| 20 | **`Drawer`** | `DrawerStyle`: `Standard` · `AccentHeader` · `Floating` | Accessible slide-over `dialog` (`Escape`/backdrop close, scroll lock, focus restore) + `inline` preview mode |

### Consulting Frameworks & Data Exhibits (8)

| # | Component | `style` Enum Variants | Key Capabilities |
| :-: | :--- | :--- | :--- |
| 7 | **`MetricCard`** | `MetricCardStyle`: `Hero` · `Compact` · `Split` | Oversized `tabular-nums` KPI display, trend delta badge, benchmark comparison, and source line |
| 8 | **`ExhibitFrame`** | `ExhibitStyle`: `Editorial` · `Card` · `AccentHeader` | Numbered consulting exhibit wrapper (`Exhibit N`, action title, `controls` slot, `Note`, and `Source`) |
| 9 | **`DataTable`** | `DataTableStyle`: `Editorial` · `Zebra` · `Compact` | Declarative `columns` + `rows` + pinned `summaryRow`, highlighted target rows, numeric-aware sorting (`aria-sort`) |
| 11 | **`HarveyBall`** | `HarveyBallStyle`: `Solid` · `Ring` · `Minimal` | Discrete `0 | 25 | 50 | 75 | 100` qualitative capability ideogram for matrices and comparison tables |
| 12 | **`WaterfallChart`** | `WaterfallStyle`: `Classic` · `Clean` · `Compact` | Declarative `steps` bridge auto-computing cumulative bases, `+`/`-` deltas, subtotals, totals & step connectors |
| 13 | **`Matrix2x2`** | `MatrixStyle`: `Quadrant` · `Minimal` · `Card` | 4-quadrant strategic grid with `0–100` coordinates and keyboard-selectable plotted points |
| 14 | **`ChevronFlow`** | `ChevronFlowStyle`: `Interlocking` · `Cards` · `Minimal` | Sequential transformation roadmap (sharp interlocking chevrons on McKinsey/Bain, capsules on BCG) |
| 15 | **`BenchmarkBar`** | `BenchmarkBarStyle`: `Bullet` · `Split` · `Minimal` | Quartile progress gauge displaying current value against sector median tick and top-quartile zone |

---

## Automated npm Publishing (OIDC)

This repository automates CI and npm releases via GitHub Actions with **npm Trusted Publishing (GitHub OIDC)** and cryptographic Sigstore **provenance**—zero long-lived `NPM_TOKEN` secrets required:

- **[`.github/workflows/pr-check.yml`](./.github/workflows/pr-check.yml)**: Runs lint, typecheck, Vitest suite, and library + showcase builds on every pull request.
- **[`.github/workflows/publish.yml`](./.github/workflows/publish.yml)**: Triggered on GitHub **Release `published`** (or manual `workflow_dispatch`). Verifies types, lint, tests, and build on Node 24, then publishes with `npm publish --provenance --access public` using short-lived GitHub OIDC credentials (`id-token: write`).
- **[`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)**: Deploys the 3-view interactive Showcase to GitHub Pages on every push to `main`.

---

## Local Development

```bash
git clone https://github.com/sinansonmez/consulting-ui.git
cd consulting-ui
npm install

# Run 3-view interactive Showcase locally
npm run dev

# Run Vitest + Testing Library suite across all 20 components
npm test

# Typecheck, lint, and build library + GitHub Pages showcase
npm run typecheck
npm run lint
npm run build
npm run build:demo
```

---

## Disclaimer

`consulting-ui` is an independent, open-source React UI library and design-system study. It is **not affiliated with, sponsored by, or endorsed by** McKinsey & Company, Boston Consulting Group, or Bain & Company. All trademarks, brand names, and proprietary corporate typeface names belong to their respective owners; open-source Google Font fallbacks are used in the live showcase, and all report metrics shown in the demo are illustrative benchmark datasets.

## License

[MIT](./LICENSE)
