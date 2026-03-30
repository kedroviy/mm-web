import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { GenresService } from '@core/api/generated/nsi-genres/nsi-genres.service';
import { catchError, map, of } from 'rxjs';
import { Genre } from './genres.types';

interface GenresState {
  genres: Genre[];
  loading: boolean;
  loaded: boolean;
}

const initialState: GenresState = {
  genres: [],
  loading: false,
  loaded: false,
};

export const GenresStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, genresService = inject(GenresService)) => ({
    load(force = false): void {
      if (store.loaded() && !force) return;

      patchState(store, { loading: true });

      genresService
        .genresControllerGetWithPages({ page: 1, limit: 10 })
        .pipe(
          map((res) => (res.data as Genre[]) ?? []),
          catchError(() => of([])),
        )
        .subscribe((genres) => {
          patchState(store, { genres, loading: false, loaded: true });
        });
    },
    invalidate(): void {
      patchState(store, { loaded: false });
    },
    reload(): void {
      this.invalidate();
      this.load(true);
    },
  })),
);
