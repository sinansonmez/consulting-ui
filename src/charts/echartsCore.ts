import * as echarts from 'echarts/core';
import {
  BarChart as EChartsBarChart,
  CustomChart as EChartsCustomChart,
  ScatterChart as EChartsScatterChart,
  type BarSeriesOption,
  type CustomSeriesOption,
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

echarts.use([
  EChartsBarChart,
  EChartsCustomChart,
  EChartsScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  SVGRenderer,
]);

export type ConsultingChartOption = echarts.ComposeOption<
  | BarSeriesOption
  | CustomSeriesOption
  | ScatterSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | MarkLineComponentOption
>;

export type EChartsInstance = echarts.ECharts;

export { echarts };
