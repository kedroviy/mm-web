import { ImportStatus } from '@core/services/import-progress/import-progress.service';
import { CreateAwardCategoryDto } from '@core/api/nsi-admin/model';

export interface AwardCategory extends CreateAwardCategoryDto {
  id: number;
  createdAt: string;
  awardId: number;
}

export interface AwardCategoryState {
  data: AwardCategory[];
  loading: boolean;
  loaded: boolean;
  page: number;
  limit: number;
  totalItems: number;
  importStatus: ImportStatus | 'idle';
  importProgress: number;
  importMessage: string;
}
