import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionStyle,
  Badge,
  BadgeStyle,
  Button,
  ButtonStyle,
  Callout,
  CalloutStyle,
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
  MetricCard,
  MetricCardStyle,
  PullQuote,
  PullQuoteStyle,
  Select,
  SelectStyle,
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
import { ExhibitChart } from './ExhibitChart';
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
          <Badge style={BadgeStyle.Positive}>20 Components</Badge>
        </div>

        <h1 className={styles.headline}>{brief.headline}</h1>
        <p className={styles.deck}>{brief.deck}</p>

        <div className={styles.heroActions}>
          <Button style={ButtonStyle.Primary} showArrow onClick={onOpenSimulator}>
            Launch interactive simulator
          </Button>
          <Button style={ButtonStyle.Secondary} onClick={onOpenLab}>
            Compare all 20 side-by-side
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
            <ExhibitChart data={bars} />
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
