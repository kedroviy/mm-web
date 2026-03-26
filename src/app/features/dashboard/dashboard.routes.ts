import { Routes } from '@angular/router';

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
        loadComponent: () => import('./pages/nsi-list/nsi-list').then((m) => m.NsiList),
        data: { title: 'Справочники', canGoBack: true },
      },
    ],
  },
];
