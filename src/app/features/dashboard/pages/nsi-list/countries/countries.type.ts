import { ImportStatus } from '@core/services/import-progress/import-progress.service';
import { CreateCountryDto } from '@core/api/model';

export interface Country extends CreateCountryDto {
  id: number;
  createdAt: string;
}

export interface CountriesState {
  data: Country[];
  loading: boolean;
  loaded: boolean;
  page: number;
  limit: number;
  totalItems: number;
  importStatus: ImportStatus | 'idle';
  importProgress: number;
  importMessage: string;
}
