import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { GenresService } from '@core/api/generated/nsi-genre/nsi-genre.service';

@Component({
  selector: 'app-list',
  imports: [KitTable],
  templateUrl: './list.html',
  styleUrl: './list.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  private genresService = inject(GenresService);
  readonly items = toSignal(
    this.genresService.genresControllerGetWithPages({ page: 1, limit: 100 }).pipe(
      map((response: any) => response.items || response.data || []),

      catchError((error) => {
        console.error('Ошибка загрузки жанров:', error);
        return of([]);
      }),
    ),
    { initialValue: [] },
  );
  readonly columns = ['имя', 'name', 'weight', 'symbol'];
}
