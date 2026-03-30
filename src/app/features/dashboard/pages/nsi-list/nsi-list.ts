import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';

@Component({
  selector: 'app-nsi-list',
  imports: [KitTable],
  templateUrl: './nsi-list.html',
  styleUrl: './nsi-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NsiList {
  readonly columns: TableColumn[] = [
    { key: 'position', label: '№' },
    { key: 'name', label: 'Название' },
  ];

  readonly items = signal([
    { id: 'genres', position: 1, name: 'Жанры', route: 'genres' },
    { id: 'countries', position: 2, name: 'Страны', route: 'countries' },
  ]);
}
