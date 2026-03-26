import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  inject,
  input,
  output,
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { TableService } from '@core/services/layout/table/table.service';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { COMMON_CONSTANTS } from '@core/constants';

@Component({
  selector: 'app-kit-table',
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    RouterLink,
    MatIcon,
  ],
  templateUrl: './kit-table.html',
  styleUrl: './kit-table.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitTable<T> {
  private tableService = inject(TableService);

  dataSource = input<T[]>([]);
  displayedColumns = input<string[]>([]);
  showViewAction = input<boolean>(false);
  showDeleteAction = input<boolean>(false);
  baseRoute = input<string>(COMMON_CONSTANTS.EMPTY_STRING);

  delete = output<T>();
  view = output<T>();

  customColumns = contentChildren(MatColumnDef);

  isCustomColumn(column: string): boolean {
    return this.customColumns().some((col) => col.name === column);
  }

  onRowClick(row: T) {
    this.tableService.selectItem(row);
  }
}
