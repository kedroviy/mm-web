export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  /** Sort field sent to the API when it differs from `key` (for example row index → id). */
  sortKey?: string;
  width?: string;
}

export type TableSortDirection = 'asc' | 'desc';

export interface TableSortChange {
  readonly key: string;
  readonly direction: TableSortDirection;
}
