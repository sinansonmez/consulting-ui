import * as echarts from 'echarts/core';
import {
  BarChart as EChartsBarChart,
  CustomChart as EChartsCustomChart,
  FunnelChart as EChartsFunnelChart,
  HeatmapChart as EChartsHeatmapChart,
  LineChart as EChartsLineChart,
  SankeyChart as EChartsSankeyChart,
  ScatterChart as EChartsScatterChart,
  type BarSeriesOption,
  type CustomSeriesOption,
  type FunnelSeriesOption,
  type HeatmapSeriesOption,
  type LineSeriesOption,
  type SankeySeriesOption,
  type ScatterSeriesOption,
} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
  VisualMapComponent,
  type GridComponentOption,
  type LegendComponentOption,
  type MarkAreaComponentOption,
  type MarkLineComponentOption,
  type TooltipComponentOption,
  type VisualMapComponentOption,
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
      EChartsHeatmapChart,
      EChartsLineChart,
      EChartsSankeyChart,
      EChartsScatterChart,
      GridComponent,
      TooltipComponent,
      LegendComponent,
      MarkAreaComponent,
      MarkLineComponent,
      VisualMapComponent,
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
  | HeatmapSeriesOption
  | LineSeriesOption
  | SankeySeriesOption
  | ScatterSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | MarkAreaComponentOption
  | MarkLineComponentOption
  | VisualMapComponentOption
>;

export type EChartsInstance = echarts.ECharts;
