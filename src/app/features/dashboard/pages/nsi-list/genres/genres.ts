import { Component, inject, OnInit } from '@angular/core';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { GenresStore } from './genres.store';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [KitTable],
  templateUrl: './genres.html',
  styleUrl: './genres.css',
})
export class Genres implements OnInit {
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
}
