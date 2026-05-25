import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { FilterUsageApiService } from '@core/services/analytics/filter-usage-api.service';
import type { FilterUsageItemDto, FilterUsageType } from '@core/api/model/filter-usage.types';
import { catchError, of } from 'rxjs';

import type { GenreUsageRow } from './filter-usage-genre.types';

const CHART_TOP_LIMIT = 10;
const GENRE_CHART_LIMIT = 24;

interface FilterUsageState {
  readonly items: FilterUsageItemDto[];
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly filterType: FilterUsageType | null;
  readonly genreItems: FilterUsageItemDto[];
  readonly genreLoading: boolean;
  readonly genreLoaded: boolean;
}

const initialState: FilterUsageState = {
  items: [],
  loading: false,
  loaded: false,
  page: 1,
  limit: 20,
  totalItems: 0,
  filterType: null,
  genreItems: [],
  genreLoading: false,
  genreLoaded: false,
};

export const FilterUsageStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    chartLabels: computed(() =>
      store
        .items()
        .slice(0, CHART_TOP_LIMIT)
        .map((item) => item.name),
    ),
    chartValues: computed(() =>
      store
        .items()
        .slice(0, CHART_TOP_LIMIT)
        .map((item) => item.selectionCount),
    ),
    hasChartData: computed(() => store.items().length > 0),
    genreSlices: computed((): GenreUsageRow[] => {
      const items = store.genreItems();
      const total = items.reduce((sum, item) => sum + item.selectionCount, 0);
      if (total === 0) {
        return [];
      }
      return items.map((item) => {
        const percent = Math.round((item.selectionCount / total) * 1000) / 10;
        return {
          label: item.name,
          value: item.selectionCount,
          percent,
        };
      });
    }),
    hasGenreChartData: computed(() => store.genreItems().some((item) => item.selectionCount > 0)),
    genreSelectionsTotal: computed(() =>
      store.genreItems().reduce((sum, item) => sum + item.selectionCount, 0),
    ),
  })),
  withMethods((store, api = inject(FilterUsageApiService)) => ({
    load(force = false): void {
      if (store.loaded() && !force) {
        return;
      }
      patchState(store, { loading: true });
      api
        .getFilterUsage({
          page: store.page(),
          limit: store.limit(),
          sort: 'selectionCount:desc',
          filterType: store.filterType() ?? undefined,
        })
        .pipe(
          catchError(() =>
            of({
              items: [] as FilterUsageItemDto[],
              total: 0,
              page: store.page(),
              limit: store.limit(),
            }),
          ),
        )
        .subscribe((res) => {
          patchState(store, {
            items: res.items ?? [],
            totalItems: res.total ?? 0,
            loading: false,
            loaded: true,
          });
        });
    },
    setFilterType(filterType: FilterUsageType | null): void {
      patchState(store, { filterType, page: 1, loaded: false });
      this.load(true);
    },
    setPage(page: number, limit: number): void {
      patchState(store, { page, limit, loaded: false });
      this.load(true);
    },
    loadGenres(force = false): void {
      if (store.genreLoaded() && !force) {
        return;
      }
      patchState(store, { genreLoading: true });
      api
        .getFilterUsage({
          page: 1,
          limit: GENRE_CHART_LIMIT,
          sort: 'selectionCount:desc',
          filterType: 'genre',
        })
        .pipe(
          catchError(() =>
            of({
              items: [] as FilterUsageItemDto[],
              total: 0,
              page: 1,
              limit: GENRE_CHART_LIMIT,
            }),
          ),
        )
        .subscribe((res) => {
          patchState(store, {
            genreItems: res.items ?? [],
            genreLoading: false,
            genreLoaded: true,
          });
        });
    },
    loadPage(force = false): void {
      this.load(force);
      this.loadGenres(force);
    },
  })),
);
