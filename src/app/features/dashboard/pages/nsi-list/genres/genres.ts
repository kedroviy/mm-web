import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import { GenresStore } from './genres.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-genres',
  imports: [KitTable, DatePipe],
  templateUrl: './genres.html',
  styleUrl: './genres.css',
  standalone: true,
})
export class Genres implements OnInit {
  @ViewChild('dateCell', { static: true }) dateCell!: TemplateRef<unknown>;

  readonly store = inject(GenresStore);
  readonly columns: TableColumn[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Название жанра' },
    { key: 'slug', label: 'URL-путь' },
    { key: 'createdAt', label: 'Дата создания' },
  ];

  ngOnInit() {
    this.store.load();
  }

  onPageChange(event: PaginationState) {
    this.store.setPage(event.page, event.limit);
  }
}
