import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'auth/login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard/home',
    renderMode: RenderMode.Client,
  },
];
