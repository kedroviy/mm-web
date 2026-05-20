import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackService } from '@core/api/generated/feedback/feedback.service';
import type { FeedbackMessageResponse } from '@core/api/model';
import { FeedbackMessageResponseStatus } from '@core/api/model';
import { NotificationsService } from '@core/services/notifications/notifications';
import { FeedbackAdminStore } from '@features/dashboard/pages/feedback/feedback-admin.store';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-feedback-view',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './feedback-view.html',
  styleUrl: './feedback-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FeedbackView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(FeedbackService);
  private readonly notify = inject(NotificationsService);
  private readonly feedbackStore = inject(FeedbackAdminStore);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly message = signal<FeedbackMessageResponse | null>(null);
  readonly statuses = [
    FeedbackMessageResponseStatus.NEW,
    FeedbackMessageResponseStatus.IN_PROGRESS,
    FeedbackMessageResponseStatus.ANSWERED,
  ] as const;

  readonly replyForm = this.fb.group({
    adminReply: this.fb.control('', { validators: [Validators.required, Validators.minLength(1)] }),
    status: this.fb.control<FeedbackMessageResponseStatus>(FeedbackMessageResponseStatus.NEW, {
      validators: [Validators.required],
    }),
  });

  private messageId: number | null = null;

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    const id = raw ? Number(raw) : NaN;
    if (!Number.isFinite(id)) {
      void this.router.navigate(['/dashboard/feedback']);
      return;
    }
    this.messageId = id;
    this.load(id);
  }

  submitReply(): void {
    if (this.replyForm.invalid || this.messageId === null) {
      this.replyForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.api
      .feedbackControllerUpdateFeedbackMessage(this.messageId, {
        adminReply: this.replyForm.controls.adminReply.value.trim(),
        status: this.replyForm.controls.status.value,
      })
      .pipe(
        catchError(() => {
          this.notify.showError('Не удалось отправить ответ');
          return of(null);
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe((res) => {
        if (!res) {
          return;
        }
        this.message.set(res);
        this.feedbackStore.invalidate();
        this.notify.showSuccess('Ответ сохранён');
      });
  }

  private load(id: number): void {
    this.loading.set(true);
    this.api
      .feedbackControllerGetFeedbackMessageById(id)
      .pipe(
        catchError(() => {
          this.notify.showError('Обращение не найдено');
          void this.router.navigate(['/dashboard/feedback']);
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (!res) {
          return;
        }
        this.message.set(res);
        this.replyForm.patchValue({
          adminReply: res.adminReply?.trim() ?? '',
          status: res.status,
        });
      });
  }
}
