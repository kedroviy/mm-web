import type { FilterUsageType } from '@core/api/model/filter-usage.types';

export const FILTER_USAGE_TYPE_OPTIONS: readonly {
  value: FilterUsageType | null;
  label: string;
}[] = [
  { value: null, label: 'Все типы' },
  { value: 'genre', label: 'Жанры' },
  { value: 'exclude_genre', label: 'Исключённые жанры' },
  { value: 'country', label: 'Страны' },
  { value: 'year', label: 'Годы' },
  { value: 'rating', label: 'Рейтинг' },
];

export function resolveFilterUsageTypeLabel(type: FilterUsageType): string {
  const match = FILTER_USAGE_TYPE_OPTIONS.find((option) => option.value === type);
  return match?.label ?? type;
}
