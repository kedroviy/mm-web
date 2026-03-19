import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private snackBar = inject(MatSnackBar);

  showSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      panelClass: ['success-snackbar'],
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Закрыть', {
      panelClass: ['error-snackbar'],
      duration: 5000,
    });
  }
}
