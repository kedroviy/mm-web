import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import {
  ImportProgressService,
} from '@core/services/import-progress/import-progress.service';
import { catchError, of, switchMap, tap, EMPTY } from 'rxjs';
import { AgeRating, AgeRatingState } from '@features/dashboard/pages/nsi-list/age-ratings/age-rating.types';
import { NsiAgeratingService } from '@core/api/generated/nsi-agerating/nsi-agerating.service';


const initialState: AgeRatingState = {
  data: [],
  loading: false,
  loaded: false,
  page: 1,
  limit: 10,
  totalItems: 0,
  importStatus: 'idle',
  importProgress: 0,
  importMessage: '',
};

export const AgeRatingStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((
    store,
    ageRatingService = inject(NsiAgeratingService),
    progressService = inject(ImportProgressService),
  ) => ({
    load(force = false): void {
      if (store.loaded() && !force) return;

      patchState(store, { loading: true });

      ageRatingService
        .ageRatingControllerGetWithPages({ page: store.page(), limit: store.limit() })
        .pipe(
          catchError(() => of({ data: [], totalItems: 0 })),
        )
        .subscribe((res) => {
          patchState(store, {
            data: (res.data as AgeRating[]) ?? [],
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

      ageRatingService
        .ageRatingControllerImportExcel({ file })
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
            return progressService.connect(`/api/v1/nsi/ageRating/import-progress/${jobId}`).pipe(
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
