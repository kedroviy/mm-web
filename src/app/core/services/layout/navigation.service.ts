import { Injectable, computed, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, startWith } from 'rxjs';
import { Location } from '@angular/common';
import { COMMON_CONSTANTS } from '@core/constants';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  readonly navEnd = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
    ),
  );

  private readonly lastRouteSnapshot = computed(() => {
    this.navEnd();
    let route = this.route.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route;
  });

  private readonly deepestRoute = computed(() => {
    this.navEnd();
    let route = this.route.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route;
  });

  readonly activeAction = computed(() => {
    this.navEnd();
    let route: ActivatedRouteSnapshot | null = this.deepestRoute();

    while (route) {
      // Если нашли экшен на этом уровне - возвращаем его
      if (route.data['action']) {
        return route.data['action'];
      }
      // Если дошли до уровня, где путь не пустой (например, 'create'),
      // и экшена нет - значит мы ушли слишком далеко, кнопка не нужна.
      if (route.url.length > 0 && route !== this.deepestRoute()) {
        break;
      }
      route = route.parent;
    }
    return null;
  });

  // 3. Данные для заголовка и canGoBack берем как обычно
  readonly activeData = computed(() => this.deepestRoute().data);

  readonly canGoBack = computed(() => !!this.activeData()['canGoBack']);

  readonly currentBaseUrl = computed(() => {
    let route = this.route.snapshot.root;
    let url = COMMON_CONSTANTS.EMPTY_STRING;
    while (route.firstChild) {
      route = route.firstChild;
      const path = route.url.map((s) => s.path).join('/');
      if (path) url += `/${path}`;
    }
    return url;
  });

  readonly breadcrumbs = computed(() => {
    this.navEnd();
    const crumbs: { label: string; url: string }[] = [];
    let currentRoute: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    let accumulatedUrl = '';

    while (currentRoute) {
      // 1. Берем сегменты текущего уровня
      const pathSegments = currentRoute.url.map((s) => s.path).join('/');

      // 2. Добавляем сегмент к пути ТОЛЬКО если он не пустой
      if (pathSegments) {
        accumulatedUrl = `${accumulatedUrl}/${pathSegments}`;
      }

      const title = currentRoute.data['title'];
      if (title) {
        // 3. Гарантируем, что URL всегда начинается с /
        const cleanUrl = accumulatedUrl.startsWith('/') ? accumulatedUrl : `/${accumulatedUrl}`;

        // 4. Проверка на дубликаты заголовков
        if (crumbs.length === 0 || crumbs[crumbs.length - 1].label !== title) {
          crumbs.push({
            label: title,
            url: cleanUrl || '/dashboard',
          });
        }
      }
      currentRoute = currentRoute.firstChild;
    }
    return crumbs;
  });

  readonly pageTitle = computed(() => {
    return this.breadcrumbs().slice(-1)[0]?.label || 'Дефолт';
  });

  goBack() {
    const crumbs = this.breadcrumbs();
    if (crumbs.length > 1) {
      // Переходим на URL предыдущей крошки
      const parentUrl = crumbs[crumbs.length - 2].url;
      void this.router.navigate([parentUrl]);
    } else {
      void this.router.navigate(['/dashboard/home']);
    }
  }
}
