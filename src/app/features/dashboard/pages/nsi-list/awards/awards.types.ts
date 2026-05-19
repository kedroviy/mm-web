import { ImportStatus } from '@core/services/import-progress/import-progress.service';
import { CreateAwardDto } from '@core/api/nsi-admin/model';

export interface Awards extends CreateAwardDto {
  id: number;
  createdAt: string;
}

export interface AwardsState {
  data: Awards[];
  loading: boolean;
  loaded: boolean;
  page: number;
  limit: number;
  totalItems: number;
  importStatus: ImportStatus | 'idle';
  importProgress: number;
  importMessage: string;
}
