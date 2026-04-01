import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private snackBar = inject(MatSnackBar);

  showSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      panelClass: ['toast', 'toast-success'],
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Закрыть', {
      panelClass: ['toast', 'toast-error'],
      duration: 5000,
    });
  }

  showWarning(message: string) {
    this.snackBar.open(message, 'OK', {
      panelClass: ['toast', 'toast-warning'],
      duration: 4000,
    });
  }

  showInfo(message: string) {
    this.snackBar.open(message, 'OK', {
      panelClass: ['toast', 'toast-info'],
    });
  }
}
