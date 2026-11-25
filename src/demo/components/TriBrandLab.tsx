import { useState, type ReactNode } from 'react';
import {
  Accordion,
  AccordionStyle,
  Badge,
  BadgeStyle,
  BarChart,
  BarChartStyle,
  BenchmarkBar,
  BenchmarkBarStyle,
  Brand,
  BubbleChart,
  BubbleChartStyle,
  Button,
  ButtonStyle,
  Callout,
  CalloutStyle,
  ChevronFlow,
  ChevronFlowStyle,
  ComboChart,
  ComboChartStyle,
  ControlSize,
  DataTable,
  DataTableStyle,
  Drawer,
  DrawerStyle,
  DumbbellChart,
  DumbbellStyle,
  ExhibitFrame,
  ExhibitStyle,
  FunnelChart,
  FunnelStyle,
  HarveyBall,
  HarveyBallStyle,
  HeatmapChart,
  HeatmapStyle,
  Input,
  InputStyle,
  InsightCard,
  InsightCardStyle,
  LineChart,
  LineChartStyle,
  MarimekkoChart,
  MarimekkoStyle,
  Matrix2x2,
  MatrixStyle,
  MetricCard,
  MetricCardStyle,
  PullQuote,
  PullQuoteStyle,
  SankeyChart,
  SankeyStyle,
  SegmentedControl,
  SegmentedControlStyle,
  Select,
  SelectStyle,
  Slider,
  SliderStyle,
  SlopeChart,
  SlopeChartStyle,
  StackedBarChart,
  StackedBarStyle,
  Tabs,
  TabsStyle,
  WaterfallChart,
  WaterfallStyle,
  useBrand,
  type DataTableColumn,
  type DataTableRow,
} from '../../index';
import {
  buildLabSectionSnippet,
  buildQuickStartSnippet,
} from '../data/labSnippets';
import { CodePanel, CodeToggleButton } from './CodePanel';
import styles from './TriBrandLab.module.css';

type CategoryFilter = 'all' | 'charts' | 'controls' | 'editorial' | 'frameworks';

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
    title: 'WaterfallChart — WaterfallStyle enum (ECharts)',
    category: 'charts',
    renderFirm: (brand) => (
      <WaterfallChart
        brand={brand}
        style={WaterfallStyle.Compact}
        formatValue={(n) => `$${n}M`}
        steps={[
          { id: 'w1', label: 'Base', value: 80, kind: 'start' },
          { id: 'w2', label: 'Price', value: 24 },
          { id: 'w3', label: 'Cost', value: -10 },
          { id: 'w4', label: 'FY26', kind: 'total' },
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
  {
    number: 21,
    title: 'BarChart — BarChartStyle enum (Ranked / Grouped / Diverging)',
    category: 'charts',
    renderFirm: (brand) => (
      <BarChart
        brand={brand}
        style={BarChartStyle.Ranked}
        height={210}
        deltaColumnLabel="YoY"
        formatValue={(v) => `${v}%`}
        formatDelta={(d) => `${d > 0 ? '+' : ''}${d} pp`}
        data={[
          { id: 'b1', label: 'Agronomy', value: 31, delta: 2, highlighted: true },
          { id: 'b2', label: 'Precision HW', value: 27, delta: 3, highlighted: true },
          { id: 'b3', label: 'Sensing', value: 24, delta: 5 },
          { id: 'b4', label: 'Robotics', value: 5, delta: -1 },
        ]}
      />
    ),
  },
  {
    number: 22,
    title: 'StackedBarChart — StackedBarStyle enum (100% / Absolute / Diverging)',
    category: 'charts',
    renderFirm: (brand) => (
      <StackedBarChart
        brand={brand}
        style={StackedBarStyle.Proportional}
        height={210}
        series={[
          { id: 's1', label: 'Decrease', tone: 'primary' },
          { id: 's2', label: 'No change', tone: 'neutral' },
          { id: 's3', label: 'Increase', tone: 'secondary' },
        ]}
        categories={[
          { id: 'c1', label: 'Forecast', values: [32, 50, 18] },
          { id: 'c2', label: 'Actual', values: [14, 66, 20] },
          { id: 'c3', label: 'Next yr', values: [39, 43, 18] },
        ]}
      />
    ),
  },
  {
    number: 23,
    title: 'DumbbellChart — DumbbellStyle enum (Gap / Range / Minimal)',
    category: 'charts',
    renderFirm: (brand) => (
      <DumbbellChart
        brand={brand}
        style={DumbbellStyle.Gap}
        height={220}
        startLabel="Boomers"
        endLabel="Gen Z"
        deltaColumnLabel="Gap"
        formatValue={(v) => `${v > 0 ? '+' : ''}${v}`}
        formatDelta={(d) => `${d > 0 ? '+' : ''}${d}`}
        data={[
          { id: 'd1', label: 'Peers', start: 64, end: 56 },
          { id: 'd2', label: 'Gen AI', start: -24, end: 8 },
          { id: 'd3', label: 'Social', start: -38, end: -14 },
        ]}
      />
    ),
  },
  {
    number: 24,
    title: 'MarimekkoChart — MarimekkoStyle enum (Editorial / Compact / Outlined)',
    category: 'charts',
    renderFirm: (brand) => (
      <MarimekkoChart
        brand={brand}
        style={MarimekkoStyle.Compact}
        height={220}
        formatValue={(v) => v.toFixed(1)}
        columns={[
          {
            id: 'other',
            label: 'Other',
            segments: [
              { id: 'o1', label: 'All other', value: 58.6, tone: 'neutral' },
            ],
          },
          {
            id: 'priority',
            label: 'Priority',
            segments: [
              { id: 'p1', label: 'Manufacturing', value: 15.2, tone: 'primary' },
              { id: 'p2', label: 'Transport', value: 10.8, tone: 'primary' },
              { id: 'p3', label: 'Broadband', value: 4.7, tone: 'primary' },
              { id: 'p4', label: 'Energy', value: 10.7, tone: 'secondary' },
            ],
          },
        ]}
      />
    ),
  },
  {
    number: 25,
    title: 'FunnelChart — FunnelStyle enum (Tiered / Tapered / Horizontal)',
    category: 'charts',
    renderFirm: (brand) => (
      <FunnelChart
        brand={brand}
        style={FunnelStyle.Tiered}
        height={210}
        conversionColumnLabel="Conv."
        formatValue={(v) => `${v}`}
        stages={[
          { id: 'f1', label: '$70M+', value: 220, tone: 'neutral' },
          { id: 'f2', label: '$250M+', value: 60, tone: 'secondary' },
          { id: 'f3', label: '$500M+', value: 19, tone: 'tertiary' },
          { id: 'f4', label: '$1B+', value: 7, tone: 'primary' },
        ]}
      />
    ),
  },
  {
    number: 26,
    title: 'SankeyChart — SankeyStyle enum (Editorial / Flow / Minimal)',
    category: 'charts',
    renderFirm: (brand) => (
      <SankeyChart
        brand={brand}
        style={SankeyStyle.Editorial}
        height={230}
        formatValue={(v) => `$${v}M`}
        nodes={[
          { id: 'run', label: 'Run IT', depth: 0, tone: 'neutral' },
          { id: 'chg', label: 'Change', depth: 0, tone: 'primary' },
          { id: 'cld', label: 'Cloud', depth: 1, tone: 'secondary' },
          { id: 'ai', label: 'Data & AI', depth: 1, tone: 'primary' },
          { id: 'app', label: 'Apps', depth: 1, tone: 'tertiary' },
        ]}
        links={[
          { source: 'run', target: 'cld', value: 24 },
          { source: 'run', target: 'app', value: 34 },
          { source: 'chg', target: 'cld', value: 14 },
          { source: 'chg', target: 'ai', value: 22 },
          { source: 'chg', target: 'app', value: 6 },
        ]}
      />
    ),
  },
  {
    number: 27,
    title: 'LineChart — LineChartStyle enum (Trend / Forecast / StackedArea)',
    category: 'charts',
    renderFirm: (brand) => (
      <LineChart
        brand={brand}
        style={LineChartStyle.Forecast}
        height={220}
        periods={['22', '24', '26', '28', '30']}
        forecastStartIndex={2}
        formatValue={(v) => `$${v}B`}
        band={{
          low: [null, null, 480, 515, 548],
          high: [null, null, 480, 565, 635],
        }}
        series={[
          { id: 'mkt', label: 'Beauty', values: [410, 448, 480, 536, 590], tone: 'primary', emphasized: true },
        ]}
      />
    ),
  },
  {
    number: 28,
    title: 'ComboChart — ComboChartStyle enum (BarLine / StackedLine / Indexed)',
    category: 'charts',
    renderFirm: (brand) => (
      <ComboChart
        brand={brand}
        style={ComboChartStyle.BarLine}
        height={230}
        periods={['FY23', 'FY24', 'FY25', 'FY26']}
        formatBarValue={(v) => `$${v}B`}
        formatLineValue={(v) => `${v}%`}
        barSeries={[
          { id: 'rev', label: 'Revenue', values: [4.7, 5.4, 6.2, 7.1], tone: 'neutral' },
        ]}
        lineSeries={[
          { id: 'ebitda', label: 'Margin', values: [20, 22, 24, 25], tone: 'primary' },
        ]}
      />
    ),
  },
  {
    number: 29,
    title: 'BubbleChart — BubbleChartStyle enum (GrowthShare / Scatter / Quadrant)',
    category: 'charts',
    renderFirm: (brand) => (
      <BubbleChart
        brand={brand}
        style={BubbleChartStyle.GrowthShare}
        height={250}
        xAxisLabel="Rel. Share"
        yAxisLabel="Growth %"
        xThreshold={1.1}
        yThreshold={11}
        quadrantLabels={{
          topLeft: 'Bets',
          topRight: 'Stars',
          bottomLeft: 'Exit',
          bottomRight: 'Cows',
        }}
        formatX={(v) => `${v}x`}
        formatY={(v) => `${v}%`}
        data={[
          { id: 'a1', label: 'Cloud AI', x: 1.8, y: 24, size: 480, highlighted: true },
          { id: 'a2', label: 'Core ERP', x: 2.0, y: 5, size: 800, tone: 'secondary' },
          { id: 'a3', label: 'Edge', x: 0.6, y: 20, size: 190, tone: 'tertiary' },
        ]}
      />
    ),
  },
  {
    number: 30,
    title: 'HeatmapChart — HeatmapStyle enum (Sequential / Diverging / Scorecard)',
    category: 'charts',
    renderFirm: (brand) => (
      <HeatmapChart
        brand={brand}
        style={HeatmapStyle.Scorecard}
        height={210}
        rows={['Bank', 'Tech', 'Retail']}
        columns={['Sales', 'Ops', 'R&D']}
        formatValue={(v) => `${v}%`}
        rowSummaryLabel="Avg"
        values={[
          [4.6, 5.2, 4.9],
          [4.8, 4.4, 6.2],
          [5.1, 4.7, 2.6],
        ]}
      />
    ),
  },
  {
    number: 31,
    title: 'SlopeChart — SlopeChartStyle enum (BeforeAfter / RankShift / Indexed)',
    category: 'charts',
    renderFirm: (brand) => (
      <SlopeChart
        brand={brand}
        style={SlopeChartStyle.Indexed}
        height={220}
        periods={['2021', '2026']}
        formatValue={(v) => `${v}%`}
        formatDelta={(d) => `${d > 0 ? '+' : ''}${d}`}
        series={[
          { id: 's1', label: 'Social AI', values: [11, 29], highlighted: true },
          { id: 's2', label: 'Market', values: [32, 35] },
          { id: 's3', label: 'Retail', values: [38, 19] },
        ]}
      />
    ),
  },
];

export function TriBrandLab() {
  const { brand, surface } = useBrand();
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [openCode, setOpenCode] = useState<Record<number, boolean>>({});

  const toggleCode = (num: number) => {
    setOpenCode((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const visibleSections =
    category === 'all'
      ? LAB_SECTIONS
      : LAB_SECTIONS.filter((sec) => sec.category === category);

  const totalCount = LAB_SECTIONS.length;
  const countByCategory = (cat: Exclude<CategoryFilter, 'all'>) =>
    LAB_SECTIONS.filter((sec) => sec.category === cat).length;

  return (
    <div className={styles.lab}>
      <header className={styles.labHeader}>
        <div className={styles.headerRow}>
          <h1 className={styles.labTitle}>
            Tri-Brand Component Lab ({totalCount} Components)
          </h1>
          <SegmentedControl
            style={SegmentedControlStyle.Filled}
            size={ControlSize.Sm}
            ariaLabel="Component category filter"
            value={category}
            onChange={(v) => setCategory(v as CategoryFilter)}
            options={[
              { value: 'all', label: `All (${totalCount})` },
              { value: 'charts', label: `Charts (${countByCategory('charts')})` },
              { value: 'controls', label: `Controls (${countByCategory('controls')})` },
              { value: 'editorial', label: `Editorial (${countByCategory('editorial')})` },
              { value: 'frameworks', label: `Frameworks (${countByCategory('frameworks')})` },
            ]}
          />
        </div>

        <p className={styles.labDeck}>
          Every component rendered side-by-side across <code>Brand.McKinsey</code>,{' '}
          <code>Brand.BCG</code>, and <code>Brand.Bain</code> using per-component{' '}
          <code>brand</code> overrides and strict TypeScript <code>style</code> enums.
          Click <code>&lt;/&gt; Code</code> on any section to copy ready-to-paste TSX.
        </p>

        <CodePanel
          title="Quick Start"
          code={buildQuickStartSnippet(brand, surface)}
        />
      </header>

      {visibleSections.map((section) => {
        const isCodeOpen = Boolean(openCode[section.number]);
        const codeId = `lab-code-${section.number}`;
        return (
          <section key={section.number} className={styles.block}>
            <div className={styles.blockHeader}>
              <h2 className={styles.blockTitle}>
                {section.number}. {section.title}
              </h2>
              <CodeToggleButton
                expanded={isCodeOpen}
                controlsId={codeId}
                itemLabel={section.title}
                onToggle={() => toggleCode(section.number)}
              />
            </div>
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
            {isCodeOpen && (
              <CodePanel
                id={codeId}
                title={section.title}
                code={buildLabSectionSnippet(section.number, brand, surface)}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}
