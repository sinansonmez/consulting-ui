import { Brand } from '../../index';
import type { DataTableRow } from '../../index';

export type RegionKey = 'global' | 'na' | 'emea' | 'apac';

export interface SectorMetricRow extends DataTableRow {
  sector: string;
  adoptionPct: number;
  ebitdaLift: string;
  readinessScore: number;
  medianPayback: string;
  tier: 'Leader' | 'Scaling' | 'Emerging';
}

export interface ExhibitBarDatum {
  label: string;
  leaders: number;
  median: number;
}

export interface BrandReportBrief {
  firmName: string;
  shortName: string;
  designSignature: string;
  typographyNote: string;
  practiceTag: string;
  releaseTag: string;
  headline: string;
  deck: string;
  takeawayEyebrow: string;
  takeawayTitle: string;
  takeaways: readonly string[];
  exhibitNumber: string;
  exhibitTitle: string;
  exhibitSubtitle: string;
  exhibitNote: string;
  exhibitSource: string;
  metricsByRegion: Record<
    RegionKey,
    readonly [
      { value: string; label: string; delta: string; deltaDirection: 'up' | 'down'; caption: string; benchmark: string },
      { value: string; label: string; delta: string; deltaDirection: 'up' | 'down'; caption: string; benchmark: string },
      { value: string; label: string; delta: string; deltaDirection: 'up' | 'down'; caption: string; benchmark: string },
    ]
  >;
  barsByRegion: Record<RegionKey, readonly ExhibitBarDatum[]>;
  tableByRegion: Record<RegionKey, readonly SectorMetricRow[]>;
}

export const REGION_OPTIONS = [
  { value: 'global', label: 'Global Composite', meta: 'n = 10,400 executives' },
  { value: 'na', label: 'North America', meta: 'n = 3,850 executives' },
  { value: 'emea', label: 'Europe & Middle East', meta: 'n = 3,620 executives' },
  { value: 'apac', label: 'Asia-Pacific', meta: 'n = 2,930 executives' },
] as const;

export const BRAND_BRIEFS: Record<Brand, BrandReportBrief> = {
  [Brand.McKinsey]: {
    firmName: 'McKinsey & Company',
    shortName: 'McKinsey',
    designSignature: '0px architectural corners · Midnight Navy (#051C2C) & Electric Blue (#2251FF)',
    typographyNote: 'Bower / Newsreader display serif + McKinsey Sans / Plus Jakarta Sans UI',
    practiceTag: 'People & Organizational Performance',
    releaseTag: '2026 Flagship Brief',
    headline: 'The State of Organizations 2026: From perpetual disruption to structural speed',
    deck: 'Across 10,400 senior leaders surveyed in 2026, organizations that pair flat decision architecture with embedded AI workflows capture 2.4x higher productivity gains than peers still running isolated pilots.',
    takeawayEyebrow: 'Executive Summary',
    takeawayTitle: 'Three structural shifts separate top-quartile performers from stalled transformations',
    takeaways: [
      '72% of leadership teams report feeling underprepared for operating-model disruption despite sustained technology budgets.',
      'Rewiring core P&L workflows delivers 3.1x greater margin expansion than adding standalone productivity copilots.',
      'Organizations that compress middle-layer sign-off loops cut product-to-market cycle times by 34% within 12 months.',
    ],
    exhibitNumber: 'Exhibit 1',
    exhibitTitle: 'Top-quartile organizations outpace sector medians by 28–39 percentage points in scaled AI workflow redesign',
    exhibitSubtitle: '% of respondents reporting measurable EBIT impact from redesigned core workflows, by sector',
    exhibitNote: 'Figures reflect weighted executive responses across enterprises with >$500M annual revenue. Leaders represent top-quartile ROIC cohort.',
    exhibitSource: 'Illustrative 2026 organizational benchmark dataset styled after McKinsey digital exhibits',
    metricsByRegion: {
      global: [
        { value: '72%', label: 'Feel underprepared for disruption', delta: '+6 pp YoY', deltaDirection: 'up', caption: 'Leadership teams citing operating-model drag as their primary bottleneck.', benchmark: '2024 baseline: 66%' },
        { value: '2.4x', label: 'Top-quartile productivity lead', delta: '+0.5x', deltaDirection: 'up', caption: 'Output-per-FTE advantage among enterprises with redesigned decision rights.', benchmark: 'Median cohort: 1.0x' },
        { value: '11.4 mo', label: 'Median transformation payback', delta: '-3.2 mo', deltaDirection: 'down', caption: 'Time from workflow redesign kickoff to audited EBITDA breakeven.', benchmark: '2024 median: 14.6 mo' },
      ],
      na: [
        { value: '68%', label: 'Feel underprepared for disruption', delta: '+4 pp YoY', deltaDirection: 'up', caption: 'North American enterprises report faster pilot-to-production handoffs.', benchmark: 'Global composite: 72%' },
        { value: '2.7x', label: 'Top-quartile productivity lead', delta: '+0.6x', deltaDirection: 'up', caption: 'Driven by software, financial services, and commercial healthcare leaders.', benchmark: 'Global composite: 2.4x' },
        { value: '9.8 mo', label: 'Median transformation payback', delta: '-4.1 mo', deltaDirection: 'down', caption: 'Fastest payback period across all surveyed regions in 2026.', benchmark: 'Global composite: 11.4 mo' },
      ],
      emea: [
        { value: '76%', label: 'Feel underprepared for disruption', delta: '+8 pp YoY', deltaDirection: 'up', caption: 'Regulatory harmonization and energy-transition capex heighten complexity.', benchmark: 'Global composite: 72%' },
        { value: '2.1x', label: 'Top-quartile productivity lead', delta: '+0.3x', deltaDirection: 'up', caption: 'Industrial champions lead in supply-chain and plant-floor redesign.', benchmark: 'Global composite: 2.4x' },
        { value: '12.9 mo', label: 'Median transformation payback', delta: '-2.1 mo', deltaDirection: 'down', caption: 'Longer governance gates offset by higher multi-year retention.', benchmark: 'Global composite: 11.4 mo' },
      ],
      apac: [
        { value: '71%', label: 'Feel underprepared for disruption', delta: '+5 pp YoY', deltaDirection: 'up', caption: 'Rapid digital commerce adoption pushes structural reskilling to the top.', benchmark: 'Global composite: 72%' },
        { value: '2.5x', label: 'Top-quartile productivity lead', delta: '+0.5x', deltaDirection: 'up', caption: 'Strongest acceleration in automated customer operations and logistics.', benchmark: 'Global composite: 2.4x' },
        { value: '10.6 mo', label: 'Median transformation payback', delta: '-3.6 mo', deltaDirection: 'down', caption: 'Compressed rollout cycles across mobile-first operating models.', benchmark: 'Global composite: 11.4 mo' },
      ],
    },
    barsByRegion: {
      global: [
        { label: 'Technology & Telecom', leaders: 81, median: 44 },
        { label: 'Financial Services', leaders: 76, median: 42 },
        { label: 'Advanced Industrials', leaders: 68, median: 35 },
        { label: 'Healthcare & Life Sciences', leaders: 64, median: 33 },
        { label: 'Consumer & Retail', leaders: 61, median: 31 },
      ],
      na: [
        { label: 'Technology & Telecom', leaders: 86, median: 49 },
        { label: 'Financial Services', leaders: 80, median: 46 },
        { label: 'Advanced Industrials', leaders: 70, median: 36 },
        { label: 'Healthcare & Life Sciences', leaders: 69, median: 38 },
        { label: 'Consumer & Retail', leaders: 65, median: 34 },
      ],
      emea: [
        { label: 'Technology & Telecom', leaders: 75, median: 40 },
        { label: 'Financial Services', leaders: 72, median: 39 },
        { label: 'Advanced Industrials', leaders: 73, median: 38 },
        { label: 'Healthcare & Life Sciences', leaders: 60, median: 30 },
        { label: 'Consumer & Retail', leaders: 57, median: 28 },
      ],
      apac: [
        { label: 'Technology & Telecom', leaders: 83, median: 46 },
        { label: 'Financial Services', leaders: 77, median: 43 },
        { label: 'Advanced Industrials', leaders: 67, median: 34 },
        { label: 'Healthcare & Life Sciences', leaders: 62, median: 31 },
        { label: 'Consumer & Retail', leaders: 66, median: 35 },
      ],
    },
    tableByRegion: {
      global: [
        { id: 'tech', sector: 'Technology & Telecom', adoptionPct: 81, ebitdaLift: '+4.8%', readinessScore: 84, medianPayback: '8.5 mo', tier: 'Leader', highlighted: true },
        { id: 'fin', sector: 'Financial Services', adoptionPct: 76, ebitdaLift: '+3.9%', readinessScore: 79, medianPayback: '10.2 mo', tier: 'Leader' },
        { id: 'ind', sector: 'Advanced Industrials', adoptionPct: 68, ebitdaLift: '+3.2%', readinessScore: 71, medianPayback: '12.1 mo', tier: 'Scaling' },
        { id: 'hc', sector: 'Healthcare & Life Sciences', adoptionPct: 64, ebitdaLift: '+2.7%', readinessScore: 66, medianPayback: '13.4 mo', tier: 'Scaling' },
        { id: 'ret', sector: 'Consumer & Retail', adoptionPct: 61, ebitdaLift: '+2.3%', readinessScore: 62, medianPayback: '14.0 mo', tier: 'Emerging' },
      ],
      na: [
        { id: 'tech', sector: 'Technology & Telecom', adoptionPct: 86, ebitdaLift: '+5.4%', readinessScore: 88, medianPayback: '7.4 mo', tier: 'Leader', highlighted: true },
        { id: 'fin', sector: 'Financial Services', adoptionPct: 80, ebitdaLift: '+4.3%', readinessScore: 82, medianPayback: '9.1 mo', tier: 'Leader' },
        { id: 'ind', sector: 'Advanced Industrials', adoptionPct: 70, ebitdaLift: '+3.4%', readinessScore: 73, medianPayback: '11.2 mo', tier: 'Scaling' },
        { id: 'hc', sector: 'Healthcare & Life Sciences', adoptionPct: 69, ebitdaLift: '+3.1%', readinessScore: 70, medianPayback: '11.8 mo', tier: 'Scaling' },
        { id: 'ret', sector: 'Consumer & Retail', adoptionPct: 65, ebitdaLift: '+2.6%', readinessScore: 66, medianPayback: '12.6 mo', tier: 'Emerging' },
      ],
      emea: [
        { id: 'tech', sector: 'Technology & Telecom', adoptionPct: 75, ebitdaLift: '+4.1%', readinessScore: 78, medianPayback: '9.8 mo', tier: 'Leader', highlighted: true },
        { id: 'ind', sector: 'Advanced Industrials', adoptionPct: 73, ebitdaLift: '+3.7%', readinessScore: 76, medianPayback: '11.4 mo', tier: 'Leader' },
        { id: 'fin', sector: 'Financial Services', adoptionPct: 72, ebitdaLift: '+3.4%', readinessScore: 75, medianPayback: '11.9 mo', tier: 'Scaling' },
        { id: 'hc', sector: 'Healthcare & Life Sciences', adoptionPct: 60, ebitdaLift: '+2.4%', readinessScore: 63, medianPayback: '14.5 mo', tier: 'Scaling' },
        { id: 'ret', sector: 'Consumer & Retail', adoptionPct: 57, ebitdaLift: '+2.0%', readinessScore: 59, medianPayback: '15.2 mo', tier: 'Emerging' },
      ],
      apac: [
        { id: 'tech', sector: 'Technology & Telecom', adoptionPct: 83, ebitdaLift: '+5.0%', readinessScore: 85, medianPayback: '8.1 mo', tier: 'Leader', highlighted: true },
        { id: 'fin', sector: 'Financial Services', adoptionPct: 77, ebitdaLift: '+4.1%', readinessScore: 80, medianPayback: '9.6 mo', tier: 'Leader' },
        { id: 'ret', sector: 'Consumer & Retail', adoptionPct: 66, ebitdaLift: '+2.9%', readinessScore: 69, medianPayback: '11.5 mo', tier: 'Scaling' },
        { id: 'ind', sector: 'Advanced Industrials', adoptionPct: 67, ebitdaLift: '+3.1%', readinessScore: 70, medianPayback: '12.0 mo', tier: 'Scaling' },
        { id: 'hc', sector: 'Healthcare & Life Sciences', adoptionPct: 62, ebitdaLift: '+2.5%', readinessScore: 64, medianPayback: '13.2 mo', tier: 'Emerging' },
      ],
    },
  },

  [Brand.BCG]: {
    firmName: 'Boston Consulting Group',
    shortName: 'BCG',
    designSignature: 'Pill controls (9999px) & 10px modular cards · Deep Emerald (#147B58) & Signal Green (#29BA74)',
    typographyNote: 'Henderson BCG Sans / DM Sans geometric display & UI + Fraunces accents',
    practiceTag: 'BCG X · AI & Operating Models',
    releaseTag: 'AI at Work 2026',
    headline: 'AI at Work 2026: Strategy matters more than tools as frontline adoption hits 74%',
    deck: 'Frontline usage of generative and agentic AI surged across global enterprises, yet only 36% of employees report receiving structured workflow training—opening a decisive gap between AI leaders and laggards.',
    takeawayEyebrow: 'Key Takeaways',
    takeawayTitle: 'Closing the 38-point training gap unlocks durable change-the-business value',
    takeaways: [
      '74% of frontline employees now use AI tools weekly, up 21 percentage points over 2025.',
      'Only 36% have received formal role-specific enablement, stalling cross-functional value capture.',
      'Companies investing 70% of transformation effort in people and process realize 1.9x higher revenue growth.',
    ],
    exhibitNumber: 'Exhibit 1',
    exhibitTitle: 'AI leaders embed role-specific enablement at nearly twice the rate of median peers',
    exhibitSubtitle: '% of workforce actively applying redesigned AI workflows weekly, leaders vs. sector median',
    exhibitNote: 'BCG 10-20-70 maturity benchmark across global enterprises (10% algorithms, 20% tech/data, 70% people & processes).',
    exhibitSource: 'Illustrative 2026 workforce enablement benchmark styled after BCG interactive exhibits',
    metricsByRegion: {
      global: [
        { value: '74%', label: 'Frontline weekly AI adoption', delta: '+21 pp YoY', deltaDirection: 'up', caption: 'Share of knowledge and operations staff integrating AI into daily tasks.', benchmark: '2025 survey: 53%' },
        { value: '36%', label: 'Trained on redesigned workflows', delta: '+9 pp YoY', deltaDirection: 'up', caption: 'Employees who received structured hands-on enablement beyond tool access.', benchmark: 'Leaders cohort: 69%' },
        { value: '5.4 hrs', label: 'Weekly capacity reinvested', delta: '+1.8 hrs', deltaDirection: 'up', caption: 'Average weekly time saved and redeployed toward client & strategic work.', benchmark: 'Median laggard: 1.9 hrs' },
      ],
      na: [
        { value: '79%', label: 'Frontline weekly AI adoption', delta: '+23 pp YoY', deltaDirection: 'up', caption: 'Highest penetration across software, banking, and commercial teams.', benchmark: 'Global composite: 74%' },
        { value: '41%', label: 'Trained on redesigned workflows', delta: '+11 pp YoY', deltaDirection: 'up', caption: 'Stronger executive sponsorship for dedicated enablement academies.', benchmark: 'Global composite: 36%' },
        { value: '6.1 hrs', label: 'Weekly capacity reinvested', delta: '+2.1 hrs', deltaDirection: 'up', caption: 'Highest measurable redeployment into higher-margin client work.', benchmark: 'Global composite: 5.4 hrs' },
      ],
      emea: [
        { value: '69%', label: 'Frontline weekly AI adoption', delta: '+18 pp YoY', deltaDirection: 'up', caption: 'Strong governance-first rollouts across EU regulated sectors.', benchmark: 'Global composite: 74%' },
        { value: '34%', label: 'Trained on redesigned workflows', delta: '+8 pp YoY', deltaDirection: 'up', caption: 'Works-council alignment slows initial launch but raises compliance.', benchmark: 'Global composite: 36%' },
        { value: '4.8 hrs', label: 'Weekly capacity reinvested', delta: '+1.5 hrs', deltaDirection: 'up', caption: 'Concentrated in engineering documentation and risk analytics.', benchmark: 'Global composite: 5.4 hrs' },
      ],
      apac: [
        { value: '78%', label: 'Frontline weekly AI adoption', delta: '+24 pp YoY', deltaDirection: 'up', caption: 'Fastest bottom-up experimentation among managers and specialists.', benchmark: 'Global composite: 74%' },
        { value: '38%', label: 'Trained on redesigned workflows', delta: '+10 pp YoY', deltaDirection: 'up', caption: 'Expanding rapidly across digital banking and e-commerce players.', benchmark: 'Global composite: 36%' },
        { value: '5.7 hrs', label: 'Weekly capacity reinvested', delta: '+2.0 hrs', deltaDirection: 'up', caption: 'Driven by multilingual customer operations and supply planning.', benchmark: 'Global composite: 5.4 hrs' },
      ],
    },
    barsByRegion: {
      global: [
        { label: 'Corporate & Investment Banking', leaders: 84, median: 47 },
        { label: 'Software & Cloud Platforms', leaders: 88, median: 52 },
        { label: 'Biopharma & Medtech', leaders: 71, median: 38 },
        { label: 'Energy & Climate Tech', leaders: 66, median: 34 },
        { label: 'Consumer Packaged Goods', leaders: 63, median: 32 },
      ],
      na: [
        { label: 'Corporate & Investment Banking', leaders: 88, median: 51 },
        { label: 'Software & Cloud Platforms', leaders: 91, median: 57 },
        { label: 'Biopharma & Medtech', leaders: 75, median: 41 },
        { label: 'Energy & Climate Tech', leaders: 68, median: 36 },
        { label: 'Consumer Packaged Goods', leaders: 67, median: 35 },
      ],
      emea: [
        { label: 'Corporate & Investment Banking', leaders: 80, median: 44 },
        { label: 'Software & Cloud Platforms', leaders: 83, median: 48 },
        { label: 'Biopharma & Medtech', leaders: 69, median: 36 },
        { label: 'Energy & Climate Tech', leaders: 71, median: 39 },
        { label: 'Consumer Packaged Goods', leaders: 59, median: 29 },
      ],
      apac: [
        { label: 'Corporate & Investment Banking', leaders: 85, median: 49 },
        { label: 'Software & Cloud Platforms', leaders: 89, median: 54 },
        { label: 'Biopharma & Medtech', leaders: 68, median: 36 },
        { label: 'Energy & Climate Tech', leaders: 64, median: 33 },
        { label: 'Consumer Packaged Goods', leaders: 66, median: 35 },
      ],
    },
    tableByRegion: {
      global: [
        { id: 'sw', sector: 'Software & Cloud Platforms', adoptionPct: 88, ebitdaLift: '+5.1%', readinessScore: 86, medianPayback: '7.8 mo', tier: 'Leader', highlighted: true },
        { id: 'cib', sector: 'Corporate & Investment Banking', adoptionPct: 84, ebitdaLift: '+4.4%', readinessScore: 81, medianPayback: '9.4 mo', tier: 'Leader' },
        { id: 'bio', sector: 'Biopharma & Medtech', adoptionPct: 71, ebitdaLift: '+3.1%', readinessScore: 70, medianPayback: '12.6 mo', tier: 'Scaling' },
        { id: 'en', sector: 'Energy & Climate Tech', adoptionPct: 66, ebitdaLift: '+2.8%', readinessScore: 67, medianPayback: '13.1 mo', tier: 'Scaling' },
        { id: 'cpg', sector: 'Consumer Packaged Goods', adoptionPct: 63, ebitdaLift: '+2.4%', readinessScore: 64, medianPayback: '13.8 mo', tier: 'Emerging' },
      ],
      na: [
        { id: 'sw', sector: 'Software & Cloud Platforms', adoptionPct: 91, ebitdaLift: '+5.6%', readinessScore: 89, medianPayback: '6.9 mo', tier: 'Leader', highlighted: true },
        { id: 'cib', sector: 'Corporate & Investment Banking', adoptionPct: 88, ebitdaLift: '+4.8%', readinessScore: 85, medianPayback: '8.7 mo', tier: 'Leader' },
        { id: 'bio', sector: 'Biopharma & Medtech', adoptionPct: 75, ebitdaLift: '+3.4%', readinessScore: 73, medianPayback: '11.4 mo', tier: 'Scaling' },
        { id: 'en', sector: 'Energy & Climate Tech', adoptionPct: 68, ebitdaLift: '+3.0%', readinessScore: 69, medianPayback: '12.2 mo', tier: 'Scaling' },
        { id: 'cpg', sector: 'Consumer Packaged Goods', adoptionPct: 67, ebitdaLift: '+2.7%', readinessScore: 67, medianPayback: '12.7 mo', tier: 'Emerging' },
      ],
      emea: [
        { id: 'sw', sector: 'Software & Cloud Platforms', adoptionPct: 83, ebitdaLift: '+4.5%', readinessScore: 81, medianPayback: '8.9 mo', tier: 'Leader', highlighted: true },
        { id: 'cib', sector: 'Corporate & Investment Banking', adoptionPct: 80, ebitdaLift: '+3.9%', readinessScore: 78, medianPayback: '10.6 mo', tier: 'Leader' },
        { id: 'en', sector: 'Energy & Climate Tech', adoptionPct: 71, ebitdaLift: '+3.3%', readinessScore: 72, medianPayback: '12.0 mo', tier: 'Scaling' },
        { id: 'bio', sector: 'Biopharma & Medtech', adoptionPct: 69, ebitdaLift: '+2.9%', readinessScore: 68, medianPayback: '13.4 mo', tier: 'Scaling' },
        { id: 'cpg', sector: 'Consumer Packaged Goods', adoptionPct: 59, ebitdaLift: '+2.1%', readinessScore: 61, medianPayback: '14.6 mo', tier: 'Emerging' },
      ],
      apac: [
        { id: 'sw', sector: 'Software & Cloud Platforms', adoptionPct: 89, ebitdaLift: '+5.2%', readinessScore: 87, medianPayback: '7.4 mo', tier: 'Leader', highlighted: true },
        { id: 'cib', sector: 'Corporate & Investment Banking', adoptionPct: 85, ebitdaLift: '+4.5%', readinessScore: 82, medianPayback: '9.0 mo', tier: 'Leader' },
        { id: 'bio', sector: 'Biopharma & Medtech', adoptionPct: 68, ebitdaLift: '+2.9%', readinessScore: 68, medianPayback: '12.9 mo', tier: 'Scaling' },
        { id: 'cpg', sector: 'Consumer Packaged Goods', adoptionPct: 66, ebitdaLift: '+2.8%', readinessScore: 67, medianPayback: '12.5 mo', tier: 'Scaling' },
        { id: 'en', sector: 'Energy & Climate Tech', adoptionPct: 64, ebitdaLift: '+2.5%', readinessScore: 65, medianPayback: '13.7 mo', tier: 'Emerging' },
      ],
    },
  },

  [Brand.Bain]: {
    firmName: 'Bain & Company',
    shortName: 'Bain',
    designSignature: '2px financial precision · Crimson Red (#CC0000), Charcoal (#222222) & crimson rules',
    typographyNote: 'Tiempos / Source Serif 4 financial display + Graphik / Public Sans tabular UI',
    practiceTag: 'Global Private Equity & M&A',
    releaseTag: 'Global PE Report 2026',
    headline: 'Global Private Equity Report 2026: 12 is the new 5 in value creation',
    deck: 'With interest rates normalized and multiple expansion no longer carrying returns, general partners need roughly 12% annual EBITDA growth—not the historical 5%—to clear target buyout hurdles.',
    takeawayEyebrow: 'At a Glance',
    takeawayTitle: 'Operational EBITDA acceleration replaces financial engineering as the decisive alpha engine',
    takeaways: [
      'Exit value rebounded 26% year-over-year, yet aging inventory leaves $3.1T in unrealized buyout assets seeking liquidity.',
      'Top-decile sponsors deploy AI-assisted commercial diligence before signing to compress Day-1 value-creation plans.',
      'Portfolio companies achieving 12%+ EBITDA CAGR pair pricing discipline with rapid SG&A automation inside 18 months.',
    ],
    exhibitNumber: 'Exhibit 1',
    exhibitTitle: 'Top-quartile buyout sponsors generate nearly 2x higher operational EBITDA contribution across sectors',
    exhibitSubtitle: '% of total exit value creation attributable to organic EBITDA expansion vs. sector median',
    exhibitNote: 'Analysis covers realized control buyouts ($250M+ EV) exited between 2022 and Q3 2026. Excludes venture and distressed turnarounds.',
    exhibitSource: 'Illustrative 2026 private equity value-creation dataset styled after Bain financial exhibits',
    metricsByRegion: {
      global: [
        { value: '12.1%', label: 'Target annual EBITDA CAGR', delta: '+7.1 pp vs 2019', deltaDirection: 'up', caption: 'Required operational growth to sustain 2.5x MOIC without multiple tailwinds.', benchmark: 'Historical norm: 5.0%' },
        { value: '$3.1T', label: 'Unrealized buyout inventory', delta: '+8% YoY', deltaDirection: 'up', caption: 'Capital held in portfolio companies aged four years or longer.', benchmark: 'Avg hold period: 5.8 yrs' },
        { value: '+26%', label: 'Sponsor exit value rebound', delta: '+14 pp QoQ', deltaDirection: 'up', caption: 'Strategic corporate buyers and continuation funds drive liquidity.', benchmark: '2024 trough: -18%' },
      ],
      na: [
        { value: '12.6%', label: 'Target annual EBITDA CAGR', delta: '+7.6 pp vs 2019', deltaDirection: 'up', caption: 'Higher base financing rates raise the bar on operating leverage.', benchmark: 'Global composite: 12.1%' },
        { value: '$1.7T', label: 'Unrealized buyout inventory', delta: '+6% YoY', deltaDirection: 'up', caption: 'Concentrated in 2020–2021 software and healthcare buyouts.', benchmark: 'Avg hold period: 5.6 yrs' },
        { value: '+31%', label: 'Sponsor exit value rebound', delta: '+17 pp QoQ', deltaDirection: 'up', caption: 'IPO window reopening plus active strategic M&A in software.', benchmark: 'Global composite: +26%' },
      ],
      emea: [
        { value: '11.4%', label: 'Target annual EBITDA CAGR', delta: '+6.4 pp vs 2019', deltaDirection: 'up', caption: 'Cross-border carve-outs and industrial buy-and-build lead alpha.', benchmark: 'Global composite: 12.1%' },
        { value: '$0.9T', label: 'Unrealized buyout inventory', delta: '+10% YoY', deltaDirection: 'up', caption: 'Mid-market continuation vehicles absorb top-performing assets.', benchmark: 'Avg hold period: 6.1 yrs' },
        { value: '+21%', label: 'Sponsor exit value rebound', delta: '+11 pp QoQ', deltaDirection: 'up', caption: 'Steady sponsor-to-sponsor activity in business services.', benchmark: 'Global composite: +26%' },
      ],
      apac: [
        { value: '11.9%', label: 'Target annual EBITDA CAGR', delta: '+6.9 pp vs 2019', deltaDirection: 'up', caption: 'Japan corporate carve-outs and India growth buyouts lead volume.', benchmark: 'Global composite: 12.1%' },
        { value: '$0.5T', label: 'Unrealized buyout inventory', delta: '+7% YoY', deltaDirection: 'up', caption: 'Faster domestic public-market exits keep hold durations tighter.', benchmark: 'Avg hold period: 5.3 yrs' },
        { value: '+24%', label: 'Sponsor exit value rebound', delta: '+13 pp QoQ', deltaDirection: 'up', caption: 'Strong secondary momentum across Japan and Southeast Asia.', benchmark: 'Global composite: +26%' },
      ],
    },
    barsByRegion: {
      global: [
        { label: 'B2B Enterprise Software', leaders: 78, median: 43 },
        { label: 'Healthcare Providers & IT', leaders: 72, median: 39 },
        { label: 'Industrial Tech & Automation', leaders: 70, median: 37 },
        { label: 'Business & Financial Services', leaders: 66, median: 35 },
        { label: 'Consumer & Multi-Site Retail', leaders: 58, median: 29 },
      ],
      na: [
        { label: 'B2B Enterprise Software', leaders: 82, median: 47 },
        { label: 'Healthcare Providers & IT', leaders: 76, median: 42 },
        { label: 'Industrial Tech & Automation', leaders: 72, median: 38 },
        { label: 'Business & Financial Services', leaders: 69, median: 37 },
        { label: 'Consumer & Multi-Site Retail', leaders: 61, median: 31 },
      ],
      emea: [
        { label: 'B2B Enterprise Software', leaders: 74, median: 40 },
        { label: 'Healthcare Providers & IT', leaders: 68, median: 36 },
        { label: 'Industrial Tech & Automation', leaders: 73, median: 40 },
        { label: 'Business & Financial Services', leaders: 65, median: 34 },
        { label: 'Consumer & Multi-Site Retail', leaders: 55, median: 27 },
      ],
      apac: [
        { label: 'B2B Enterprise Software', leaders: 76, median: 42 },
        { label: 'Healthcare Providers & IT', leaders: 71, median: 38 },
        { label: 'Industrial Tech & Automation', leaders: 69, median: 36 },
        { label: 'Business & Financial Services', leaders: 64, median: 33 },
        { label: 'Consumer & Multi-Site Retail', leaders: 60, median: 31 },
      ],
    },
    tableByRegion: {
      global: [
        { id: 'b2b', sector: 'B2B Enterprise Software', adoptionPct: 78, ebitdaLift: '+14.2%', readinessScore: 86, medianPayback: '11.0 mo', tier: 'Leader', highlighted: true },
        { id: 'hc', sector: 'Healthcare Providers & IT', adoptionPct: 72, ebitdaLift: '+12.4%', readinessScore: 79, medianPayback: '13.2 mo', tier: 'Leader' },
        { id: 'ind', sector: 'Industrial Tech & Automation', adoptionPct: 70, ebitdaLift: '+11.8%', readinessScore: 76, medianPayback: '14.1 mo', tier: 'Scaling' },
        { id: 'biz', sector: 'Business & Financial Services', adoptionPct: 66, ebitdaLift: '+10.6%', readinessScore: 72, medianPayback: '14.8 mo', tier: 'Scaling' },
        { id: 'con', sector: 'Consumer & Multi-Site Retail', adoptionPct: 58, ebitdaLift: '+8.4%', readinessScore: 63, medianPayback: '16.5 mo', tier: 'Emerging' },
      ],
      na: [
        { id: 'b2b', sector: 'B2B Enterprise Software', adoptionPct: 82, ebitdaLift: '+15.1%', readinessScore: 89, medianPayback: '10.2 mo', tier: 'Leader', highlighted: true },
        { id: 'hc', sector: 'Healthcare Providers & IT', adoptionPct: 76, ebitdaLift: '+13.0%', readinessScore: 82, medianPayback: '12.4 mo', tier: 'Leader' },
        { id: 'ind', sector: 'Industrial Tech & Automation', adoptionPct: 72, ebitdaLift: '+12.1%', readinessScore: 78, medianPayback: '13.5 mo', tier: 'Scaling' },
        { id: 'biz', sector: 'Business & Financial Services', adoptionPct: 69, ebitdaLift: '+11.2%', readinessScore: 74, medianPayback: '14.0 mo', tier: 'Scaling' },
        { id: 'con', sector: 'Consumer & Multi-Site Retail', adoptionPct: 61, ebitdaLift: '+8.9%', readinessScore: 66, medianPayback: '15.8 mo', tier: 'Emerging' },
      ],
      emea: [
        { id: 'b2b', sector: 'B2B Enterprise Software', adoptionPct: 74, ebitdaLift: '+13.1%', readinessScore: 82, medianPayback: '12.0 mo', tier: 'Leader', highlighted: true },
        { id: 'ind', sector: 'Industrial Tech & Automation', adoptionPct: 73, ebitdaLift: '+12.6%', readinessScore: 80, medianPayback: '12.9 mo', tier: 'Leader' },
        { id: 'hc', sector: 'Healthcare Providers & IT', adoptionPct: 68, ebitdaLift: '+11.5%', readinessScore: 75, medianPayback: '14.2 mo', tier: 'Scaling' },
        { id: 'biz', sector: 'Business & Financial Services', adoptionPct: 65, ebitdaLift: '+10.2%', readinessScore: 71, medianPayback: '15.1 mo', tier: 'Scaling' },
        { id: 'con', sector: 'Consumer & Multi-Site Retail', adoptionPct: 55, ebitdaLift: '+7.8%', readinessScore: 60, medianPayback: '17.2 mo', tier: 'Emerging' },
      ],
      apac: [
        { id: 'b2b', sector: 'B2B Enterprise Software', adoptionPct: 76, ebitdaLift: '+13.8%', readinessScore: 84, medianPayback: '11.2 mo', tier: 'Leader', highlighted: true },
        { id: 'hc', sector: 'Healthcare Providers & IT', adoptionPct: 71, ebitdaLift: '+12.0%', readinessScore: 77, medianPayback: '13.0 mo', tier: 'Leader' },
        { id: 'ind', sector: 'Industrial Tech & Automation', adoptionPct: 69, ebitdaLift: '+11.4%', readinessScore: 75, medianPayback: '13.9 mo', tier: 'Scaling' },
        { id: 'biz', sector: 'Business & Financial Services', adoptionPct: 64, ebitdaLift: '+10.1%', readinessScore: 70, medianPayback: '14.9 mo', tier: 'Scaling' },
        { id: 'con', sector: 'Consumer & Multi-Site Retail', adoptionPct: 60, ebitdaLift: '+8.8%', readinessScore: 65, medianPayback: '15.9 mo', tier: 'Emerging' },
      ],
    },
  },
};

export const METHODOLOGY_ITEMS = [
  {
    id: 'survey',
    title: 'Sample Architecture & Regional Weighting',
    meta: 'Global C-suite panel · 42 markets',
    content:
      'Findings synthesize illustrative benchmark distributions structured around 2026 flagship strategy-report layouts: enterprise respondents ($500M+ annual revenue) segmented across North America, EMEA, and Asia-Pacific with sector-level normalization.',
  },
  {
    id: 'cohort',
    title: 'Definition of Top-Quartile Leaders vs. Median Cohort',
    meta: 'Composite ROIC & operating-speed index',
    content:
      'Top-quartile leaders rank in the upper 25% of their peer sector on three-year EBITDA margin progression and documented workflow cycle-time reduction. Median values reflect the 50th percentile across the full regional sample.',
  },
  {
    id: 'tokens',
    title: 'How consulting-ui Maps Consulting Design Grammar to Components',
    meta: 'Zero-runtime CSS Custom Properties + strict TypeScript enums',
    content:
      'Switching the BrandProvider between McKinsey, BCG, and Bain swaps color palettes, display/body font stacks, corner radii (0px vs. 9999px pill vs. 2px financial precision), accent rules, and directional CTA motifs—while component code stays identical.',
  },
] as const;
