import { Brand, Surface } from '../../index';
import { BRAND_META, formatSurfaceEnumName } from '../components/codeUtils';

export function buildQuickStartSnippet(brand: Brand, surface: Surface): string {
  const meta = BRAND_META[brand];
  const s = formatSurfaceEnumName(surface);

  return `// npm install consulting-ui
import {
  Brand,
  BrandProvider,
  Button,
  ButtonStyle,
  Surface,
  WaterfallChart,
  WaterfallStyle,
} from 'consulting-ui';
import 'consulting-ui/styles.css';

export function ExecutiveBrief() {
  return (
    <BrandProvider brand={${meta.enumName}} surface={${s}}>
      <WaterfallChart
        style={WaterfallStyle.Classic}
        formatValue={(n) => \`$\${n}M\`}
        steps={[
          { id: 'base', label: 'FY24', value: 100, kind: 'start' },
          { id: 'ops', label: 'AI Ops', value: 28 },
          { id: 'end', label: 'FY26', kind: 'total' },
        ]}
      />
      <Button style={ButtonStyle.Primary}>Download brief</Button>
      <Button brand={${meta.alternateEnum}} style={ButtonStyle.Editorial}>${meta.alternateLabel}</Button>
    </BrandProvider>
  );
}`;
}

const LAB_SNIPPET_BODIES: Readonly<Record<number, string>> = {
  1: `import { Button, ButtonStyle, ControlSize } from 'consulting-ui';

<Button style={ButtonStyle.Primary}>Primary action</Button>
<Button style={ButtonStyle.Secondary}>Secondary outline</Button>
<Button style={ButtonStyle.Editorial}>Read full report</Button>
<Button style={ButtonStyle.Quiet} size={ControlSize.Sm}>Quiet reset</Button>
<Button style={ButtonStyle.Primary} size={ControlSize.Sm} loading>Exporting</Button>`,

  2: `import { Badge, BadgeStyle } from 'consulting-ui';

<Badge style={BadgeStyle.Accent}>Strategy</Badge>
<Badge style={BadgeStyle.Neutral}>EMEA</Badge>
<Badge style={BadgeStyle.Outline}>2026</Badge>
<Badge style={BadgeStyle.Positive}>+14.2%</Badge>
<Badge style={BadgeStyle.Negative}>-3.1 pp</Badge>`,

  3: `import { ControlSize, Input, InputStyle } from 'consulting-ui';

<Input
  style={InputStyle.Standard}
  label="Search insights"
  placeholder="EBITDA, AI readiness..."
  searchable
  clearable
/>
<Input
  style={InputStyle.Underline}
  label="Target margin lift"
  defaultValue="12.5"
  suffix="%"
/>
<Input
  style={InputStyle.Filled}
  placeholder="Filled filter query..."
  size={ControlSize.Sm}
/>`,

  4: `import { Select, SelectStyle } from 'consulting-ui';

<Select
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
  style={SelectStyle.Underline}
  defaultValue="2026"
  options={[
    { value: '2026', label: 'FY 2026 Benchmark' },
    { value: '2025', label: 'FY 2025 Baseline' },
  ]}
/>`,

  5: `import { ControlSize, Tabs, TabsStyle } from 'consulting-ui';

<Tabs
  style={TabsStyle.Underline}
  size={ControlSize.Sm}
  items={[
    { id: 'overview', label: 'Overview' },
    { id: 'exhibits', label: 'Exhibits', count: 4 },
    { id: 'notes', label: 'Notes' },
  ]}
/>
<Tabs
  style={TabsStyle.Segmented}
  size={ControlSize.Sm}
  items={[
    { id: 'chart', label: 'Chart' },
    { id: 'matrix', label: 'Matrix' },
  ]}
/>`,

  6: `import { Callout, CalloutStyle } from 'consulting-ui';

<Callout
  style={CalloutStyle.Executive}
  eyebrow="Key Takeaway"
  title="Operating model beats isolated pilots"
>
  <p>Enterprises redesigning core workflows capture over 2x the EBITDA impact of point tools.</p>
</Callout>`,

  7: `import { MetricCard, MetricCardStyle } from 'consulting-ui';

<MetricCard
  style={MetricCardStyle.Hero}
  value="74%"
  label="Frontline workflow adoption"
  delta="+21 pp"
  deltaDirection="up"
  benchmark="2025 baseline: 53%"
/>`,

  8: `import { ExhibitFrame, ExhibitStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.AccentHeader}
  exhibitLabel="Exhibit 2"
  title="Payback compresses under 12 months"
  subtitle="Illustrative index (2024 = 100)"
  source="consulting-ui showcase benchmark"
>
  <p>Chart-agnostic slot supporting WaterfallChart, Matrix2x2, or DataTable.</p>
</ExhibitFrame>`,

  9: `import { DataTable, DataTableStyle } from 'consulting-ui';

<DataTable
  style={DataTableStyle.Compact}
  columns={[
    { key: 'region', header: 'Region', sortable: true },
    { key: 'cagr', header: 'EBITDA CAGR', align: 'right', sortable: true },
    { key: 'share', header: 'Share', align: 'right', sortable: true },
  ]}
  rows={[
    { id: 'na', region: 'North America', cagr: '+12.6%', share: '44%', highlighted: true },
    { id: 'eu', region: 'EMEA', cagr: '+11.4%', share: '31%' },
    { id: 'ap', region: 'APAC', cagr: '+11.9%', share: '25%' },
  ]}
  summaryRow={{ region: 'Global', cagr: '+12.1%', share: '100%' }}
/>`,

  10: `import { Accordion, AccordionStyle } from 'consulting-ui';

<Accordion
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
/>`,

  11: `import { HarveyBall, HarveyBallStyle } from 'consulting-ui';

<HarveyBall value={75} style={HarveyBallStyle.Solid} showValue />
<HarveyBall value={75} style={HarveyBallStyle.Ring} showValue />
<HarveyBall value={50} style={HarveyBallStyle.Minimal} showValue />`,

  12: `import { WaterfallChart, WaterfallStyle } from 'consulting-ui';

<WaterfallChart
  style={WaterfallStyle.Compact}
  formatValue={(n) => \`$\${n}M\`}
  steps={[
    { id: 'w1', label: 'Base', value: 80, kind: 'start' },
    { id: 'w2', label: 'Price', value: 24 },
    { id: 'w3', label: 'Cost', value: -10 },
    { id: 'w4', label: 'FY26', kind: 'total' },
  ]}
/>`,

  13: `import { Matrix2x2, MatrixStyle } from 'consulting-ui';

<Matrix2x2
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
/>`,

  14: `import { ChevronFlow, ChevronFlowStyle } from 'consulting-ui';

<ChevronFlow
  style={ChevronFlowStyle.Interlocking}
  steps={[
    { id: 'c1', phase: 'Phase 1', title: 'Diagnose' },
    { id: 'c2', phase: 'Phase 2', title: 'Redesign', active: true },
  ]}
/>`,

  15: `import { BenchmarkBar, BenchmarkBarStyle } from 'consulting-ui';

<BenchmarkBar
  style={BenchmarkBarStyle.Bullet}
  label="Workflow automation"
  value={68}
  median={44}
  topQuartile={79}
/>
<BenchmarkBar
  style={BenchmarkBarStyle.Split}
  label="Enablement coverage"
  value={58}
  topQuartile={82}
/>`,

  16: `import { PullQuote, PullQuoteStyle } from 'consulting-ui';

<PullQuote
  style={PullQuoteStyle.Editorial}
  quote="Operating-model speed turns technological parity into durable ROIC."
  author="Managing Partner Brief"
  role="2026 Strategy Synthesis"
/>`,

  17: `import { InsightCard, InsightCardStyle } from 'consulting-ui';

<InsightCard
  style={InsightCardStyle.Bordered}
  eyebrow="M&A & Private Equity"
  meta="PDF · 12 min"
  title="Value Creation Beyond Multiple Expansion"
  summary="Operational levers driving 12%+ annual EBITDA growth across buyouts."
  ctaLabel="Read publication"
  onAction={() => console.log('Open brief')}
/>`,

  18: `import { Slider, SliderStyle } from 'consulting-ui';

<Slider
  style={SliderStyle.Stepped}
  label="Automation target"
  min={0}
  max={100}
  step={10}
  defaultValue={60}
  benchmarkValue={45}
  benchmarkLabel="Median: 45%"
  formatValue={(v) => \`\${v}%\`}
/>`,

  19: `import { ControlSize, SegmentedControl, SegmentedControlStyle } from 'consulting-ui';

<SegmentedControl
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
  style={SegmentedControlStyle.Outline}
  size={ControlSize.Sm}
  defaultValue="usd"
  options={[
    { value: 'usd', label: 'USD ($M)' },
    { value: 'pct', label: '% Share' },
  ]}
/>`,

  20: `import { useState } from 'react';
import { Button, ButtonStyle, Drawer, DrawerStyle } from 'consulting-ui';

export function InitiativeDrawer() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button style={ButtonStyle.Secondary} onClick={() => setOpen(true)}>
        Open drill-down
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        style={DrawerStyle.AccentHeader}
        eyebrow="Executive Sheet"
        title="Initiative Drill-Down"
        footer={<span>Owner: Transformation Office</span>}
      >
        <p>Full slide-over dialog with Escape/backdrop close, scroll lock, and focus restoration.</p>
      </Drawer>
    </>
  );
}`,

  21: `import { BarChart, BarChartStyle } from 'consulting-ui';

<BarChart
  style={BarChartStyle.Ranked}
  height={210}
  deltaColumnLabel="YoY"
  formatValue={(v) => \`\${v}%\`}
  formatDelta={(d) => \`\${d > 0 ? '+' : ''}\${d} pp\`}
  data={[
    { id: 'b1', label: 'Agronomy', value: 31, delta: 2, highlighted: true },
    { id: 'b2', label: 'Precision HW', value: 27, delta: 3, highlighted: true },
    { id: 'b3', label: 'Sensing', value: 24, delta: 5 },
    { id: 'b4', label: 'Robotics', value: 5, delta: -1 },
  ]}
/>`,

  22: `import { StackedBarChart, StackedBarStyle } from 'consulting-ui';

<StackedBarChart
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
/>`,

  23: `import { DumbbellChart, DumbbellStyle } from 'consulting-ui';

<DumbbellChart
  style={DumbbellStyle.Gap}
  height={220}
  startLabel="Boomers"
  endLabel="Gen Z"
  deltaColumnLabel="Gap"
  formatValue={(v) => \`\${v > 0 ? '+' : ''}\${v}\`}
  formatDelta={(d) => \`\${d > 0 ? '+' : ''}\${d}\`}
  data={[
    { id: 'd1', label: 'Peers', start: 64, end: 56 },
    { id: 'd2', label: 'Gen AI', start: -24, end: 8 },
    { id: 'd3', label: 'Social', start: -38, end: -14 },
  ]}
/>`,

  24: `import { MarimekkoChart, MarimekkoStyle } from 'consulting-ui';

<MarimekkoChart
  style={MarimekkoStyle.Compact}
  height={220}
  formatValue={(v) => v.toFixed(1)}
  columns={[
    {
      id: 'other',
      label: 'Other',
      segments: [{ id: 'o1', label: 'All other', value: 58.6, tone: 'neutral' }],
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
/>`,

  25: `import { FunnelChart, FunnelStyle } from 'consulting-ui';

<FunnelChart
  style={FunnelStyle.Tiered}
  height={210}
  conversionColumnLabel="Conv."
  formatValue={(v) => \`\${v}\`}
  stages={[
    { id: 'f1', label: '$70M+', value: 220, tone: 'neutral' },
    { id: 'f2', label: '$250M+', value: 60, tone: 'secondary' },
    { id: 'f3', label: '$500M+', value: 19, tone: 'tertiary' },
    { id: 'f4', label: '$1B+', value: 7, tone: 'primary' },
  ]}
/>`,

  26: `import { SankeyChart, SankeyStyle } from 'consulting-ui';

<SankeyChart
  style={SankeyStyle.Editorial}
  height={230}
  formatValue={(v) => \`$\${v}M\`}
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
/>`,

  27: `import { LineChart, LineChartStyle } from 'consulting-ui';

<LineChart
  style={LineChartStyle.Forecast}
  height={220}
  periods={['22', '24', '26', '28', '30']}
  forecastStartIndex={2}
  formatValue={(v) => \`$\${v}B\`}
  band={{
    low: [null, null, 480, 515, 548],
    high: [null, null, 480, 565, 635],
  }}
  series={[
    { id: 'mkt', label: 'Beauty', values: [410, 448, 480, 536, 590], tone: 'primary', emphasized: true },
  ]}
/>`,

  28: `import { ComboChart, ComboChartStyle } from 'consulting-ui';

<ComboChart
  style={ComboChartStyle.BarLine}
  height={230}
  periods={['FY23', 'FY24', 'FY25', 'FY26']}
  formatBarValue={(v) => \`$\${v}B\`}
  formatLineValue={(v) => \`\${v}%\`}
  barSeries={[
    { id: 'rev', label: 'Revenue', values: [4.7, 5.4, 6.2, 7.1], tone: 'neutral' },
  ]}
  lineSeries={[
    { id: 'ebitda', label: 'Margin', values: [20, 22, 24, 25], tone: 'primary' },
  ]}
/>`,

  29: `import { BubbleChart, BubbleChartStyle } from 'consulting-ui';

<BubbleChart
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
  formatX={(v) => \`\${v}x\`}
  formatY={(v) => \`\${v}%\`}
  data={[
    { id: 'a1', label: 'Cloud AI', x: 1.8, y: 24, size: 480, highlighted: true },
    { id: 'a2', label: 'Core ERP', x: 2.0, y: 5, size: 800, tone: 'secondary' },
    { id: 'a3', label: 'Edge', x: 0.6, y: 20, size: 190, tone: 'tertiary' },
  ]}
/>`,

  30: `import { HeatmapChart, HeatmapStyle } from 'consulting-ui';

<HeatmapChart
  style={HeatmapStyle.Scorecard}
  height={210}
  rows={['Bank', 'Tech', 'Retail']}
  columns={['Sales', 'Ops', 'R&D']}
  formatValue={(v) => \`\${v}%\`}
  rowSummaryLabel="Avg"
  values={[
    [4.6, 5.2, 4.9],
    [4.8, 4.4, 6.2],
    [5.1, 4.7, 2.6],
  ]}
/>`,

  31: `import { SlopeChart, SlopeChartStyle } from 'consulting-ui';

<SlopeChart
  style={SlopeChartStyle.Indexed}
  height={220}
  periods={['2021', '2026']}
  formatValue={(v) => \`\${v}%\`}
  formatDelta={(d) => \`\${d > 0 ? '+' : ''}\${d}\`}
  series={[
    { id: 's1', label: 'Social AI', values: [11, 29], highlighted: true },
    { id: 's2', label: 'Market', values: [32, 35] },
    { id: 's3', label: 'Retail', values: [38, 19] },
  ]}
/>`,
};

export function buildLabSectionSnippet(
  sectionNumber: number,
  brand: Brand,
  surface: Surface,
): string {
  const meta = BRAND_META[brand];
  const s = formatSurfaceEnumName(surface);
  const body = LAB_SNIPPET_BODIES[sectionNumber] ?? '';
  return `// Theme: ${meta.enumName} · ${s} — pass brand={${meta.alternateEnum}} on any component to override\n${body}`;
}
