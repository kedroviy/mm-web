import { Injectable, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export type ImportStatus = 'uploading' | 'processing' | 'completed' | 'error';

export interface ImportProgressEvent {
  status: ImportStatus;
  progress: number;
  message?: string;
  total?: number;
  imported?: number;
}

@Injectable({ providedIn: 'root' })
export class ImportProgressService {
  private readonly zone = inject(NgZone);

  connect(url: string): Observable<ImportProgressEvent> {
    return new Observable<ImportProgressEvent>((subscriber) => {
      const fullUrl = url.startsWith('/api/') ? `${environment.apiBaseUrl}${url}` : url;
      const es = new EventSource(fullUrl, { withCredentials: true });

      es.onmessage = (event) => {
        this.zone.run(() => {
          try {
            const data = JSON.parse(event.data) as ImportProgressEvent;
            subscriber.next(data);

            if (data.status === 'completed' || data.status === 'error') {
              es.close();
              subscriber.complete();
            }
          } catch {
            subscriber.error(new Error('Failed to parse SSE event'));
            es.close();
          }
        });
      };

      es.onerror = () => {
        this.zone.run(() => {
          subscriber.error(new Error('SSE connection lost'));
          es.close();
        });
      };

      return () => es.close();
    });
  }
}
