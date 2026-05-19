import { ImportStatus } from '@core/services/import-progress/import-progress.service';
import { CreateAgeRatingDto } from '@core/api/nsi-admin/model';

export interface AgeRating extends CreateAgeRatingDto {
  id: number;
  createdAt: string;
}

export interface AgeRatingState {
  data: AgeRating[];
  loading: boolean;
  loaded: boolean;
  page: number;
  limit: number;
  totalItems: number;
  importStatus: ImportStatus | 'idle';
  importProgress: number;
  importMessage: string;
}
