import { CreateGenreDto } from '@core/api/nsi-admin/model';
import { ImportStatus } from '@core/services/import-progress/import-progress.service';

export interface Genre extends CreateGenreDto {
  id: number;
  createdAt: string;
}

export interface GenresState {
  genres: Genre[];
  loading: boolean;
  loaded: boolean;
  page: number;
  limit: number;
  totalItems: number;
  importStatus: ImportStatus | 'idle';
  importProgress: number;
  importMessage: string;
}
