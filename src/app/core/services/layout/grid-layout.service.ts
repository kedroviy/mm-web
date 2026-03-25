import { computed, Injectable, signal } from '@angular/core';
import { GridConfig } from '@shared/kit/grid/kit-grid-component/kit-grid-component.type';
import { KitHeader } from '@shared/kit/kit-header';
import { DashboardHubSection } from '../../../features/dashboard/ui/dashboard-hub-section/dashboard-hub-section';

@Injectable({
  providedIn: 'root',
})
export class GridLayoutService {
  private _isMenuExpanded = signal(false);
  readonly isMenuExpanded = this._isMenuExpanded.asReadonly();
  readonly isExpanded = this._isMenuExpanded();

  private readonly BASE_CONFIG = {
    columns: 12,
    rowHeight: '80px',
    totalRows: 12,
    gutter: '16px',
  };

  readonly adminConfig = computed<GridConfig>(() => {
    const isExpanded = this._isMenuExpanded();
    return {
      ...this.BASE_CONFIG,
      isExpanded: isExpanded,
      tiles: [
        {
          text: 'Admin Header',
          cols: 12,
          rows: 1,
          component: KitHeader,
          inputs: {
            title: 'Панель администратора',
          },
        },
        { text: 'Side Menu', cols: isExpanded ? 1 : 0, rows: 11 },
        {
          text: 'Admin Statistics',
          cols: 11,
          rows: 5,
          component: DashboardHubSection,
        },
        { text: 'System Logs', cols: 11, rows: 6, color: '#ffecb3' },
        { text: 'Footer', cols: 12, rows: 1, color: '#333' },
      ],
    };
  });

  readonly userConfig = computed<GridConfig>(() => {
    const isExpanded = this._isMenuExpanded();
    return {
      ...this.BASE_CONFIG,
      tiles: [
        { text: 'User Header', cols: 6, rows: 1, color: '#f1f1f1' },
        { text: 'Menu', cols: isExpanded ? 2 : 1, rows: 11, color: '#e0f7fa' },
        { text: 'My Dashboard', cols: isExpanded ? 4 : 5, rows: 11, color: '#fff' },
      ],
    };
  });

  toggleMenu() {
    this._isMenuExpanded.update((_isMenuExpanded) => !_isMenuExpanded);
  }
}
