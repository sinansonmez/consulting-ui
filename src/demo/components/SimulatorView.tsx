import { useMemo, useState } from 'react';
import {
  BenchmarkBar,
  BenchmarkBarStyle,
  Button,
  ButtonStyle,
  ChevronFlow,
  ChevronFlowStyle,
  ControlSize,
  Drawer,
  DrawerStyle,
  ExhibitFrame,
  ExhibitStyle,
  Matrix2x2,
  MatrixStyle,
  MetricCard,
  MetricCardStyle,
  SegmentedControl,
  SegmentedControlStyle,
  Slider,
  SliderStyle,
  WaterfallChart,
  WaterfallStyle,
  type MatrixItem,
} from '../../index';
import styles from './SimulatorView.module.css';

type ScenarioId = 'conservative' | 'base' | 'upside';

const SCENARIO_MULTIPLIER: Record<ScenarioId, number> = {
  conservative: 0.78,
  base: 1.0,
  upside: 1.26,
};

interface InitiativeDetail extends MatrixItem {
  owner: string;
  payback: string;
  summary: string;
}

const INITIATIVES: readonly InitiativeDetail[] = [
  {
    id: 'claims',
    label: 'Agentic Claims & Ops Triage',
    x: 80,
    y: 84,
    meta: '+$38M',
    highlighted: true,
    owner: 'COO / Shared Services',
    payback: '7.5 months',
    summary:
      'End-to-end straight-through processing across intake, exception routing, and quality assurance.',
  },
  {
    id: 'pricing',
    label: 'Dynamic Deal Desk Pricing',
    x: 74,
    y: 68,
    meta: '+$29M',
    owner: 'Chief Commercial Officer',
    payback: '6.2 months',
    summary:
      'Real-time margin floor guardrails and discount-leakage scoring embedded in quoting workflows.',
  },
  {
    id: 'supply',
    label: 'Autonomous Supply Control Tower',
    x: 34,
    y: 78,
    meta: '+$34M',
    owner: 'VP Global Supply Chain',
    payback: '14.0 months',
    summary:
      'Multi-tier supplier risk sensing and automated inventory rebalancing across regional hubs.',
  },
  {
    id: 'legacy',
    label: 'Back-Office Report Consolidation',
    x: 66,
    y: 28,
    meta: '+$9M',
    owner: 'Finance Operations',
    payback: '9.0 months',
    summary:
      'Retiring manual spreadsheet packs in favor of automated monthly variance narratives.',
  },
];

export interface SimulatorViewProps {
  onOpenLab: () => void;
}

export function SimulatorView({ onOpenLab }: SimulatorViewProps) {
  const [scenario, setScenario] = useState<ScenarioId>('base');
  const [automationPct, setAutomationPct] = useState<number>(62);
  const [enablementPct, setEnablementPct] = useState<number>(55);
  const [drawerItem, setDrawerItem] = useState<InitiativeDetail | null>(null);

  const mult = SCENARIO_MULTIPLIER[scenario];

  const model = useMemo(() => {
    const pricingLift = Math.round((14 + automationPct * 0.24) * mult);
    const opsSavings = Math.round((10 + enablementPct * 0.32) * mult);
    const transitionCost = -Math.round(12 + automationPct * 0.08);
    const sgaEfficiency = Math.round((8 + (automationPct + enablementPct) * 0.14) * mult);
    const netRunRate = 120 + pricingLift + opsSavings + transitionCost + sgaEfficiency;
    const cycleCompression = Math.min(
      95,
      Math.round((automationPct * 0.52 + enablementPct * 0.42) * mult),
    );
    const readinessIndex = Math.min(
      98,
      Math.round(automationPct * 0.45 + enablementPct * 0.55),
    );

    return {
      pricingLift,
      opsSavings,
      transitionCost,
      sgaEfficiency,
      netRunRate,
      cycleCompression,
      readinessIndex,
    };
  }, [automationPct, enablementPct, mult]);

  return (
    <div className={styles.simulator}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>
              Executive Diagnostic &amp; Value-Bridge Simulator
            </h1>
            <p className={styles.deck}>
              Adjust operating-model assumptions with <code>SegmentedControl</code> and{' '}
              <code>Slider</code> to recalculate <code>BenchmarkBar</code> quartiles and the{' '}
              <code>WaterfallChart</code> EBITDA bridge. Click any plotted initiative in{' '}
              <code>Matrix2x2</code> to inspect its phased <code>ChevronFlow</code> inside a{' '}
              <code>Drawer</code>.
            </p>
          </div>
          <Button style={ButtonStyle.Secondary} size={ControlSize.Sm} onClick={onOpenLab}>
            Inspect all 20 in Lab
          </Button>
        </div>
      </header>

      {/* Parameter Control Grid */}
      <section className={styles.gridTwo} aria-label="Scenario controls and benchmark gauges">
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>1. Operating Assumptions</h2>
            <SegmentedControl
              style={SegmentedControlStyle.Filled}
              size={ControlSize.Sm}
              ariaLabel="Macro scenario"
              value={scenario}
              onChange={(v) => setScenario(v as ScenarioId)}
              options={[
                { value: 'conservative', label: 'Conservative' },
                { value: 'base', label: 'Base Case' },
                { value: 'upside', label: 'Upside' },
              ]}
            />
          </div>

          <div className={styles.sliderStack}>
            <Slider
              style={SliderStyle.Stepped}
              label="Core workflow automation coverage"
              min={20}
              max={95}
              step={5}
              value={automationPct}
              onChange={setAutomationPct}
              benchmarkValue={45}
              benchmarkLabel="Sector median: 45%"
              formatValue={(v) => `${v}%`}
            />
            <Slider
              style={SliderStyle.Standard}
              label="Role-specific frontline enablement"
              min={15}
              max={95}
              step={5}
              value={enablementPct}
              onChange={setEnablementPct}
              benchmarkValue={36}
              benchmarkLabel="2026 average: 36%"
              formatValue={(v) => `${v}%`}
            />
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>2. Live Quartile Benchmarks</h2>
          <div className={styles.kpiPair}>
            <MetricCard
              style={MetricCardStyle.Compact}
              value={`$${model.netRunRate}M`}
              label="Projected FY26 Run-Rate EBITDA"
              delta={`+$${model.netRunRate - 120}M net`}
              deltaDirection="up"
            />
            <MetricCard
              style={MetricCardStyle.Compact}
              value={`${model.readinessIndex}/100`}
              label="Execution Readiness Score"
              delta={model.readinessIndex >= 75 ? 'Top Quartile' : 'Scaling'}
            />
          </div>

          <div className={styles.barStack}>
            <BenchmarkBar
              style={BenchmarkBarStyle.Bullet}
              label="Cycle-time compression index"
              value={model.cycleCompression}
              median={42}
              topQuartile={76}
            />
            <BenchmarkBar
              style={BenchmarkBarStyle.Split}
              label="Organizational readiness vs. top-quartile leaders"
              value={model.readinessIndex}
              topQuartile={82}
            />
          </div>
        </div>
      </section>

      {/* Live Waterfall Bridge */}
      <ExhibitFrame
        style={ExhibitStyle.Card}
        exhibitLabel="Exhibit A · Dynamic Value Bridge"
        title={`Simulated transformation roadmap delivers $${model.netRunRate}M run-rate EBITDA (${scenario} case)`}
        subtitle="Annualized EBITDA trajectory ($M), baseline $120M"
        note="Subtotals and closing run-rate pillars recompute automatically from slider parameters."
        source="consulting-ui interactive value-bridge engine"
      >
        <WaterfallChart
          style={WaterfallStyle.Classic}
          ariaLabel="Simulated EBITDA bridge"
          formatValue={(n) => `$${n}M`}
          steps={[
            { id: 'start', label: 'FY24 Baseline', value: 120, kind: 'start' },
            { id: 'price', label: 'Commercial Pricing', value: model.pricingLift },
            { id: 'ops', label: 'Workflow Redesign', value: model.opsSavings },
            { id: 'sub', label: 'Gross Impact', value: 0, kind: 'subtotal' },
            { id: 'inv', label: 'Change & Tech Capex', value: model.transitionCost },
            { id: 'sga', label: 'SG&A Automation', value: model.sgaEfficiency },
            { id: 'end', label: 'FY26 Target', value: 0, kind: 'total' },
          ]}
        />
      </ExhibitFrame>

      {/* Strategic 2x2 Matrix */}
      <ExhibitFrame
        style={ExhibitStyle.Editorial}
        exhibitLabel="Exhibit B · Portfolio Prioritization"
        title="Click any initiative in the 2x2 matrix to open its executive execution drawer"
        subtitle="Implementation feasibility (X) vs. annualized EBITDA impact (Y)"
        source="Illustrative transformation portfolio prioritization"
      >
        <Matrix2x2
          style={MatrixStyle.Quadrant}
          xAxisLabel="Implementation Feasibility"
          yAxisLabel="Annualized EBITDA Impact"
          quadrantLabels={{
            topLeft: '2. Multi-Year Strategic Bets',
            topRight: '1. Priority Value Scalers',
            bottomLeft: '4. Defer / Rationalize',
            bottomRight: '3. Tactical Quick Wins',
          }}
          defaultSelectedId="claims"
          items={INITIATIVES}
          onSelectItem={(item) => {
            const match = INITIATIVES.find((i) => i.id === item.id) ?? null;
            setDrawerItem(match);
          }}
        />
      </ExhibitFrame>

      {/* Phased Transformation Chevron Flow */}
      <section className={styles.roadmapSection}>
        <h2 className={styles.panelTitle}>3. Phased Execution Architecture</h2>
        <ChevronFlow
          style={ChevronFlowStyle.Interlocking}
          steps={[
            {
              id: 'diagnose',
              phase: 'Months 1–2',
              title: 'Zero-Based Diagnostic',
              items: ['Baseline P&L cost cube', 'Prioritize top 5 workflows'],
            },
            {
              id: 'redesign',
              phase: 'Months 3–6',
              title: 'Wave-1 Redesign & Pilot',
              items: ['Deploy agentic triage', 'Retrain frontline pods'],
              active: true,
            },
            {
              id: 'scale',
              phase: 'Months 7–12',
              title: 'Enterprise Scale & Lock-In',
              items: ['Embed KPIs in operating cadence', 'Audit run-rate capture'],
            },
          ]}
        />
      </section>

      {/* Drill-down Drawer */}
      <Drawer
        open={drawerItem !== null}
        onClose={() => setDrawerItem(null)}
        style={DrawerStyle.AccentHeader}
        size={ControlSize.Md}
        eyebrow={drawerItem ? `Payback: ${drawerItem.payback}` : undefined}
        title={drawerItem?.label ?? ''}
        subtitle={drawerItem ? `Executive sponsor: ${drawerItem.owner}` : undefined}
        footer={
          <div className={styles.drawerFooter}>
            <span>Estimated impact: {drawerItem?.meta}</span>
            <Button
              style={ButtonStyle.Primary}
              size={ControlSize.Sm}
              onClick={() => setDrawerItem(null)}
            >
              Done
            </Button>
          </div>
        }
      >
        {drawerItem && (
          <div className={styles.drawerStack}>
            <p>{drawerItem.summary}</p>
            <BenchmarkBar
              style={BenchmarkBarStyle.Bullet}
              label="Feasibility score"
              value={drawerItem.x}
              median={50}
              topQuartile={75}
            />
            <ChevronFlow
              style={ChevronFlowStyle.Minimal}
              steps={[
                { id: 's1', phase: 'Weeks 1–3', title: 'Scope & Data Readiness' },
                { id: 's2', phase: 'Weeks 4–8', title: 'Workflow Cutover', active: true },
                { id: 's3', phase: 'Weeks 9–12', title: 'P&L Sign-Off' },
              ]}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}
