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

const VIEW_ONLY_CHILDREN = {
  VIEW: { path: ':id', data: { title: 'Просмотр', canGoBack: true } },
} as const;

export const DASHBOARD_CONFIG = {
  HOME: { path: 'home', data: { title: 'Главная' } },
  USERS: {
    path: 'users',
    data: { title: 'Пользователи', canGoBack: true },
    CHILDREN: VIEW_ONLY_CHILDREN,
  },
  FEEDBACK: {
    path: 'feedback',
    data: { title: 'Обращения пользователей', canGoBack: true },
    CHILDREN: VIEW_ONLY_CHILDREN,
  },
  ANALYTICS_FILTER_USAGE: {
    path: 'analytics/filter-usage',
    data: { title: 'Популярные фильтры', canGoBack: true },
  },
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
