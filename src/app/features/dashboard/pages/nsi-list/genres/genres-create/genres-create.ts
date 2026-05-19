import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import { KitDynamicForm } from '@shared/kit/kit-dynamic-form/kit-dynamic-form';
import {
  FormFieldConfig,
  FORM_COMPONENT_REGISTRY,
} from '@shared/kit/kit-dynamic-form/form-factory.types';
import { NavigationService } from '@core/services/layout/navigation.service';
import {
  NsiGenresService as GeneratedGenresService,
} from '@core/api/nsi-admin/generated/nsi-genres/nsi-genres.service';
import { CreateGenreDto } from '@core/api/nsi-admin/model';
import { NotificationsService } from '@core/services/notifications/notifications';
import { FORM_COMPONENTS } from './genres-form-registry';
import { GenresStore } from '@features/dashboard/pages/nsi-list/genres/genres.store';

@Component({
  selector: 'app-genres-create',
  imports: [KitDynamicForm],
  templateUrl: './genres-create.html',
  styleUrl: './genres-create.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: FORM_COMPONENT_REGISTRY, useValue: FORM_COMPONENTS }],
  standalone: true,
})
export class GenresCreate {
  protected readonly navService = inject(NavigationService);
  private genresService = inject(GeneratedGenresService);
  private genresStore = inject(GenresStore);
  private notify = inject(NotificationsService);

  loading = signal(false);

  readonly formConfig: FormFieldConfig[] = [
    {
      key: 'name',
      label: 'Название жанра',
      type: 'text',
      validators: [Validators.required, Validators.minLength(2)],
      placeholder: 'Напр. Научная фантастика',
      className: 'col-span-6',
      errors: { minlength: 'Название должно быть не короче 2 символов' },
    },
    {
      key: 'slug',
      label: 'URL-слаг',
      type: 'text',
      validators: [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)],
      placeholder: 'science-fiction',
      className: 'col-span-6',
      errors: { pattern: 'Только строчные латинские буквы, цифры и дефис' },
    },
    {
      key: 'description',
      label: 'Описание',
      type: 'text',
      placeholder: 'Краткое описание жанра для SEO',
    },
  ];

  onSubmit(formData: Record<string, unknown>) {
    this.loading.set(true);
    const payload = formData as unknown as CreateGenreDto;
    this.genresService.genresControllerCreate(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.notify.showSuccess('Жанр успешно создан');
        this.genresStore.reload();
        this.onGoBack();
      },
      error: (err) => {
        this.loading.set(false);
        this.notify.showError('Ошибка при создании жанра');
        console.error(err);
      },
    });
  }

  onGoBack(): void {
    return this.navService.goBack();
  }
}
