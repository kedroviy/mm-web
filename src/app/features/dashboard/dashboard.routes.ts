import { Routes } from '@angular/router';
import { NsiItem } from '@features/dashboard/pages/nsi-list/nsi-item/nsi-item';
import { Genres } from '@features/dashboard/pages/nsi-list/genres/genres';
import { GenresView } from '@features/dashboard/pages/nsi-list/genres/genres-view/genres-view';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
        data: { title: 'Главная' },
      },
      {
        path: 'nsi-list',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/nsi-list/nsi-list').then((m) => m.NsiList),
            data: { title: 'Справочники', canGoBack: true },
          },
          {
            path: 'genres',
            children: [
              {
                path: '',
                loadComponent: () => import('./pages/nsi-list/genres/genres').then((m) => m.Genres),
                data: { title: 'Жанры', canGoBack: true },
              },
              // {
              //   path: 'create',
              //   loadComponent: () =>
              //     import('./pages/genres/item/genres-item-create.page').then(m => m.GenresItemCreatePage),
              //   data: { title: 'Создать жанр' },
              // },
              {
                path: ':id',
                loadComponent: () =>
                  import('./pages/nsi-list/genres/genres-view/genres-view').then(
                    (m) => m.GenresView,
                  ),
                data: { title: 'Просмотр' },
              },
              // {
              //   path: ':id/edit',
              //   loadComponent: () =>
              //     import('./pages/genres/item/genres-item-edit.page').then(m => m.GenresItemEditPage),
              //   data: { title: 'Редактирование жанра' },
              // },
            ],
          },
          // {
          //   path: 'create',
          //   loadComponent: () =>
          //     import('./pages/nsi-list/item/nsi-item-create.page').then((m) => m.NsiItemCreatePage),
          //   data: { title: 'Создать' },
          // },
          // {
          //   path: ':id/edit',
          //   loadComponent: () =>
          //     import('./pages/nsi-list/item/nsi-item-edit.page').then((m) => m.NsiItemEditPage),
          //   data: { title: 'Редактирование' },
          // },
        ],
      },
    ],
  },
];
