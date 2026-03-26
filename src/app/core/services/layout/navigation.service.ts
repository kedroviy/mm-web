import { Injectable, computed, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, startWith } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);

  // Глобальный триггер навигации
  readonly navEnd = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
    ),
  );

  readonly breadcrumbs = computed(() => {
    this.navEnd(); // Триггер обновления

    const crumbs: { label: string; url: string }[] = [];
    let currentRoute: ActivatedRouteSnapshot | null = this.activatedRoute.snapshot.root;
    let accumulatedUrl = ''; // Здесь мы копим путь для ссылок

    while (currentRoute) {
      // Собираем сегменты пути этого конкретного уровня
      const pathSegments = currentRoute.url.map((segment) => segment.path).join('/');

      if (pathSegments) {
        accumulatedUrl += `/${pathSegments}`;
      }

      const title = currentRoute.data['title'];

      // Добавляем в список, только если у роута есть заголовок
      if (title) {
        crumbs.push({
          label: title,
          // Если путь пустой (корень), ведем на /dashboard или /
          url: accumulatedUrl || '/dashboard',
        });
      }

      currentRoute = currentRoute.firstChild;
    }

    return crumbs;
  });

  // Заголовок текущей страницы (самый глубокий title)
  readonly pageTitle = computed(() => {
    const crumbs = this.breadcrumbs();
    return crumbs.length > 0 ? crumbs[crumbs.length - 1].label : 'Дефолт';
  });

  // Флаг кнопки "Назад"
  readonly canGoBack = computed(() => {
    this.navEnd();
    let route = this.activatedRoute.snapshot;
    while (route.firstChild) route = route.firstChild;
    return !!route.data['canGoBack'];
  });

  goBack() {
    this.location.back();
  }
}
