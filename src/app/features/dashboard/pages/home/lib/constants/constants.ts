import { GridConfig } from '@shared/kit/grid/kit-grid-component/kit-grid-component.type';

export const MY_DASHBOARD_CONFIG: GridConfig = {
  columns: 6,
  rowHeight: '80px',
  totalRows: 12,
  gutter: '16px',
  tiles: [
    { text: 'header', cols: 6, rows: 1, color: '#f1f1f1' },
    { text: 'side menu', cols: 1, rows: 11, color: '#e0f7fa' },
    { text: 'content', cols: 5, rows: 11, color: '#fff9c4' },
    { text: 'footer', cols: 6, rows: 1, color: '#fff9c4' },
  ],
};
