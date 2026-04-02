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
import { NgTemplateOutlet } from '@angular/common';
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
const EXPAND_COLUMN_KEY = '__expand';
const DETAIL_COLUMN_KEY = 'expandedDetail';

@Component({
  selector: 'app-kit-table',
  imports: [
    NgTemplateOutlet,
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

  /** Две строки на запись: основная + опциональная детальная (см. expandDetailTemplate). */
  expandable = input(false);
  /** Какие строки развёрнуты — сравнение по полю expandRowIdKey (по умолчанию id). */
  expandedKeys = input<readonly PropertyKey[]>([]);
  expandRowIdKey = input<string>('id');
  expandDetailTemplate = input<TemplateRef<unknown> | null>(null);
  expandToggle = output<T>();

  totalItems = input(0);
  page = input(1);
  limit = input(10);
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);

  delete = output<T>();
  view = output<T>();
  pageChange = output<PaginationState>();

  private cellDefs = contentChildren(KitCellDef);

  readonly expandColumnKey = EXPAND_COLUMN_KEY;
  readonly detailColumnKey = DETAIL_COLUMN_KEY;

  readonly displayedKeys = computed(() => {
    const keys = this.columns().map((c) => c.key);
    const hasActions = this.showViewAction() || this.showDeleteAction();
    let result =
      hasActions && !keys.includes(ACTIONS_KEY) ? [...keys, ACTIONS_KEY] : [...keys];
    if (this.expandable()) {
      result = [EXPAND_COLUMN_KEY, ...result];
    }
    return result;
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

  isExpandColumn(column: string): boolean {
    return column === EXPAND_COLUMN_KEY;
  }

  isRowExpanded(row: T): boolean {
    const id = (row as unknown as Record<string, PropertyKey | undefined>)[
      this.expandRowIdKey()
    ];
    if (id === undefined) return false;
    return this.expandedKeys().includes(id);
  }

  onExpandClick(row: T): void {
    this.expandToggle.emit(row);
  }

  onRowClick(row: T): void {
    this.tableService.selectItem(row);
  }
}
