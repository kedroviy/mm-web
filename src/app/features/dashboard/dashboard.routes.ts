import { Routes } from '@angular/router';
import { COMMON_CONSTANTS } from '@core/constants';
import { DASHBOARD_CONFIG as PAGES } from '@features/dashboard/lib/dashboard.config';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: PAGES.HOME.path,
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    data: PAGES.HOME.data,
  },
  {
    path: PAGES.NSI.path,
    data: PAGES.NSI.data,
    children: [
      {
        path: COMMON_CONSTANTS.EMPTY_STRING,
        loadComponent: () => import('./pages/nsi-list/nsi-list').then((m) => m.NsiList),
      },
      {
        path: PAGES.NSI.GENRES.path,
        children: [
          {
            path: COMMON_CONSTANTS.EMPTY_STRING,
            loadComponent: () => import('./pages/nsi-list/genres/genres').then((m) => m.Genres),
            data: PAGES.NSI.GENRES.data,
            children: [
              {
                path: PAGES.NSI.GENRES.CHILDREN.CREATE.path,
                loadComponent: () =>
                  import('./pages/nsi-list/genres/genres-create/').then((m) => m.GenresCreate),
                data: PAGES.NSI.GENRES.CHILDREN.CREATE.data, // Крошка "Создание"
              },
              {
                path: PAGES.NSI.GENRES.CHILDREN.VIEW.path,
                loadComponent: () =>
                  import('./pages/nsi-list/genres/genres-view/genres-view').then(
                    (m) => m.GenresView,
                  ),
                data: PAGES.NSI.GENRES.CHILDREN.VIEW.data,
              },
            ],
          },
        ],
      },
    ],
  },
];
