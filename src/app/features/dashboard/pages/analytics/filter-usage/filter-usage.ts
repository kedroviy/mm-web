import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { KitChartBar } from '@shared/kit/kit-chart-bar/kit-chart-bar';
import { KitChartDoughnut } from '@shared/kit/kit-chart-doughnut/kit-chart-doughnut';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import type { FilterUsageType } from '@core/api/model/filter-usage.types';

import { FILTER_USAGE_TYPE_OPTIONS, resolveFilterUsageTypeLabel } from './filter-usage.labels';
import { FilterUsageStore } from './filter-usage.store';

@Component({
  selector: 'app-filter-usage-analytics',
  imports: [KitChartBar, KitChartDoughnut, KitTable, MatFormFieldModule, MatSelectModule, DatePipe],
  templateUrl: './filter-usage.html',
  styleUrl: './filter-usage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FilterUsageAnalytics implements OnInit {
  readonly store = inject(FilterUsageStore);
  readonly filterTypeOptions = FILTER_USAGE_TYPE_OPTIONS;
  readonly resolveFilterTypeLabel = resolveFilterUsageTypeLabel;
  
  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Фильтр' },
    { key: 'filterType', label: 'Тип' },
    { key: 'selectionCount', label: 'Выборов' },
    { key: 'updatedAt', label: 'Обновлено' },
  ];

  readonly genreColumns: TableColumn[] = [
    { key: 'label', label: 'Жанр' },
    { key: 'value', label: 'Выборов' },
    { key: 'percent', label: 'Доля, %' },
  ];

  ngOnInit(): void {
    this.store.loadPage(true);
  }

  onFilterTypeChange(event: MatSelectChange): void {
    const value = event.value as FilterUsageType | null;
    this.store.setFilterType(value);
  }

  onPageChange(event: PaginationState): void {
    this.store.setPage(event.page, event.limit);
  }
}
