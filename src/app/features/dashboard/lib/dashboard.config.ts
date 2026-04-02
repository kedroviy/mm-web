import { AppRouteConfig } from '@features/dashboard/lib/interfaces/dashboard.interface';

const DEFAULT_NSI_CHILDREN = {
  CREATE: { path: 'create', data: { title: 'Создание', canGoBack: true } },
  VIEW: { path: ':id', data: { title: 'Просмотр', canGoBack: true } },
} as const;

const createNsiItem = (path: string, title: string) => ({
  path,
  data: {
    title,
    canGoBack: true,
    action: { link: 'create', label: 'Добавить новую запись' },
    uploadAction: { label: 'Загрузить из файла' },
  },
  CHILDREN: DEFAULT_NSI_CHILDREN,
} as const);

export const DASHBOARD_CONFIG = {
  HOME: { path: 'home', data: { title: 'Главная' } },
  NSI: {
    path: 'nsi-list',
    data: { title: 'Справочники', canGoBack: true },
    GENRES: createNsiItem('genres', 'Жанры'),
    COUNTRIES: createNsiItem('countries', 'Страны'),
    AWARDS: createNsiItem('awards', 'Списки и награды'),
    CONTENT_TYPE: createNsiItem('content-types', 'Формат контента'),
    AGE_RATING: createNsiItem('age-rating', 'Возрастной ценз (MPAA / РФ)'),
    AWARD_CATEGORY: createNsiItem('award-category', 'Категории наград'),
  },
} as const satisfies Record<string, AppRouteConfig>;
