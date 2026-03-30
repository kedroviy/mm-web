import { Injectable, computed, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, startWith } from 'rxjs';
import { Location } from '@angular/common';
import { COMMON_CONSTANTS } from '@core/constants';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);

  readonly navEnd = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
    ),
  );

  private readonly lastRoute = computed(() => {
    this.navEnd(); // следим за навигацией
    let route = this.activatedRoute.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  });

  // Теперь actionLink вычисляется автоматически
  readonly actionLink = computed(() => {
    return this.lastRoute().data['actionLink'] || null;
  });

  readonly actionLabel = computed(() => {
    return this.lastRoute().data['actionLabel'] || 'Создать';
  });

  readonly breadcrumbs = computed(() => {
    this.navEnd();

    const crumbs: { label: string; url: string }[] = [];
    let currentRoute: ActivatedRouteSnapshot | null = this.activatedRoute.snapshot.root;
    let accumulatedUrl = COMMON_CONSTANTS.EMPTY_STRING;

    while (currentRoute) {
      const pathSegments = currentRoute.url.map((segment) => segment.path).join('/');

      if (pathSegments) {
        accumulatedUrl += `/${pathSegments}`;
      }

      const title = currentRoute.data['title'];

      if (title) {
        crumbs.push({
          label: title,
          url: accumulatedUrl || '/dashboard',
        });
      }

      currentRoute = currentRoute.firstChild;
    }

    return crumbs;
  });

  readonly pageTitle = computed(() => {
    const crumbs = this.breadcrumbs();
    return crumbs.length > 0 ? crumbs[crumbs.length - 1].label : 'Дефолт';
  });

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
