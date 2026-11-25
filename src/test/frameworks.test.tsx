import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import {
  BenchmarkBar,
  BenchmarkBarStyle,
  Brand,
  BrandProvider,
  ChevronFlow,
  ChevronFlowStyle,
  HarveyBall,
  HarveyBallStyle,
  Matrix2x2,
  MatrixStyle,
  WaterfallChart,
  WaterfallStyle,
  type WaterfallStep,
  type WaterfallStepKind,
} from '../index';

describe('Consulting framework & visual exhibits (#11–#15)', () => {
  it('HarveyBall exposes accessible completion rating and style/brand attributes', () => {
    render(
      <BrandProvider brand={Brand.McKinsey}>
        <HarveyBall
          value={75}
          style={HarveyBallStyle.Solid}
          label="AI governance maturity"
        />
        <HarveyBall
          value={25}
          brand={Brand.Bain}
          style={HarveyBallStyle.Ring}
        />
      </BrandProvider>,
    );

    const primary = screen.getByRole('img', {
      name: /AI governance maturity: 75%/i,
    });
    expect(primary).toHaveAttribute('data-style', 'solid');
    expect(primary).toHaveAttribute('data-brand', 'mckinsey');

    const secondary = screen.getByRole('img', { name: /25%/i });
    expect(secondary).toHaveAttribute('data-style', 'ring');
    expect(secondary).toHaveAttribute('data-brand', 'bain');
  });

  it('BenchmarkBar displays current value alongside median and top-quartile markers', () => {
    render(
      <BrandProvider brand={Brand.BCG}>
        <BenchmarkBar
          style={BenchmarkBarStyle.Bullet}
          label="Workflow automation rate"
          value={64}
          median={42}
          topQuartile={78}
          unit="%"
        />
      </BrandProvider>,
    );

    expect(screen.getByText('Workflow automation rate')).toBeInTheDocument();
    expect(screen.getByText('64%')).toBeInTheDocument();
    expect(screen.getByText(/Median: 42%/i)).toBeInTheDocument();
    expect(screen.getByText(/Top quartile: 78%/i)).toBeInTheDocument();
  });

  it('WaterfallChart automatically computes subtotal and closing total from delta steps', () => {
    render(
      <BrandProvider brand={Brand.Bain}>
        <WaterfallChart
          style={WaterfallStyle.Classic}
          ariaLabel="EBITDA value creation bridge"
          formatValue={(n) => `$${n}M`}
          steps={[
            { id: 'base', label: 'FY24 EBITDA', value: 100, kind: 'start' },
            { id: 'price', label: 'Pricing realization', value: 35 },
            { id: 'cost', label: 'Input inflation', value: -15 },
            { id: 'sub', label: 'Commercial subtotal', value: 0, kind: 'subtotal' },
            { id: 'ai', label: 'SG&A automation', value: 20 },
            { id: 'end', label: 'FY26 Run-rate', value: 0, kind: 'total' },
          ]}
        />
      </BrandProvider>,
    );

    const chart = screen.getByRole('img', {
      name: 'EBITDA value creation bridge',
    });
    expect(chart).toHaveAttribute('data-style', 'classic');
    // 100 + 35 - 15 = 120 subtotal; 120 + 20 = 140 closing total
    expect(screen.getByText('$120M')).toBeInTheDocument();
    expect(screen.getByText('$140M')).toBeInTheDocument();
    expect(screen.getByText('+$35M')).toBeInTheDocument();
    expect(screen.getByText('-$15M')).toBeInTheDocument();
  });

  it('WaterfallChart allows omitting value on subtotal and total steps while preserving WaterfallStepKind compatibility', () => {
    const startKind: WaterfallStepKind = 'start';
    const steps: WaterfallStep[] = [
      { id: 'base', label: 'FY24 Base', value: 120, kind: startKind },
      { id: 'price', label: 'Pricing', value: 28 },
      { id: 'sub', label: 'Gross Lift', kind: 'subtotal' },
      { id: 'capex', label: 'Capex', value: -18 },
      { id: 'end', label: 'FY26 Target', kind: 'total' },
    ];

    render(
      <BrandProvider brand={Brand.McKinsey}>
        <WaterfallChart
          style={WaterfallStyle.Clean}
          ariaLabel="Optional value waterfall bridge"
          formatValue={(n) => `$${n}M`}
          steps={steps}
        />
      </BrandProvider>,
    );

    expect(screen.getByText('$148M')).toBeInTheDocument();
    expect(screen.getByText('$130M')).toBeInTheDocument();
  });

  it('Matrix2x2 renders quadrant headers and supports keyboard/click selection of plotted items', async () => {
    const user = userEvent.setup();
    const onSelectItem = vi.fn();

    render(
      <BrandProvider brand={Brand.BCG}>
        <Matrix2x2
          style={MatrixStyle.Quadrant}
          xAxisLabel="Implementation Feasibility"
          yAxisLabel="EBITDA Impact"
          quadrantLabels={{
            topLeft: 'Strategic Bets',
            topRight: 'Priority Scalers',
            bottomLeft: 'Deprioritize',
            bottomRight: 'Quick Wins',
          }}
          defaultSelectedId="claims"
          onSelectItem={onSelectItem}
          items={[
            {
              id: 'claims',
              label: 'Claims Triage AI',
              x: 82,
              y: 86,
              meta: '+$42M',
              highlighted: true,
            },
            {
              id: 'erp',
              label: 'Core ERP Consolidation',
              x: 28,
              y: 74,
              meta: '+$30M',
            },
          ]}
        />
      </BrandProvider>,
    );

    expect(screen.getByText('Priority Scalers')).toBeInTheDocument();
    const claimsBtn = screen.getByRole('button', { name: /Claims Triage AI/i });
    const erpBtn = screen.getByRole('button', {
      name: /Core ERP Consolidation/i,
    });

    expect(claimsBtn).toHaveAttribute('aria-pressed', 'true');
    expect(erpBtn).toHaveAttribute('aria-pressed', 'false');

    erpBtn.focus();
    await user.keyboard('{Enter}');
    expect(onSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'erp', label: 'Core ERP Consolidation' }),
    );
    expect(erpBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('ChevronFlow renders sequential transformation stages with timing and deliverables', () => {
    render(
      <BrandProvider brand={Brand.McKinsey}>
        <ChevronFlow
          style={ChevronFlowStyle.Interlocking}
          steps={[
            {
              id: 'p1',
              phase: 'Weeks 1–4',
              title: 'Diagnostic & Baseline',
              items: ['Cost-cube audit', 'Zero-based benchmark'],
            },
            {
              id: 'p2',
              phase: 'Weeks 5–12',
              title: 'Operating Model Design',
              items: ['Decision-rights reset', 'Pilot launch'],
              active: true,
            },
          ]}
        />
      </BrandProvider>,
    );

    const list = screen.getByRole('list', { name: 'Transformation stages' });
    expect(list.closest('[data-style]')).toHaveAttribute(
      'data-style',
      'interlocking',
    );
    expect(screen.getByText('Diagnostic & Baseline')).toBeInTheDocument();
    expect(screen.getByText('Operating Model Design')).toBeInTheDocument();
    expect(screen.getByText('Zero-based benchmark')).toBeInTheDocument();
  });
});
