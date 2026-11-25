import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BarChartStyle,
  Brand,
  BrandProvider,
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
} from '../index';
import { tokenizeTsx } from '../demo/components/tsxHighlighter';
import { CodePanel, CodeToggleButton } from '../demo/components/CodePanel';
import {
  buildChartSnippet,
  type GalleryChartId,
} from '../demo/data/chartSnippets';
import {
  buildLabSectionSnippet,
  buildQuickStartSnippet,
} from '../demo/data/labSnippets';
import { ChartsGalleryView } from '../demo/components/ChartsGalleryView';
import { TriBrandLab } from '../demo/components/TriBrandLab';
import { App } from '../demo/App';

describe('Demo TSX syntax highlighter & CodePanel', () => {
  it('tokenizeTsx losslessly preserves input and classifies JSX tags, props, enums, strings, numbers, and comments', () => {
    const sample = [
      "// Theme: Brand.McKinsey · Surface.Light",
      "import { WaterfallChart, WaterfallStyle } from 'consulting-ui';",
      '',
      '<WaterfallChart',
      '  style={WaterfallStyle.Classic}',
      '  steps={[{ id: "base", value: 120, kind: \'start\' }]}',
      '/>',
    ].join('\n');

    const lines = tokenizeTsx(sample);
    const reconstructed = lines
      .map((tokens) => tokens.map((token) => token.text).join(''))
      .join('\n');

    expect(reconstructed).toBe(sample);
    expect(lines[0]).toEqual([
      { kind: 'comment', text: '// Theme: Brand.McKinsey · Surface.Light' },
    ]);

    const importKinds = new Map(lines[1].map((t) => [t.text, t.kind]));
    expect(importKinds.get('import')).toBe('keyword');
    expect(importKinds.get('from')).toBe('keyword');
    expect(importKinds.get("'consulting-ui'")).toBe('string');

    expect(lines[3].some((t) => t.kind === 'tag' && t.text === 'WaterfallChart')).toBe(true);
    expect(lines[4].some((t) => t.kind === 'attr' && t.text === 'style')).toBe(true);
    expect(lines[4].some((t) => t.kind === 'enum' && t.text === 'WaterfallStyle')).toBe(true);
    expect(lines[4].some((t) => t.kind === 'enum' && t.text === 'Classic')).toBe(true);
    expect(lines[5].some((t) => t.kind === 'number' && t.text === '120')).toBe(true);
  });

  it('CodePanel renders active theme metadata, line numbers, and copies snippet to clipboard', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const snippet = `import { Button, ButtonStyle } from 'consulting-ui';\n\n<Button style={ButtonStyle.Primary}>Download brief</Button>`;

    render(
      <BrandProvider brand={Brand.BCG} surface={Surface.Dark}>
        <CodePanel title="Button · Primary" code={snippet} />
      </BrandProvider>,
    );

    expect(screen.getByText('TSX')).toBeInTheDocument();
    expect(screen.getByText('BCG · Dark')).toBeInTheDocument();
    expect(screen.getByText('Button · Primary')).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: /copy code/i });
    await user.click(copyButton);

    expect(writeText).toHaveBeenCalledWith(snippet);
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
  });

  it('CodeToggleButton exposes aria-expanded state and toggles label', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    const { rerender } = render(
      <BrandProvider brand={Brand.McKinsey}>
        <CodeToggleButton
          expanded={false}
          controlsId="chart-1-code"
          onToggle={onToggle}
        />
      </BrandProvider>,
    );

    const button = screen.getByRole('button', { name: /show code/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'chart-1-code');

    await user.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(
      <BrandProvider brand={Brand.McKinsey}>
        <CodeToggleButton
          expanded
          controlsId="chart-1-code"
          onToggle={onToggle}
        />
      </BrandProvider>,
    );

    const hideBtn = screen.getByRole('button', { name: /hide code/i });
    expect(hideBtn).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('Live TSX snippet builders (Charts Gallery 12 & Tri-Brand Lab 31)', () => {
  it('buildChartSnippet generates valid, style-reactive TSX for all 12 charts across all 36 variants', () => {
    const matrix: readonly {
      id: GalleryChartId;
      styles: readonly { value: string; expectedEnum: string }[];
    }[] = [
      {
        id: 'line',
        styles: [
          { value: LineChartStyle.Forecast, expectedEnum: 'LineChartStyle.Forecast' },
          { value: LineChartStyle.Trend, expectedEnum: 'LineChartStyle.Trend' },
          { value: LineChartStyle.StackedArea, expectedEnum: 'LineChartStyle.StackedArea' },
        ],
      },
      {
        id: 'combo',
        styles: [
          { value: ComboChartStyle.BarLine, expectedEnum: 'ComboChartStyle.BarLine' },
          { value: ComboChartStyle.StackedLine, expectedEnum: 'ComboChartStyle.StackedLine' },
          { value: ComboChartStyle.Indexed, expectedEnum: 'ComboChartStyle.Indexed' },
        ],
      },
      {
        id: 'bubble',
        styles: [
          { value: BubbleChartStyle.GrowthShare, expectedEnum: 'BubbleChartStyle.GrowthShare' },
          { value: BubbleChartStyle.Scatter, expectedEnum: 'BubbleChartStyle.Scatter' },
          { value: BubbleChartStyle.Quadrant, expectedEnum: 'BubbleChartStyle.Quadrant' },
        ],
      },
      {
        id: 'heatmap',
        styles: [
          { value: HeatmapStyle.Scorecard, expectedEnum: 'HeatmapStyle.Scorecard' },
          { value: HeatmapStyle.Sequential, expectedEnum: 'HeatmapStyle.Sequential' },
          { value: HeatmapStyle.Diverging, expectedEnum: 'HeatmapStyle.Diverging' },
        ],
      },
      {
        id: 'slope',
        styles: [
          { value: SlopeChartStyle.Indexed, expectedEnum: 'SlopeChartStyle.Indexed' },
          { value: SlopeChartStyle.BeforeAfter, expectedEnum: 'SlopeChartStyle.BeforeAfter' },
          { value: SlopeChartStyle.RankShift, expectedEnum: 'SlopeChartStyle.RankShift' },
        ],
      },
      {
        id: 'marimekko',
        styles: [
          { value: MarimekkoStyle.Editorial, expectedEnum: 'MarimekkoStyle.Editorial' },
          { value: MarimekkoStyle.Compact, expectedEnum: 'MarimekkoStyle.Compact' },
          { value: MarimekkoStyle.Outlined, expectedEnum: 'MarimekkoStyle.Outlined' },
        ],
      },
      {
        id: 'funnel',
        styles: [
          { value: FunnelStyle.Tiered, expectedEnum: 'FunnelStyle.Tiered' },
          { value: FunnelStyle.Tapered, expectedEnum: 'FunnelStyle.Tapered' },
          { value: FunnelStyle.Horizontal, expectedEnum: 'FunnelStyle.Horizontal' },
        ],
      },
      {
        id: 'sankey',
        styles: [
          { value: SankeyStyle.Editorial, expectedEnum: 'SankeyStyle.Editorial' },
          { value: SankeyStyle.Flow, expectedEnum: 'SankeyStyle.Flow' },
          { value: SankeyStyle.Minimal, expectedEnum: 'SankeyStyle.Minimal' },
        ],
      },
      {
        id: 'waterfall',
        styles: [
          { value: WaterfallStyle.Classic, expectedEnum: 'WaterfallStyle.Classic' },
          { value: WaterfallStyle.Clean, expectedEnum: 'WaterfallStyle.Clean' },
          { value: WaterfallStyle.Compact, expectedEnum: 'WaterfallStyle.Compact' },
        ],
      },
      {
        id: 'bar',
        styles: [
          { value: BarChartStyle.Ranked, expectedEnum: 'BarChartStyle.Ranked' },
          { value: BarChartStyle.Grouped, expectedEnum: 'BarChartStyle.Grouped' },
          { value: BarChartStyle.Diverging, expectedEnum: 'BarChartStyle.Diverging' },
        ],
      },
      {
        id: 'stacked-bar',
        styles: [
          { value: StackedBarStyle.Proportional, expectedEnum: 'StackedBarStyle.Proportional' },
          { value: StackedBarStyle.Absolute, expectedEnum: 'StackedBarStyle.Absolute' },
          { value: StackedBarStyle.Diverging, expectedEnum: 'StackedBarStyle.Diverging' },
        ],
      },
      {
        id: 'dumbbell',
        styles: [
          { value: DumbbellStyle.Gap, expectedEnum: 'DumbbellStyle.Gap' },
          { value: DumbbellStyle.Range, expectedEnum: 'DumbbellStyle.Range' },
          { value: DumbbellStyle.Minimal, expectedEnum: 'DumbbellStyle.Minimal' },
        ],
      },
    ];

    for (const entry of matrix) {
      for (const variant of entry.styles) {
        const snippet = buildChartSnippet(
          entry.id,
          variant.value,
          Brand.BCG,
          Surface.Dark,
        );
        expect(snippet).toContain("from 'consulting-ui'");
        expect(snippet).toContain('<ExhibitFrame');
        expect(snippet).toContain(variant.expectedEnum);
        expect(snippet).toContain('Brand.BCG');
        expect(snippet).toContain('Surface.Dark');
      }
    }

    const waterfallSnippet = buildChartSnippet(
      'waterfall',
      WaterfallStyle.Classic,
      Brand.McKinsey,
      Surface.Light,
    );
    expect(waterfallSnippet).toContain("kind: 'subtotal'");
    expect(waterfallSnippet).toContain("kind: 'total'");
    expect(waterfallSnippet).not.toContain('value: 0');
  });

  it('buildQuickStartSnippet and buildLabSectionSnippet cover Quick Start + all 31 Lab components reactively', () => {
    const quickStart = buildQuickStartSnippet(Brand.Bain, Surface.Dark);
    expect(quickStart).toContain('<BrandProvider brand={Brand.Bain} surface={Surface.Dark}>');
    expect(quickStart).not.toContain('value: 0');

    for (let num = 1; num <= 31; num++) {
      const snippet = buildLabSectionSnippet(num, Brand.BCG, Surface.Light);
      expect(snippet).toContain("from 'consulting-ui'");
      expect(snippet).toContain('Brand.BCG');
      expect(snippet).toContain('Surface.Light');
      expect(snippet).not.toContain('brand={brand}');
      expect(snippet).not.toContain('value: 0');
    }
  });
});

describe('Showcase live code viewing integration', () => {
  it('ChartsGalleryView expands inline code panel underneath and updates TSX live when switching chart style', async () => {
    const user = userEvent.setup();

    render(
      <BrandProvider brand={Brand.McKinsey} surface={Surface.Light}>
        <ChartsGalleryView />
      </BrandProvider>,
    );

    const codeButtons = screen.getAllByRole('button', { name: /show code for/i });
    expect(codeButtons).toHaveLength(12);

    const lineCodeBtn = screen.getByRole('button', { name: /show code for LineChart/i });
    await user.click(lineCodeBtn);

    const codePanel = document.getElementById('chart-code-line');
    expect(codePanel).toBeInTheDocument();
    expect(codePanel?.textContent).toContain('LineChartStyle.Forecast');

    // Switch LineChart style live while code panel is open
    await user.click(screen.getByRole('radio', { name: 'Stacked Area' }));
    expect(codePanel?.textContent).toContain('LineChartStyle.StackedArea');

    // Verify newly wired style toggles exist (e.g. Heatmap Diverging & Waterfall Compact)
    expect(screen.getByRole('radiogroup', { name: 'Heatmap style' })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'WaterfallChart style' })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'BarChart style' })).toBeInTheDocument();
  });

  it(
    'TriBrandLab renders live Quick Start CodePanel and toggles per-component code panels',
    async () => {
      const user = userEvent.setup();

      render(
        <BrandProvider brand={Brand.Bain} surface={Surface.Dark}>
          <TriBrandLab />
        </BrandProvider>,
      );

      expect(screen.getByText('Quick Start')).toBeInTheDocument();
      expect(screen.getByText('Bain · Dark')).toBeInTheDocument();

      const btnToggle = screen.getByRole('button', {
        name: /show code for Button — ButtonStyle enum/i,
      });
      await user.click(btnToggle);

      const panel = document.getElementById('lab-code-1');
      expect(panel).toBeInTheDocument();
      expect(panel?.textContent).toContain('ButtonStyle.Primary');
      expect(panel?.textContent).toContain('Brand.Bain');
    },
    15000,
  );

  it('App top-bar install chip copies npm install command on click', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(<App />);

    const chip = screen.getByRole('button', { name: /copy install command/i });
    await user.click(chip);

    expect(writeText).toHaveBeenCalledWith('npm i consulting-ui');
    expect(
      await screen.findByRole('button', { name: /copied install command/i }),
    ).toBeInTheDocument();
  });
});
