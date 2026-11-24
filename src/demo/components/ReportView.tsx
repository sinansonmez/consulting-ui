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
}

export function ReportView({ onOpenLab }: ReportViewProps) {
  const { brand } = useBrand();
  const brief = BRAND_BRIEFS[brand];

  const [region, setRegion] = useState<RegionKey>('global');
  const [exhibitTab, setExhibitTab] = useState<string>('chart');
  const [sectorQuery, setSectorQuery] = useState<string>('');
  const [downloadNote, setDownloadNote] = useState<string | null>(null);

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
      header: 'Readiness Index',
      align: 'right',
      sortable: true,
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
          <Badge style={BadgeStyle.Positive}>2026 Benchmark</Badge>
        </div>

        <h1 className={styles.headline}>{brief.headline}</h1>
        <p className={styles.deck}>{brief.deck}</p>

        <div className={styles.heroActions}>
          <Button
            style={ButtonStyle.Primary}
            showArrow
            onClick={() =>
              setDownloadNote(
                `Prepared ${brief.shortName} executive briefing summary (${region.toUpperCase()} slice).`,
              )
            }
          >
            Download executive brief
          </Button>
          <Button style={ButtonStyle.Secondary} onClick={onOpenLab}>
            Compare all 3 firms side-by-side
          </Button>
          <Button
            style={ButtonStyle.Editorial}
            onClick={() => setExhibitTab((t) => (t === 'chart' ? 'table' : 'chart'))}
          >
            Jump to {exhibitTab === 'chart' ? 'data matrix' : 'visual exhibit'}
          </Button>
        </div>

        {downloadNote && (
          <p className={styles.actionFeedback} role="status">
            {downloadNote}
          </p>
        )}
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
                  { id: 'chart', label: 'Exhibit Chart' },
                  { id: 'table', label: 'Data Matrix', count: filteredRows.length },
                ]}
              />
            </div>
          }
        >
          {exhibitTab === 'chart' ? (
            <ExhibitChart data={bars} />
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
                  readinessScore: avgReadiness,
                  medianPayback: '—',
                  tier: `${filteredRows.length} sectors`,
                }}
              />
            </div>
          )}
        </ExhibitFrame>
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
    </article>
  );
}
