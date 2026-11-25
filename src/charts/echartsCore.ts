import * as echarts from 'echarts/core';
import {
  BarChart as EChartsBarChart,
  CustomChart as EChartsCustomChart,
  FunnelChart as EChartsFunnelChart,
  SankeyChart as EChartsSankeyChart,
  ScatterChart as EChartsScatterChart,
  type BarSeriesOption,
  type CustomSeriesOption,
  type FunnelSeriesOption,
  type SankeySeriesOption,
  type ScatterSeriesOption,
} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
  type GridComponentOption,
  type LegendComponentOption,
  type MarkLineComponentOption,
  type TooltipComponentOption,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

let registered = false;

export function initConsultingChart(
  dom: HTMLElement,
  opts: Parameters<typeof echarts.init>[2],
): echarts.ECharts {
  if (!registered) {
    echarts.use([
      EChartsBarChart,
      EChartsCustomChart,
      EChartsFunnelChart,
      EChartsSankeyChart,
      EChartsScatterChart,
      GridComponent,
      TooltipComponent,
      LegendComponent,
      MarkLineComponent,
      SVGRenderer,
    ]);
    registered = true;
  }
  return echarts.init(dom, undefined, opts);
}

export type ConsultingChartOption = echarts.ComposeOption<
  | BarSeriesOption
  | CustomSeriesOption
  | FunnelSeriesOption
  | SankeySeriesOption
  | ScatterSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | MarkLineComponentOption
>;

export type EChartsInstance = echarts.ECharts;
