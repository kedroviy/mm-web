import { Type } from '@angular/core';

export interface GridTile {
  text?: string;
  cols: number;
  rows: number;
  color?: string;
  component?: Type<unknown>;
  inputs?: Record<string, unknown>;
}

export interface GridConfig {
  columns: number;
  rowHeight: string;
  totalRows: number;
  gutter?: string;
  tiles: GridTile[];
  isExpanded?: boolean;
}
