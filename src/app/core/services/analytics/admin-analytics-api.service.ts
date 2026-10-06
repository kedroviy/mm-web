import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type {
  MatchFunnelQueryParams,
  MatchFunnelResponse,
  UsersOverviewResponse,
} from '@core/api/model/admin-analytics.types';

@Injectable({ providedIn: 'root' })
export class AdminAnalyticsApiService {
  private readonly http = inject(HttpClient);

  getUsersOverview(params: { from?: string; to?: string } = {}): Observable<UsersOverviewResponse> {
    let httpParams = new HttpParams();
    if (params.from) {
      httpParams = httpParams.set('from', params.from);
    }
    if (params.to) {
      httpParams = httpParams.set('to', params.to);
    }
    return this.http.get<UsersOverviewResponse>('/analytics/users-overview', { params: httpParams });
  }

  getMatchFunnel(params: MatchFunnelQueryParams = {}): Observable<MatchFunnelResponse> {
    let httpParams = new HttpParams();
    if (params.from) {
      httpParams = httpParams.set('from', params.from);
    }
    if (params.to) {
      httpParams = httpParams.set('to', params.to);
    }
    if (params.platformChannel) {
      httpParams = httpParams.set('platformChannel', params.platformChannel);
    }
    return this.http.get<MatchFunnelResponse>('/analytics/match-funnel', { params: httpParams });
  }
}
