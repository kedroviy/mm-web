import { LOCALE_ID, Pipe, PipeTransform, inject } from '@angular/core';

import { formatAppDate } from './format-app-date';

@Pipe({
  name: 'appDate',
  standalone: true,
})
export class AppDatePipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(value: string | number | Date | null | undefined): string | null {
    return formatAppDate(value, this.locale);
  }
}
