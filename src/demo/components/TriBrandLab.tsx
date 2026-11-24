import { useState, type ReactNode } from 'react';
import {
  Accordion,
  AccordionStyle,
  Badge,
  BadgeStyle,
  BenchmarkBar,
  BenchmarkBarStyle,
  Brand,
  Button,
  ButtonStyle,
  Callout,
  CalloutStyle,
  ChevronFlow,
  ChevronFlowStyle,
  ControlSize,
  DataTable,
  DataTableStyle,
  Drawer,
  DrawerStyle,
  ExhibitFrame,
  ExhibitStyle,
  HarveyBall,
  HarveyBallStyle,
  Input,
  InputStyle,
  InsightCard,
  InsightCardStyle,
  Matrix2x2,
  MatrixStyle,
  MetricCard,
  MetricCardStyle,
  PullQuote,
  PullQuoteStyle,
  SegmentedControl,
  SegmentedControlStyle,
  Select,
  SelectStyle,
  Slider,
  SliderStyle,
  Tabs,
  TabsStyle,
  WaterfallChart,
  WaterfallStyle,
  useBrand,
  type DataTableColumn,
  type DataTableRow,
} from '../../index';
import styles from './TriBrandLab.module.css';

type CategoryFilter = 'all' | 'controls' | 'editorial' | 'frameworks';

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

import { BrandProvider, Brand, Surface, Button, ButtonStyle, WaterfallChart, WaterfallStyle } from 'consulting-ui';
import 'consulting-ui/styles.css';

export function ExecutiveBrief() {
  return (
    <BrandProvider brand={Brand.McKinsey} surface={Surface.Light}>
      <WaterfallChart
        style={WaterfallStyle.Classic}
        formatValue={(n) => \`$\${n}M\`}
        steps={[
          { id: 'base', label: 'FY24', value: 100, kind: 'start' },
          { id: 'ops', label: 'AI Ops', value: 28 },
          { id: 'end', label: 'FY26', value: 0, kind: 'total' },
        ]}
      />
      <Button style={ButtonStyle.Primary}>Download brief</Button>
      <Button brand={Brand.BCG} style={ButtonStyle.Editorial}>BCG override</Button>
    </BrandProvider>
  );
}`;

interface LabSectionSpec {
  number: number;
  title: string;
  category: Exclude<CategoryFilter, 'all'>;
  renderFirm: (brand: Brand) => ReactNode;
}

const LAB_SECTIONS: readonly LabSectionSpec[] = [
  {
    number: 1,
    title: 'Button — ButtonStyle enum',
    category: 'controls',
    renderFirm: (brand) => (
      <div className={styles.stack}>
        <Button brand={brand} style={ButtonStyle.Primary}>
          Primary action
        </Button>
        <Button brand={brand} style={ButtonStyle.Secondary}>
          Secondary outline
        </Button>
        <Button brand={brand} style={ButtonStyle.Editorial}>
          Read full report
        </Button>
        <div className={styles.inlineRow}>
          <Button brand={brand} style={ButtonStyle.Quiet} size={ControlSize.Sm}>
            Quiet reset
          </Button>
          <Button brand={brand} style={ButtonStyle.Primary} size={ControlSize.Sm} loading>
            Exporting
          </Button>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    title: 'Badge — BadgeStyle enum',
    category: 'controls',
    renderFirm: (brand) => (
      <div className={styles.wrapRow}>
        <Badge brand={brand} style={BadgeStyle.Accent}>Strategy</Badge>
        <Badge brand={brand} style={BadgeStyle.Neutral}>EMEA</Badge>
        <Badge brand={brand} style={BadgeStyle.Outline}>2026</Badge>
        <Badge brand={brand} style={BadgeStyle.Positive}>+14.2%</Badge>
        <Badge brand={brand} style={BadgeStyle.Negative}>-3.1 pp</Badge>
      </div>
    ),
  },
  {
    number: 3,
    title: 'Input — InputStyle enum',
    category: 'controls',
    renderFirm: (brand) => (
      <div className={styles.stack}>
        <Input
          brand={brand}
          style={InputStyle.Standard}
          label="Search insights"
          placeholder="EBITDA, AI readiness..."
          searchable
          clearable
        />
        <Input
          brand={brand}
          style={InputStyle.Underline}
          label="Target margin lift"
          defaultValue="12.5"
          suffix="%"
        />
        <Input
          brand={brand}
          style={InputStyle.Filled}
          placeholder="Filled filter query..."
          size={ControlSize.Sm}
        />
      </div>
    ),
  },
  {
    number: 4,
    title: 'Select — SelectStyle enum (ARIA Listbox)',
    category: 'controls',
    renderFirm: (brand) => (
      <div className={styles.stack}>
        <Select
          brand={brand}
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
          brand={brand}
          style={SelectStyle.Underline}
          defaultValue="2026"
          options={[
            { value: '2026', label: 'FY 2026 Benchmark' },
            { value: '2025', label: 'FY 2025 Baseline' },
          ]}
        />
      </div>
    ),
  },
  {
    number: 5,
    title: 'Tabs — TabsStyle enum',
    category: 'controls',
    renderFirm: (brand) => (
      <div className={styles.stack}>
        <Tabs
          brand={brand}
          style={TabsStyle.Underline}
          size={ControlSize.Sm}
          items={[
            { id: 'overview', label: 'Overview' },
            { id: 'exhibits', label: 'Exhibits', count: 4 },
            { id: 'notes', label: 'Notes' },
          ]}
        />
        <Tabs
          brand={brand}
          style={TabsStyle.Segmented}
          size={ControlSize.Sm}
          items={[
            { id: 'chart', label: 'Chart' },
            { id: 'matrix', label: 'Matrix' },
          ]}
        />
      </div>
    ),
  },
  {
    number: 6,
    title: 'Callout — CalloutStyle enum',
    category: 'editorial',
    renderFirm: (brand) => (
      <Callout
        brand={brand}
        style={CalloutStyle.Executive}
        eyebrow="Key Takeaway"
        title="Operating model beats isolated pilots"
      >
        <p>Enterprises redesigning core workflows capture over 2x the EBITDA impact of point tools.</p>
      </Callout>
    ),
  },
  {
    number: 7,
    title: 'MetricCard — MetricCardStyle enum',
    category: 'frameworks',
    renderFirm: (brand) => (
      <div className={styles.stack}>
        <MetricCard
          brand={brand}
          style={MetricCardStyle.Hero}
          value="74%"
          label="Frontline workflow adoption"
          delta="+21 pp"
          deltaDirection="up"
          benchmark="2025 baseline: 53%"
        />
      </div>
    ),
  },
  {
    number: 8,
    title: 'ExhibitFrame — ExhibitStyle enum',
    category: 'frameworks',
    renderFirm: (brand) => (
      <ExhibitFrame
        brand={brand}
        style={ExhibitStyle.AccentHeader}
        exhibitLabel="Exhibit 2"
        title="Payback compresses under 12 months"
        subtitle="Illustrative index (2024 = 100)"
        source="consulting-ui showcase benchmark"
      >
        <p className={styles.slotCopy}>
          Chart-agnostic slot supporting WaterfallChart, Matrix2x2, or DataTable.
        </p>
      </ExhibitFrame>
    ),
  },
  {
    number: 9,
    title: 'DataTable — DataTableStyle enum',
    category: 'frameworks',
    renderFirm: (brand) => (
      <DataTable
        brand={brand}
        style={DataTableStyle.Compact}
        columns={MINI_COLUMNS}
        rows={MINI_ROWS}
        summaryRow={{ region: 'Global', cagr: '+12.1%', share: '100%' }}
      />
    ),
  },
  {
    number: 10,
    title: 'Accordion — AccordionStyle enum',
    category: 'editorial',
    renderFirm: (brand) => (
      <Accordion
        brand={brand}
        style={AccordionStyle.Separated}
        defaultExpandedIds={['a1']}
        items={[
          {
            id: 'a1',
            title: 'Research Methodology',
            meta: 'n = 10,400 executives',
            content: <p>Weighted cross-sector benchmark with tabular numerals.</p>,
          },
          {
            id: 'a2',
            title: 'Footnote Definitions',
            content: <p>EBITDA margins normalized across FY2024–FY2026 calendars.</p>,
          },
        ]}
      />
    ),
  },
  {
    number: 11,
    title: 'HarveyBall — HarveyBallStyle enum',
    category: 'frameworks',
    renderFirm: (brand) => (
      <div className={styles.stack}>
        <div className={styles.wrapRow}>
          {([0, 25, 50, 75, 100] as const).map((v) => (
            <HarveyBall key={v} brand={brand} value={v} style={HarveyBallStyle.Solid} showValue />
          ))}
        </div>
        <div className={styles.wrapRow}>
          <HarveyBall brand={brand} value={75} style={HarveyBallStyle.Ring} showValue />
          <HarveyBall brand={brand} value={50} style={HarveyBallStyle.Minimal} showValue />
        </div>
      </div>
    ),
  },
  {
    number: 12,
    title: 'WaterfallChart — WaterfallStyle enum',
    category: 'frameworks',
    renderFirm: (brand) => (
      <WaterfallChart
        brand={brand}
        style={WaterfallStyle.Compact}
        formatValue={(n) => `$${n}M`}
        steps={[
          { id: 'w1', label: 'Base', value: 80, kind: 'start' },
          { id: 'w2', label: 'Price', value: 24 },
          { id: 'w3', label: 'Cost', value: -10 },
          { id: 'w4', label: 'FY26', value: 0, kind: 'total' },
        ]}
      />
    ),
  },
  {
    number: 13,
    title: 'Matrix2x2 — MatrixStyle enum',
    category: 'frameworks',
    renderFirm: (brand) => (
      <Matrix2x2
        brand={brand}
        style={MatrixStyle.Quadrant}
        xAxisLabel="Feasibility"
        yAxisLabel="Impact"
        quadrantLabels={{
          topLeft: 'Bets',
          topRight: 'Scalers',
          bottomLeft: 'Defer',
          bottomRight: 'Quick Wins',
        }}
        defaultSelectedId="m1"
        items={[
          { id: 'm1', label: 'Claims AI', x: 78, y: 80, meta: '+$38M', highlighted: true },
          { id: 'm2', label: 'ERP Core', x: 28, y: 70 },
        ]}
      />
    ),
  },
  {
    number: 14,
    title: 'ChevronFlow — ChevronFlowStyle enum',
    category: 'frameworks',
    renderFirm: (brand) => (
      <ChevronFlow
        brand={brand}
        style={ChevronFlowStyle.Interlocking}
        steps={[
          { id: 'c1', phase: 'Phase 1', title: 'Diagnose' },
          { id: 'c2', phase: 'Phase 2', title: 'Redesign', active: true },
        ]}
      />
    ),
  },
  {
    number: 15,
    title: 'BenchmarkBar — BenchmarkBarStyle enum',
    category: 'frameworks',
    renderFirm: (brand) => (
      <div className={styles.stack}>
        <BenchmarkBar
          brand={brand}
          style={BenchmarkBarStyle.Bullet}
          label="Workflow automation"
          value={68}
          median={44}
          topQuartile={79}
        />
        <BenchmarkBar
          brand={brand}
          style={BenchmarkBarStyle.Split}
          label="Enablement coverage"
          value={58}
          topQuartile={82}
        />
      </div>
    ),
  },
  {
    number: 16,
    title: 'PullQuote — PullQuoteStyle enum',
    category: 'editorial',
    renderFirm: (brand) => (
      <PullQuote
        brand={brand}
        style={PullQuoteStyle.Editorial}
        quote="Operating-model speed turns technological parity into durable ROIC."
        author="Managing Partner Brief"
        role="2026 Strategy Synthesis"
      />
    ),
  },
  {
    number: 17,
    title: 'InsightCard — InsightCardStyle enum',
    category: 'editorial',
    renderFirm: (brand) => (
      <InsightCard
        brand={brand}
        style={InsightCardStyle.Bordered}
        eyebrow="M&A & Private Equity"
        meta="PDF · 12 min"
        title="Value Creation Beyond Multiple Expansion"
        summary="Operational levers driving 12%+ annual EBITDA growth across buyouts."
        ctaLabel="Read publication"
        onAction={() => {}}
      />
    ),
  },
  {
    number: 18,
    title: 'Slider — SliderStyle enum',
    category: 'controls',
    renderFirm: (brand) => (
      <Slider
        brand={brand}
        style={SliderStyle.Stepped}
        label="Automation target"
        min={0}
        max={100}
        step={10}
        defaultValue={60}
        benchmarkValue={45}
        benchmarkLabel="Median: 45%"
        formatValue={(v) => `${v}%`}
      />
    ),
  },
  {
    number: 19,
    title: 'SegmentedControl — SegmentedControlStyle enum',
    category: 'controls',
    renderFirm: (brand) => (
      <div className={styles.stack}>
        <SegmentedControl
          brand={brand}
          style={SegmentedControlStyle.Filled}
          size={ControlSize.Sm}
          defaultValue="base"
          options={[
            { value: 'cons', label: 'Downside' },
            { value: 'base', label: 'Base' },
            { value: 'up', label: 'Upside' },
          ]}
        />
        <SegmentedControl
          brand={brand}
          style={SegmentedControlStyle.Outline}
          size={ControlSize.Sm}
          defaultValue="usd"
          options={[
            { value: 'usd', label: 'USD ($M)' },
            { value: 'pct', label: '% Share' },
          ]}
        />
      </div>
    ),
  },
  {
    number: 20,
    title: 'Drawer (inline preview) — DrawerStyle enum',
    category: 'editorial',
    renderFirm: (brand) => (
      <Drawer
        open
        inline
        onClose={() => {}}
        brand={brand}
        style={DrawerStyle.AccentHeader}
        eyebrow="Executive Sheet"
        title="Initiative Drill-Down"
        footer={<span>Owner: Transformation Office</span>}
      >
        <p>Full slide-over dialog with Escape/backdrop close, scroll lock, and focus restoration.</p>
      </Drawer>
    ),
  },
];

export function TriBrandLab() {
  const { surface } = useBrand();
  const [category, setCategory] = useState<CategoryFilter>('all');

  const visibleSections =
    category === 'all'
      ? LAB_SECTIONS
      : LAB_SECTIONS.filter((sec) => sec.category === category);

  return (
    <div className={styles.lab}>
      <header className={styles.labHeader}>
        <div className={styles.headerRow}>
          <h1 className={styles.labTitle}>Tri-Brand Component Lab (20 Components)</h1>
          <SegmentedControl
            style={SegmentedControlStyle.Filled}
            size={ControlSize.Sm}
            ariaLabel="Component category filter"
            value={category}
            onChange={(v) => setCategory(v as CategoryFilter)}
            options={[
              { value: 'all', label: 'All (20)' },
              { value: 'controls', label: 'Controls (7)' },
              { value: 'editorial', label: 'Editorial (5)' },
              { value: 'frameworks', label: 'Frameworks (8)' },
            ]}
          />
        </div>

        <p className={styles.labDeck}>
          Every component rendered side-by-side across <code>Brand.McKinsey</code>,{' '}
          <code>Brand.BCG</code>, and <code>Brand.Bain</code> using per-component{' '}
          <code>brand</code> overrides and strict TypeScript <code>style</code> enums.
        </p>

        <pre className={styles.codeBlock}>
          <code>{USAGE_SNIPPET}</code>
        </pre>
      </header>

      {visibleSections.map((section) => (
        <section key={section.number} className={styles.block}>
          <h2 className={styles.blockTitle}>
            {section.number}. {section.title}
          </h2>
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
                  {section.number === 1 && <span>{firm.spec}</span>}
                </div>
                {section.renderFirm(firm.brand)}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
