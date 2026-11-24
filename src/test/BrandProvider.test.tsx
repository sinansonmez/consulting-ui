import { render, screen } from '@testing-library/react';
import {
  Brand,
  BrandProvider,
  Button,
  ButtonStyle,
  Surface,
  useBrand,
} from '../index';

function ThemeProbe() {
  const { brand, surface } = useBrand();
  return <span data-testid="probe">{`${brand}:${surface}`}</span>;
}

describe('BrandProvider & theme seam', () => {
  it('propagates brand and surface context to nested components', () => {
    render(
      <BrandProvider brand={Brand.BCG} surface={Surface.Dark}>
        <ThemeProbe />
        <Button style={ButtonStyle.Primary}>Explore</Button>
      </BrandProvider>,
    );

    expect(screen.getByTestId('probe')).toHaveTextContent('bcg:dark');
    const btn = screen.getByRole('button', { name: 'Explore' });
    expect(btn).toHaveAttribute('data-brand', 'bcg');
    expect(btn).toHaveAttribute('data-surface', 'dark');
  });

  it('allows per-component brand and surface overrides for side-by-side rendering', () => {
    render(
      <BrandProvider brand={Brand.McKinsey} surface={Surface.Light}>
        <Button style={ButtonStyle.Primary}>Inherited</Button>
        <Button
          brand={Brand.Bain}
          surface={Surface.Dark}
          style={ButtonStyle.Editorial}
        >
          Overridden
        </Button>
      </BrandProvider>,
    );

    const inherited = screen.getByRole('button', { name: 'Inherited' });
    const overridden = screen.getByRole('button', { name: 'Overridden' });

    expect(inherited).toHaveAttribute('data-brand', 'mckinsey');
    expect(inherited).toHaveAttribute('data-surface', 'light');
    expect(overridden).toHaveAttribute('data-brand', 'bain');
    expect(overridden).toHaveAttribute('data-surface', 'dark');
  });
});
