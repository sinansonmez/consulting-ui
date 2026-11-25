import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionStyle,
  Badge,
  BadgeStyle,
  BarChart,
  BarChartStyle,
  Button,
  ButtonStyle,
  Callout,
  CalloutStyle,
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
  Input,
  InputStyle,
  InsightCard,
  InsightCardStyle,
  MarimekkoChart,
  MarimekkoStyle,
  MetricCard,
  MetricCardStyle,
  PullQuote,
  PullQuoteStyle,
  SankeyChart,
  SankeyStyle,
  Select,
  SelectStyle,
  StackedBarChart,
  StackedBarStyle,
  Tabs,
  TabsStyle,
  WaterfallChart,
  WaterfallStyle,
  useBrand,
  type DataTableColumn,
  type HarveyBallValue,
} from '../../index';
import {
  BRAND_BRIEFS,
  METHODOLOGY_ITEMS,
  REGION_OPTIONS,
  type RegionKey,
  type SectorMetricRow,
} from '../data/reports';
import styles from './ReportView.module.css';

export interface ReportViewProps {
  onOpenLab: () => void;
  onOpenSimulator: () => void;
}

function toHarveyValue(score: number): HarveyBallValue {
  if (score >= 84) return 100;
  if (score >= 73) return 75;
  if (score >= 64) return 50;
  if (score >= 45) return 25;
  return 0;
}

const RELATED_BRIEFS = [
  {
    id: 'ai-operating-model',
    eyebrow: 'Operating Model',
    meta: 'PDF Brief · 14 min read',
    title: 'Rewiring Decision Rights for Agentic Scale',
    summary:
      'Why top-quartile leadership teams flatten middle-management approval gates before scaling enterprise AI.',
  },
  {
    id: 'capital-allocation',
    eyebrow: 'Corporate Finance',
    meta: 'Interactive Report · 11 min read',
    title: 'Dynamic Capital Allocation in a Higher-Rate Cycle',
    summary:
      'Empirical evidence across 1,200 corporates showing quarterly reallocation outperforms static annual budgets by 190 bps.',
  },
  {
    id: 'commercial-excellence',
    eyebrow: 'Commercial & Pricing',
    meta: 'Executive Deck · 9 min read',
    title: 'Precision Pricing Architecture & Margin Defense',
    summary:
      'Capturing 250–400 bps of pocket-margin expansion through automated deal-desk guardrails.',
  },
] as const;

export function ReportView({ onOpenLab, onOpenSimulator }: ReportViewProps) {
  const { brand } = useBrand();
  const brief = BRAND_BRIEFS[brand];

  const [region, setRegion] = useState<RegionKey>('global');
  const [exhibitTab, setExhibitTab] = useState<string>('chart');
  const [sectorQuery, setSectorQuery] = useState<string>('');
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);

  const metrics = brief.metricsByRegion[region];
  const bars = brief.barsByRegion[region];
  const rows = brief.tableByRegion[region];

  const filteredRows = useMemo(() => {
    const q = sectorQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.sector.toLowerCase().includes(q) ||
        row.tier.toLowerCase().includes(q),
    );
  }, [rows, sectorQuery]);

  const avgAdoption = useMemo(() => {
    if (filteredRows.length === 0) return '—';
    const avg = Math.round(
      filteredRows.reduce((sum, r) => sum + r.adoptionPct, 0) /
        filteredRows.length,
    );
    return `${avg}%`;
  }, [filteredRows]);

  const avgReadiness = useMemo(() => {
    if (filteredRows.length === 0) return '—';
    return Math.round(
      filteredRows.reduce((sum, r) => sum + r.readinessScore, 0) /
        filteredRows.length,
    );
  }, [filteredRows]);

  const activeBrief =
    RELATED_BRIEFS.find((b) => b.id === activeBriefId) ?? null;

  const columns: readonly DataTableColumn<SectorMetricRow>[] = [
    { key: 'sector', header: 'Industry Sector', sortable: true },
    {
      key: 'adoptionPct',
      header: 'Leaders (%)',
      align: 'right',
      sortable: true,
      render: (val) => `${String(val)}%`,
    },
    {
      key: 'ebitdaLift',
      header: 'EBIT / EBITDA Lift',
      align: 'right',
      sortable: true,
    },
    {
      key: 'readinessScore',
      header: 'Maturity',
      align: 'right',
      sortable: true,
      render: (val) => (
        <HarveyBall
          value={toHarveyValue(Number(val))}
          style={HarveyBallStyle.Solid}
          size={ControlSize.Sm}
          label="Sector maturity"
          showValue
        />
      ),
    },
    {
      key: 'medianPayback',
      header: 'Median Payback',
      align: 'right',
      sortable: true,
    },
    {
      key: 'tier',
      header: 'Cohort',
      align: 'right',
      render: (val) => (
        <Badge
          style={
            val === 'Leader'
              ? BadgeStyle.Positive
              : val === 'Scaling'
                ? BadgeStyle.Accent
                : BadgeStyle.Neutral
          }
          size={ControlSize.Sm}
          showDeltaIcon={false}
        >
          {String(val)}
        </Badge>
      ),
    },
  ];

  return (
    <article className={styles.report}>
      {/* Hero Briefing Header */}
      <header className={styles.hero}>
        <div className={styles.tagRow}>
          <Badge style={BadgeStyle.Accent}>{brief.practiceTag}</Badge>
          <Badge style={BadgeStyle.Outline}>{brief.releaseTag}</Badge>
          <Badge style={BadgeStyle.Positive}>26 Components</Badge>
        </div>

        <h1 className={styles.headline}>{brief.headline}</h1>
        <p className={styles.deck}>{brief.deck}</p>

        <div className={styles.heroActions}>
          <Button style={ButtonStyle.Primary} showArrow onClick={onOpenSimulator}>
            Launch interactive simulator
          </Button>
          <Button style={ButtonStyle.Secondary} onClick={onOpenLab}>
            Compare all 26 side-by-side
          </Button>
          <Button
            style={ButtonStyle.Editorial}
            onClick={() =>
              setExhibitTab((t) =>
                t === 'chart' ? 'bridge' : t === 'bridge' ? 'table' : 'chart',
              )
            }
          >
            Cycle exhibit view
          </Button>
        </div>
      </header>

      {/* KPI Metric Strip */}
      <section className={styles.section} aria-label="Headline metrics">
        <div className={styles.kpiGrid}>
          <MetricCard
            style={MetricCardStyle.Hero}
            value={metrics[0].value}
            label={metrics[0].label}
            delta={metrics[0].delta}
            deltaDirection={metrics[0].deltaDirection}
            caption={metrics[0].caption}
            benchmark={metrics[0].benchmark}
          />
          <MetricCard
            style={MetricCardStyle.Split}
            value={metrics[1].value}
            label={metrics[1].label}
            delta={metrics[1].delta}
            deltaDirection={metrics[1].deltaDirection}
            caption={metrics[1].caption}
            benchmark={metrics[1].benchmark}
          />
          <MetricCard
            style={MetricCardStyle.Hero}
            value={metrics[2].value}
            label={metrics[2].label}
            delta={metrics[2].delta}
            deltaDirection={metrics[2].deltaDirection}
            caption={metrics[2].caption}
            benchmark={metrics[2].benchmark}
          />
        </div>
      </section>

      {/* Executive Summary Callout */}
      <section className={styles.section}>
        <Callout
          style={CalloutStyle.Executive}
          eyebrow={brief.takeawayEyebrow}
          title={brief.takeawayTitle}
          footer={`Active design language: ${brief.designSignature}`}
        >
          <ul className={styles.takeawayList}>
            {brief.takeaways.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </Callout>
      </section>

      {/* Interactive Flagship Exhibit */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel={brief.exhibitNumber}
          title={brief.exhibitTitle}
          subtitle={brief.exhibitSubtitle}
          note={brief.exhibitNote}
          source={brief.exhibitSource}
          controls={
            <div className={styles.exhibitControls}>
              <Select
                style={SelectStyle.Underline}
                size={ControlSize.Sm}
                label="Geography"
                options={REGION_OPTIONS}
                value={region}
                onChange={(next) => setRegion(next as RegionKey)}
              />
              <Tabs
                style={TabsStyle.Segmented}
                size={ControlSize.Sm}
                ariaLabel="Exhibit presentation mode"
                value={exhibitTab}
                onChange={setExhibitTab}
                items={[
                  { id: 'chart', label: 'Benchmark Bars' },
                  { id: 'bridge', label: 'Value Bridge' },
                  { id: 'table', label: 'Harvey Matrix', count: filteredRows.length },
                ]}
              />
            </div>
          }
        >
          {exhibitTab === 'chart' ? (
            <BarChart
              style={BarChartStyle.Grouped}
              ariaLabel="Leaders versus sector median benchmark chart"
              deltaColumnLabel="Spread"
              formatValue={(v) => `${v}%`}
              series={[
                { id: 'leaders', label: 'Top-quartile leaders (%)', tone: 'primary' },
                { id: 'median', label: 'Sector median (%)', tone: 'neutral' },
              ]}
              data={bars.map((b) => ({
                id: b.label,
                label: b.label,
                values: [b.leaders, b.median],
                delta: `+${b.leaders - b.median} pp`,
              }))}
            />
          ) : exhibitTab === 'bridge' ? (
            <WaterfallChart
              style={WaterfallStyle.Classic}
              ariaLabel="Regional EBITDA value-creation bridge"
              formatValue={(n) => `${n} bps`}
              steps={[
                { id: 's0', label: 'Baseline Margin', value: 1400, kind: 'start' },
                { id: 's1', label: 'Pricing Discipline', value: 210 },
                { id: 's2', label: 'Workflow AI', value: 280 },
                { id: 's3', label: 'Gross Lift', value: 0, kind: 'subtotal' },
                { id: 's4', label: 'Talent & Cloud', value: -130 },
                { id: 's5', label: 'Net Run-Rate', value: 0, kind: 'total' },
              ]}
            />
          ) : (
            <div className={styles.tableStack}>
              <div className={styles.tableToolbar}>
                <div className={styles.searchWrap}>
                  <Input
                    style={InputStyle.Standard}
                    size={ControlSize.Sm}
                    placeholder="Filter sectors or cohort (e.g. Leader, Tech)..."
                    searchable
                    clearable
                    value={sectorQuery}
                    onChange={setSectorQuery}
                  />
                </div>
                {sectorQuery && (
                  <Button
                    style={ButtonStyle.Quiet}
                    size={ControlSize.Sm}
                    onClick={() => setSectorQuery('')}
                  >
                    Reset filter
                  </Button>
                )}
              </div>

              <DataTable
                style={DataTableStyle.Editorial}
                columns={columns}
                rows={filteredRows}
                summaryRow={{
                  sector: 'Regional Mean (Filtered)',
                  adoptionPct: avgAdoption,
                  ebitdaLift: '—',
                  readinessScore: `${avgReadiness}/100`,
                  medianPayback: '—',
                  tier: `${filteredRows.length} sectors`,
                }}
              />
            </div>
          )}
        </ExhibitFrame>
      </section>

      {/* Editorial Chart Suite Showcase (Wave 1) */}
      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel="Exhibit 2 · Marimekko Composition"
          title="Priority sectors accounted for roughly 40 percent of US construction spend in 2025."
          unitLabel="2025 US construction spend, %"
          footnotes={[
            'Includes electric power generation component of NAICS 2211 (Electric Power Generation, Transmission and Distribution).',
          ]}
          source="Illustrative construction capital-expenditure benchmark modeled on Annual Capital Expenditures Survey & EIA"
          attribution={`${brief.shortName} · Illustrative Exhibit`}
        >
          <MarimekkoChart
            style={MarimekkoStyle.Editorial}
            ariaLabel="2025 US construction spend composition by sector"
            totalCallout={{ label: 'Total', value: '100%' }}
            highlightCallout={{
              label: 'Priority sectors total',
              value: '41.4%',
            }}
            formatValue={(v) => v.toFixed(1)}
            columns={[
              {
                id: 'other',
                label: 'All other construction',
                segments: [
                  {
                    id: 'other-all',
                    label: 'All other construction',
                    value: 58.6,
                    tone: 'neutral',
                  },
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
                  {
                    id: 'gen',
                    label: 'Electricity generation',
                    value: 2.9,
                    tone: 'secondary',
                    footnoteRef: '1',
                  },
                ],
              },
            ]}
          />
        </ExhibitFrame>
      </section>

      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Card}
          exhibitLabel="Exhibit 3 · 100% Stacked Composition"
          title="Reported AI headcount reductions trailed prior-year executive forecasts by more than half."
          unitLabel="Share of surveyed enterprises reporting or expecting workforce impact, %"
          footnotes={[
            'Responses normalized excluding "don’t know" answers across global enterprise survey waves.',
          ]}
          source="Illustrative 2026 State of AI workforce survey synthesis"
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

      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel="Exhibit 4 · Cohort Gap Dumbbell"
          title="Despite heavy adoption, younger consumers remain skeptical of social and AI research channels."
          unitLabel="Net trust score for product research channels (positive minus negative), index points"
          source="Illustrative 2026 Consumer Trust & Discovery benchmark"
        >
          <DumbbellChart
            style={DumbbellStyle.Gap}
            ariaLabel="Net consumer trust by generation"
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

      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Card}
          exhibitLabel="Exhibit 5 · Ranked Horizontal Bar + Delta Column"
          title="Digital agronomy and precision hardware lead field adoption while remote sensing accelerates fastest."
          unitLabel="Global farmers currently using technology, % of respondents"
          source="Illustrative 2026 Global AgTech Adoption benchmark (n = 5,500)"
        >
          <BarChart
            style={BarChartStyle.Ranked}
            ariaLabel="Global agriculture technology adoption and two-year change"
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
              { id: 'elec', label: 'Electrical equipment', value: 4, delta: 'New' },
            ]}
          />
        </ExhibitFrame>
      </section>

      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel="Exhibit 6 · Scaling Attrition Funnel"
          title="Only seven independent beauty brands founded in the past two decades have scaled past $1 billion."
          unitLabel="Number of brands reaching annual retail sales milestone"
          source="Illustrative 2026 Beauty Scaling Funnel benchmark"
        >
          <FunnelChart
            style={FunnelStyle.Tiered}
            ariaLabel="Beauty brand scaling milestones funnel"
            conversionColumnLabel="Of $70M+ cohort"
            formatValue={(v) => `${v} brands`}
            stages={[
              {
                id: 's70',
                label: '$70M+ scale-ups',
                value: 220,
                note: '89 skincare leaders',
                tone: 'neutral',
              },
              {
                id: 's250',
                label: '$250M+ breakout',
                value: 60,
                note: 'Multi-category expansion',
                tone: 'secondary',
              },
              {
                id: 's500',
                label: '$500M+ regional giants',
                value: 19,
                tone: 'tertiary',
              },
              {
                id: 's1b',
                label: '$1B+ global icons',
                value: 7,
                note: '3.2% conversion from $70M',
                tone: 'primary',
              },
            ]}
          />
        </ExhibitFrame>
      </section>

      <section className={styles.section}>
        <ExhibitFrame
          style={ExhibitStyle.Card}
          exhibitLabel="Exhibit 7 · Multi-Stage Budget Flow (Sankey)"
          title="Deliberate modernizers redirect 42 percent of enterprise IT budgets from legacy run into AI and change."
          unitLabel="Annualized enterprise IT spend allocation ($M, n = $100M illustrative baseline)"
          source="Illustrative 2026 Enterprise IT Run-vs-Change budget flow benchmark"
        >
          <SankeyChart
            style={SankeyStyle.Editorial}
            ariaLabel="Enterprise IT budget flow from Run vs Change into IT towers"
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

      {/* Executive Pull Quote */}
      <section className={styles.section}>
        <PullQuote
          style={PullQuoteStyle.Editorial}
          quote="Technology budgets alone explain less than a fifth of performance dispersion; the winners re-architect decision speed, incentives, and frontline workflows simultaneously."
          author="2026 Global Executive Panel"
          role={`${brief.shortName} Benchmark Synthesis`}
          organization="42 Markets · n = 10,400"
        />
      </section>

      {/* Related Publications Grid */}
      <section className={styles.section} aria-labelledby="related-heading">
        <div className={styles.sectionHeader}>
          <h2 id="related-heading" className={styles.sectionTitle}>
            Related 2026 Publications
          </h2>
          <p className={styles.sectionSub}>
            Click any publication card to preview its executive summary sheet.
          </p>
        </div>

        <div className={styles.insightGrid}>
          {RELATED_BRIEFS.map((item, idx) => (
            <InsightCard
              key={item.id}
              style={
                idx === 1 ? InsightCardStyle.Featured : InsightCardStyle.Bordered
              }
              eyebrow={item.eyebrow}
              meta={item.meta}
              title={item.title}
              summary={item.summary}
              ctaLabel="Preview executive brief"
              onAction={() => setActiveBriefId(item.id)}
            />
          ))}
        </div>
      </section>

      {/* Methodology & Footnotes Accordion */}
      <section className={styles.section} aria-labelledby="methodology-heading">
        <div className={styles.sectionHeader}>
          <h2 id="methodology-heading" className={styles.sectionTitle}>
            Methodology &amp; Research Notes
          </h2>
          <p className={styles.sectionSub}>{brief.typographyNote}</p>
        </div>

        <Accordion
          style={AccordionStyle.Bordered}
          defaultExpandedIds={['tokens']}
          allowMultiple
          items={METHODOLOGY_ITEMS.map((item) => ({
            id: item.id,
            title: item.title,
            meta: item.meta,
            content: <p>{item.content}</p>,
          }))}
        />
      </section>

      <Drawer
        open={activeBrief !== null}
        onClose={() => setActiveBriefId(null)}
        style={DrawerStyle.Standard}
        eyebrow={activeBrief?.eyebrow}
        title={activeBrief?.title ?? ''}
        subtitle={activeBrief?.meta}
        footer={
          <Button
            style={ButtonStyle.Primary}
            size={ControlSize.Sm}
            onClick={() => {
              setActiveBriefId(null);
              onOpenSimulator();
            }}
          >
            Model impact in Simulator
          </Button>
        }
      >
        {activeBrief && <p>{activeBrief.summary}</p>}
      </Drawer>
    </article>
  );
}
