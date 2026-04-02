import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { ActiveImportService } from '@core/services/import-progress/active-import.service';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import { ContentTypeStore } from '@features/dashboard/pages/nsi-list/content-types/content-type.store';
import { DatePipe } from '@angular/common';
import { KitTable } from '@shared/kit/kit-table/kit-table';

@Component({
  selector: 'app-content-types',
  imports: [
    DatePipe,
    KitTable,
  ],
  templateUrl: './content-types.html',
  styleUrl: './content-types.css',
  standalone: true,
})
export class ContentTypes implements OnInit, OnDestroy {
  @ViewChild('dateCell', { static: true }) dateCell!: TemplateRef<unknown>;

  readonly store = inject(ContentTypeStore);
  private readonly activeImport = inject(ActiveImportService);

  readonly columns: TableColumn[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Название жанра' },
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
