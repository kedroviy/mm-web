import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { AdminAnalyticsApiService } from '@core/services/analytics/admin-analytics-api.service';
import type { MatchFunnelResponse } from '@core/api/model/admin-analytics.types';
import { catchError, of } from 'rxjs';

const STAGE_LABELS: Record<string, string> = {
  created: 'Создано',
  joined2: '≥2 участников',
  started: 'Старт матча',
  shortlist: 'Shortlist',
  result: 'Результат',
};

interface MatchFunnelState {
  readonly data: MatchFunnelResponse | null;
  readonly loading: boolean;
  readonly from: string;
  readonly to: string;
  readonly platformChannel: 'all' | 'web' | 'mobile' | 'unknown';
}

const initialState: MatchFunnelState = {
  data: null,
  loading: false,
  from: '',
  to: '',
  platformChannel: 'all',
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

export const MatchFunnelStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    chartLabels: computed(() =>
      (store.data()?.stages ?? []).map((stage) => STAGE_LABELS[stage.stage] ?? stage.stage),
    ),
    chartValues: computed(() => (store.data()?.stages ?? []).map((stage) => stage.count)),
    hasChartData: computed(() => (store.data()?.stages?.length ?? 0) > 0),
    stageLabel: computed(() => STAGE_LABELS),
  })),
  withMethods((store, api = inject(AdminAnalyticsApiService)) => ({
    load(): void {
      patchState(store, { loading: true });
      api
        .getMatchFunnel({
          from: toIsoDateStart(store.from()),
          to: toIsoDateEnd(store.to()),
          platformChannel: store.platformChannel(),
        })
        .pipe(catchError(() => of(null)))
        .subscribe((data) => {
          patchState(store, { data, loading: false });
        });
    },
    setFrom(from: string): void {
      patchState(store, { from });
      this.load();
    },
    setTo(to: string): void {
      patchState(store, { to });
      this.load();
    },
    setPlatformChannel(platformChannel: 'all' | 'web' | 'mobile' | 'unknown'): void {
      patchState(store, { platformChannel });
      this.load();
    },
  })),
);
