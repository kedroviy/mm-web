import { computed, Injectable, Signal, signal } from '@angular/core';
import { ImportStatus } from './import-progress.service';
import { COMMON_CONSTANTS } from '@core/constants';

export interface ImportHandler {
  importExcel(file: File): void;

  importStatus: Signal<ImportStatus | 'idle'>;
  importProgress: Signal<number>;
  importMessage: Signal<string>;
}

@Injectable({ providedIn: 'root' })
export class ActiveImportService {
  private readonly handler = signal<ImportHandler | null>(null);

  readonly importStatus = computed(() => this.handler()?.importStatus() ?? 'idle');
  readonly importProgress = computed(() => this.handler()?.importProgress() ?? 0);
  readonly importMessage = computed(() => this.handler()?.importMessage() ?? COMMON_CONSTANTS.EMPTY_STRING);
  readonly hasHandler = computed(() => this.handler() !== null);

  register(handler: ImportHandler): void {
    this.handler.set(handler);
  }

  unregister(handler: ImportHandler): void {
    if (this.handler() === handler) {
      this.handler.set(null);
    }
  }

  importExcel(file: File): void {
    this.handler()?.importExcel(file);
  }
}
