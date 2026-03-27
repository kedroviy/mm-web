import { Component, inject } from '@angular/core';
import { GenresService as GeneratedGenresService } from '@core/api/generated/nsi-genres/nsi-genres.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { type CreateGenreDto, GenrePaginationResponseDto } from '@core/api/model';
import { KitTable } from '@shared/kit/kit-table/kit-table';

@Component({
  selector: 'app-genres',
  imports: [KitTable],
  templateUrl: './genres.html',
  styleUrl: './genres.css',
  standalone: true,
})
export class Genres {
  private genresService = inject(GeneratedGenresService);
  readonly genres = toSignal(
    this.genresService
      .genresControllerGetWithPages<GenrePaginationResponseDto>({ page: 1, limit: 10 })
      .pipe(
        // Явно указываем, что если данных нет, возвращаем []
        map((result) => (result && result.data ? result.data : [])),
        catchError(() => of([])),
      ),
    { initialValue: [] as CreateGenreDto[] },
  );
}
