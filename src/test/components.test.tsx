import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import {
  Accordion,
  AccordionStyle,
  Badge,
  BadgeStyle,
  Brand,
  BrandProvider,
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
  Surface,
  Tabs,
  TabsStyle,
  type DataTableColumn,
  type DataTableRow,
} from '../index';

describe('consulting-ui Top 10 components', () => {
  it('Button applies enum style, loading/disabled invariants, and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <BrandProvider brand={Brand.McKinsey}>
        <Button style={ButtonStyle.Primary} onClick={onClick}>
          Download brief
        </Button>
        <Button style={ButtonStyle.Editorial} loading onClick={onClick}>
          Generating PDF
        </Button>
      </BrandProvider>,
    );

    const primary = screen.getByRole('button', { name: 'Download brief' });
    expect(primary).toHaveAttribute('data-style', 'primary');
    await user.click(primary);
    expect(onClick).toHaveBeenCalledTimes(1);

    const loadingBtn = screen.getByRole('button', { name: 'Generating PDF' });
    expect(loadingBtn).toBeDisabled();
    expect(loadingBtn).toHaveAttribute('aria-busy', 'true');
    await user.click(loadingBtn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Badge renders enum style variants across brands', () => {
    render(
      <BrandProvider brand={Brand.BCG}>
        <Badge style={BadgeStyle.Positive}>+21 pp</Badge>
        <Badge brand={Brand.Bain} style={BadgeStyle.Accent}>
          Private Equity
        </Badge>
      </BrandProvider>,
    );

    const positive = screen.getByText('+21 pp').closest('[data-style]');
    const accent = screen.getByText('Private Equity').closest('[data-style]');

    expect(positive).toHaveAttribute('data-style', 'positive');
    expect(positive).toHaveAttribute('data-brand', 'bcg');
    expect(accent).toHaveAttribute('data-style', 'accent');
    expect(accent).toHaveAttribute('data-brand', 'bain');
  });

  it('Input supports uncontrolled editing, clearable action, and accessible errors', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <BrandProvider brand={Brand.Bain}>
        <Input
          style={InputStyle.Underline}
          label="Sector filter"
          defaultValue="Software"
          clearable
          error="Enter at least 3 characters"
          onChange={onChange}
        />
      </BrandProvider>,
    );

    const input = screen.getByLabelText('Sector filter');
    expect(input).toHaveValue('Software');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter at least 3 characters',
    );

    await user.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('Select implements custom ARIA listbox keyboard and pointer selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <BrandProvider brand={Brand.McKinsey}>
        <Select
          style={SelectStyle.Standard}
          label="Region"
          defaultValue="global"
          onChange={onChange}
          options={[
            { value: 'global', label: 'Global Composite' },
            { value: 'na', label: 'North America', disabled: true },
            { value: 'emea', label: 'EMEA' },
            { value: 'apac', label: 'APAC' },
          ]}
        />
      </BrandProvider>,
    );

    const trigger = screen.getByRole('combobox', { name: /Region/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // ArrowDown from index 0 should skip disabled index 1 ('na') and move to index 2 ('emea')
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('emea');
    expect(trigger).toHaveTextContent('EMEA');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Reopen and close with Escape
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Tabs supports WAI-ARIA panels and keyboard ArrowRight / End switching', async () => {
    const user = userEvent.setup();

    render(
      <BrandProvider brand={Brand.BCG}>
        <Tabs
          style={TabsStyle.Segmented}
          size={ControlSize.Sm}
          items={[
            { id: 'chart', label: 'Chart', content: <p>Chart canvas</p> },
            { id: 'matrix', label: 'Matrix', content: <p>Matrix view</p> },
            { id: 'notes', label: 'Notes', content: <p>Footnotes view</p> },
          ]}
        />
      </BrandProvider>,
    );

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Chart canvas');
    const chartTab = screen.getByRole('tab', { name: 'Chart' });
    chartTab.focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Matrix' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Matrix view');

    await user.keyboard('{End}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Footnotes view');
  });

  it('Callout and MetricCard render semantic consulting structures and styles', () => {
    render(
      <BrandProvider brand={Brand.BCG} surface={Surface.Light}>
        <Callout
          style={CalloutStyle.Executive}
          eyebrow="Key Takeaways"
          title="Strategy beats tools"
          footer="Source: 2026 study"
        >
          <p>Enablement drives durable EBITDA.</p>
        </Callout>
        <MetricCard
          style={MetricCardStyle.Split}
          value="74%"
          label="Frontline AI adoption"
          delta="+21 pp"
          deltaDirection="up"
          benchmark="2025: 53%"
        />
      </BrandProvider>,
    );

    const aside = screen.getByRole('complementary', {
      name: 'Strategy beats tools',
    });
    expect(aside).toHaveAttribute('data-style', 'executive');
    expect(screen.getByText('74%')).toBeInTheDocument();
    expect(screen.getByText('+21 pp')).toBeInTheDocument();
    expect(screen.getByText('2025: 53%')).toBeInTheDocument();
  });

  it('ExhibitFrame renders numbered header, controls slot, visual body, and footer', () => {
    render(
      <BrandProvider brand={Brand.Bain}>
        <ExhibitFrame
          style={ExhibitStyle.AccentHeader}
          exhibitLabel="Exhibit 1"
          title="Organic EBITDA drives exit alpha"
          subtitle="% of value creation"
          controls={<button type="button">Filter</button>}
          note="Control buyouts >$250M EV."
          source="2026 Private Equity dataset"
        >
          <div data-testid="chart-slot">SVG Graphic</div>
        </ExhibitFrame>
      </BrandProvider>,
    );

    const figure = screen.getByRole('figure');
    expect(figure).toHaveAttribute('data-style', 'accent-header');
    expect(screen.getByText('Exhibit 1')).toBeInTheDocument();
    expect(screen.getByTestId('chart-slot')).toBeInTheDocument();
    expect(screen.getByText(/Control buyouts/)).toBeInTheDocument();
    expect(screen.getByText(/2026 Private Equity dataset/)).toBeInTheDocument();
  });

  it('DataTable sorts numeric columns (desc -> asc -> none), highlights rows, and renders summaryRow', async () => {
    const user = userEvent.setup();

    interface Row extends DataTableRow {
      sector: string;
      score: number;
    }

    const columns: readonly DataTableColumn<Row>[] = [
      { key: 'sector', header: 'Sector', sortable: true },
      { key: 'score', header: 'Score', align: 'right', sortable: true },
    ];

    const rows: readonly Row[] = [
      { id: 'r1', sector: 'Retail', score: 61 },
      { id: 'r2', sector: 'Software', score: 88, highlighted: true },
      { id: 'r3', sector: 'Industrials', score: 70 },
    ];

    render(
      <BrandProvider brand={Brand.McKinsey}>
        <DataTable
          style={DataTableStyle.Editorial}
          columns={columns}
          rows={rows}
          summaryRow={{ sector: 'Average', score: 73 }}
        />
      </BrandProvider>,
    );

    const table = screen.getByRole('table');
    const tbody = table.querySelector('tbody')!;
    const scoreHeader = screen.getByRole('columnheader', { name: /Score/i });
    const scoreSortBtn = within(scoreHeader).getByRole('button');

    // First click -> descending (88, 70, 61)
    await user.click(scoreSortBtn);
    expect(scoreHeader).toHaveAttribute('aria-sort', 'descending');
    let bodyRows = within(tbody).getAllByRole('row');
    expect(bodyRows[0]).toHaveTextContent('Software');
    expect(bodyRows[0]).toHaveAttribute('data-highlighted', 'true');
    expect(bodyRows[2]).toHaveTextContent('Retail');

    // Second click -> ascending (61, 70, 88)
    await user.click(scoreSortBtn);
    expect(scoreHeader).toHaveAttribute('aria-sort', 'ascending');
    bodyRows = within(tbody).getAllByRole('row');
    expect(bodyRows[0]).toHaveTextContent('Retail');
    expect(bodyRows[2]).toHaveTextContent('Software');

    // Summary row present in tfoot
    expect(table.querySelector('tfoot')).toHaveTextContent('Average');
    expect(table.querySelector('tfoot')).toHaveTextContent('73');
  });

  it('Accordion enforces single vs multi-expand and ARIA regions', async () => {
    const user = userEvent.setup();

    render(
      <BrandProvider brand={Brand.Bain}>
        <Accordion
          style={AccordionStyle.Bordered}
          defaultExpandedIds={['m1']}
          items={[
            { id: 'm1', title: 'Sample Size', content: <p>10,400 leaders</p> },
            { id: 'm2', title: 'Definitions', content: <p>Top quartile ROIC</p> },
          ]}
        />
      </BrandProvider>,
    );

    const trigger1 = screen.getByRole('button', { name: /Sample Size/i });
    const trigger2 = screen.getByRole('button', { name: /Definitions/i });

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('10,400 leaders')).toBeInTheDocument();

    await user.click(trigger2);
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByText('10,400 leaders')).not.toBeInTheDocument();
    expect(screen.getByText('Top quartile ROIC')).toBeInTheDocument();
  });
});
