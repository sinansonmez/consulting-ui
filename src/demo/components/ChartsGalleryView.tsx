import { useState } from 'react';
import {
  Badge,
  BadgeStyle,
  BarChart,
  BarChartStyle,
  Brand,
  BubbleChart,
  BubbleChartStyle,
  ComboChart,
  ComboChartStyle,
  ControlSize,
  DumbbellChart,
  DumbbellStyle,
  ExhibitFrame,
  ExhibitStyle,
  FunnelChart,
  FunnelStyle,
  HeatmapChart,
  HeatmapStyle,
  LineChart,
  LineChartStyle,
  MarimekkoChart,
  MarimekkoStyle,
  SankeyChart,
  SankeyStyle,
  SegmentedControl,
  SegmentedControlStyle,
  SlopeChart,
  SlopeChartStyle,
  StackedBarChart,
  StackedBarStyle,
  WaterfallChart,
  WaterfallStyle,
  useBrand,
} from '../../index';
import styles from './ChartsGalleryView.module.css';

export function ChartsGalleryView() {
  const { brand } = useBrand();
  const [lineStyle, setLineStyle] = useState<LineChartStyle>(
    LineChartStyle.Forecast,
  );
  const [funnelStyle, setFunnelStyle] = useState<FunnelStyle>(
    FunnelStyle.Tiered,
  );
  const [slopeStyle, setSlopeStyle] = useState<SlopeChartStyle>(
    SlopeChartStyle.Indexed,
  );
  const [heatmapStyle, setHeatmapStyle] = useState<HeatmapStyle>(
    HeatmapStyle.Scorecard,
  );

  const firmWordmark =
    brand === Brand.McKinsey
      ? 'McKinsey Style · Illustrative Exhibit'
      : brand === Brand.BCG
        ? 'BCG Style · Illustrative Exhibit'
        : 'Bain Style · Illustrative Exhibit';

  return (
    <div className={styles.gallery}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>
            Consulting Charts Gallery (12 ECharts SVG Exhibits)
          </h1>
          <Badge style={BadgeStyle.Accent}>Apache ECharts SVG · MBB Tokens</Badge>
        </div>
        <p className={styles.deck}>
          All 12 publication-grade consulting chart components rendered at full
          editorial width. Switch firms (McKinsey, BCG, Bain) or Light/Dark in
          the top bar—or toggle live <code>style</code> enum variants on the
          exhibits below.
        </p>
      </header>

      {/* 1. LineChart */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel="Chart 01 · LineChart"
          title="Global beauty retail sales are projected to approach $590 billion by 2030, led by social commerce."
          unitLabel="Global beauty retail sales ($B), actuals and forecast scenario range"
          source="Illustrative 2026 State of Beauty forecast model"
          attribution={firmWordmark}
          controls={
            <SegmentedControl
              style={SegmentedControlStyle.Filled}
              size={ControlSize.Sm}
              ariaLabel="LineChart style"
              value={lineStyle}
              onChange={(v) => setLineStyle(v as LineChartStyle)}
              options={[
                { value: LineChartStyle.Forecast, label: 'Forecast' },
                { value: LineChartStyle.Trend, label: 'Trend' },
                { value: LineChartStyle.StackedArea, label: 'Stacked Area' },
              ]}
            />
          }
        >
          {lineStyle === LineChartStyle.StackedArea ? (
            <LineChart
              style={LineChartStyle.StackedArea}
              ariaLabel="Beauty market size by channel"
              periods={['2021', '2022', '2023', '2024', '2025', '2026E']}
              formatValue={(v) => `$${v}B`}
              series={[
                {
                  id: 'retail',
                  label: 'Specialty & department retail',
                  values: [260, 272, 285, 294, 302, 310],
                  tone: 'neutral',
                },
                {
                  id: 'direct',
                  label: 'Brand e-commerce',
                  values: [78, 88, 96, 108, 118, 128],
                  tone: 'secondary',
                },
                {
                  id: 'social',
                  label: 'Social commerce & AI discovery',
                  values: [24, 34, 48, 66, 86, 112],
                  tone: 'primary',
                },
              ]}
            />
          ) : (
            <LineChart
              style={lineStyle}
              ariaLabel="Global beauty market trajectory and forecast"
              periods={['2020', '2022', '2024', '2026', '2028', '2030']}
              forecastStartIndex={3}
              formatValue={(v) => `$${v}B`}
              band={
                lineStyle === LineChartStyle.Forecast
                  ? {
                      low: [null, null, null, 482, 514, 548],
                      high: [null, null, null, 482, 566, 636],
                      label: 'Upside / downside range',
                    }
                  : undefined
              }
              series={[
                {
                  id: 'total',
                  label: 'Global beauty',
                  values: [365, 412, 448, 482, 536, 590],
                  tone: 'primary',
                  emphasized: true,
                },
                {
                  id: 'skincare',
                  label: 'Skincare',
                  values: [145, 168, 186, 204, 232, 260],
                  tone: 'secondary',
                },
              ]}
            />
          )}
        </ExhibitFrame>
      </section>

      {/* 2. ComboChart */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Card}
          exhibitLabel="Chart 02 · ComboChart"
          title="AI-led pricing and SG&A discipline expanded EBITDA margins by 630 bps while scaling revenue."
          unitLabel="Annual revenue ($B, left axis) vs. adjusted EBITDA margin (%, right axis)"
          source="Illustrative Private Equity Value-Creation CFO Pack"
        >
          <ComboChart
            style={ComboChartStyle.BarLine}
            ariaLabel="Annual revenue and EBITDA margin trajectory"
            periods={['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26E']}
            barAxisLabel="Revenue ($B)"
            lineAxisLabel="EBITDA margin (%)"
            formatBarValue={(v) => `$${v.toFixed(1)}B`}
            formatLineValue={(v) => `${v.toFixed(1)}%`}
            barSeries={[
              {
                id: 'rev',
                label: 'Annual revenue',
                values: [3.6, 4.1, 4.7, 5.4, 6.2, 7.1],
                tone: 'neutral',
              },
            ]}
            lineSeries={[
              {
                id: 'margin',
                label: 'EBITDA margin',
                values: [18.2, 19.1, 20.4, 22.1, 23.6, 24.5],
                tone: 'primary',
              },
            ]}
          />
        </ExhibitFrame>
      </section>

      {/* 3. BubbleChart (BCG Growth-Share Matrix) */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel="Chart 03 · BubbleChart (BCG Growth-Share Matrix)"
          title="Three high-growth cloud and AI businesses anchor portfolio expansion while legacy ERP funds reinvestment."
          unitLabel="Relative market share (X) vs. market growth rate (Y); bubble area proportional to annual revenue"
          source="Illustrative Corporate Portfolio Review"
        >
          <BubbleChart
            style={BubbleChartStyle.GrowthShare}
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
            formatX={(v) => `${v.toFixed(1)}x`}
            formatY={(v) => `${v}%`}
            formatSize={(v) => `$${v}M`}
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
        </ExhibitFrame>
      </section>

      {/* 4. HeatmapChart */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Card}
          exhibitLabel="Chart 04 · HeatmapChart"
          title="Software engineering, customer operations, and commercial pricing concentrate over 70% of GenAI EBIT impact."
          unitLabel="Estimated annual EBIT impact as % of functional cost base"
          source="Illustrative 2026 Industry × Function GenAI Value Matrix"
          controls={
            <SegmentedControl
              style={SegmentedControlStyle.Filled}
              size={ControlSize.Sm}
              ariaLabel="Heatmap style"
              value={heatmapStyle}
              onChange={(v) => setHeatmapStyle(v as HeatmapStyle)}
              options={[
                { value: HeatmapStyle.Scorecard, label: 'Scorecard' },
                { value: HeatmapStyle.Sequential, label: 'Sequential' },
              ]}
            />
          }
        >
          <HeatmapChart
            style={heatmapStyle}
            ariaLabel="GenAI EBIT impact heatmap by sector and business function"
            rows={['Banking', 'High Tech', 'Retail', 'Pharma', 'Industrials']}
            columns={['Commercial', 'Customer Ops', 'R&D / Tech', 'Supply Chain', 'Finance']}
            formatValue={(v) => `${v.toFixed(1)}%`}
            rowSummaryLabel="Row Avg"
            values={[
              [4.6, 5.2, 4.9, 1.4, 3.1],
              [4.8, 4.4, 6.2, 2.1, 2.8],
              [5.1, 4.7, 2.6, 4.2, 2.2],
              [3.9, 2.8, 5.8, 2.7, 2.1],
              [2.9, 2.5, 3.4, 4.8, 2.4],
            ]}
          />
        </ExhibitFrame>
      </section>

      {/* 5. SlopeChart */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel="Chart 05 · SlopeChart"
          title="Social commerce and AI-assisted shopping surged 18 percentage points in share since 2021."
          unitLabel="Share of consumer product discovery journeys (%), 2021 vs. 2026"
          source="Illustrative Consumer Path-to-Purchase Shift Analysis"
          controls={
            <SegmentedControl
              style={SegmentedControlStyle.Filled}
              size={ControlSize.Sm}
              ariaLabel="SlopeChart style"
              value={slopeStyle}
              onChange={(v) => setSlopeStyle(v as SlopeChartStyle)}
              options={[
                { value: SlopeChartStyle.Indexed, label: 'With Delta' },
                { value: SlopeChartStyle.BeforeAfter, label: 'Before / After' },
                { value: SlopeChartStyle.RankShift, label: 'Rank Bump' },
              ]}
            />
          }
        >
          {slopeStyle === SlopeChartStyle.RankShift ? (
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
          ) : (
            <SlopeChart
              style={slopeStyle}
              ariaLabel="Consumer discovery channel share shift 2021 to 2026"
              periods={['2021', '2026']}
              formatValue={(v) => `${v}%`}
              formatDelta={(d) => `${d > 0 ? '+' : ''}${d} pp`}
              series={[
                { id: 'social', label: 'Social & AI discovery', values: [11, 29], highlighted: true },
                { id: 'market', label: 'Online marketplaces', values: [32, 35] },
                { id: 'brand', label: 'Brand direct sites', values: [19, 17] },
                { id: 'dept', label: 'Traditional retail', values: [38, 19] },
              ]}
            />
          )}
        </ExhibitFrame>
      </section>

      {/* 6. MarimekkoChart */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel="Chart 06 · MarimekkoChart"
          title="Priority sectors accounted for roughly 40 percent of US construction spend in 2025."
          unitLabel="2025 US construction spend, %"
          footnotes={[
            'Includes electric power generation component of NAICS 2211.',
          ]}
          source="Illustrative construction spend composition modeled on US Census & EIA"
          attribution={firmWordmark}
        >
          <MarimekkoChart
            style={MarimekkoStyle.Editorial}
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
        </ExhibitFrame>
      </section>

      {/* 7. FunnelChart */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Card}
          exhibitLabel="Chart 07 · FunnelChart"
          title="Only seven independent beauty brands founded over the past two decades have crossed $1 billion."
          unitLabel="Brands reaching annual retail sales threshold"
          source="Illustrative Beauty Scaling Funnel"
          controls={
            <SegmentedControl
              style={SegmentedControlStyle.Filled}
              size={ControlSize.Sm}
              ariaLabel="FunnelChart style"
              value={funnelStyle}
              onChange={(v) => setFunnelStyle(v as FunnelStyle)}
              options={[
                { value: FunnelStyle.Tiered, label: 'Tiered' },
                { value: FunnelStyle.Tapered, label: 'Tapered' },
                { value: FunnelStyle.Horizontal, label: 'Horizontal' },
              ]}
            />
          }
        >
          <FunnelChart
            style={funnelStyle}
            ariaLabel="Beauty brand scaling milestones funnel"
            conversionColumnLabel="Of $70M+"
            formatValue={(v) => `${v} brands`}
            stages={[
              { id: 's70', label: '$70M+ scale-ups', value: 220, note: '89 skincare leaders', tone: 'neutral' },
              { id: 's250', label: '$250M+ breakout', value: 60, note: 'Multi-category expansion', tone: 'secondary' },
              { id: 's500', label: '$500M+ leaders', value: 19, tone: 'tertiary' },
              { id: 's1b', label: '$1B+ global icons', value: 7, tone: 'primary' },
            ]}
          />
        </ExhibitFrame>
      </section>

      {/* 8. SankeyChart */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel="Chart 08 · SankeyChart"
          title="Deliberate modernizers redirect 42 percent of enterprise IT budgets from legacy run into AI and change."
          unitLabel="Annualized enterprise IT spend flow ($M, $100M illustrative baseline)"
          source="Illustrative Enterprise IT Budget Flow Benchmark"
        >
          <SankeyChart
            style={SankeyStyle.Editorial}
            ariaLabel="Enterprise IT budget flow from Run vs Change into towers"
            formatValue={(v) => `$${v}M`}
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
        </ExhibitFrame>
      </section>

      {/* 9. WaterfallChart */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Card}
          exhibitLabel="Chart 09 · WaterfallChart"
          title="Pricing discipline and workflow redesign drive +$52M in net annualized EBITDA expansion."
          unitLabel="Run-rate EBITDA value bridge ($M)"
          source="Illustrative Transformation Office Value Bridge"
        >
          <WaterfallChart
            style={WaterfallStyle.Classic}
            ariaLabel="Annualized EBITDA value bridge"
            formatValue={(n) => `$${n}M`}
            steps={[
              { id: 'base', label: 'FY24 Base', value: 120, kind: 'start' },
              { id: 'price', label: 'Pricing', value: 28 },
              { id: 'ops', label: 'Workflow AI', value: 34 },
              { id: 'sub', label: 'Gross Lift', value: 0, kind: 'subtotal' },
              { id: 'capex', label: 'Change Capex', value: -18 },
              { id: 'sga', label: 'SG&A', value: 8 },
              { id: 'end', label: 'FY26 Target', value: 0, kind: 'total' },
            ]}
          />
        </ExhibitFrame>
      </section>

      {/* 10. BarChart (Ranked + Delta) */}
      <section className={styles.section}>
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
            formatValue={(v) => `${v}%`}
            formatDelta={(d) => `${d > 0 ? '+' : ''}${d} pp`}
            data={[
              { id: 'agro', label: 'Digital agronomy', value: 31, delta: 1, highlighted: true },
              { id: 'hw', label: 'Precision ag hardware', value: 27, delta: 3, highlighted: true },
              { id: 'sense', label: 'Remote sensing', value: 24, delta: 5, highlighted: true },
              { id: 'fms', label: 'Farm management software', value: 24, delta: 3 },
              { id: 'sust', label: 'Sustainability software', value: 7, delta: 1 },
              { id: 'robot', label: 'Automation & robotics', value: 5, delta: -1 },
            ]}
          />
        </ExhibitFrame>
      </section>

      {/* 11. StackedBarChart */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Card}
          exhibitLabel="Chart 11 · StackedBarChart"
          title="Reported AI headcount reductions trailed prior-year executive forecasts by more than half."
          unitLabel="Share of surveyed organizations reporting or expecting workforce impact (%)"
          source="Illustrative State of AI Workforce Survey"
        >
          <StackedBarChart
            style={StackedBarStyle.Proportional}
            ariaLabel="AI workforce impact forecast versus actuals"
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
        </ExhibitFrame>
      </section>

      {/* 12. DumbbellChart */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel="Chart 12 · DumbbellChart"
          title="Despite heavy adoption, younger consumers remain skeptical of social and AI research channels."
          unitLabel="Net trust score for product research channels (positive minus negative)"
          source="Illustrative Consumer Trust & Discovery Benchmark"
        >
          <DumbbellChart
            style={DumbbellStyle.Gap}
            ariaLabel="Consumer net trust by generation"
            startLabel="Baby Boomers"
            endLabel="Gen Z"
            deltaColumnLabel="Gen Z vs. Boomers"
            formatValue={(v) => `${v > 0 ? '+' : ''}${v}`}
            formatDelta={(d) => `${d > 0 ? '+' : ''}${d} pp`}
            data={[
              { id: 'friends', label: 'Friends & family', start: 64, end: 56 },
              { id: 'reviews', label: 'Verified customer reviews', start: 42, end: 31 },
              { id: 'brand', label: 'Brand websites', start: 28, end: 18 },
              { id: 'genai', label: 'Generative AI assistants', start: -24, end: 8 },
              { id: 'social', label: 'Social media influencers', start: -38, end: -14 },
            ]}
          />
        </ExhibitFrame>
      </section>
    </div>
  );
}
