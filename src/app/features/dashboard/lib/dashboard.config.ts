import { AppRouteConfig } from '@features/dashboard/lib/interfaces/dashboard.interface';

export const DASHBOARD_CONFIG = {
  HOME: { path: 'home', data: { title: 'Главная' } },
  NSI: {
    path: 'nsi-list',
    data: { title: 'Справочники', canGoBack: true },
    GENRES: {
      path: 'genres',
      data: {
        title: 'Жанры',
        canGoBack: true,
        action: { link: 'create', label: 'Добавить жанр' },
        uploadAction: { label: 'Загрузить из файла' },
      },
      CHILDREN: {
        CREATE: { path: 'create', data: { title: 'Создание', canGoBack: true } },
        VIEW: { path: ':id', data: { title: 'Просмотр', canGoBack: true } },
      },
    },
  },
} as const satisfies Record<string, AppRouteConfig>;
