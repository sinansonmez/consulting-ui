import { useState } from 'react';
import {
  Brand,
  BrandProvider,
  ControlSize,
  Surface,
  Tabs,
  TabsStyle,
} from '../index';
import { ReportView } from './components/ReportView';
import { TriBrandLab } from './components/TriBrandLab';
import styles from './App.module.css';

export function App() {
  const [brand, setBrand] = useState<Brand>(Brand.McKinsey);
  const [surface, setSurface] = useState<Surface>(Surface.Light);
  const [view, setView] = useState<'report' | 'lab'>('report');

  return (
    <BrandProvider brand={brand} surface={surface}>
      <div className={styles.shell}>
        <nav className={styles.topbar} aria-label="Theme and showcase navigation">
          <div className={styles.topbarInner}>
            <div className={styles.brandMark}>
              <span className={styles.logoTile} aria-hidden="true" />
              <div className={styles.brandWordmark}>
                <span className={styles.packageName}>mbb-ui</span>
                <span className={styles.packageSub}>Strategy Consulting UI</span>
              </div>
            </div>

            <div className={styles.controlCluster}>
              <div className={styles.controlGroup} role="group" aria-label="Consulting firm theme">
                {(
                  [
                    { id: Brand.McKinsey, label: 'McKinsey' },
                    { id: Brand.BCG, label: 'BCG' },
                    { id: Brand.Bain, label: 'Bain' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.switchBtn} ${brand === item.id ? styles.switchBtnActive : ''}`}
                    aria-pressed={brand === item.id}
                    onClick={() => setBrand(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className={styles.controlGroup} role="group" aria-label="Surface polarity">
                <button
                  type="button"
                  className={`${styles.switchBtn} ${surface === Surface.Light ? styles.switchBtnActive : ''}`}
                  aria-pressed={surface === Surface.Light}
                  onClick={() => setSurface(Surface.Light)}
                >
                  Light
                </button>
                <button
                  type="button"
                  className={`${styles.switchBtn} ${surface === Surface.Dark ? styles.switchBtnActive : ''}`}
                  aria-pressed={surface === Surface.Dark}
                  onClick={() => setSurface(Surface.Dark)}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>

          <div className={styles.subNav}>
            <Tabs
              style={TabsStyle.Underline}
              size={ControlSize.Sm}
              ariaLabel="Showcase mode"
              value={view}
              onChange={(next) => setView(next as 'report' | 'lab')}
              items={[
                { id: 'report', label: 'Interactive 2026 Strategy Report' },
                { id: 'lab', label: 'Tri-Brand Side-by-Side Lab', count: 10 },
              ]}
            />
          </div>
        </nav>

        <main className={styles.main}>
          {view === 'report' ? (
            <ReportView onOpenLab={() => setView('lab')} />
          ) : (
            <TriBrandLab />
          )}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <p className={styles.disclaimer}>
              <strong>mbb-ui</strong> is an independent, open-source React 19 + TypeScript design-system POC. It is not affiliated with, sponsored by, or endorsed by McKinsey &amp; Company, Boston Consulting Group, or Bain &amp; Company. All metrics shown are illustrative benchmark datasets.
            </p>
            <div className={styles.footerLinks}>
              <a
                href="https://github.com/sinansonmez/mbb-ui"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Repository
              </a>
              <span>MIT License · Zero Runtime Dependencies</span>
            </div>
          </div>
        </footer>
      </div>
    </BrandProvider>
  );
}
