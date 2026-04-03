/** Ключ sessionStorage: оттенок аватара для текущей сессии браузера. */
export const AVATAR_SESSION_HUE_KEY = 'mm_avatar_session_hue';

/** Случайный оттенок 0..359 (новый при каждом логине). */
export function pickRandomAvatarHue(): number {
  return Math.floor(Math.random() * 360);
}

export function normalizeHue(n: number): number {
  const h = Math.trunc(n);
  return ((h % 360) + 360) % 360;
}

/** Стабильный оттенок по строке (SSR / первый заход без сохранённой сессии). */
export function stableHueFromSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return normalizeHue(hash);
}

export function parseStoredHue(raw: string | null): number | null {
  if (raw === null || raw === '') {
    return null;
  }
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) {
    return null;
  }
  return normalizeHue(n);
}
