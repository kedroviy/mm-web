import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { KitTable } from '@shared/kit/kit-table/kit-table';

@Component({
  selector: 'app-nsi-list',
  imports: [KitTable],
  templateUrl: './nsi-list.html',
  styleUrl: './nsi-list.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NsiList {
  readonly items = signal([
    { id: 'genres', position: 1, name: 'Жанры', route: 'genres' },
    { id: 'countries', position: 2, name: 'Страны', route: 'countries' },
  ]);

  readonly columns = ['position', 'name', 'actions'];
}
