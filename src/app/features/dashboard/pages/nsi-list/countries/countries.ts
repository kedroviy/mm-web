import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import { CountriesStore } from '@features/dashboard/pages/nsi-list/countries/countries.store';

@Component({
  selector: 'app-countries',
  imports: [
    DatePipe,
    KitTable,
  ],
  templateUrl: './countries.html',
  styleUrl: './countries.css',
  standalone: true,
})
export class Countries implements OnInit {
  @ViewChild('dateCell', { static: true }) dateCell!: TemplateRef<unknown>;

  readonly store = inject(CountriesStore);
  readonly columns: TableColumn[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Название страны' },
    { key: 'slug', label: 'URL-путь' },
    { key: 'createdAt', label: 'Дата создания' },
  ];

  ngOnInit() {
    this.store.load();
    console.log('countres');
  }

  onPageChange(event: PaginationState) {
    this.store.setPage(event.page, event.limit);
  }
}
