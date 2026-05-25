import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';

import { CHART_DOUGHNUT_COLORS } from './chart-doughnut-colors';
import type { ChartDoughnutSlice } from './kit-chart-doughnut.types';

let areDoughnutPluginsRegistered = false;

function ensureDoughnutPluginsRegistered(): void {
  if (areDoughnutPluginsRegistered) {
    return;
  }
  Chart.register(ChartDataLabels);
  areDoughnutPluginsRegistered = true;
}

function resolveSliceTotal(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

@Component({
  selector: 'app-kit-chart-doughnut',
  imports: [BaseChartDirective],
  templateUrl: './kit-chart-doughnut.html',
  styleUrl: './kit-chart-doughnut.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class KitChartDoughnut {
  readonly slices = input.required<readonly ChartDoughnutSlice[]>();
  readonly chartTitle = input<string>('');

  readonly hasData = computed(() => this.slices().some((slice) => slice.value > 0));

  readonly chartData = computed<ChartData<'doughnut'>>(() => {
    const slices = this.slices();
    return {
      labels: slices.map((slice) => slice.label),
      datasets: [
        {
          data: slices.map((slice) => slice.value),
          backgroundColor: slices.map((_, index) => CHART_DOUGHNUT_COLORS[index % CHART_DOUGHNUT_COLORS.length]),
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  });

  readonly chartOptions = computed<ChartOptions<'doughnut'>>(() => {
    const title = this.chartTitle();
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '52%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 14,
            padding: 10,
            generateLabels: (chart) => {
              const dataset = chart.data.datasets[0];
              const labels = (chart.data.labels ?? []) as string[];
              const values = (dataset.data ?? []) as number[];
              const colors = dataset.backgroundColor as string[];
              const total = resolveSliceTotal(values.map((value) => Number(value)));
              return labels.map((label, index) => {
                const value = Number(values[index] ?? 0);
                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return {
                  text: `${label} — ${value} (${percent}%)`,
                  fillStyle: Array.isArray(colors) ? colors[index] : String(colors),
                  strokeStyle: '#fff',
                  lineWidth: 1,
                  hidden: false,
                  index,
                };
              });
            },
          },
        },
        title: { display: title.length > 0, text: title },
        datalabels: {
          color: '#fff',
          font: { weight: 'bold', size: 11 },
          textAlign: 'center',
          formatter: (value: number, context) => {
            const dataset = context.chart.data.datasets[context.datasetIndex];
            const values = (dataset.data ?? []) as number[];
            const total = resolveSliceTotal(values.map((entry) => Number(entry)));
            if (total === 0 || Number(value) === 0) {
              return '';
            }
            const percent = ((Number(value) / total) * 100).toFixed(1);
            return `${percent}%\n${value}`;
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = Number(context.raw ?? 0);
              const values = (context.dataset.data ?? []) as number[];
              const total = resolveSliceTotal(values.map((entry) => Number(entry)));
              const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
              return `${context.label}: ${value} (${percent}%)`;
            },
          },
        },
      },
    };
  });

  constructor() {
    ensureDoughnutPluginsRegistered();
  }
}
