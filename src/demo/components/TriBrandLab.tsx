import {
  Accordion,
  AccordionStyle,
  Badge,
  BadgeStyle,
  Brand,
  Button,
  ButtonStyle,
  Callout,
  CalloutStyle,
  ControlSize,
  DataTable,
  DataTableStyle,
  ExhibitFrame,
  ExhibitStyle,
  Input,
  InputStyle,
  MetricCard,
  MetricCardStyle,
  Select,
  SelectStyle,
  Tabs,
  TabsStyle,
  useBrand,
  type DataTableColumn,
  type DataTableRow,
} from '../../index';
import styles from './TriBrandLab.module.css';

interface MiniRow extends DataTableRow {
  region: string;
  cagr: string;
  share: string;
}

const MINI_COLUMNS: readonly DataTableColumn<MiniRow>[] = [
  { key: 'region', header: 'Region', sortable: true },
  { key: 'cagr', header: 'EBITDA CAGR', align: 'right', sortable: true },
  { key: 'share', header: 'Share', align: 'right', sortable: true },
];

const MINI_ROWS: readonly MiniRow[] = [
  { id: 'na', region: 'North America', cagr: '+12.6%', share: '44%', highlighted: true },
  { id: 'eu', region: 'EMEA', cagr: '+11.4%', share: '31%' },
  { id: 'ap', region: 'APAC', cagr: '+11.9%', share: '25%' },
];

const FIRMS: readonly { brand: Brand; name: string; spec: string }[] = [
  {
    brand: Brand.McKinsey,
    name: 'Brand.McKinsey',
    spec: '#051C2C · #2251FF · 0px corners · Bower / McKinsey Sans',
  },
  {
    brand: Brand.BCG,
    name: 'Brand.BCG',
    spec: '#147B58 · #29BA74 · 9999px pills · Henderson BCG Sans',
  },
  {
    brand: Brand.Bain,
    name: 'Brand.Bain',
    spec: '#CC0000 · #222222 · 2px rules · Tiempos / Graphik',
  },
];

const USAGE_SNIPPET = `npm install consulting-ui

import { BrandProvider, Brand, Surface, Button, ButtonStyle } from 'consulting-ui';
import 'consulting-ui/styles.css';

export function ExecutiveActions() {
  return (
    <BrandProvider brand={Brand.McKinsey} surface={Surface.Light}>
      <Button style={ButtonStyle.Primary}>Download report</Button>
      <Button style={ButtonStyle.Editorial}>Read full insight</Button>
      <Button brand={Brand.BCG} style={ButtonStyle.Editorial}>BCG override</Button>
    </BrandProvider>
  );
}`;

export function TriBrandLab() {
  const { surface } = useBrand();

  return (
    <div className={styles.lab}>
      <header className={styles.labHeader}>
        <h1 className={styles.labTitle}>Tri-Brand Component Lab</h1>
        <p className={styles.labDeck}>
          Every component rendered side-by-side across <code>Brand.McKinsey</code>,{' '}
          <code>Brand.BCG</code>, and <code>Brand.Bain</code> using the per-component{' '}
          <code>brand</code> prop override and strict TypeScript <code>style</code> enums.
        </p>

        <pre className={styles.codeBlock}>
          <code>{USAGE_SNIPPET}</code>
        </pre>
      </header>

      {/* 1. Button */}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>1. Button — ButtonStyle enum</h2>
        <div className={styles.triGrid}>
          {FIRMS.map((firm) => (
            <div
              key={firm.brand}
              className={styles.firmPanel}
              data-brand={firm.brand}
              data-surface={surface}
            >
              <div className={styles.firmHeading}>
                <strong>{firm.name}</strong>
                <span>{firm.spec}</span>
              </div>
              <div className={styles.stack}>
                <Button brand={firm.brand} style={ButtonStyle.Primary}>
                  Primary action
                </Button>
                <Button brand={firm.brand} style={ButtonStyle.Secondary}>
                  Secondary outline
                </Button>
                <Button brand={firm.brand} style={ButtonStyle.Editorial}>
                  Read full report
                </Button>
                <div className={styles.inlineRow}>
                  <Button
                    brand={firm.brand}
                    style={ButtonStyle.Quiet}
                    size={ControlSize.Sm}
                  >
                    Quiet reset
                  </Button>
                  <Button
                    brand={firm.brand}
                    style={ButtonStyle.Primary}
                    size={ControlSize.Sm}
                    loading
                  >
                    Exporting
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Badge */}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>2. Badge — BadgeStyle enum</h2>
        <div className={styles.triGrid}>
          {FIRMS.map((firm) => (
            <div
              key={firm.brand}
              className={styles.firmPanel}
              data-brand={firm.brand}
              data-surface={surface}
            >
              <div className={styles.firmHeading}>
                <strong>{firm.name}</strong>
              </div>
              <div className={styles.wrapRow}>
                <Badge brand={firm.brand} style={BadgeStyle.Accent}>
                  Strategy
                </Badge>
                <Badge brand={firm.brand} style={BadgeStyle.Neutral}>
                  EMEA
                </Badge>
                <Badge brand={firm.brand} style={BadgeStyle.Outline}>
                  2026
                </Badge>
                <Badge brand={firm.brand} style={BadgeStyle.Positive}>
                  +14.2%
                </Badge>
                <Badge brand={firm.brand} style={BadgeStyle.Negative}>
                  -3.1 pp
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Input */}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>3. Input — InputStyle enum</h2>
        <div className={styles.triGrid}>
          {FIRMS.map((firm) => (
            <div
              key={firm.brand}
              className={styles.firmPanel}
              data-brand={firm.brand}
              data-surface={surface}
            >
              <div className={styles.firmHeading}>
                <strong>{firm.name}</strong>
              </div>
              <div className={styles.stack}>
                <Input
                  brand={firm.brand}
                  style={InputStyle.Standard}
                  label="Search insights"
                  placeholder="EBITDA, AI readiness..."
                  searchable
                  clearable
                />
                <Input
                  brand={firm.brand}
                  style={InputStyle.Underline}
                  label="Target margin lift"
                  defaultValue="12.5"
                  suffix="%"
                />
                <Input
                  brand={firm.brand}
                  style={InputStyle.Filled}
                  placeholder="Filled filter query..."
                  size={ControlSize.Sm}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Select */}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>4. Select — SelectStyle enum (ARIA Listbox)</h2>
        <div className={styles.triGrid}>
          {FIRMS.map((firm) => (
            <div
              key={firm.brand}
              className={styles.firmPanel}
              data-brand={firm.brand}
              data-surface={surface}
            >
              <div className={styles.firmHeading}>
                <strong>{firm.name}</strong>
              </div>
              <div className={styles.stack}>
                <Select
                  brand={firm.brand}
                  style={SelectStyle.Standard}
                  label="Region slicer"
                  defaultValue="global"
                  options={[
                    { value: 'global', label: 'Global Composite', meta: 'All 42 markets' },
                    { value: 'na', label: 'North America', meta: 'US & Canada' },
                    { value: 'emea', label: 'EMEA', meta: 'Europe & Middle East' },
                  ]}
                />
                <Select
                  brand={firm.brand}
                  style={SelectStyle.Underline}
                  defaultValue="2026"
                  options={[
                    { value: '2026', label: 'FY 2026 Benchmark' },
                    { value: '2025', label: 'FY 2025 Baseline' },
                  ]}
                />
                <Select
                  brand={firm.brand}
                  style={SelectStyle.Compact}
                  defaultValue="top"
                  options={[
                    { value: 'top', label: 'Top Quartile' },
                    { value: 'med', label: 'Sector Median' },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Tabs */}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>5. Tabs — TabsStyle enum</h2>
        <div className={styles.triGrid}>
          {FIRMS.map((firm) => (
            <div
              key={firm.brand}
              className={styles.firmPanel}
              data-brand={firm.brand}
              data-surface={surface}
            >
              <div className={styles.firmHeading}>
                <strong>{firm.name}</strong>
              </div>
              <div className={styles.stack}>
                <Tabs
                  brand={firm.brand}
                  style={TabsStyle.Underline}
                  size={ControlSize.Sm}
                  items={[
                    { id: 'overview', label: 'Overview' },
                    { id: 'exhibits', label: 'Exhibits', count: 4 },
                    { id: 'notes', label: 'Notes' },
                  ]}
                />
                <Tabs
                  brand={firm.brand}
                  style={TabsStyle.Segmented}
                  size={ControlSize.Sm}
                  items={[
                    { id: 'chart', label: 'Chart' },
                    { id: 'matrix', label: 'Matrix' },
                  ]}
                />
                <Tabs
                  brand={firm.brand}
                  style={TabsStyle.Minimal}
                  size={ControlSize.Sm}
                  items={[
                    { id: 'q1', label: 'Q1' },
                    { id: 'q2', label: 'Q2' },
                    { id: 'q3', label: 'Q3' },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Callout */}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>6. Callout — CalloutStyle enum</h2>
        <div className={styles.triGrid}>
          {FIRMS.map((firm) => (
            <div
              key={firm.brand}
              className={styles.firmPanel}
              data-brand={firm.brand}
              data-surface={surface}
            >
              <div className={styles.firmHeading}>
                <strong>{firm.name}</strong>
              </div>
              <div className={styles.stack}>
                <Callout
                  brand={firm.brand}
                  style={CalloutStyle.Executive}
                  eyebrow="Key Takeaway"
                  title="Operating model beats isolated pilots"
                >
                  <p>
                    Enterprises redesigning end-to-end workflows capture over 2x the EBITDA impact of point tools.
                  </p>
                </Callout>
                <Callout
                  brand={firm.brand}
                  style={CalloutStyle.Highlight}
                  title="Margin pressure alert"
                >
                  <p>Multiple expansion contributed less than 10% of realized buyout alpha in 2026.</p>
                </Callout>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. MetricCard */}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>7. MetricCard — MetricCardStyle enum</h2>
        <div className={styles.triGrid}>
          {FIRMS.map((firm) => (
            <div
              key={firm.brand}
              className={styles.firmPanel}
              data-brand={firm.brand}
              data-surface={surface}
            >
              <div className={styles.firmHeading}>
                <strong>{firm.name}</strong>
              </div>
              <div className={styles.stack}>
                <MetricCard
                  brand={firm.brand}
                  style={MetricCardStyle.Hero}
                  value="74%"
                  label="Frontline workflow adoption"
                  delta="+21 pp"
                  deltaDirection="up"
                  benchmark="2025 baseline: 53%"
                />
                <MetricCard
                  brand={firm.brand}
                  style={MetricCardStyle.Split}
                  value="2.4x"
                  label="Top-quartile productivity spread"
                  caption="Leaders vs. sector median"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. ExhibitFrame */}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>8. ExhibitFrame — ExhibitStyle enum</h2>
        <div className={styles.triGrid}>
          {FIRMS.map((firm) => (
            <div
              key={firm.brand}
              className={styles.firmPanel}
              data-brand={firm.brand}
              data-surface={surface}
            >
              <div className={styles.firmHeading}>
                <strong>{firm.name}</strong>
              </div>
              <ExhibitFrame
                brand={firm.brand}
                style={ExhibitStyle.AccentHeader}
                exhibitLabel="Exhibit 2"
                title="Productivity payback compresses under 12 months"
                subtitle="Illustrative index (2024 = 100)"
                source="consulting-ui showcase benchmark"
              >
                <p className={styles.slotCopy}>
                  Chart-agnostic slot supporting SVG, Recharts, Visx, or DataTable.
                </p>
              </ExhibitFrame>
            </div>
          ))}
        </div>
      </section>

      {/* 9. DataTable */}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>9. DataTable — DataTableStyle enum</h2>
        <div className={styles.triGrid}>
          {FIRMS.map((firm) => (
            <div
              key={firm.brand}
              className={styles.firmPanel}
              data-brand={firm.brand}
              data-surface={surface}
            >
              <div className={styles.firmHeading}>
                <strong>{firm.name}</strong>
              </div>
              <DataTable
                brand={firm.brand}
                style={DataTableStyle.Compact}
                columns={MINI_COLUMNS}
                rows={MINI_ROWS}
                summaryRow={{ region: 'Global', cagr: '+12.1%', share: '100%' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 10. Accordion */}
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>10. Accordion — AccordionStyle enum</h2>
        <div className={styles.triGrid}>
          {FIRMS.map((firm) => (
            <div
              key={firm.brand}
              className={styles.firmPanel}
              data-brand={firm.brand}
              data-surface={surface}
            >
              <div className={styles.firmHeading}>
                <strong>{firm.name}</strong>
              </div>
              <Accordion
                brand={firm.brand}
                style={AccordionStyle.Separated}
                defaultExpandedIds={['a1']}
                items={[
                  {
                    id: 'a1',
                    title: 'Research Methodology',
                    meta: 'n = 10,400 executives',
                    content: (
                      <p>
                        Weighted cross-sector benchmark with tabular numerals and WCAG AA contrast.
                      </p>
                    ),
                  },
                  {
                    id: 'a2',
                    title: 'Footnote Definitions',
                    content: <p>EBITDA margins normalized across FY2024–FY2026 reporting calendars.</p>,
                  },
                ]}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
