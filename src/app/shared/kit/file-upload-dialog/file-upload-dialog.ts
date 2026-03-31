import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UiButtonComponent } from '@shared/kit/button/button';

@Component({
  selector: 'app-file-upload-dialog',
  imports: [MatDialogModule, MatIconModule, MatButtonModule, UiButtonComponent],
  templateUrl: './file-upload-dialog.html',
  styleUrl: './file-upload-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FileUploadDialog {
  private readonly dialogRef = inject(MatDialogRef<FileUploadDialog>);

  readonly selectedFile = signal<File | null>(null);
  readonly isDragOver = signal(false);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave() {
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

  removeFile() {
    this.selectedFile.set(null);
  }

  upload() {
    if (this.selectedFile()) {
      this.dialogRef.close(this.selectedFile());
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
