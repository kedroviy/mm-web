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
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  ]);
  readonly columns = ['position', 'name', 'weight', 'symbol'];
}
