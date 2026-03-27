import { Component, inject, signal } from '@angular/core';
import { GenresService as GeneratedGenresService } from '@core/api/generated/nsi-genres/nsi-genres.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { GenrePaginationResponseDto } from '@core/api/model';

@Component({
  selector: 'app-genres',
  imports: [],
  templateUrl: './genres.html',
  styleUrl: './genres.css',
  standalone: true,
})
export class Genres {
  private genresService = inject(GeneratedGenresService);
  readonly genres = toSignal(
    this.genresService
      ?.genresControllerGetWithPages<GenrePaginationResponseDto>({ page: 1, limit: 10 })
      .pipe(
        map((result) => result?.data || []),
        catchError((error) => of([])),
      ),
    { initialValue: [] },
  );
}
