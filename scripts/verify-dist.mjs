import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '..', 'dist', 'index.js');

if (!fs.existsSync(distPath)) {
  console.error(`verify-dist: missing ${distPath}`);
  process.exit(1);
}

const bundle = fs.readFileSync(distPath, 'utf8');

function extractImportedSpecifiers(sourceModule) {
  const regex = new RegExp(
    `import\\s*\\{([^}]+)\\}\\s*from\\s*["']${sourceModule}["']`,
    'g',
  );
  const specifiers = new Set();
  for (const match of bundle.matchAll(regex)) {
    for (const part of match[1].split(',')) {
      const origName = part.trim().split(/\s+as\s+/)[0]?.trim();
      if (origName) specifiers.add(origName);
    }
  }
  return specifiers;
}

const requiredByModule = {
  'echarts/renderers': ['SVGRenderer'],
  'echarts/charts': [
    'BarChart',
    'CustomChart',
    'FunnelChart',
    'HeatmapChart',
    'LineChart',
    'SankeyChart',
    'ScatterChart',
  ],
  'echarts/components': [
    'GridComponent',
    'LegendComponent',
    'MarkAreaComponent',
    'MarkLineComponent',
    'TooltipComponent',
    'VisualMapComponent',
  ],
};

const missing = [];
for (const [mod, syms] of Object.entries(requiredByModule)) {
  const imported = extractImportedSpecifiers(mod);
  for (const sym of syms) {
    if (!imported.has(sym)) {
      missing.push(`${mod}:${sym}`);
    }
  }
}

if (missing.length > 0) {
  console.error(
    `verify-dist: Rollup tree-shook required ECharts imports from dist/index.js: ${missing.join(', ')}`,
  );
  process.exit(1);
}

if (!/\.use\(\[/.test(bundle)) {
  console.error(
    'verify-dist: echarts.use([...]) registration call is missing from dist/index.js',
  );
  process.exit(1);
}

console.log(
  'verify-dist: OK — all ECharts renderer, chart, and component imports + echarts.use([...]) preserved in dist/index.js',
);
