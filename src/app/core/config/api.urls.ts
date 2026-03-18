import { ApiUrls } from '../interfaces/api-urls.interface';

export const API_URLS: ApiUrls = {
  auth: {
    login: '/api/login',
    logout: '/api/logout',
  },
  users: {
    list: '/api/users',
    create: '/api/users/create',
    edit: (id: string) => `/api/users/${id}`,
  },
  filters: {
    list: '/api/filters',
    create: '/api/filters/create',
    edit: (id: string) => `/api/filters/${id}`,
  },
};
