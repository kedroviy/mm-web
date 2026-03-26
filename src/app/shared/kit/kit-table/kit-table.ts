import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { TableService } from '@core/services/layout/table/table.service';

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
  ],
  templateUrl: './kit-table.html',
  styleUrl: './kit-table.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitTable {
  private tableService = inject(TableService);

  dataSource = input<any[]>([]);

  displayedColumns = input<string[]>([]);

  onRowClick(row: any) {
    this.tableService.selectItem(row);
  }
}
