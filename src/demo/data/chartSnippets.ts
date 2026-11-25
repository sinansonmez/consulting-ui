import {
  BarChartStyle,
  Brand,
  BubbleChartStyle,
  ComboChartStyle,
  DumbbellStyle,
  FunnelStyle,
  HeatmapStyle,
  LineChartStyle,
  MarimekkoStyle,
  SankeyStyle,
  SlopeChartStyle,
  StackedBarStyle,
  Surface,
  WaterfallStyle,
} from '../../index';
import { BRAND_META, formatSurfaceEnumName } from '../components/codeUtils';

export type GalleryChartId =
  | 'line'
  | 'combo'
  | 'bubble'
  | 'heatmap'
  | 'slope'
  | 'marimekko'
  | 'funnel'
  | 'sankey'
  | 'waterfall'
  | 'bar'
  | 'stacked-bar'
  | 'dumbbell';

function themeComment(brand: Brand, surface: Surface): string {
  return `// Active theme: ${BRAND_META[brand].enumName} · ${formatSurfaceEnumName(surface)} (configured on <BrandProvider>)`;
}

export function buildChartSnippet(
  chartId: GalleryChartId,
  styleValue: string,
  brand: Brand,
  surface: Surface,
): string {
  const header = themeComment(brand, surface);
  const attribution = BRAND_META[brand].attribution;

  switch (chartId) {
    case 'line': {
      if (styleValue === LineChartStyle.StackedArea) {
        return `${header}
import { ExhibitFrame, ExhibitStyle, LineChart, LineChartStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 01 · LineChart"
  title="Global beauty retail sales are projected to approach $590 billion by 2030, led by social commerce."
  unitLabel="Global beauty retail sales ($B) by channel"
  source="Illustrative 2026 State of Beauty forecast model"
  attribution="${attribution}"
>
  <LineChart
    style={LineChartStyle.StackedArea}
    ariaLabel="Beauty market size by channel"
    periods={['2021', '2022', '2023', '2024', '2025', '2026E']}
    formatValue={(v) => \`$\${v}B\`}
    series={[
      { id: 'retail', label: 'Specialty & department retail', values: [260, 272, 285, 294, 302, 310], tone: 'neutral' },
      { id: 'direct', label: 'Brand e-commerce', values: [78, 88, 96, 108, 118, 128], tone: 'secondary' },
      { id: 'social', label: 'Social commerce & AI discovery', values: [24, 34, 48, 66, 86, 112], tone: 'primary' },
    ]}
  />
</ExhibitFrame>`;
      }
      const enumRef =
        styleValue === LineChartStyle.Trend
          ? 'LineChartStyle.Trend'
          : 'LineChartStyle.Forecast';
      const bandBlock =
        styleValue === LineChartStyle.Forecast
          ? `\n    band={{
      low: [null, null, null, 482, 514, 548],
      high: [null, null, null, 482, 566, 636],
      label: 'Upside / downside range',
    }}`
          : '';
      return `${header}
import { ExhibitFrame, ExhibitStyle, LineChart, LineChartStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 01 · LineChart"
  title="Global beauty retail sales are projected to approach $590 billion by 2030, led by social commerce."
  unitLabel="Global beauty retail sales ($B), actuals and forecast scenario range"
  source="Illustrative 2026 State of Beauty forecast model"
  attribution="${attribution}"
>
  <LineChart
    style={${enumRef}}
    ariaLabel="Global beauty market trajectory and forecast"
    periods={['2020', '2022', '2024', '2026', '2028', '2030']}
    forecastStartIndex={3}
    formatValue={(v) => \`$\${v}B\`}${bandBlock}
    series={[
      { id: 'total', label: 'Global beauty', values: [365, 412, 448, 482, 536, 590], tone: 'primary', emphasized: true },
      { id: 'skincare', label: 'Skincare', values: [145, 168, 186, 204, 232, 260], tone: 'secondary' },
    ]}
  />
</ExhibitFrame>`;
    }

    case 'combo': {
      const enumRef =
        styleValue === ComboChartStyle.StackedLine
          ? 'ComboChartStyle.StackedLine'
          : styleValue === ComboChartStyle.Indexed
            ? 'ComboChartStyle.Indexed'
            : 'ComboChartStyle.BarLine';
      const barSeriesCode =
        styleValue === ComboChartStyle.StackedLine
          ? `[
      { id: 'core', label: 'Core products', values: [2.8, 3.0, 3.3, 3.6, 3.9, 4.2], tone: 'neutral' },
      { id: 'cloud', label: 'Cloud & AI services', values: [0.8, 1.1, 1.4, 1.8, 2.3, 2.9], tone: 'secondary' },
    ]`
          : `[
      { id: 'rev', label: 'Annual revenue', values: [3.6, 4.1, 4.7, 5.4, 6.2, 7.1], tone: 'neutral' },
    ]`;
      const lineSeriesCode =
        styleValue === ComboChartStyle.Indexed
          ? `[
      { id: 'margin', label: 'EBITDA margin index', values: [100, 105, 112, 121, 130, 135], tone: 'primary' },
    ]`
          : `[
      { id: 'margin', label: 'EBITDA margin', values: [18.2, 19.1, 20.4, 22.1, 23.6, 24.5], tone: 'primary' },
    ]`;
      const lineAxis =
        styleValue === ComboChartStyle.Indexed
          ? 'Indexed margin (FY21 = 100)'
          : 'EBITDA margin (%)';
      const unitLabel =
        styleValue === ComboChartStyle.Indexed
          ? 'Annual revenue ($B, left axis) vs. indexed margin (FY21 = 100, right axis)'
          : 'Annual revenue ($B, left axis) vs. adjusted EBITDA margin (%, right axis)';
      const lineFormat =
        styleValue === ComboChartStyle.Indexed
          ? '(v) => `${Math.round(v)}`'
          : '(v) => `${v.toFixed(1)}%`';
      return `${header}
import { ComboChart, ComboChartStyle, ExhibitFrame, ExhibitStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Card}
  exhibitLabel="Chart 02 · ComboChart"
  title="AI-led pricing and SG&A discipline expanded EBITDA margins by 630 bps while scaling revenue."
  unitLabel="${unitLabel}"
  source="Illustrative Private Equity Value-Creation CFO Pack"
>
  <ComboChart
    style={${enumRef}}
    ariaLabel="Annual revenue and EBITDA margin trajectory"
    periods={['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26E']}
    barAxisLabel="Revenue ($B)"
    lineAxisLabel="${lineAxis}"
    formatBarValue={(v) => \`$\${v.toFixed(1)}B\`}
    formatLineValue={${lineFormat}}
    barSeries={${barSeriesCode}}
    lineSeries={${lineSeriesCode}}
  />
</ExhibitFrame>`;
    }

    case 'bubble': {
      const enumRef =
        styleValue === BubbleChartStyle.Scatter
          ? 'BubbleChartStyle.Scatter'
          : styleValue === BubbleChartStyle.Quadrant
            ? 'BubbleChartStyle.Quadrant'
            : 'BubbleChartStyle.GrowthShare';
      return `${header}
import { BubbleChart, BubbleChartStyle, ExhibitFrame, ExhibitStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 03 · BubbleChart (BCG Growth-Share Matrix)"
  title="Three high-growth cloud and AI businesses anchor portfolio expansion while legacy ERP funds reinvestment."
  unitLabel="Relative market share (X) vs. market growth rate (Y); bubble area proportional to annual revenue"
  source="Illustrative Corporate Portfolio Review"
>
  <BubbleChart
    style={${enumRef}}
    ariaLabel="Corporate portfolio BCG growth-share bubble matrix"
    xAxisLabel="Relative Market Share (x)"
    yAxisLabel="Market Growth Rate (%)"
    sizeLabel="Annual Revenue"
    xThreshold={1.1}
    yThreshold={11}
    quadrantLabels={{
      topLeft: 'Question Marks',
      topRight: 'Stars',
      bottomLeft: 'Divest / Harvest',
      bottomRight: 'Cash Cows',
    }}
    formatX={(v) => \`\${v.toFixed(1)}x\`}
    formatY={(v) => \`\${v}%\`}
    formatSize={(v) => \`$\${v}M\`}
    data={[
      { id: 'agentic', label: 'Agentic Cloud', x: 1.9, y: 26, size: 540, highlighted: true, group: 'Growth' },
      { id: 'data', label: 'Data Fabric', x: 1.5, y: 19, size: 390, highlighted: true, group: 'Growth' },
      { id: 'cyber', label: 'Managed Cyber', x: 1.3, y: 14, size: 310, highlighted: true, group: 'Growth' },
      { id: 'erp', label: 'Core ERP Suite', x: 2.2, y: 5, size: 920, tone: 'secondary', group: 'Cash Cow' },
      { id: 'payments', label: 'B2B Payments', x: 1.6, y: 7, size: 610, tone: 'secondary', group: 'Cash Cow' },
      { id: 'edge', label: 'Edge Telemetry', x: 0.6, y: 22, size: 190, tone: 'tertiary', group: 'Venture' },
      { id: 'legacy', label: 'On-Prem Hosting', x: 0.4, y: 2, size: 220, tone: 'neutral', group: 'Legacy' },
    ]}
  />
</ExhibitFrame>`;
    }

    case 'heatmap': {
      if (styleValue === HeatmapStyle.Diverging) {
        return `${header}
import { ExhibitFrame, ExhibitStyle, HeatmapChart, HeatmapStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Card}
  exhibitLabel="Chart 04 · HeatmapChart"
  title="Commercial and R&D outperformed margin plans while supply-chain inflation dragged industrials."
  unitLabel="YoY margin variance vs. plan (percentage points)"
  source="Illustrative 2026 Industry × Function Variance Matrix"
>
  <HeatmapChart
    style={HeatmapStyle.Diverging}
    ariaLabel="YoY margin variance heatmap by sector and business function"
    rows={['Banking', 'High Tech', 'Retail', 'Pharma', 'Industrials']}
    columns={['Commercial', 'Customer Ops', 'R&D / Tech', 'Supply Chain', 'Finance']}
    formatValue={(v) => \`\${v > 0 ? '+' : ''}\${v.toFixed(1)} pp\`}
    values={[
      [2.1, 3.4, 2.8, -1.6, 0.4],
      [2.5, 1.9, 4.2, -0.8, 0.7],
      [3.1, 2.6, -1.4, 1.8, -0.9],
      [1.2, -0.6, 3.6, -1.1, 0.2],
      [-0.8, -1.5, 0.9, 2.4, -0.4],
    ]}
  />
</ExhibitFrame>`;
      }
      const enumRef =
        styleValue === HeatmapStyle.Sequential
          ? 'HeatmapStyle.Sequential'
          : 'HeatmapStyle.Scorecard';
      return `${header}
import { ExhibitFrame, ExhibitStyle, HeatmapChart, HeatmapStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Card}
  exhibitLabel="Chart 04 · HeatmapChart"
  title="Software engineering, customer operations, and commercial pricing concentrate over 70% of GenAI EBIT impact."
  unitLabel="Estimated annual EBIT impact as % of functional cost base"
  source="Illustrative 2026 Industry × Function GenAI Value Matrix"
>
  <HeatmapChart
    style={${enumRef}}
    ariaLabel="GenAI EBIT impact heatmap by sector and business function"
    rows={['Banking', 'High Tech', 'Retail', 'Pharma', 'Industrials']}
    columns={['Commercial', 'Customer Ops', 'R&D / Tech', 'Supply Chain', 'Finance']}
    formatValue={(v) => \`\${v.toFixed(1)}%\`}
    rowSummaryLabel="Row Avg"
    values={[
      [4.6, 5.2, 4.9, 1.4, 3.1],
      [4.8, 4.4, 6.2, 2.1, 2.8],
      [5.1, 4.7, 2.6, 4.2, 2.2],
      [3.9, 2.8, 5.8, 2.7, 2.1],
      [2.9, 2.5, 3.4, 4.8, 2.4],
    ]}
  />
</ExhibitFrame>`;
    }

    case 'slope': {
      if (styleValue === SlopeChartStyle.RankShift) {
        return `${header}
import { ExhibitFrame, ExhibitStyle, SlopeChart, SlopeChartStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 05 · SlopeChart"
  title="Agentic AI scale jumped from #5 to #1 on CEO agendas between 2022 and 2026."
  unitLabel="Executive strategic priority ranking (#1 = highest priority)"
  source="Illustrative Global CEO Priority Survey"
>
  <SlopeChart
    style={SlopeChartStyle.RankShift}
    ariaLabel="CEO strategic priority rank shifts"
    periods={['2022', '2024', '2026']}
    series={[
      { id: 'ai', label: 'Agentic AI Scale', values: [5, 2, 1], highlighted: true },
      { id: 'margin', label: 'Margin & Pricing', values: [2, 1, 2] },
      { id: 'supply', label: 'Supply Resilience', values: [1, 3, 4] },
      { id: 'cyber', label: 'Cyber & Trust', values: [4, 4, 3], highlighted: true },
      { id: 'ma', label: 'Portfolio M&A', values: [3, 5, 5] },
    ]}
  />
</ExhibitFrame>`;
      }
      const enumRef =
        styleValue === SlopeChartStyle.BeforeAfter
          ? 'SlopeChartStyle.BeforeAfter'
          : 'SlopeChartStyle.Indexed';
      return `${header}
import { ExhibitFrame, ExhibitStyle, SlopeChart, SlopeChartStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 05 · SlopeChart"
  title="Social commerce and AI-assisted shopping surged 18 percentage points in share since 2021."
  unitLabel="Share of consumer product discovery journeys (%), 2021 vs. 2026"
  source="Illustrative Consumer Path-to-Purchase Shift Analysis"
>
  <SlopeChart
    style={${enumRef}}
    ariaLabel="Consumer discovery channel share shift 2021 to 2026"
    periods={['2021', '2026']}
    formatValue={(v) => \`\${v}%\`}
    formatDelta={(d) => \`\${d > 0 ? '+' : ''}\${d} pp\`}
    series={[
      { id: 'social', label: 'Social & AI discovery', values: [11, 29], highlighted: true },
      { id: 'market', label: 'Online marketplaces', values: [32, 35] },
      { id: 'brand', label: 'Brand direct sites', values: [19, 17] },
      { id: 'dept', label: 'Traditional retail', values: [38, 19] },
    ]}
  />
</ExhibitFrame>`;
    }

    case 'marimekko': {
      const enumRef =
        styleValue === MarimekkoStyle.Compact
          ? 'MarimekkoStyle.Compact'
          : styleValue === MarimekkoStyle.Outlined
            ? 'MarimekkoStyle.Outlined'
            : 'MarimekkoStyle.Editorial';
      return `${header}
import { ExhibitFrame, ExhibitStyle, MarimekkoChart, MarimekkoStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 06 · MarimekkoChart"
  title="Priority sectors accounted for roughly 40 percent of US construction spend in 2025."
  unitLabel="2025 US construction spend, %"
  footnotes={['Includes electric power generation component of NAICS 2211.']}
  source="Illustrative construction spend composition modeled on US Census & EIA"
  attribution="${attribution}"
>
  <MarimekkoChart
    style={${enumRef}}
    ariaLabel="2025 US construction spend Marimekko composition"
    totalCallout={{ label: 'Total', value: '100%' }}
    highlightCallout={{ label: 'Priority sectors total', value: '41.4%' }}
    formatValue={(v) => v.toFixed(1)}
    columns={[
      {
        id: 'other',
        label: 'All other construction',
        segments: [
          { id: 'other-all', label: 'All other construction', value: 58.6, tone: 'neutral' },
        ],
      },
      {
        id: 'priority',
        label: 'Priority sectors',
        segments: [
          { id: 'mfg', label: 'Manufacturing', value: 15.2, tone: 'primary' },
          { id: 'mining', label: 'Mining', value: 0.9, tone: 'primary' },
          { id: 'trans', label: 'Transportation', value: 9.9, tone: 'primary' },
          { id: 'bb', label: 'Broadband and telecom', value: 4.7, tone: 'primary' },
          { id: 'pipe', label: 'Oil and gas pipelines', value: 0.9, tone: 'secondary' },
          { id: 'extract', label: 'Oil and gas extraction', value: 5.2, tone: 'secondary' },
          { id: 'tx', label: 'Electricity transmission', value: 1.7, tone: 'secondary' },
          { id: 'gen', label: 'Electricity generation', value: 2.9, tone: 'secondary', footnoteRef: '1' },
        ],
      },
    ]}
  />
</ExhibitFrame>`;
    }

    case 'funnel': {
      const enumRef =
        styleValue === FunnelStyle.Tapered
          ? 'FunnelStyle.Tapered'
          : styleValue === FunnelStyle.Horizontal
            ? 'FunnelStyle.Horizontal'
            : 'FunnelStyle.Tiered';
      return `${header}
import { ExhibitFrame, ExhibitStyle, FunnelChart, FunnelStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Card}
  exhibitLabel="Chart 07 · FunnelChart"
  title="Only seven independent beauty brands founded over the past two decades have crossed $1 billion."
  unitLabel="Brands reaching annual retail sales threshold"
  source="Illustrative Beauty Scaling Funnel"
>
  <FunnelChart
    style={${enumRef}}
    ariaLabel="Beauty brand scaling milestones funnel"
    conversionColumnLabel="Of $70M+"
    formatValue={(v) => \`\${v} brands\`}
    stages={[
      { id: 's70', label: '$70M+ scale-ups', value: 220, note: '89 skincare leaders', tone: 'neutral' },
      { id: 's250', label: '$250M+ breakout', value: 60, note: 'Multi-category expansion', tone: 'secondary' },
      { id: 's500', label: '$500M+ leaders', value: 19, tone: 'tertiary' },
      { id: 's1b', label: '$1B+ global icons', value: 7, tone: 'primary' },
    ]}
  />
</ExhibitFrame>`;
    }

    case 'sankey': {
      const enumRef =
        styleValue === SankeyStyle.Flow
          ? 'SankeyStyle.Flow'
          : styleValue === SankeyStyle.Minimal
            ? 'SankeyStyle.Minimal'
            : 'SankeyStyle.Editorial';
      return `${header}
import { ExhibitFrame, ExhibitStyle, SankeyChart, SankeyStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 08 · SankeyChart"
  title="Deliberate modernizers redirect 42 percent of enterprise IT budgets from legacy run into AI and change."
  unitLabel="Annualized enterprise IT spend flow ($M, $100M illustrative baseline)"
  source="Illustrative Enterprise IT Budget Flow Benchmark"
>
  <SankeyChart
    style={${enumRef}}
    ariaLabel="Enterprise IT budget flow from Run vs Change into towers"
    formatValue={(v) => \`$\${v}M\`}
    nodes={[
      { id: 'run', label: 'Run Legacy', depth: 0, tone: 'neutral' },
      { id: 'change', label: 'Change & AI', depth: 0, tone: 'primary' },
      { id: 'cloud', label: 'Cloud & Infra', depth: 1, tone: 'secondary' },
      { id: 'apps', label: 'Core Apps & ERP', depth: 1, tone: 'quaternary' },
      { id: 'data', label: 'Data & AI Platforms', depth: 1, tone: 'primary' },
      { id: 'cyber', label: 'Cyber & Resilience', depth: 1, tone: 'tertiary' },
      { id: 'work', label: 'Digital Workplace', depth: 1, tone: 'quinary' },
    ]}
    links={[
      { source: 'run', target: 'cloud', value: 20 },
      { source: 'run', target: 'apps', value: 22 },
      { source: 'run', target: 'cyber', value: 7 },
      { source: 'run', target: 'work', value: 9 },
      { source: 'change', target: 'cloud', value: 11 },
      { source: 'change', target: 'apps', value: 6 },
      { source: 'change', target: 'data', value: 19 },
      { source: 'change', target: 'cyber', value: 4 },
      { source: 'change', target: 'work', value: 2 },
    ]}
  />
</ExhibitFrame>`;
    }

    case 'waterfall': {
      const enumRef =
        styleValue === WaterfallStyle.Clean
          ? 'WaterfallStyle.Clean'
          : styleValue === WaterfallStyle.Compact
            ? 'WaterfallStyle.Compact'
            : 'WaterfallStyle.Classic';
      return `${header}
import { ExhibitFrame, ExhibitStyle, WaterfallChart, WaterfallStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Card}
  exhibitLabel="Chart 09 · WaterfallChart"
  title="Pricing discipline and workflow redesign drive +$52M in net annualized EBITDA expansion."
  unitLabel="Run-rate EBITDA value bridge ($M)"
  source="Illustrative Transformation Office Value Bridge"
>
  <WaterfallChart
    style={${enumRef}}
    ariaLabel="Annualized EBITDA value bridge"
    formatValue={(n) => \`$\${n}M\`}
    steps={[
      { id: 'base', label: 'FY24 Base', value: 120, kind: 'start' },
      { id: 'price', label: 'Pricing', value: 28 },
      { id: 'ops', label: 'Workflow AI', value: 34 },
      { id: 'sub', label: 'Gross Lift', kind: 'subtotal' },
      { id: 'capex', label: 'Change Capex', value: -18 },
      { id: 'sga', label: 'SG&A', value: 8 },
      { id: 'end', label: 'FY26 Target', kind: 'total' },
    ]}
  />
</ExhibitFrame>`;
    }

    case 'bar': {
      if (styleValue === BarChartStyle.Grouped) {
        return `${header}
import { BarChart, BarChartStyle, ExhibitFrame, ExhibitStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 10 · BarChart"
  title="Top-quartile digital leaders outpace sector medians by 25+ percentage points in AI deployment."
  unitLabel="Share of enterprises scaling production workflows (%)"
  source="Illustrative Cross-Sector AI Maturity Benchmark"
>
  <BarChart
    style={BarChartStyle.Grouped}
    ariaLabel="Top-quartile leaders versus sector median AI adoption"
    deltaColumnLabel="Gap"
    formatValue={(v) => \`\${v}%\`}
    series={[
      { id: 'leaders', label: 'Top-quartile leaders', tone: 'primary' },
      { id: 'median', label: 'Sector median', tone: 'neutral' },
    ]}
    data={[
      { id: 'tech', label: 'Software & Cloud', values: [78, 49], delta: '+29 pp' },
      { id: 'fin', label: 'Financial Services', values: [68, 42], delta: '+26 pp' },
      { id: 'health', label: 'Healthcare & Life Sci', values: [54, 31], delta: '+23 pp' },
      { id: 'mfg', label: 'Advanced Industrials', values: [49, 24], delta: '+25 pp' },
    ]}
  />
</ExhibitFrame>`;
      }
      if (styleValue === BarChartStyle.Diverging) {
        return `${header}
import { BarChart, BarChartStyle, ExhibitFrame, ExhibitStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 10 · BarChart"
  title="Discretionary consumer spending intent diverged sharply across regions in early 2026."
  unitLabel="Net spending intent balance (percentage points, positive minus negative)"
  source="Illustrative Global Consumer Pulse Survey"
>
  <BarChart
    style={BarChartStyle.Diverging}
    ariaLabel="Regional net spending intent shift"
    formatValue={(v) => \`\${v > 0 ? '+' : ''}\${v} pp\`}
    data={[
      { id: 'ind', label: 'India', value: 34, highlighted: true },
      { id: 'us', label: 'United States', value: 14 },
      { id: 'eu', label: 'Eurozone Core', value: 6 },
      { id: 'uk', label: 'United Kingdom', value: -11 },
      { id: 'can', label: 'Canada', value: -24 },
      { id: 'arg', label: 'Argentina', value: -38 },
    ]}
  />
</ExhibitFrame>`;
      }
      return `${header}
import { BarChart, BarChartStyle, ExhibitFrame, ExhibitStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 10 · BarChart"
  title="Digital agronomy and precision hardware lead field adoption while remote sensing accelerates fastest."
  unitLabel="Global farmers currently using technology (% of respondents)"
  source="Illustrative Global AgTech Adoption Survey (n = 5,500)"
>
  <BarChart
    style={BarChartStyle.Ranked}
    ariaLabel="AgTech adoption and two-year change"
    deltaColumnLabel="2024–26"
    formatValue={(v) => \`\${v}%\`}
    formatDelta={(d) => \`\${d > 0 ? '+' : ''}\${d} pp\`}
    data={[
      { id: 'agro', label: 'Digital agronomy', value: 31, delta: 1, highlighted: true },
      { id: 'hw', label: 'Precision ag hardware', value: 27, delta: 3, highlighted: true },
      { id: 'sense', label: 'Remote sensing', value: 24, delta: 5, highlighted: true },
      { id: 'fms', label: 'Farm management software', value: 24, delta: 3 },
      { id: 'sust', label: 'Sustainability software', value: 7, delta: 1 },
      { id: 'robot', label: 'Automation & robotics', value: 5, delta: -1 },
    ]}
  />
</ExhibitFrame>`;
    }

    case 'stacked-bar': {
      if (styleValue === StackedBarStyle.Diverging) {
        return `${header}
import { ExhibitFrame, ExhibitStyle, StackedBarChart, StackedBarStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Card}
  exhibitLabel="Chart 11 · StackedBarChart"
  title="Reported AI headcount reductions trailed prior-year executive forecasts by more than half."
  unitLabel="Diverging share of organizations expecting headcount decrease vs. increase (%)"
  source="Illustrative State of AI Workforce Survey"
>
  <StackedBarChart
    style={StackedBarStyle.Diverging}
    ariaLabel="AI workforce headcount decrease versus increase sentiment"
    series={[
      { id: 'dec', label: 'Decrease (>3%)', tone: 'negative', polarity: 'negative' },
      { id: 'inc', label: 'Increase (>3%)', tone: 'primary', polarity: 'positive' },
    ]}
    categories={[
      { id: 'prior', label: 'Prior-year expectation', values: [32, 18] },
      { id: 'actual', label: 'Actual reported impact', values: [14, 20] },
      { id: 'next', label: 'Next-12-month forecast', values: [39, 18] },
    ]}
  />
</ExhibitFrame>`;
      }
      const enumRef =
        styleValue === StackedBarStyle.Absolute
          ? 'StackedBarStyle.Absolute'
          : 'StackedBarStyle.Proportional';
      return `${header}
import { ExhibitFrame, ExhibitStyle, StackedBarChart, StackedBarStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Card}
  exhibitLabel="Chart 11 · StackedBarChart"
  title="Reported AI headcount reductions trailed prior-year executive forecasts by more than half."
  unitLabel="Share of surveyed organizations reporting or expecting workforce impact (%)"
  source="Illustrative State of AI Workforce Survey"
>
  <StackedBarChart
    style={${enumRef}}
    ariaLabel="AI workforce impact forecast versus actuals"
    formatValue={(v) => \`\${v}%\`}
    series={[
      { id: 'dec', label: 'Decrease (>3%)', tone: 'primary' },
      { id: 'same', label: 'Little or no change', tone: 'neutral' },
      { id: 'inc', label: 'Increase (>3%)', tone: 'secondary' },
    ]}
    categories={[
      { id: 'prior', label: 'Prior-year expectation', values: [32, 50, 18] },
      { id: 'actual', label: 'Actual reported impact', values: [14, 66, 20] },
      { id: 'next', label: 'Next-12-month forecast', values: [39, 43, 18] },
    ]}
  />
</ExhibitFrame>`;
    }

    case 'dumbbell': {
      const enumRef =
        styleValue === DumbbellStyle.Range
          ? 'DumbbellStyle.Range'
          : styleValue === DumbbellStyle.Minimal
            ? 'DumbbellStyle.Minimal'
            : 'DumbbellStyle.Gap';
      return `${header}
import { DumbbellChart, DumbbellStyle, ExhibitFrame, ExhibitStyle } from 'consulting-ui';

<ExhibitFrame
  style={ExhibitStyle.Editorial}
  exhibitLabel="Chart 12 · DumbbellChart"
  title="Despite heavy adoption, younger consumers remain skeptical of social and AI research channels."
  unitLabel="Net trust score for product research channels (positive minus negative)"
  source="Illustrative Consumer Trust & Discovery Benchmark"
>
  <DumbbellChart
    style={${enumRef}}
    ariaLabel="Consumer net trust by generation"
    startLabel="Baby Boomers"
    endLabel="Gen Z"
    deltaColumnLabel="Gen Z vs. Boomers"
    formatValue={(v) => \`\${v > 0 ? '+' : ''}\${v}\`}
    formatDelta={(d) => \`\${d > 0 ? '+' : ''}\${d} pp\`}
    data={[
      { id: 'friends', label: 'Friends & family', start: 64, end: 56 },
      { id: 'reviews', label: 'Verified customer reviews', start: 42, end: 31 },
      { id: 'brand', label: 'Brand websites', start: 28, end: 18 },
      { id: 'genai', label: 'Generative AI assistants', start: -24, end: 8 },
      { id: 'social', label: 'Social media influencers', start: -38, end: -14 },
    ]}
  />
</ExhibitFrame>`;
    }
  }
}
