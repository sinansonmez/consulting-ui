import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import {
  Brand,
  BrandProvider,
  ControlSize,
  Drawer,
  DrawerStyle,
  InsightCard,
  InsightCardStyle,
  PullQuote,
  PullQuoteStyle,
  SegmentedControl,
  SegmentedControlStyle,
  Slider,
  SliderStyle,
} from '../index';

describe('Editorial modules & simulator controls (#16–#20)', () => {
  it('PullQuote renders quote text, attribution, role, and brand/style attributes', () => {
    render(
      <BrandProvider brand={Brand.McKinsey}>
        <PullQuote
          style={PullQuoteStyle.Editorial}
          quote="Rewiring core workflows yields 3.1x the margin lift of isolated pilots."
          author="Elena Rostova"
          role="Senior Partner, Zurich"
          organization="Global Technology Practice"
        />
      </BrandProvider>,
    );

    const figure = screen.getByText(/Rewiring core workflows/i).closest('figure');
    expect(figure).toHaveAttribute('data-style', 'editorial');
    expect(figure).toHaveAttribute('data-brand', 'mckinsey');
    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();
    expect(screen.getByText(/Senior Partner, Zurich/i)).toBeInTheDocument();
  });

  it('InsightCard supports both router-agnostic href links and onAction button triggers', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <BrandProvider brand={Brand.BCG}>
        <InsightCard
          style={InsightCardStyle.Editorial}
          eyebrow="Private Equity"
          meta="PDF Report · 14 min read"
          title="Global M&A Outlook 2026"
          summary="Strategic buyers return as financing spreads stabilize."
          ctaLabel="Download PDF"
          href="https://example.com/report.pdf"
        />
        <InsightCard
          brand={Brand.Bain}
          style={InsightCardStyle.Featured}
          eyebrow="AI & Digital"
          title="Scaling Agentic Workflows"
          summary="Moving from pilot theater to P&L accountability."
          ctaLabel="Open brief"
          onAction={onAction}
        />
      </BrandProvider>,
    );

    const link = screen.getByRole('link', { name: /Download PDF/i });
    expect(link).toHaveAttribute('href', 'https://example.com/report.pdf');

    const actionBtn = screen.getByRole('button', { name: /Open brief/i });
    await user.click(actionBtn);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('Slider updates numeric value, formats readout, and displays optional benchmark marker', () => {
    const onChange = vi.fn();

    render(
      <BrandProvider brand={Brand.Bain}>
        <Slider
          style={SliderStyle.Stepped}
          label="Target automation coverage"
          min={0}
          max={100}
          step={5}
          defaultValue={45}
          benchmarkValue={60}
          benchmarkLabel="Leader threshold: 60%"
          formatValue={(v) => `${v}%`}
          onChange={onChange}
        />
      </BrandProvider>,
    );

    const slider = screen.getByRole('slider', {
      name: 'Target automation coverage',
    });
    expect(slider).toHaveValue('45');
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('Leader threshold: 60%')).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: '70' } });
    expect(onChange).toHaveBeenCalledWith(70);
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('SegmentedControl implements WAI-ARIA radiogroup roving arrow focus skipping disabled items', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <BrandProvider brand={Brand.McKinsey}>
        <SegmentedControl
          style={SegmentedControlStyle.Filled}
          size={ControlSize.Sm}
          ariaLabel="Scenario case"
          defaultValue="base"
          onChange={onChange}
          options={[
            { value: 'base', label: 'Base Case' },
            { value: 'locked', label: 'Locked Case', disabled: true },
            { value: 'upside', label: 'Upside Case' },
          ]}
        />
      </BrandProvider>,
    );

    const baseRadio = screen.getByRole('radio', { name: 'Base Case' });
    const upsideRadio = screen.getByRole('radio', { name: 'Upside Case' });
    expect(baseRadio).toHaveAttribute('aria-checked', 'true');

    baseRadio.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('upside');
    expect(upsideRadio).toHaveAttribute('aria-checked', 'true');
  });

  it('Drawer manages modal Escape/backdrop dismissal, focus restoration, and inline preview mode', async () => {
    const user = userEvent.setup();

    function DrawerHarness() {
      const [open, setOpen] = useState(false);
      return (
        <BrandProvider brand={Brand.BCG}>
          <button type="button" onClick={() => setOpen(true)}>
            Inspect initiative
          </button>
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            style={DrawerStyle.AccentHeader}
            eyebrow="Initiative Deep Dive"
            title="Claims Triage Automation"
            footer={<span>Owner: Operations</span>}
          >
            <p>Projected $42M run-rate savings.</p>
          </Drawer>

          <Drawer
            open
            inline
            onClose={() => {}}
            brand={Brand.Bain}
            style={DrawerStyle.Standard}
            title="Inline Preview Sheet"
          >
            <p>Static lab comparison body.</p>
          </Drawer>
        </BrandProvider>
      );
    }

    render(<DrawerHarness />);

    // Inline drawer is rendered directly without locking body scroll
    expect(screen.getByText('Inline Preview Sheet')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');

    const launcher = screen.getByRole('button', { name: 'Inspect initiative' });
    await user.click(launcher);

    const modalDialog = screen.getByRole('dialog', {
      name: 'Claims Triage Automation',
    });
    expect(modalDialog).toHaveAttribute('aria-modal', 'true');
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(
      screen.queryByRole('dialog', { name: 'Claims Triage Automation' }),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    expect(launcher).toHaveFocus();
  });
});
