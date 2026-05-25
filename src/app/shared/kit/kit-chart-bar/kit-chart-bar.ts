import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-kit-chart-bar',
  imports: [BaseChartDirective],
  templateUrl: './kit-chart-bar.html',
  styleUrl: './kit-chart-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class KitChartBar {
  readonly labels = input.required<string[]>();
  readonly values = input.required<number[]>();
  readonly chartTitle = input<string>('');

  readonly hasData = computed(() => this.labels().length > 0 && this.values().length > 0);

  readonly chartData = computed<ChartData<'bar'>>(() => ({
    labels: this.labels(),
    datasets: [
      {
        label: this.chartTitle() || 'Количество',
        data: this.values(),
        backgroundColor: 'rgba(92, 107, 192, 0.75)',
        borderColor: 'rgba(57, 73, 171, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }));

  readonly chartOptions = computed<ChartOptions<'bar'>>(() => {
    const title = this.chartTitle();
    return {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: title.length > 0, text: title },
      },
      scales: {
        x: { beginAtZero: true, ticks: { precision: 0 } },
      },
    };
  });
}
