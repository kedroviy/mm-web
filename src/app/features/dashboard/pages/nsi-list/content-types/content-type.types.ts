import { CreateContentTypeDto } from '@core/api/nsi-admin/model';
import { ImportStatus } from '@core/services/import-progress/import-progress.service';

export interface ContentType extends CreateContentTypeDto {
  id: number;
  createdAt: string;
}

export interface ContentTypeState {
  contentType: ContentType[];
  loading: boolean;
  loaded: boolean;
  page: number;
  limit: number;
  totalItems: number;
  importStatus: ImportStatus | 'idle';
  importProgress: number;
  importMessage: string;
}
