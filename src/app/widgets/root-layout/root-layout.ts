import { Component, inject } from '@angular/core';
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
})
export class RootLayout {
  protected readonly navService = inject(NavigationService);
  private readonly dialog = inject(MatDialog);
  private readonly genresStore = inject(GenresStore);
  private readonly notify = inject(NotificationsService);

  openUploadDialog() {
    this.dialog
      .open(FileUploadDialog, { width: '480px', panelClass: 'upload-dialog' })
      .afterClosed()
      .subscribe((file: File | null) => {
        if (file) {
          this.handleFileUpload(file);
        }
      });
  }

  private handleFileUpload(file: File) {
    this.genresStore.importExcel(file);
    this.notify.showSuccess('Файл отправлен на импорт');
  }
}
