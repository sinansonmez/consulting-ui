import { render, screen } from '@testing-library/react';
import {
  BarChart,
  BarChartStyle,
  Brand,
  BrandProvider,
  DumbbellChart,
  DumbbellStyle,
  ExhibitFrame,
  ExhibitStyle,
  MarimekkoChart,
  MarimekkoStyle,
  StackedBarChart,
  StackedBarStyle,
} from '../index';

describe('Wave 1 consulting charts & editorial framing', () => {
  it('ExhibitFrame renders unitLabel, numbered footnotes, and attribution line', () => {
    render(
      <BrandProvider brand={Brand.McKinsey}>
        <ExhibitFrame
          style={ExhibitStyle.Editorial}
          exhibitLabel="Exhibit 1"
          title="Priority sectors accounted for about 40 percent of US construction spend in 2025."
          unitLabel="2025 US construction spend, %"
          footnotes={[
            'Previous article identified category as energy generation.',
            'Figures may not sum to 100%, because of rounding.',
          ]}
          source="Annual Capital Expenditures Survey; EIA"
          attribution="McKinsey & Company"
        >
          <div>Chart body</div>
        </ExhibitFrame>
      </BrandProvider>,
    );

    expect(screen.getByText('2025 US construction spend, %')).toBeInTheDocument();
    expect(
      screen.getByText(/Previous article identified category as energy generation\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Figures may not sum to 100%, because of rounding\./i),
    ).toBeInTheDocument();
    expect(screen.getByText('McKinsey & Company')).toBeInTheDocument();
  });

  it('BarChart Ranked sorts descending by default and renders direct values and delta column', () => {
    render(
      <BrandProvider brand={Brand.McKinsey}>
        <BarChart
          style={BarChartStyle.Ranked}
          ariaLabel="Agriculture technology adoption"
          formatValue={(v) => `${v}%`}
          formatDelta={(d) => `${d > 0 ? '+' : ''}${d} pp`}
          deltaColumnLabel="vs. 2024"
          data={[
            { id: 'fms', label: 'Farm management software', value: 24, delta: 3 },
            { id: 'agro', label: 'Digital agronomy', value: 31, delta: 1, highlighted: true },
            { id: 'sense', label: 'Remote sensing', value: 27, delta: 5 },
          ]}
        />
      </BrandProvider>,
    );

    const chart = screen.getByRole('img', {
      name: 'Agriculture technology adoption',
    });
    expect(chart).toHaveAttribute('data-style', 'ranked');
    expect(chart).toHaveAttribute('data-brand', 'mckinsey');
    expect(screen.getByText('Digital agronomy')).toBeInTheDocument();
    expect(screen.getByText('31%')).toBeInTheDocument();
    expect(screen.getByText('+5 pp')).toBeInTheDocument();
    expect(screen.getByText('vs. 2024')).toBeInTheDocument();
  });

  it('BarChart Grouped renders multi-series cohort bars and Diverging supports negative values', () => {
    render(
      <BrandProvider brand={Brand.BCG}>
        <BarChart
          style={BarChartStyle.Grouped}
          ariaLabel="Leaders versus sector median"
          formatValue={(v) => `${v}%`}
          series={[
            { id: 'leaders', label: 'Top-quartile leaders' },
            { id: 'median', label: 'Sector median', tone: 'neutral' },
          ]}
          data={[
            { id: 'tech', label: 'Software & Cloud', values: [78, 49], delta: '+29 pp' },
            { id: 'fin', label: 'Financial Services', values: [68, 42], delta: '+26 pp' },
          ]}
        />
        <BarChart
          style={BarChartStyle.Diverging}
          ariaLabel="Net spending intent shift"
          formatValue={(v) => `${v > 0 ? '+' : ''}${v} pp`}
          data={[
            { id: 'arg', label: 'Argentina', value: -49 },
            { id: 'can', label: 'Canada', value: -29 },
            { id: 'eu', label: 'EU Core', value: 8 },
          ]}
        />
      </BrandProvider>,
    );

    expect(
      screen.getByRole('img', { name: 'Leaders versus sector median' }),
    ).toHaveAttribute('data-style', 'grouped');
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('49%')).toBeInTheDocument();
    expect(screen.getByText('+29 pp')).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: 'Net spending intent shift' }),
    ).toHaveAttribute('data-style', 'diverging');
    expect(screen.getByText('-49 pp')).toBeInTheDocument();
    expect(screen.getByText('+8 pp')).toBeInTheDocument();
  });

  it('StackedBarChart Proportional normalizes segments to 100% with direct labels and Absolute displays row totals', () => {
    render(
      <BrandProvider brand={Brand.McKinsey}>
        <StackedBarChart
          style={StackedBarStyle.Proportional}
          ariaLabel="AI workforce impact forecast vs actual"
          series={[
            { id: 'dec', label: 'Headcount decrease', tone: 'primary' },
            { id: 'same', label: 'Little or no change', tone: 'neutral' },
            { id: 'inc', label: 'Headcount increase', tone: 'secondary' },
          ]}
          categories={[
            { id: 'forecast', label: 'Prior-year forecast', values: [32, 48, 20] },
            { id: 'actual', label: 'Actual reported', values: [14, 66, 20] },
          ]}
        />
        <StackedBarChart
          style={StackedBarStyle.Absolute}
          ariaLabel="Regional IT spend composition"
          formatValue={(v) => `$${v}B`}
          series={[
            { id: 'run', label: 'Run IT', tone: 'neutral' },
            { id: 'change', label: 'Change & AI', tone: 'primary' },
          ]}
          categories={[
            { id: 'na', label: 'North America', values: [60, 45] },
          ]}
        />
      </BrandProvider>,
    );

    expect(
      screen.getByRole('img', { name: 'AI workforce impact forecast vs actual' }),
    ).toHaveAttribute('data-style', 'proportional');
    expect(screen.getByText('66%')).toBeInTheDocument();
    expect(screen.getByText('32%')).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: 'Regional IT spend composition' }),
    ).toHaveAttribute('data-style', 'absolute');
    expect(screen.getByText('$105B')).toBeInTheDocument();
  });

  it('DumbbellChart Gap renders cohort endpoints across negative-to-positive scale with delta callouts', () => {
    render(
      <BrandProvider brand={Brand.McKinsey}>
        <DumbbellChart
          style={DumbbellStyle.Gap}
          ariaLabel="Net consumer trust by generation"
          startLabel="Baby Boomers"
          endLabel="Gen Z"
          deltaColumnLabel="Gap"
          formatValue={(v) => `${v > 0 ? '+' : ''}${v}`}
          formatDelta={(d) => `${d > 0 ? '+' : ''}${d} pp`}
          data={[
            { id: 'friends', label: 'Friends & family', start: 62, end: 54 },
            { id: 'social', label: 'Social media', start: -12, end: -26 },
            { id: 'genai', label: 'Generative AI tools', start: -18, end: 14 },
          ]}
        />
      </BrandProvider>,
    );

    const chart = screen.getByRole('img', {
      name: 'Net consumer trust by generation',
    });
    expect(chart).toHaveAttribute('data-style', 'gap');
    expect(screen.getByText('Friends & family')).toBeInTheDocument();
    expect(screen.getByText('-8 pp')).toBeInTheDocument();
    expect(screen.getByText('+32 pp')).toBeInTheDocument();
    expect(screen.getByText('Gap')).toBeInTheDocument();
  });

  it('MarimekkoChart Editorial renders proportional blocks, hero serif totals, and sliver arrow callouts', () => {
    render(
      <BrandProvider brand={Brand.McKinsey}>
        <MarimekkoChart
          style={MarimekkoStyle.Editorial}
          ariaLabel="2025 US construction spend composition"
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
      </BrandProvider>,
    );

    const chart = screen.getByRole('img', {
      name: '2025 US construction spend composition',
    });
    expect(chart).toHaveAttribute('data-style', 'editorial');
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('41.4%')).toBeInTheDocument();
    expect(screen.getByText('All other construction')).toBeInTheDocument();
    expect(screen.getByText('58.6')).toBeInTheDocument();
    expect(screen.getByText('Manufacturing')).toBeInTheDocument();
    expect(screen.getByText('15.2')).toBeInTheDocument();
    expect(screen.getByText(/Mining/)).toBeInTheDocument();
    expect(screen.getByText(/Electricity transmission/)).toBeInTheDocument();
  });

  it('StackedBarChart Diverging normalizes to centered 0% shares and preserves labels across height resizes', () => {
    const { rerender } = render(
      <BrandProvider brand={Brand.McKinsey}>
        <StackedBarChart
          style={StackedBarStyle.Diverging}
          height={220}
          showTooltip={false}
          ariaLabel="Executive sentiment split"
          series={[
            { id: 'neg', label: 'Skeptical', polarity: 'negative', tone: 'negative' },
            { id: 'pos', label: 'Confident', polarity: 'positive', tone: 'primary' },
          ]}
          categories={[
            { id: 'ai', label: 'AI ROI', values: [25, 75] },
          ]}
        />
      </BrandProvider>,
    );

    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();

    // Updating height alone should resize without blanking rendered content
    rerender(
      <BrandProvider brand={Brand.McKinsey}>
        <StackedBarChart
          style={StackedBarStyle.Diverging}
          height={320}
          showTooltip={false}
          ariaLabel="Executive sentiment split"
          series={[
            { id: 'neg', label: 'Skeptical', polarity: 'negative', tone: 'negative' },
            { id: 'pos', label: 'Confident', polarity: 'positive', tone: 'primary' },
          ]}
          categories={[
            { id: 'ai', label: 'AI ROI', values: [25, 75] },
          ]}
        />
      </BrandProvider>,
    );

    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});
