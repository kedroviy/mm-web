import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { NsiGenresService } from '@core/api/nsi-admin/generated/nsi-genres/nsi-genres.service';
import {
  ImportProgressService,
} from '@core/services/import-progress/import-progress.service';
import { catchError, of, switchMap, tap, EMPTY } from 'rxjs';
import { Genre, GenresState } from './genres.types';


const initialState: GenresState = {
  genres: [],
  loading: false,
  loaded: false,
  page: 1,
  limit: 10,
  totalItems: 0,
  importStatus: 'idle',
  importProgress: 0,
  importMessage: '',
};

export const GenresStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((
    store,
    genresService = inject(NsiGenresService),
    progressService = inject(ImportProgressService),
  ) => ({
    load(force = false): void {
      if (store.loaded() && !force) return;

      patchState(store, { loading: true });

      genresService
        .genresControllerGetWithPages({ page: store.page(), limit: store.limit() })
        .pipe(
          catchError(() => of({ data: [], totalItems: 0 })),
        )
        .subscribe((res) => {
          patchState(store, {
            genres: (res.data as Genre[]) ?? [],
            totalItems: res.totalItems ?? 0,
            loading: false,
            loaded: true,
          });
        });
    },

    setPage(page: number, limit: number): void {
      patchState(store, { page, limit, loaded: false });
      this.load(true);
    },

    importExcel(file: File): void {
      patchState(store, {
        importStatus: 'uploading',
        importProgress: 0,
        importMessage: 'Загрузка файла…',
      });

      genresService
        .genresControllerImportExcel({ file })
        .pipe(
          catchError(() => {
            patchState(store, {
              importStatus: 'error',
              importMessage: 'Ошибка загрузки файла',
            });
            return EMPTY;
          }),
          switchMap((res: unknown) => {
            const { jobId } = res as { jobId: string };
            patchState(store, {
              importStatus: 'processing',
              importMessage: 'Обработка…',
            });
            return progressService.connect(`/api/v1/nsi/genres/import-progress/${jobId}`).pipe(
              tap((event) => {
                patchState(store, {
                  importStatus: event.status,
                  importProgress: event.progress,
                  importMessage: event.message ?? '',
                });
              }),
              catchError(() => {
                patchState(store, {
                  importStatus: 'error',
                  importMessage: 'Потеряно соединение с сервером',
                });
                return EMPTY;
              }),
            );
          }),
        )
        .subscribe({
          complete: () => {
            const status = store.importStatus();
            if (status === 'completed') {
              this.reload();
            }
            this.resetImport();
          },
        });
    },

    resetImport(): void {
      patchState(store, {
        importStatus: 'idle',
        importProgress: 0,
        importMessage: '',
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
