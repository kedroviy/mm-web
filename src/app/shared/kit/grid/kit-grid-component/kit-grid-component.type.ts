export interface GridTile {
  text?: string;
  cols: number;
  rows: number;
  color?: string;
  component?: any;
}

export interface GridConfig {
  columns: number;
  rowHeight: string;
  totalRows: number;
  gutter?: string;
  tiles: GridTile[];
}
