import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { NsiGenresService } from '@core/api/generated/nsi-genres/nsi-genres.service';
import { catchError, map, of } from 'rxjs';
import { Genre } from './genres.types';

interface GenresState {
  genres: Genre[];
  loading: boolean;
  loaded: boolean;
  importing: boolean;
}

const initialState: GenresState = {
  genres: [],
  loading: false,
  loaded: false,
  importing: false,
};

export const GenresStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, genresService = inject(NsiGenresService)) => ({
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
    importExcel(file: File): void {
      patchState(store, { importing: true });

      genresService
        .genresControllerImportExcel({ file })
        .pipe(catchError(() => of(null)))
        .subscribe((result) => {
          patchState(store, { importing: false });
          if (result !== null) {
            this.reload();
          }
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
