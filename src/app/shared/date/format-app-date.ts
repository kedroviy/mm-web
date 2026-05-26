import { formatDate } from '@angular/common';

import { APP_DATE_TIME_FORMAT } from './app-date.constants';

export function formatAppDate(
  value: string | number | Date | null | undefined,
  locale = 'ru-RU',
): string | null {
  if (value == null || value === '') {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return formatDate(date, APP_DATE_TIME_FORMAT, locale);
}
