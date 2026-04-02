import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { ActiveImportService } from '@core/services/import-progress/active-import.service';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import { AwardsStore } from '@features/dashboard/pages/nsi-list/awards/awards.store';

@Component({
  selector: 'app-awards',
  imports: [
    DatePipe,
    KitTable,
  ],
  templateUrl: './awards.html',
  styleUrl: './awards.css',
  standalone: true,
})
export class Awards implements OnInit, OnDestroy {
  @ViewChild('dateCell', { static: true }) dateCell!: TemplateRef<unknown>;

  readonly store = inject(AwardsStore);
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
