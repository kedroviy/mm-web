import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppDatePipe } from '@shared/date/app-date.pipe';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import { ActiveImportService } from '@core/services/import-progress/active-import.service';
import { CountriesStore } from '@features/dashboard/pages/nsi-list/countries/countries.store';

@Component({
  selector: 'app-countries',
  imports: [
    AppDatePipe,
    KitTable,
  ],
  templateUrl: './countries.html',
  styleUrl: './countries.css',
  standalone: true,
})
export class Countries implements OnInit, OnDestroy {
  @ViewChild('dateCell', { static: true }) dateCell!: TemplateRef<unknown>;

  readonly store = inject(CountriesStore);
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
