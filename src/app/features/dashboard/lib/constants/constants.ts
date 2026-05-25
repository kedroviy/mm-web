export const MODULES = [
  { title: 'Справочники', description: 'Управление НСИ и кодами', link: '/dashboard/nsi-list' },
  { title: 'Пользователи', description: 'Учётные записи пользователей', link: '/dashboard/users' },
  { title: 'Обращения', description: 'Обратная связь от пользователей', link: '/dashboard/feedback' },
  { title: 'База данных', description: 'Статус и бэкапы', link: '/db-admin' },
];

export const LOGS_MODULES = [
  { title: 'Сессии', description: 'Аналитика сессий', link: '/db-admin' },
  {
    title: 'Популярные фильтры',
    description: 'Какие фильтры чаще выбирают при подборе фильмов',
    link: '/dashboard/analytics/filter-usage',
  },
];
