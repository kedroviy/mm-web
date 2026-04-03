import { COMMON_CONSTANTS } from '@core/constants';

export function normalizeHueDegrees(n: number): number {
  const h = Math.trunc(n);
  return ((h % 360) + 360) % 360;
}

/** Детерминированный оттенок 0–359 для hsl по строке (имя пользователя). */
export function hueFromString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return normalizeHueDegrees(hash);
}

/** До двух инициалий из полного имени или одной буквы из одного слова. */
export function initialsFromDisplayName(name: string | null | undefined): string {
  if (!name?.trim()) {
    return COMMON_CONSTANTS.EMPTY_STRING;
  }
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) {
    return COMMON_CONSTANTS.EMPTY_STRING;
  }
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
