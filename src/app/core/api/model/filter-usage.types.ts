import type { FilterUsageAnalyticsControllerGetFilterUsageFilterType } from './filterUsageAnalyticsControllerGetFilterUsageFilterType';
import type { FilterUsageItemResponseDto } from './filterUsageItemResponseDto';
import type { FilterUsagePageResponseDto } from './filterUsagePageResponseDto';

export type FilterUsageType = FilterUsageAnalyticsControllerGetFilterUsageFilterType;
export type FilterUsageItemDto = FilterUsageItemResponseDto;
export type FilterUsagePageDto = FilterUsagePageResponseDto;

export interface FilterUsageQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  filterType?: FilterUsageType;
}
