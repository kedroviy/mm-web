import { Injectable, inject, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

export interface CookieSetOptions {
  /** Срок жизни в днях. По умолчанию — сессионная cookie. */
  days?: number;
  path?: string;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CookieService {
  private platformId = inject(PLATFORM_ID);

  private request = isPlatformServer(this.platformId) ? inject(REQUEST, { optional: true }) : null;

  get(name: string): string | null {
    if (isPlatformServer(this.platformId)) {
      return this.getFromServer(name);
    }

    if (isPlatformBrowser(this.platformId)) {
      return this.getFromBrowser(name);
    }

    return null;
  }

  set(name: string, value: string, options?: CookieSetOptions): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const path = options?.path ?? '/';
    const sameSite = options?.sameSite ?? 'Lax';
    const parts = [
      `${name}=${encodeURIComponent(value)}`,
      `path=${path}`,
      `SameSite=${sameSite}`,
    ];

    if (options?.days !== undefined) {
      parts.push(`max-age=${options.days * 24 * 60 * 60}`);
    }

    if (options?.secure) {
      parts.push('Secure');
    }

    document.cookie = parts.join('; ');
  }

  remove(name: string, path = '/'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.cookie = `${name}=; path=${path}; max-age=0`;
  }

  private getFromBrowser(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  private getFromServer(name: string): string | null {
    const cookieHeader = this.request?.headers?.get('cookie');
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';').reduce<Record<string, string>>((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});

    return cookies[name] ? decodeURIComponent(cookies[name]) : null;
  }
}
