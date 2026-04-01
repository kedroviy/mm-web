import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { TableService } from '@core/services/layout/table/table.service';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { COMMON_CONSTANTS } from '@core/constants';
import { KitPaginator, PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import { TableColumn } from './kit-table.types';
import { KitCellDef } from './kit-cell-def.directive';

const ACTIONS_KEY = 'actions';

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
    MatNoDataRow,
    KitPaginator,
  ],
  templateUrl: "./kit-table.html",
  styleUrl: './kit-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class KitTable<T extends object> {
  private tableService = inject(TableService);

  columns = input.required<TableColumn[]>();
  dataSource = input<T[]>([]);
  loading = input(false);
  showViewAction = input(false);
  showDeleteAction = input(false);
  baseRoute = input(COMMON_CONSTANTS.EMPTY_STRING);
  cellTemplates = input<Record<string, TemplateRef<unknown>> | null>(null);

  totalItems = input(0);
  page = input(1);
  limit = input(10);
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);

  delete = output<T>();
  view = output<T>();
  pageChange = output<PaginationState>();

  private cellDefs = contentChildren(KitCellDef);

  readonly displayedKeys = computed(() => {
    const keys = this.columns().map((c) => c.key);
    const hasActions = this.showViewAction() || this.showDeleteAction();
    if (hasActions && !keys.includes(ACTIONS_KEY)) {
      return [...keys, ACTIONS_KEY];
    }
    return keys;
  });

  readonly labelMap = computed(() => {
    const map: Record<string, string> = {};
    for (const col of this.columns()) {
      map[col.key] = col.label;
    }
    return map;
  });

  readonly cellTemplateMap = computed(() => {
    const map: Record<string, TemplateRef<unknown>> = {};

    for (const def of this.cellDefs()) {
      map[def.columnKey()] = def.templateRef;
    }

    const externalTemplates = this.cellTemplates();
    if (externalTemplates) {
      Object.assign(map, externalTemplates);
    }

    return map;
  });


  isActionsColumn(column: string): boolean {
    return column === ACTIONS_KEY;
  }

  onRowClick(row: T): void {
    this.tableService.selectItem(row);
  }
}
