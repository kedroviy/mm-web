import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { KitHeader } from '@shared/kit/kit-header';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from '@core/services/layout/navigation.service';
import { UiButtonComponent } from '@shared/kit/button/button';
import { FileUploadDialog } from '@shared/kit/file-upload-dialog/file-upload-dialog';
import { GenresStore } from '@features/dashboard/pages/nsi-list/genres/genres.store';
import { NotificationsService } from '@core/services/notifications/notifications';

@Component({
  selector: 'app-root-layout',
  imports: [KitHeader, MatIconModule, RouterLink, RouterOutlet, UiButtonComponent],
  templateUrl: './root-layout.html',
  styleUrl: './root-layout.css',
  standalone: true,
})
export class RootLayout {
  protected readonly navService = inject(NavigationService);
  private readonly dialog = inject(MatDialog);
  private readonly genresStore = inject(GenresStore);
  private readonly notify = inject(NotificationsService);

  readonly isImporting = computed(() => {
    const status = this.genresStore.importStatus();
    return status === 'uploading' || status === 'processing';
  });

  readonly importButtonText = computed(() => {
    const status = this.genresStore.importStatus();
    const progress = this.genresStore.importProgress();

    switch (status) {
      case 'uploading':
        return 'Загрузка…';
      case 'processing':
        return `Импорт ${progress}%`;
      default:
        return this.navService.activeData()['uploadAction']?.['label'] ?? 'Загрузить';
    }
  });

  private readonly importStatusEffect = effect(() => {
    const status = this.genresStore.importStatus();
    const message = this.genresStore.importMessage();

    if (status === 'completed') {
      this.notify.showSuccess(message || 'Импорт завершён');
    } else if (status === 'error') {
      this.notify.showError(message || 'Ошибка импорта');
    }
  });

  openUploadDialog() {
    if (this.isImporting()) return;

    this.dialog
      .open(FileUploadDialog, { width: '480px', panelClass: 'upload-dialog' })
      .afterClosed()
      .subscribe((file: File | null) => {
        if (file) {
          this.genresStore.importExcel(file);
        }
      });
  }
}
