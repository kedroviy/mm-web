import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { NsiUsersService } from '@core/api/generated/nsi-users/nsi-users.service';
import type { UserNsiResponseDto } from '@core/api/model';
import { catchError, of } from 'rxjs';

type UsersState = {
  readonly users: UserNsiResponseDto[];
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
};

const initialState: UsersState = {
  users: [],
  loading: false,
  loaded: false,
  page: 1,
  limit: 10,
  totalItems: 0,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(NsiUsersService)) => ({
    load(force = false): void {
      if (store.loaded() && !force) {
        return;
      }
      patchState(store, { loading: true });
      api
        .usersNsiControllerGetUsers({
          page: store.page(),
          limit: store.limit(),
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
    setPage(page: number, limit: number): void {
      patchState(store, { page, limit, loaded: false });
      this.load(true);
    },
    invalidate(): void {
      patchState(store, { loaded: false });
    },
  })),
);
