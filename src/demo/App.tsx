import { useState } from 'react';
import {
  Brand,
  BrandProvider,
  ControlSize,
  Surface,
  Tabs,
  TabsStyle,
} from '../index';
import { ChartsGalleryView } from './components/ChartsGalleryView';
import { useCopyFeedback } from './components/codeUtils';
import { ReportView } from './components/ReportView';
import { SimulatorView } from './components/SimulatorView';
import { TriBrandLab } from './components/TriBrandLab';
import styles from './App.module.css';

type ShowcaseView = 'report' | 'charts' | 'simulator' | 'lab';
const INSTALL_COMMAND = 'npm i consulting-ui';

export function App() {
  const [brand, setBrand] = useState<Brand>(Brand.McKinsey);
  const [surface, setSurface] = useState<Surface>(Surface.Light);
  const [view, setView] = useState<ShowcaseView>('report');
  const { copied: installCopied, copy: copyInstall } = useCopyFeedback();

  return (
    <BrandProvider brand={brand} surface={surface}>
      <div className={styles.shell}>
        <nav className={styles.topbar} aria-label="Theme and showcase navigation">
          <div className={styles.topbarInner}>
            <div className={styles.brandMark}>
              <span className={styles.logoTile} aria-hidden="true" />
              <div className={styles.brandWordmark}>
                <span className={styles.packageName}>consulting-ui</span>
                <span className={styles.packageSub}>Strategy Consulting React UI</span>
              </div>
              <button
                type="button"
                className={`${styles.installChip} ${installCopied ? styles.installChipCopied : ''}`}
                aria-label={
                  installCopied
                    ? 'Copied install command'
                    : 'Copy install command: npm i consulting-ui'
                }
                onClick={() => void copyInstall(INSTALL_COMMAND)}
              >
                <code>{INSTALL_COMMAND}</code>
                <span className={styles.installChipAction}>
                  {installCopied ? '✓ Copied' : 'Copy'}
                </span>
              </button>
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
              onChange={(next) => setView(next as ShowcaseView)}
              items={[
                { id: 'report', label: 'Interactive 2026 Strategy Report' },
                { id: 'charts', label: 'Charts Gallery', count: 12 },
                { id: 'simulator', label: 'Diagnostic & Frameworks Simulator' },
                { id: 'lab', label: 'Tri-Brand Side-by-Side Lab', count: 31 },
              ]}
            />
          </div>
        </nav>

        <main className={styles.main}>
          {view === 'report' ? (
            <ReportView
              onOpenLab={() => setView('lab')}
              onOpenSimulator={() => setView('simulator')}
            />
          ) : view === 'charts' ? (
            <ChartsGalleryView />
          ) : view === 'simulator' ? (
            <SimulatorView onOpenLab={() => setView('lab')} />
          ) : (
            <TriBrandLab />
          )}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <p className={styles.disclaimer}>
              <strong>consulting-ui</strong> is an independent, open-source React 19 + TypeScript design-system library (31 components). It is not affiliated with, sponsored by, or endorsed by McKinsey &amp; Company, Boston Consulting Group, or Bain &amp; Company. All metrics shown are illustrative benchmark datasets.
            </p>
            <div className={styles.footerLinks}>
              <a
                href="https://github.com/sinansonmez/consulting-ui"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Repository
              </a>
              <a
                href="https://www.npmjs.com/package/consulting-ui"
                target="_blank"
                rel="noreferrer"
              >
                npm Package
              </a>
              <span>MIT License · Apache ECharts SVG Engine · OIDC Provenance</span>
            </div>
          </div>
        </footer>
      </div>
    </BrandProvider>
  );
}
