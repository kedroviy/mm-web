import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { NsiUsersService } from '@core/api/generated/nsi-users/nsi-users.service';
import { AdminAnalyticsApiService } from '@core/services/analytics/admin-analytics-api.service';
import type { UserNsiResponseDto } from '@core/api/model';
import type { UsersLifecycleFilter, UsersOverviewResponse } from '@core/api/model/admin-analytics.types';
import { catchError, of } from 'rxjs';

interface UsersState {
  readonly users: UserNsiResponseDto[];
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly lifecycle: UsersLifecycleFilter;
  readonly lastLoginFrom: string;
  readonly lastLoginTo: string;
  readonly usernameQuery: string;
  readonly emailQuery: string;
  readonly overview: UsersOverviewResponse | null;
  readonly overviewLoading: boolean;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  loaded: false,
  page: 1,
  limit: 10,
  totalItems: 0,
  lifecycle: 'all',
  lastLoginFrom: '',
  lastLoginTo: '',
  usernameQuery: '',
  emailQuery: '',
  overview: null,
  overviewLoading: false,
};

function toIsoDateStart(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  return new Date(`${trimmed}T00:00:00.000Z`).toISOString();
}

function toIsoDateEnd(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  return new Date(`${trimmed}T23:59:59.999Z`).toISOString();
}

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(NsiUsersService), analytics = inject(AdminAnalyticsApiService)) => ({
    load(force = false): void {
      if (store.loaded() && !force) {
        return;
      }
      patchState(store, { loading: true });
      api
        .usersNsiControllerGetUsers({
          page: store.page(),
          limit: store.limit(),
          lifecycle: store.lifecycle() === 'all' ? undefined : store.lifecycle(),
          lastLoginFrom: toIsoDateStart(store.lastLoginFrom()),
          lastLoginTo: toIsoDateEnd(store.lastLoginTo()),
          usernameQuery: store.usernameQuery().trim() || undefined,
          emailQuery: store.emailQuery().trim() || undefined,
          sort: 'lastLoginAt:desc',
        })
        .pipe(catchError(() => of({ items: [], total: 0, page: store.page(), limit: store.limit() })))
        .subscribe((res) => {
          patchState(store, {
            users: res.items ?? [],
            totalItems: res.total ?? 0,
            loading: false,
            loaded: true,
          });
        });
    },
    loadOverview(): void {
      patchState(store, { overviewLoading: true });
      analytics
        .getUsersOverview()
        .pipe(catchError(() => of(null)))
        .subscribe((overview) => {
          patchState(store, { overview, overviewLoading: false });
        });
    },
    setPage(page: number, limit: number): void {
      patchState(store, { page, limit, loaded: false });
      this.load(true);
    },
    setLifecycle(lifecycle: UsersLifecycleFilter): void {
      patchState(store, { lifecycle, page: 1, loaded: false });
      this.load(true);
    },
    setLastLoginFrom(lastLoginFrom: string): void {
      patchState(store, { lastLoginFrom, page: 1, loaded: false });
      this.load(true);
    },
    setLastLoginTo(lastLoginTo: string): void {
      patchState(store, { lastLoginTo, page: 1, loaded: false });
      this.load(true);
    },
    setUsernameQuery(usernameQuery: string): void {
      patchState(store, { usernameQuery, page: 1, loaded: false });
      this.load(true);
    },
    setEmailQuery(emailQuery: string): void {
      patchState(store, { emailQuery, page: 1, loaded: false });
      this.load(true);
    },
    invalidate(): void {
      patchState(store, { loaded: false });
    },
  })),
);
