import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { Brand, Surface } from './enums';
import './tokens.css';

export interface BrandContextValue {
  brand: Brand;
  surface: Surface;
}

const BrandContext = createContext<BrandContextValue>({
  brand: Brand.McKinsey,
  surface: Surface.Light,
});

export interface BrandProviderProps {
  brand: Brand;
  surface?: Surface;
  children: ReactNode;
}

export function BrandProvider({
  brand,
  surface = Surface.Light,
  children,
}: BrandProviderProps) {
  const value = useMemo(() => ({ brand, surface }), [brand, surface]);

  return (
    <BrandContext.Provider value={value}>
      <div
        className="mbb-provider-root"
        data-brand={brand}
        data-surface={surface}
      >
        {children}
      </div>
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandContextValue {
  return useContext(BrandContext);
}

export function useResolvedTheme(
  brandOverride?: Brand,
  surfaceOverride?: Surface,
): BrandContextValue {
  const ctx = useContext(BrandContext);
  return {
    brand: brandOverride ?? ctx.brand,
    surface: surfaceOverride ?? ctx.surface,
  };
}
