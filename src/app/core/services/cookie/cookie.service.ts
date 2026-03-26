import { Injectable, inject, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

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
