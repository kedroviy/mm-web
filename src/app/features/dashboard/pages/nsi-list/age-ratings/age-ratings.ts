import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { ActiveImportService } from '@core/services/import-progress/active-import.service';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import { AgeRatingStore } from '@features/dashboard/pages/nsi-list/age-ratings/age-rating.store';
import { AppDatePipe } from '@shared/date/app-date.pipe';
import { KitTable } from '@shared/kit/kit-table/kit-table';

@Component({
  selector: 'app-age-ratings',
  imports: [AppDatePipe,
    KitTable],
  templateUrl: './age-ratings.html',
  styleUrl: './age-ratings.css',
  standalone: true,
})
export class AgeRatings implements OnInit, OnDestroy {
  @ViewChild('dateCell', { static: true }) dateCell!: TemplateRef<unknown>;

  readonly store = inject(AgeRatingStore);
  private readonly activeImport = inject(ActiveImportService);

  readonly columns: TableColumn[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Название страны' },
    { key: 'slug', label: 'URL-путь' },
    { key: 'createdAt', label: 'Дата создания' },
    { key: 'description', label: 'Описание' },
  ];

  ngOnInit() {
    this.activeImport.register(this.store);
    this.store.load();
  }

  ngOnDestroy() {
    this.activeImport.unregister(this.store);
  }

  onPageChange(event: PaginationState) {
    this.store.setPage(event.page, event.limit);
  }
}
