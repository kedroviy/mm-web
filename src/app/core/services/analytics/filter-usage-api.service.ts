import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { FilterUsagePageDto, FilterUsageQueryParams } from '@core/api/model/filter-usage.types';

@Injectable({ providedIn: 'root' })
export class FilterUsageApiService {
  private readonly http = inject(HttpClient);

  getFilterUsage(params: FilterUsageQueryParams = {}): Observable<FilterUsagePageDto> {
    let httpParams = new HttpParams();
    if (params.page != null) {
      httpParams = httpParams.set('page', String(params.page));
    }
    if (params.limit != null) {
      httpParams = httpParams.set('limit', String(params.limit));
    }
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.filterType) {
      httpParams = httpParams.set('filterType', params.filterType);
    }
    return this.http.get<FilterUsagePageDto>('/analytics/filter-usage', { params: httpParams });
  }
}
