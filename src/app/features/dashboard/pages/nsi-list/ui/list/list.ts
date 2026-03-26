import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { KitTable } from '@shared/kit/kit-table/kit-table';

@Component({
  selector: 'app-list',
  imports: [KitTable],
  templateUrl: './list.html',
  styleUrl: './list.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  readonly items = signal([
    { position: 1, name: 'Жанры' },
    { position: 2, name: 'Helium' },
  ]);
  readonly columns = ['position', 'name', 'actions'];
}
