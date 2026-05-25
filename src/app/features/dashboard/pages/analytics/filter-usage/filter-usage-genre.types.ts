import type { ChartDoughnutSlice } from '@shared/kit/kit-chart-doughnut/kit-chart-doughnut.types';

export type GenreUsageRow = ChartDoughnutSlice & {
  readonly percent: number;
};
